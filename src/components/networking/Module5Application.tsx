
import React, { useState } from 'react';
import { 
  Globe, Search, Server, FileJson, 
  Send, AlertTriangle, CheckCircle2, 
  BookOpen, Activity, ArrowRight
} from 'lucide-react';

type TabType = 'dns' | 'http';

export default function Module5Application() {
  const [activeTab, setActiveTab] = useState<TabType>('dns');

  // --- ESTADOS DO SIMULADOR DNS ---
  const [domain, setDomain] = useState('api.meubanco.com');
  const [dnsStep, setDnsStep] = useState(0);
  const [isResolving, setIsResolving] = useState(false);

  const resolveDns = () => {
    setIsResolving(true);
    setDnsStep(0);
    
    // Simula a jornada do DNS com delays
    const steps = [1, 2, 3, 4, 5];
    steps.forEach((step, index) => {
      setTimeout(() => {
        setDnsStep(step);
        if (step === 5) setIsResolving(false);
      }, (index + 1) * 800);
    });
  };

  // --- ESTADOS DO SIMULADOR HTTP ---
  const [httpMethod, setHttpMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [httpStatus, setHttpStatus] = useState<'200' | '201' | '400' | '404' | '500'>('200');

  const httpConcepts = {
    'GET': { desc: 'Busca dados. É Idempotente (chamar 1 ou 100 vezes tem o mesmo efeito no servidor). Seguro para cache.', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' },
    'POST': { desc: 'Cria novos dados. NÃO é idempotente (clicar em "Pagar" duas vezes cria duas cobranças se não houver proteção).', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    'PUT': { desc: 'Atualiza dados existentes substituindo-os completamente. É Idempotente.', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
    'DELETE': { desc: 'Remove dados. É Idempotente (deletar algo que já foi deletado não muda o estado final).', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' }
  };

  const statusConcepts = {
    '200': { label: '200 OK', desc: 'Tudo certo. O servidor processou a requisição e devolveu o que foi pedido.', icon: <CheckCircle2 className="text-emerald-400" /> },
    '201': { label: '201 Created', desc: 'Sucesso! Um novo recurso (ex: novo usuário) foi criado no banco de dados.', icon: <CheckCircle2 className="text-emerald-400" /> },
    '400': { label: '400 Bad Request', desc: 'Erro do Cliente. Você enviou um JSON malformado ou faltou um campo obrigatório.', icon: <AlertTriangle className="text-amber-400" /> },
    '404': { label: '404 Not Found', desc: 'Erro do Cliente. A URL ou o ID (ex: usuário 999) não existe no sistema.', icon: <Search className="text-amber-400" /> },
    '500': { label: '500 Internal Server Error', desc: 'Erro do Servidor. O seu código quebrou (ex: null pointer exception ou banco de dados caiu). O pesadelo do Dev on-call.', icon: <Activity className="text-rose-400 animate-pulse" /> }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-slate-950 text-slate-50 rounded-xl shadow-2xl border border-slate-800 space-y-6">
      
      {/* CABEÇALHO */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Globe className="text-purple-400" />
          Módulo 5: Camada de Aplicação (DNS & HTTP)
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Onde a rede encontra a engenharia de software. Como endereços viram IPs e como as APIs conversam.
        </p>
      </div>

      {/* TABS */}
      <div className="flex bg-slate-900 rounded-lg p-1.5 border border-slate-800 w-full max-w-md">
        <button
          onClick={() => setActiveTab('dns')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md font-bold text-xs sm:text-sm transition-all duration-300 ${
            activeTab === 'dns' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-md' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Search size={16} /> DNS (Resolução)
        </button>
        <button
          onClick={() => setActiveTab('http')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md font-bold text-xs sm:text-sm transition-all duration-300 ${
            activeTab === 'http' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-md' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Send size={16} /> HTTP (APIs)
        </button>
      </div>

      {/* CONTEÚDO DINÂMICO */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 min-h-[450px]">
        
        {/* === ABA 1: DNS === */}
        {activeTab === 'dns' && (
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Input & Contexto */}
            <div className="flex-1 bg-slate-900/50 p-6 rounded-lg border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-2">O Catálogo Telefônico da Web</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Computadores só entendem IPs. Humanos preferem nomes. O DNS é o sistema global distribuído que traduz domínios em IPs. Um DNS lento pode adicionar centenas de milissegundos de latência à sua aplicação antes mesmo de o primeiro byte ser transferido.
              </p>
              
              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="flex-1 bg-slate-950 text-purple-400 border border-slate-700 p-3 rounded-md focus:outline-none focus:border-purple-500 font-mono"
                  placeholder="ex: github.com"
                />
                <button 
                  onClick={resolveDns}
                  disabled={isResolving || !domain}
                  className="bg-purple-600/20 border border-purple-500/50 hover:bg-purple-600/40 text-purple-400 font-bold px-6 py-3 rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Resolver
                </button>
              </div>

              {dnsStep === 5 && (
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-md animate-in zoom-in duration-300">
                  <span className="text-xs text-emerald-500 uppercase font-bold block mb-1">Resultado Final:</span>
                  <span className="font-mono text-emerald-400 text-xl font-bold">192.0.2.146</span>
                </div>
              )}
            </div>

            {/* A Jornada do DNS */}
            <div className="flex-[1.5] bg-slate-950 p-6 rounded-lg border border-slate-800">
              <h3 className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-4">A Jornada da Resolução DNS</h3>
              
              <div className="space-y-3 relative">
                {/* Linha vertical conectora */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-800 z-0"></div>

                {[
                  { step: 1, title: 'Cache do Navegador / SO', desc: 'O Chrome ou o Windows já sabem esse IP de memória?' },
                  { step: 2, title: 'DNS Resolver (Seu Provedor)', desc: 'O roteador da sua casa pergunta ao provedor de internet (ISP) se ele sabe a resposta.' },
                  { step: 3, title: 'Root Server (.)', desc: 'O ISP não sabe. Pergunta aos servidores Raiz globais: "Onde ficam os domínios .COM?"' },
                  { step: 4, title: 'TLD Server (.com)', desc: 'O servidor .COM responde: "Vá perguntar ao servidor autoritativo do meubanco.com".' },
                  { step: 5, title: 'Servidor Autoritativo (Route53/Cloudflare)', desc: 'A fonte da verdade! Ele diz: "Sim, o IP do api.meubanco.com é 192.0.2.146".' }
                ].map((item) => (
                  <div key={item.step} className={`relative z-10 flex gap-4 items-start p-3 rounded-lg transition-all duration-500 ${dnsStep >= item.step ? 'bg-slate-900 border border-slate-700' : 'opacity-40'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors duration-500 ${dnsStep === item.step ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : dnsStep > item.step ? 'bg-slate-700 text-slate-300' : 'bg-slate-800 text-slate-500'}`}>
                      {item.step}
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${dnsStep >= item.step ? 'text-slate-200' : 'text-slate-500'}`}>{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === ABA 2: HTTP === */}
        {activeTab === 'http' && (
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Construtor de Requisição */}
            <div className="flex-1 bg-slate-900/50 p-6 rounded-lg border border-slate-800 flex flex-col">
              <h3 className="text-lg font-bold text-white mb-2">Engenharia de API (REST)</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                A camada HTTP define não apenas o transporte, mas a <strong>semântica</strong> das operações. Uma API bem desenhada usa os verbos e status corretamente.
              </p>

              <label className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Escolha um Método HTTP:</label>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {(['GET', 'POST', 'PUT', 'DELETE'] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setHttpMethod(method)}
                    className={`py-2 px-3 rounded text-sm font-bold border transition-all ${
                      httpMethod === method 
                        ? httpConcepts[method].bg + ' ' + httpConcepts[method].color 
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              <div className={`p-4 rounded-md border ${httpConcepts[httpMethod].bg} mb-6`}>
                <div className="flex items-start gap-2">
                  <BookOpen className={`shrink-0 ${httpConcepts[httpMethod].color}`} size={18} />
                  <p className="text-sm text-slate-300 leading-relaxed">
                    <strong className={httpConcepts[httpMethod].color}>{httpMethod}: </strong>
                    {httpConcepts[httpMethod].desc}
                  </p>
                </div>
              </div>

              <label className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2 mt-auto">Simular Resposta do Servidor:</label>
              <select 
                value={httpStatus}
                onChange={(e) => setHttpStatus(e.target.value as any)}
                className="w-full bg-slate-950 text-slate-300 border border-slate-700 p-3 rounded-md focus:outline-none focus:border-sky-500 font-mono text-sm"
              >
                <option value="200">200 OK (Sucesso)</option>
                <option value="201">201 Created (Recurso Criado)</option>
                <option value="400">400 Bad Request (Erro do Cliente - Validação)</option>
                <option value="404">404 Not Found (Recurso Inexistente)</option>
                <option value="500">500 Internal Server Error (Erro no Código/DB)</option>
              </select>
            </div>

            {/* Visualizador de Resposta */}
            <div className="flex-[1.5] bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex flex-col">
              {/* Header do Request/Response */}
              <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center gap-3">
                <span className={`px-3 py-1 rounded text-xs font-bold font-mono ${httpConcepts[httpMethod].bg} ${httpConcepts[httpMethod].color}`}>
                  {httpMethod}
                </span>
                <span className="text-slate-400 font-mono text-sm break-all">
                  https://api.empresa.com/v1/users/1024
                </span>
              </div>

              {/* Status Code Display */}
              <div className="p-6 border-b border-slate-800/50 flex flex-col items-center justify-center py-10">
                <div className="flex items-center gap-3 mb-3">
                  {statusConcepts[httpStatus].icon}
                  <span className={`text-2xl font-bold ${
                    httpStatus.startsWith('2') ? 'text-emerald-400' : 
                    httpStatus.startsWith('4') ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {statusConcepts[httpStatus].label}
                  </span>
                </div>
                <p className="text-center text-slate-400 text-sm max-w-md">
                  {statusConcepts[httpStatus].desc}
                </p>
              </div>

              {/* Payload (Mock) */}
              <div className="p-4 bg-slate-950/80 flex-1">
                <div className="flex items-center gap-2 text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">
                  <FileJson size={14} /> Body (Response Payload)
                </div>
                <pre className="text-sm font-mono text-slate-300 p-4 bg-slate-900 rounded-md overflow-x-auto border border-slate-800">
                  {httpStatus === '200' && `{\n  "id": 1024,\n  "name": "Jane Doe",\n  "status": "active"\n}`}
                  {httpStatus === '201' && `{\n  "message": "User created successfully",\n  "id": 1025\n}`}
                  {httpStatus === '400' && `{\n  "error": "ValidationFailed",\n  "details": "O campo 'email' é obrigatório."\n}`}
                  {httpStatus === '404' && `{\n  "error": "NotFound",\n  "details": "Usuário ID 1024 não localizado."\n}`}
                  {httpStatus === '500' && `{\n  "error": "InternalServerError",\n  "details": "Cannot read properties of null (reading 'save')" \n}`}
                </pre>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}