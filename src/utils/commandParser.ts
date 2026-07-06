import type { CommandHandler, FlagSpec, MatchContext } from '../types/terminal';

interface ParsedCommand {
  tokens: string[];
  flags: Record<string, string | true>;
  positional: string[];
}

/** Normalize whitespace, strip trailing/leading spaces, lowercase for matching only */
function normalize(cmd: string): string {
  return cmd.trim().replace(/\s+/g, ' ');
}

/**
 * Parse raw command into tokens, flags, and positional args.
 * Handles: `-n value`, `--namespace=value`, `--namespace value`, quoted strings.
 */
export function parseCommand(raw: string): ParsedCommand {
  const parts: string[] = [];
  const src = normalize(raw);
  let i = 0;
  let buf = '';
  let inQuote: string | null = null;
  while (i < src.length) {
    const ch = src[i];
    if (inQuote) {
      if (ch === inQuote) inQuote = null;
      else buf += ch;
    } else if (ch === '"' || ch === "'") {
      inQuote = ch;
    } else if (ch === ' ') {
      if (buf) { parts.push(buf); buf = ''; }
    } else {
      buf += ch;
    }
    i++;
  }
  if (buf) parts.push(buf);

  const tokens: string[] = [];
  const flags: Record<string, string | true> = {};
  const positional: string[] = [];

  for (let idx = 0; idx < parts.length; idx++) {
    const p = parts[idx];
    if (p.startsWith('--')) {
      // --name=value OR --name value
      const eqIdx = p.indexOf('=');
      if (eqIdx > 0) {
        flags[p.slice(0, eqIdx)] = p.slice(eqIdx + 1);
      } else {
        const next = parts[idx + 1];
        if (next && !next.startsWith('-')) {
          flags[p] = next;
          idx++;
        } else {
          flags[p] = true;
        }
      }
    } else if (p.startsWith('-') && p.length > 1 && !/^-\d/.test(p)) {
      // -n value  OR bundled -abc (rare, treat as boolean flags each)
      const next = parts[idx + 1];
      if (next && !next.startsWith('-')) {
        flags[p] = next;
        idx++;
      } else {
        flags[p] = true;
      }
    } else {
      if (tokens.length < 8) tokens.push(p);
      else positional.push(p);
    }
  }

  // Anything after the "leading command tokens" is truly positional.
  // The handler match will decide how many tokens are 'command tokens'.
  return { tokens, flags, positional };
}

/**
 * Try to match a handler against parsed command.
 * Returns { match, distance } — distance is edit-distance-like score for suggestions.
 */
export function matchHandler(handler: CommandHandler, parsed: ParsedCommand): { match: boolean; ctx?: MatchContext; distance: number } {
  const { tokens: cmdTokens, flags: cmdFlags } = parsed;

  // Try to match handler.tokens against cmdTokens
  const need = handler.tokens.length;
  if (cmdTokens.length < need) {
    // Not enough tokens — compute distance for suggestion
    return { match: false, distance: 100 };
  }

  let matched = 0;
  for (let i = 0; i < need; i++) {
    const aliases = handler.tokens[i].map(a => a.toLowerCase());
    const got = cmdTokens[i].toLowerCase();
    if (aliases.includes(got)) matched++;
  }
  const tokensDistance = need - matched;

  // Compute flag match
  const flagValues: Record<string, string | true> = {};
  let flagsBad = 0;
  if (handler.flags) {
    for (const flag of handler.flags) {
      let value: string | true | undefined;
      let hitKey: string | undefined;
      for (const name of flag.names) {
        if (name in cmdFlags) {
          value = cmdFlags[name];
          hitKey = name;
          break;
        }
      }
      if (value !== undefined) {
        if (flag.valueRequired && value === true) flagsBad++;
        else if (flag.valueEnum && typeof value === 'string' && !flag.valueEnum.includes(value)) flagsBad++;
        else if (hitKey) {
          // record under primary name and hit name for convenience
          flagValues[flag.names[0]] = value;
          flagValues[hitKey] = value;
        }
      }
    }
  }

  const distance = tokensDistance + flagsBad;
  const match = tokensDistance === 0 && flagsBad === 0;

  if (match) {
    return {
      match: true,
      distance: 0,
      ctx: {
        raw: parsed.tokens.join(' '),
        flagValues,
        positionalArgs: cmdTokens.slice(need),
      },
    };
  }
  return { match: false, distance };
}

/**
 * Given a full set of handlers and the user's input, return best match or nearest suggestion.
 */
export interface ParseResult {
  handler?: CommandHandler;
  ctx?: MatchContext;
  suggestion?: CommandHandler;      // nearest handler if no exact match, for "did you mean" hint
  suggestionDistance?: number;
}

export function runParser(raw: string, handlers: CommandHandler[]): ParseResult {
  const parsed = parseCommand(raw);
  let best: { h: CommandHandler; distance: number } | null = null;
  for (const h of handlers) {
    const res = matchHandler(h, parsed);
    if (res.match) {
      return { handler: h, ctx: res.ctx };
    }
    if (!best || res.distance < best.distance) {
      best = { h, distance: res.distance };
    }
  }
  if (best && best.distance <= 2) {
    return { suggestion: best.h, suggestionDistance: best.distance };
  }
  return {};
}
