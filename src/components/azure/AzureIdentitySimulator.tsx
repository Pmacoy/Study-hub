
import React, { useState } from 'react';
import { Users, UserPlus, Key, ShieldAlert, Fingerprint, Mail, CheckCircle, Trash2, Info } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  group: 'Admin' | 'Dev' | 'Finance';
  ssprEnabled: boolean;
}

export default function AzureIdentitySimulator() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Admin Root', email: 'admin@example.com', group: 'Admin', ssprEnabled: true },
  ]);
  const [newName, setNewName] = useState('');
  const [newGroup, setNewGroup] = useState<'Admin' | 'Dev' | 'Finance'>('Dev');

  const addUser = () => {
    if (!newName) return;
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      email: `${newName.toLowerCase().replace(' ', '.')}@example.com`,
      group: newGroup,
      ssprEnabled: false,
    };
    setUsers([...users, newUser]);
    setNewName('');
  };

  const toggleSspr = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, ssprEnabled: !u.ssprEnabled } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-slate-950 text-slate-50 rounded-xl shadow-2xl border border-slate-800 space-y-8 animate-in fade-in duration-500">
      
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-sky-400 flex items-center gap-2">
            <Fingerprint size={28} />
            Azure Entra ID (Active Directory)
          </h2>
          <p className="text-sm text-slate-400 mt-1">Gerenciamento de Identidades e Acesso (IAM).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-800 space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <UserPlus size={14} /> Provisionamento
          </h3>
          <div className="space-y-3">
            <input 
              type="text" placeholder="Nome do Usuário" value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 p-2.5 rounded text-sm outline-none focus:border-sky-500"
            />
            <select 
              value={newGroup} onChange={(e) => setNewGroup(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 p-2.5 rounded text-sm"
            >
              <option value="Admin">Global Admin</option>
              <option value="Dev">Application Developer</option>
              <option value="Finance">Billing Reader</option>
            </select>
            <button onClick={addUser} className="w-full bg-sky-600 hover:bg-sky-500 py-2.5 rounded text-sm font-bold transition-all">
              Criar no Diretório
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900/30 rounded-lg border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-500 border-b border-slate-800">
              <tr>
                <th className="p-4 text-[10px] uppercase font-black">Identidade</th>
                <th className="p-4 text-[10px] uppercase font-black">Grupo / Role</th>
                <th className="p-4 text-[10px] uppercase font-black text-center">SSPR</th>
                <th className="p-4 text-[10px] uppercase font-black text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30">
                  <td className="p-4">
                    <div className="font-bold">{user.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{user.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded-full text-[10px] font-bold">{user.group}</span>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => toggleSspr(user.id)} className={`p-1.5 rounded ${user.ssprEnabled ? 'text-emerald-400' : 'text-slate-600'}`}>
                      <Key size={16} />
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => deleteUser(user.id)} className="text-slate-600 hover:text-rose-500"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONCEITOS PRIMORDIAIS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800 pt-6">
        <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800">
          <h4 className="text-sky-400 font-bold text-[10px] uppercase mb-2 flex items-center gap-2"><Users size={12}/> Usuários & Grupos</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">No Azure, grupos podem ser <strong>Assigned</strong> (manual) ou <strong>Dynamic</strong> (baseado em regras de atributos).</p>
        </div>
        <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800">
          <h4 className="text-emerald-400 font-bold text-[10px] uppercase mb-2 flex items-center gap-2"><Key size={12}/> SSPR</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">O <strong>Self-Service Password Reset</strong> reduz chamados de suporte. Requer licenciamento <strong>P1 ou P2</strong>.</p>
        </div>
        <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800">
          <h4 className="text-rose-400 font-bold text-[10px] uppercase mb-2 flex items-center gap-2"><ShieldAlert size={12}/> MFA</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">Multi-Factor Authentication é a maior defesa contra ataques de identidade no Entra ID.</p>
        </div>
      </div>
    </div>
  );
}