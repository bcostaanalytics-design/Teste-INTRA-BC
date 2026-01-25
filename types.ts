
export enum AppState {
  WELCOME = 'WELCOME',
  Q1 = 'Q1',
  Q2 = 'Q2',
  FINAL_RESULT = 'FINAL_RESULT',
  ADMIN = 'ADMIN'
}

export interface SavedResult {
  id: string;
  nome: string;
  email: string;
  data: string;
  setor: string;
  perfil: string;
  cargo: string;
  adequacao: number;
  plano: string[];
  ranking_setores?: Array<{
    setor_nome: string;
    percentual: number;
  }>;
  pontuacao_perfil?: {
    gestao: number;
    tecnico: number;
  };
}

export interface Sector {
  id: string;
  nome: string;
  descricao: string;
  competencias_chave: string[];
}

export interface Question {
  id: string;
  texto: string;
  dimensao?: string;
  pontuacao: Record<string, Record<string, number>>;
}

export interface Answer {
  questao_id: string;
  valor: number;
}

export interface ResultQ1 {
  pontuacao_por_setor: Record<string, { pontos: number; percentual: number }>;
  ranking_setores: Array<{
    posicao: number;
    setor_id: string;
    setor_nome: string;
    pontos: number;
    percentual: number;
  }>;
  setor_recomendado: {
    id: string;
    nome: string;
    descricao: string;
    percentual_adequacao: number;
    nivel_adequacao: string;
    competencias_chave: string[];
  };
  top3: Array<{
    posicao: number;
    setor_id: string;
    setor_nome: string;
    pontos: number;
    percentual: number;
  }>;
}

export interface Profile {
  id: string;
  nome: string;
  descricao: string;
  caracteristicas: string[];
}

export interface ResultQ2 {
  pontuacao_por_perfil: Record<string, { pontos: number; percentual: number }>;
  diferenca_pontos: number;
  perfil_recomendado: {
    id: string;
    nome: string;
    descricao: string;
    percentual_adequacao: number;
    nivel_tendencia: string;
    caracteristicas: string[];
  };
}

export interface FinalRecommendation {
  setor_recomendado: ResultQ1['setor_recomendado'];
  perfil_recomendado: ResultQ2['perfil_recomendado'];
  cargo_sugerido: {
    titulo: string;
    descricao: string;
    setor: string;
    perfil: string;
  };
  alternativas: Array<{
    cargo: string;
    setor: string;
    adequacao: number;
  }>;
  proximos_passos: string[];
  ranking_setores_full: ResultQ1['ranking_setores'];
}
