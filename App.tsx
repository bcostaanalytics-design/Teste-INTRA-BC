
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, Answer, ResultQ1, ResultQ2, FinalRecommendation, SavedResult } from './types';
import { CONFIG } from './constants';
import { AvaliacaoLogistica } from './services/logic';
import LikertScale from './components/LikertScale';
import ProgressBar from './components/ProgressBar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.WELCOME);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [q1Answers, setQ1Answers] = useState<Answer[]>([]);
  const [q2Answers, setQ2Answers] = useState<Answer[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [resQ1, setResQ1] = useState<ResultQ1 | null>(null);
  const [resQ2, setResQ2] = useState<ResultQ2 | null>(null);
  const [finalRec, setFinalRec] = useState<FinalRecommendation | null>(null);

  // Admin states
  const [adminPassword, setAdminPassword] = useState('');
  const [adminResults, setAdminResults] = useState<SavedResult[]>([]);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim() && userEmail.trim()) {
      setState(AppState.Q1);
      setCurrentIdx(0);
      setQ1Answers([]);
      setQ2Answers([]);
    }
  };

  const handleReset = () => {
    setState(AppState.WELCOME);
    setUserName('');
    setUserEmail('');
    setQ1Answers([]);
    setQ2Answers([]);
    setCurrentIdx(0);
    setResQ1(null);
    setResQ2(null);
    setFinalRec(null);
  };

  const handleGoToQ2 = () => {
    setState(AppState.Q2);
    setCurrentIdx(0);
    setQ2Answers([]);
  };

  const saveResult = (final: FinalRecommendation) => {
    const existing = JSON.parse(localStorage.getItem('inventory_member_results') || '[]');
    const newResult: SavedResult = {
      id: crypto.randomUUID(),
      nome: userName,
      email: userEmail,
      data: new Date().toLocaleString('pt-BR'),
      setor: final.cargo_sugerido.setor,
      perfil: final.cargo_sugerido.perfil,
      cargo: final.cargo_sugerido.titulo,
      adequacao: final.setor_recomendado.percentual_adequacao,
      plano: final.proximos_passos,
      ranking_setores: final.ranking_setores_full.map(r => ({
        setor_nome: r.setor_nome,
        percentual: r.percentual
      }))
    };
    localStorage.setItem('inventory_member_results', JSON.stringify([...existing, newResult]));
  };

  const handleAnswer = (val: number) => {
    if (state === AppState.Q1) {
      const q = CONFIG.questionario_1_setores.questoes[currentIdx];
      const newAns = [...q1Answers.filter(a => a.questao_id !== q.id), { questao_id: q.id, valor: val }];
      setQ1Answers(newAns);
      
      if (currentIdx < CONFIG.questionario_1_setores.total_questoes - 1) {
        setTimeout(() => setCurrentIdx(prev => prev + 1), 300);
      } else {
        const result = AvaliacaoLogistica.calcularQ1(newAns);
        setResQ1(result);
        // Direct transition to Q2, hiding Q1 results from user
        setState(AppState.Q2);
        setCurrentIdx(0);
      }
    } else if (state === AppState.Q2) {
      const q = CONFIG.questionario_2_perfil.questoes[currentIdx];
      const newAns = [...q2Answers.filter(a => a.questao_id !== q.id), { questao_id: q.id, valor: val }];
      setQ2Answers(newAns);

      if (currentIdx < CONFIG.questionario_2_perfil.total_questoes - 1) {
        setTimeout(() => setCurrentIdx(prev => prev + 1), 300);
      } else {
        const result = AvaliacaoLogistica.calcularQ2(newAns);
        setResQ2(result);
        if (resQ1) {
          const final = AvaliacaoLogistica.gerarRecomendacaoFinal(resQ1, result);
          setFinalRec(final);
          saveResult(final);
          setState(AppState.FINAL_RESULT);
        }
      }
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'Log2026') {
      const results = JSON.parse(localStorage.getItem('inventory_member_results') || '[]');
      setAdminResults(results);
      setState(AppState.ADMIN);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert('Senha Incorreta');
    }
  };

  const exportToCSV = () => {
    if (adminResults.length === 0) return;
    
    const headers = ['Nome', 'Email', 'Data', 'Setor Ideal', 'Afinidade Setores', 'Perfil', 'Cargo Sugerido', 'Adequacao %', 'Plano de Desenvolvimento'];
    const rows = adminResults.map(r => [
      r.nome,
      r.email,
      r.data,
      r.setor,
      r.ranking_setores ? r.ranking_setores.map(s => `${s.setor_nome}: ${s.percentual}%`).join(' | ') : '',
      r.perfil,
      r.cargo,
      r.adequacao,
      r.plano ? r.plano.join(' | ') : ''
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `trilha_logistica_admin_export_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearData = () => {
    if (window.confirm('Deseja realmente apagar todos os registros permanentemente?')) {
      localStorage.removeItem('inventory_member_results');
      setAdminResults([]);
      // Reload results from storage to ensure UI is in sync
      const results = JSON.parse(localStorage.getItem('inventory_member_results') || '[]');
      setAdminResults(results);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-black text-white py-6 shadow-xl sticky top-0 z-50 border-b-2 border-orange-600">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-route text-xl"></i>
            </div>
            <button onClick={handleReset} className="text-left">
              <h1 className="text-xl font-bold tracking-tight uppercase">Trilha logística</h1>
              <p className="text-xs text-orange-500 font-medium tracking-widest uppercase">Diagnóstico de Carreira</p>
            </button>
          </div>
          <div className="hidden sm:block">
            <button 
              onClick={() => setShowAdminLogin(true)}
              className="px-3 py-1 bg-slate-900 rounded-full text-xs font-semibold text-slate-300 border border-slate-700 hover:text-orange-500 transition-colors"
            >
              ADM ACCESS
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 flex-grow w-full">
        
        {state === AppState.WELCOME && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
            <div className="p-8 sm:p-12">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <i className="fas fa-route text-4xl"></i>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4 uppercase tracking-tight">Trilha logística</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  Em qual ponto do grid você se conecta?
                </p>
              </div>
              
              <form onSubmit={handleStart} className="max-w-md mx-auto space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nome Completo</label>
                    <input 
                      required
                      type="text" 
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Ex: João Silva"
                      className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-orange-500 focus:ring-0 outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">E-mail Profissional</label>
                    <input 
                      required
                      type="email" 
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="email@empresa.com.br"
                      className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-orange-500 focus:ring-0 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full px-12 py-5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-3"
                >
                  Iniciar Trilha Logística
                  <i className="fas fa-arrow-right"></i>
                </button>
              </form>
            </div>
          </div>
        )}

        {(state === AppState.Q1 || state === AppState.Q2) && (
          <div className="animate-slideIn">
            <ProgressBar 
              current={currentIdx + 1} 
              total={state === AppState.Q1 ? CONFIG.questionario_1_setores.total_questoes : CONFIG.questionario_2_perfil.total_questoes} 
              label={state === AppState.Q1 ? 'Avaliação I: Domínio Operacional' : 'Avaliação II: DNA Comportamental'}
            />
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12">
              <div className="flex items-center gap-4 mb-6">
                 <span className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center font-black text-xl">
                    {currentIdx + 1}
                 </span>
                 <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">
                    {state === AppState.Q1 
                      ? CONFIG.questionario_1_setores.questoes[currentIdx].texto 
                      : CONFIG.questionario_2_perfil.questoes[currentIdx].texto}
                 </h2>
              </div>
              <LikertScale 
                value={
                  state === AppState.Q1 
                    ? q1Answers.find(a => a.questao_id === CONFIG.questionario_1_setores.questoes[currentIdx].id)?.valor || 0
                    : q2Answers.find(a => a.questao_id === CONFIG.questionario_2_perfil.questoes[currentIdx].id)?.valor || 0
                } 
                onChange={handleAnswer} 
              />
              <div className="flex justify-between mt-12">
                <button 
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(prev => prev - 1)}
                  className="px-6 py-3 text-slate-400 hover:text-slate-600 font-semibold flex items-center gap-2 disabled:opacity-0"
                >
                  <i className="fas fa-chevron-left"></i> Voltar
                </button>
                <div className="text-slate-300 font-medium uppercase text-xs tracking-widest">Etapa {state === AppState.Q1 ? "1" : "2"} - Questão {currentIdx + 1}</div>
              </div>
            </div>
          </div>
        )}

        {state === AppState.FINAL_RESULT && (
          <div className="animate-fadeIn flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 shadow-inner">
              <i className="fas fa-check text-4xl"></i>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Teste Concluído com Sucesso!</h2>
            <p className="text-xl text-slate-600 max-w-xl mx-auto leading-relaxed mb-10">
              Agradecemos sua participação na <strong>Trilha Logística</strong>. Seus resultados foram processados e em breve teremos uma conversa para alinhar sua jornada profissional.
            </p>
            <button 
              onClick={handleReset} 
              className="px-10 py-4 bg-black text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center gap-3"
            >
              <i className="fas fa-rotate-left"></i> Realizar Novo Teste
            </button>
          </div>
        )}

        {state === AppState.ADMIN && (
          <div className="animate-fadeIn pb-20">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-black p-8 text-white flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Painel Administrativo</h2>
                  <p className="text-orange-500 text-sm font-bold">Relatório de Candidatos e Resultados</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={exportToCSV} className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 rounded-xl font-bold text-sm flex items-center gap-2 transition-all">
                    <i className="fas fa-file-excel"></i> Exportar (CSV)
                  </button>
                  <button onClick={clearData} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl font-bold text-sm flex items-center gap-2 transition-all">
                    <i className="fas fa-trash"></i> Limpar
                  </button>
                  <button onClick={() => setState(AppState.WELCOME)} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-sm transition-all">
                    Sair
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Candidato</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Afinidade Setores</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Resultado Final</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Plano Sugerido</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adminResults.length > 0 ? adminResults.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors align-top">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800">{r.nome}</p>
                          <p className="text-xs text-slate-500">{r.email}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{r.data}</p>
                        </td>
                        <td className="px-6 py-4">
                          <ul className="text-[10px] space-y-1 text-slate-600">
                            {r.ranking_setores?.map((s, idx) => (
                              <li key={idx} className={idx === 0 ? "font-bold text-orange-600" : ""}>
                                {s.setor_nome}: {s.percentual}%
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-black text-orange-600 uppercase">{r.cargo}</p>
                          <p className="text-[10px] text-slate-500 font-medium">Setor: {r.setor} | Perfil: {r.perfil}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Adequação: {r.adequacao}%</p>
                        </td>
                        <td className="px-6 py-4">
                          <ul className="text-[10px] space-y-1 list-disc list-inside text-slate-600">
                            {r.plano?.map((step, idx) => <li key={idx}>{step}</li>)}
                          </ul>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">Nenhum registro encontrado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {showAdminLogin && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-8 animate-fadeIn shadow-2xl">
              <div className="text-center mb-6">
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Acesso Restrito</h3>
                <p className="text-sm text-slate-500 font-medium">Painel de Controle Trilha Logística</p>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input autoFocus type="password" placeholder="Senha de Acesso" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 outline-none focus:border-orange-500 transition-all font-bold text-center tracking-[0.5em]" />
                <button type="submit" className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-lg shadow-orange-200 transition-all">Autenticar</button>
                <button type="button" onClick={() => setShowAdminLogin(false)} className="w-full py-2 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600 transition-all">Cancelar</button>
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full py-8 mt-auto border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Teste criado por Bruno Costa</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;
