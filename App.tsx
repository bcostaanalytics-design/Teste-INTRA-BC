
import React, { useState, useMemo, useEffect } from 'react';
import { AppState, Answer, ResultQ1, ResultQ2, FinalRecommendation, SavedResult } from './types';
import { CONFIG } from './constants';
import { AvaliacaoLogistica } from './services/logic';
import LikertScale from './components/LikertScale';
import ProgressBar from './components/ProgressBar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

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

  // Refresh admin results
  const refreshAdminResults = () => {
    const results = JSON.parse(localStorage.getItem('inventory_member_results') || '[]');
    setAdminResults(results);
  };

  useEffect(() => {
    if (state === AppState.ADMIN) {
      refreshAdminResults();
    }
  }, [state]);

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

  const saveResult = (final: FinalRecommendation, q2: ResultQ2) => {
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
      })),
      pontuacao_perfil: {
        gestao: q2.pontuacao_por_perfil.GESTAO.percentual,
        tecnico: q2.pontuacao_por_perfil.TECNICO.percentual
      }
    };
    localStorage.setItem('inventory_member_results', JSON.stringify([...existing, newResult]));
  };

  const handleAnswer = (val: number) => {
    if (state === AppState.Q1) {
      const q = CONFIG.questionario_1_setores.questoes[currentIdx];
      const newAns = [...q1Answers.filter(a => a.questao_id !== q.id), { questao_id: q.id, valor: val }];
      setQ1Answers(newAns);
      
      if (currentIdx < CONFIG.questionario_1_setores.total_questoes - 1) {
        setTimeout(() => setCurrentIdx(prev => prev + 1), 200);
      } else {
        const result = AvaliacaoLogistica.calcularQ1(newAns);
        setResQ1(result);
        setState(AppState.Q2);
        setCurrentIdx(0);
      }
    } else if (state === AppState.Q2) {
      const q = CONFIG.questionario_2_perfil.questoes[currentIdx];
      const newAns = [...q2Answers.filter(a => a.questao_id !== q.id), { questao_id: q.id, valor: val }];
      setQ2Answers(newAns);

      if (currentIdx < CONFIG.questionario_2_perfil.total_questoes - 1) {
        setTimeout(() => setCurrentIdx(prev => prev + 1), 200);
      } else {
        const result = AvaliacaoLogistica.calcularQ2(newAns);
        setResQ2(result);
        if (resQ1) {
          const final = AvaliacaoLogistica.gerarRecomendacaoFinal(resQ1, result);
          setFinalRec(final);
          saveResult(final, result);
          setState(AppState.FINAL_RESULT);
        }
      }
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'Log2026') {
      setState(AppState.ADMIN);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert('Senha Incorreta');
    }
  };

  const exportToCSV = () => {
    if (adminResults.length === 0) return;
    
    const sectorHeaders = CONFIG.setores_logisticos.map(s => s.nome);
    const headers = [
      'Nome', 'Email', 'Data', 'Setor Ideal', 
      ...sectorHeaders.map(s => `Score ${s} (%)`),
      'Score Gestao (%)', 'Score Tecnico (%)',
      'Perfil Dominante', 'Cargo Recomendado', 'Adequacao Final (%)', 'Plano Estrategico Completo'
    ];

    const rows = adminResults.map(r => {
      const sectorScores: Record<string, number> = {};
      r.ranking_setores?.forEach(s => { sectorScores[s.setor_nome] = s.percentual; });

      return [
        r.nome,
        r.email,
        r.data,
        r.setor,
        ...sectorHeaders.map(h => sectorScores[h] || 0),
        r.pontuacao_perfil?.gestao || 0,
        r.pontuacao_perfil?.tecnico || 0,
        r.perfil,
        r.cargo,
        r.adequacao,
        r.plano ? r.plano.join(' | ') : ''
      ];
    });

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `trilha_logistica_DADOS_COMPLETOS_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearData = () => {
    if (window.confirm('CUIDADO: Isso apagará todos os dados de testes realizados. Deseja prosseguir?')) {
      localStorage.removeItem('inventory_member_results');
      setAdminResults([]);
      refreshAdminResults();
    }
  };

  // Dashboard calculations
  const dashboardStats = useMemo(() => {
    if (adminResults.length === 0) return null;
    
    const sectorCounts: Record<string, number> = {};
    const profileCounts: Record<string, number> = { 'Gestão/Liderança': 0, 'Técnico/Especialista': 0 };
    let sumAdequacy = 0;

    adminResults.forEach(r => {
      sectorCounts[r.setor] = (sectorCounts[r.setor] || 0) + 1;
      profileCounts[r.perfil] = (profileCounts[r.perfil] || 0) + 1;
      sumAdequacy += r.adequacao;
    });

    const sectorDistribution = Object.entries(sectorCounts).map(([name, value]) => ({ name, value }));
    const profileDistribution = Object.entries(profileCounts).map(([name, value]) => ({ name, value }));

    return {
      total: adminResults.length,
      avgAdequacy: Math.round(sumAdequacy / adminResults.length),
      sectorDistribution,
      profileDistribution
    };
  }, [adminResults]);

  const CHART_COLORS = ['#ea580c', '#1e293b', '#475569', '#64748b', '#94a3b8', '#cbd5e1'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-black text-white py-4 shadow-xl sticky top-0 z-50 border-b-2 border-orange-600">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-route text-xl"></i>
            </div>
            <button onClick={handleReset} className="text-left">
              <h1 className="text-xl font-black tracking-tight uppercase leading-none">Trilha logística</h1>
              <p className="text-[10px] text-orange-500 font-bold tracking-widest uppercase">Diagnóstico de Carreira</p>
            </button>
          </div>
          <div>
            <button 
              onClick={() => setShowAdminLogin(true)}
              className="px-3 py-1 bg-slate-900 rounded-lg text-[10px] font-black text-slate-400 border border-slate-700 hover:text-orange-500 hover:border-orange-500 transition-all uppercase tracking-tighter"
            >
              Acesso Adm
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8">
        
        {state === AppState.WELCOME && (
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn max-w-2xl mx-auto">
            <div className="p-8 sm:p-12">
              <div className="text-center mb-10">
                <div className="w-24 h-24 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <i className="fas fa-truck-ramp-box text-5xl"></i>
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight">Trilha logística</h2>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  Descubra seu perfil e área ideal na intralogística.
                </p>
              </div>
              
              <form onSubmit={handleStart} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Seu Nome</label>
                    <input required type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Ex: João Silva" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all font-bold text-lg" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">E-mail</label>
                    <input required type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="email@exemplo.com" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all font-bold text-lg" />
                  </div>
                </div>
                <button type="submit" className="w-full px-8 py-5 bg-orange-600 hover:bg-black text-white rounded-2xl font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4">
                  INICIAR AGORA
                  <i className="fas fa-arrow-right"></i>
                </button>
              </form>
            </div>
          </div>
        )}

        {(state === AppState.Q1 || state === AppState.Q2) && (
          <div className="animate-fadeIn max-w-4xl mx-auto">
            <ProgressBar 
              current={currentIdx + 1} 
              total={state === AppState.Q1 ? CONFIG.questionario_1_setores.total_questoes : CONFIG.questionario_2_perfil.total_questoes} 
              label={state === AppState.Q1 ? 'Avaliação Técnica' : 'Avaliação Comportamental'}
            />
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sm:p-12">
              <div className="mb-10">
                 <h2 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight">
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
              <div className="mt-12 flex justify-between border-t border-slate-100 pt-8">
                <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(prev => prev - 1)} className="px-6 py-3 text-slate-400 font-bold hover:text-slate-900 disabled:opacity-0 transition-colors">
                  <i className="fas fa-chevron-left"></i> Anterior
                </button>
                <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest self-center">Trilha Logística</span>
              </div>
            </div>
          </div>
        )}

        {state === AppState.FINAL_RESULT && (
          <div className="animate-fadeIn flex flex-col items-center justify-center py-20 px-4 text-center max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100">
            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8">
              <i className="fas fa-circle-check text-6xl"></i>
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tight">Avaliação Concluída!</h2>
            <div className="space-y-4 text-slate-600 mb-12">
              <p className="text-xl font-bold">Obrigado pela participação, <span className="text-orange-600">{userName}</span>.</p>
              <p className="text-lg leading-relaxed max-w-md mx-auto">
                Seu mapeamento foi concluído. Em breve nosso time de gestão entrará em contato para apresentar sua trilha estratégica.
              </p>
            </div>
            <button onClick={handleReset} className="px-10 py-5 bg-black text-white rounded-2xl font-black text-lg hover:bg-orange-600 transition-all shadow-xl">
              Realizar Novo Teste
            </button>
          </div>
        )}

        {state === AppState.ADMIN && (
          <div className="animate-fadeIn space-y-8">
            <div className="bg-black rounded-3xl shadow-2xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 border-b-4 border-orange-600">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                  <i className="fas fa-gauge-high text-orange-500"></i>
                  Gestão de Talentos
                </h2>
                <p className="text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Dashboards & Relatórios Bruno Costa</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={exportToCSV} className="px-5 py-2.5 bg-orange-600 text-white hover:bg-white hover:text-black rounded-xl font-black text-xs uppercase flex items-center gap-2 transition-all">
                  <i className="fas fa-download"></i> Exportar Tudo (CSV)
                </button>
                <button onClick={clearData} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-xs uppercase flex items-center gap-2 transition-all">
                  <i className="fas fa-trash-can"></i> Limpar Dados
                </button>
                <button onClick={() => setState(AppState.WELCOME)} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-black text-xs uppercase transition-all">
                  Sair
                </button>
              </div>
            </div>

            {dashboardStats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric Cards */}
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mapeamentos Realizados</p>
                    <p className="text-4xl font-black text-slate-900">{dashboardStats.total}</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Acuracidade Média</p>
                    <p className="text-4xl font-black text-orange-600">{dashboardStats.avgAdequacy}%</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status do Banco</p>
                    <div className="flex items-center gap-2 text-green-500 font-black uppercase text-xs">
                       <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                       Sincronizado (Local)
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 md:col-span-2">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Distribuição por Área Logística</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboardStats.sectorDistribution}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{fontSize: 10, fontWeight: 700}} />
                        <YAxis tick={{fontSize: 10, fontWeight: 700}} />
                        <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="value" fill="#ea580c" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Equilíbrio de Perfil</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={dashboardStats.profileDistribution} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5}>
                          {dashboardStats.profileDistribution.map((_, index) => <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 800, textTransform: 'uppercase'}} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Detalhamento de Candidatos</h3>
                <span className="text-[10px] font-bold text-slate-400">Total: {adminResults.length} registros</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Candidato</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Afinidade Areas</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Resultado</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Plano Estratégico</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adminResults.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors align-top">
                        <td className="px-6 py-6 min-w-[200px]">
                          <p className="text-sm font-black text-slate-800">{r.nome}</p>
                          <p className="text-xs text-slate-500">{r.email}</p>
                          <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase">{r.data}</p>
                        </td>
                        <td className="px-6 py-6 min-w-[150px]">
                          <div className="space-y-1.5">
                            {r.ranking_setores?.slice(0, 3).map((s, idx) => (
                              <div key={idx} className="flex flex-col">
                                <div className="flex justify-between text-[9px] font-black uppercase mb-0.5">
                                  <span className={idx === 0 ? 'text-orange-600' : 'text-slate-500'}>{s.setor_nome}</span>
                                  <span className="text-slate-400">{s.percentual}%</span>
                                </div>
                                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full ${idx === 0 ? 'bg-orange-600' : 'bg-slate-300'}`} style={{width: `${s.percentual}%`}}></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-6 min-w-[200px]">
                          <p className="text-xs font-black text-orange-600 uppercase mb-1">{r.cargo}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Perfil {r.perfil}</p>
                          <div className="mt-2 flex items-center gap-1.5">
                            <span className="text-[9px] font-black text-slate-400 uppercase">Adequação:</span>
                            <span className="text-xs font-black text-slate-800">{r.adequacao}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <ul className="text-[10px] space-y-1.5 text-slate-600 font-medium">
                            {r.plano?.map((step, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span className="text-orange-500">•</span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                    {adminResults.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-20 text-center text-slate-400 font-black uppercase tracking-widest">Nenhum teste registrado</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {showAdminLogin && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-8 animate-fadeIn shadow-2xl border border-slate-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">Acesso Restrito</h3>
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-1">Trilha Logística Admin</p>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input autoFocus type="password" placeholder="Senha" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 outline-none focus:border-orange-500 transition-all font-black text-center text-lg tracking-[0.5em]" />
                <button type="submit" className="w-full py-4 bg-orange-600 hover:bg-black text-white rounded-xl font-black text-lg shadow-xl transition-all uppercase">Autenticar</button>
                <button type="button" onClick={() => setShowAdminLogin(false)} className="w-full py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-all">Cancelar</button>
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full py-10 mt-auto border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] opacity-80">
            Teste criado por <span className="text-slate-900">Bruno Costa</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
