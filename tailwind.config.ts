export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Necessario porque colorSlots()/designTokens geram classes em runtime.
  // Sem safelist o Tailwind nao as encontra na varredura estatica.
  safelist: [
    { pattern: /(bg|border|text)-(violet|sky|orange|emerald|amber|rose|teal|cyan|fuchsia|slate)-(200|300|400|500)/, variants: ['hover'] },
    { pattern: /(bg|border)-(violet|sky|orange|emerald|amber|rose|teal|cyan|fuchsia|slate)-(500|700|800)\/(5|10|15|20|25|30|40|50)/, variants: ['hover'] },
    { pattern: /from-(violet|sky|orange|emerald|amber|rose|teal|cyan)-500/ },
    { pattern: /to-(fuchsia|blue|orange|red|violet|sky)-500/ },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['10px',  { lineHeight: '14px' }],
        'xs':  ['11px',  { lineHeight: '16px' }],
        'sm':  ['12px',  { lineHeight: '18px' }],
        'base': ['13px',  { lineHeight: '20px' }],
        'md':  ['14px',  { lineHeight: '21px' }],
        'lg':  ['15px',  { lineHeight: '22px' }],
      },
      // Small radius for a tech feel — sharp but not dead
      borderRadius: {
        DEFAULT: '3px',
        sm:      '2px',
        md:      '3px',
        lg:      '4px',
        xl:      '4px',
        '2xl':   '4px',
        '3xl':   '4px',
        full:    '9999px',
      },
    },
  },
  plugins: [],
}
