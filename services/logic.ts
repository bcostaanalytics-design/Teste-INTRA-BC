
import { CONFIG } from '../constants';
import { Answer, ResultQ1, ResultQ2, FinalRecommendation } from '../types';

export class AvaliacaoLogistica {
  static calcularQ1(respostas: Answer[]): ResultQ1 {
    const pontuacoes: Record<string, number> = { REC: 0, MOV: 0, EST: 0, PIC: 0, EXP: 0, INV: 0 };
    const q1 = CONFIG.questionario_1_setores;
    const setores = CONFIG.setores_logisticos;

    respostas.forEach(resp => {
      const q = q1.questoes.find(item => item.id === resp.questao_id);
      if (!q) return;
      const val = resp.valor.toString();
      Object.keys(pontuacoes).forEach(setor => {
        pontuacoes[setor] += q.pontuacao[setor][val] || 0;
      });
    });

    const MAX_PTS = 150;
    const resultadosPorSetor: ResultQ1['pontuacao_por_setor'] = {};
    Object.entries(pontuacoes).forEach(([id, pts]) => {
      resultadosPorSetor[id] = { pontos: pts, percentual: Math.round((pts / MAX_PTS) * 100 * 10) / 10 };
    });

    const ranking = Object.entries(resultadosPorSetor)
      .map(([id, dados]) => ({
        setor_id: id,
        setor_nome: setores.find(s => s.id === id)?.nome || '',
        pontos: dados.pontos,
        percentual: dados.percentual
      }))
      .sort((a, b) => b.pontos - a.pontos)
      .map((item, idx) => ({ posicao: idx + 1, ...item }));

    const recomendado = ranking[0];
    const setorInfo = setores.find(s => s.id === recomendado.setor_id)!;

    return {
      pontuacao_por_setor: resultadosPorSetor,
      ranking_setores: ranking,
      setor_recomendado: {
        id: recomendado.setor_id,
        nome: recomendado.setor_nome,
        descricao: setorInfo.descricao,
        percentual_adequacao: recomendado.percentual,
        nivel_adequacao: this.getNivelAdequacao(recomendado.percentual),
        competencias_chave: setorInfo.competencias_chave
      },
      top3: ranking.slice(0, 3)
    };
  }

  static calcularQ2(respostas: Answer[]): ResultQ2 {
    const pontuacoes: Record<string, number> = { GESTAO: 0, TECNICO: 0 };
    const q2 = CONFIG.questionario_2_perfil;

    respostas.forEach(resp => {
      const q = q2.questoes.find(item => item.id === resp.questao_id);
      if (!q) return;
      const val = resp.valor.toString();
      Object.keys(pontuacoes).forEach(perfil => {
        pontuacoes[perfil] += q.pontuacao[perfil][val] || 0;
      });
    });

    const MAX_PTS = 100;
    const resultadosPorPerfil: ResultQ2['pontuacao_por_perfil'] = {};
    Object.entries(pontuacoes).forEach(([id, pts]) => {
      resultadosPorPerfil[id] = { pontos: pts, percentual: Math.round((pts / MAX_PTS) * 100 * 10) / 10 };
    });

    const recomendadoId = pontuacoes.GESTAO >= pontuacoes.TECNICO ? 'GESTAO' : 'TECNICO';
    const diff = Math.abs(pontuacoes.GESTAO - pontuacoes.TECNICO);
    const perfilInfo = q2.perfis.find(p => p.id === recomendadoId)!;

    // Fixed typo: changed recommendedId to recomendadoId
    return {
      pontuacao_por_perfil: resultadosPorPerfil,
      diferenca_pontos: diff,
      perfil_recomendado: {
        id: recomendadoId,
        nome: perfilInfo.nome,
        descricao: perfilInfo.descricao,
        percentual_adequacao: resultadosPorPerfil[recomendadoId].percentual,
        nivel_tendencia: this.getNivelTendencia(diff),
        caracteristicas: perfilInfo.caracteristicas
      }
    };
  }

  static gerarRecomendacaoFinal(q1: ResultQ1, q2: ResultQ2): FinalRecommendation {
    const sId = q1.setor_recomendado.id;
    const pId = q2.perfil_recomendado.id;
    const rec = CONFIG.recomendacoes_finais.matriz_combinacao.find(m => m.setor === sId && m.perfil === pId)!;

    const alternativas = q1.top3.slice(1).map(setor => {
      const altRec = CONFIG.recomendacoes_finais.matriz_combinacao.find(m => m.setor === setor.setor_id && m.perfil === pId);
      return {
        cargo: altRec?.cargo_sugerido || 'Profissional de Logística',
        setor: setor.setor_nome,
        adequacao: setor.percentual
      };
    });

    const passos = [
      'Conversar com seu gestor sobre suas aptidões e interesses',
      'Observar profissionais atuando na área recomendada',
      'Buscar treinamentos específicos para o setor indicado',
      ...(pId === 'GESTAO' 
        ? ['Desenvolver habilidades de liderança e gestão de pessoas', 'Buscar cursos de gestão logística', 'Participar de projetos de coordenação']
        : ['Aprofundar conhecimentos técnicos específicos', 'Buscar certificações operacionais (ex: empilhadeira)', 'Tornar-se referência técnica no setor'])
    ];

    return {
      setor_recomendado: q1.setor_recomendado,
      perfil_recomendado: q2.perfil_recomendado,
      cargo_sugerido: {
        titulo: rec.cargo_sugerido,
        descricao: rec.descricao,
        setor: q1.setor_recomendado.nome,
        perfil: q2.perfil_recomendado.nome
      },
      alternativas,
      proximos_passos: passos,
      ranking_setores_full: q1.ranking_setores
    };
  }

  private static getNivelAdequacao(perc: number) {
    if (perc >= 80) return 'Excelente';
    if (perc >= 70) return 'Muito Bom';
    if (perc >= 60) return 'Bom';
    if (perc >= 50) return 'Adequado';
    return 'Baixo';
  }

  private static getNivelTendencia(diff: number) {
    if (diff >= 30) return 'Forte Tendência';
    if (diff >= 15) return 'Tendência Moderada';
    if (diff >= 5) return 'Tendência Leve';
    return 'Perfil Híbrido';
  }
}
