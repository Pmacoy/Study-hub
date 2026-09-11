import { useEffect, useRef, useState } from 'react';
import { Download, Upload, AlertCircle, CheckCircle2, X } from 'lucide-react';
import {
  STORAGE_KEYS, AZURE_STORAGE_KEYS, NETWORKING_STORAGE_KEYS,
  AWS_STORAGE_KEYS, PYTHON_STORAGE_KEYS,
  PLATFORM_STORAGE_KEYS,
  DAILY_STORAGE_KEY, ACTIVITY_LOG_STORAGE_KEY,
  PROJECT_PROGRESS_STORAGE_KEY, SCENARIO_ATTEMPTS_STORAGE_KEY,
  TERMINAL_ATTEMPTS_STORAGE_KEY,
} from '../../data/storageKeys';

const ALL_KEYS = [
  STORAGE_KEYS.activeTab,
  STORAGE_KEYS.visitedTabs,
  AZURE_STORAGE_KEYS.activeTab,
  AZURE_STORAGE_KEYS.visitedTabs,
  NETWORKING_STORAGE_KEYS.activeTab,
  NETWORKING_STORAGE_KEYS.visitedTabs,
  AWS_STORAGE_KEYS.activeTab,
  AWS_STORAGE_KEYS.visitedTabs,
  PYTHON_STORAGE_KEYS.activeTab,
  PYTHON_STORAGE_KEYS.visitedTabs,
  PLATFORM_STORAGE_KEYS.activeDomain,
  DAILY_STORAGE_KEY,
  ACTIVITY_LOG_STORAGE_KEY,
  PROJECT_PROGRESS_STORAGE_KEY,
  SCENARIO_ATTEMPTS_STORAGE_KEY,
  TERMINAL_ATTEMPTS_STORAGE_KEY,
];

interface Props {
  onClose: () => void;
}

export default function ExportImportPanel({ onClose }: Props) {
  const [importStatus, setImportStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [importMsg, setImportMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const data: Record<string, unknown> = {};
    for (const key of ALL_KEYS) {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        try {
          data[key] = JSON.parse(raw);
        } catch {
          data[key] = raw;
        }
      }
    }
    data['_exportedAt'] = new Date().toISOString();
    data['_version'] = '1.0';

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-hub-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (typeof data !== 'object' || data === null) throw new Error('Formato inválido');
        let count = 0;
        for (const [key, value] of Object.entries(data)) {
          if (key === '_exportedAt' || key === '_version') continue;
          localStorage.setItem(key, JSON.stringify(value));
          count++;
        }
        setImportStatus('ok');
        setImportMsg(`${count} chaves restauradas — recarregue a página.`);
      } catch {
        setImportStatus('error');
        setImportMsg('Ficheiro inválido. Use um backup gerado pelo Study Hub.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#181926] p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Backup & Restore</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-300"><X size={16} /></button>
        </div>

        <div className="space-y-4">
          {/* Export */}
          <div className="border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15">
                <Download size={16} className="text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Exportar progresso</p>
                <p className="text-2xs text-slate-500">Baixa um ficheiro JSON com todo o teu progresso</p>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="w-full mt-3 py-2.5 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-200 text-sm font-semibold hover:bg-violet-500/30 transition-all"
            >
              Descargar backup
            </button>
          </div>

          {/* Import */}
          <div className="border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15">
                <Upload size={16} className="text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Importar progresso</p>
                <p className="text-2xs text-slate-500">Restaura dados a partir de um ficheiro de backup</p>
              </div>
            </div>
            <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full mt-3 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-sm font-semibold hover:bg-amber-500/30 transition-all"
            >
              Carregar backup
            </button>
            {importStatus !== 'idle' && (
              <div className={`mt-3 flex items-center gap-2 text-xs px-3 py-2 rounded-xl border ${
                importStatus === 'ok'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
              }`}>
                {importStatus === 'ok' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                {importMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
