
import { Sector, Question, Profile } from './types';

export const CONFIG = {
  setores_logisticos: [
    {
      id: "REC",
      nome: "Recebimento",
      descricao: "Área responsável pela conferência, validação e recepção de mercadorias",
      competencias_chave: ["Atenção aos detalhes", "Conferência", "Documentação", "Comunicação", "Organização"]
    },
    {
      id: "MOV",
      nome: "Movimentação",
      descricao: "Área responsável pela movimentação interna de materiais e operação de equipamentos",
      competencias_chave: ["Operação de equipamentos", "Dinamismo", "Resistência física", "Segurança", "Agilidade"]
    },
    {
      id: "EST",
      nome: "Estoque",
      descricao: "Área responsável pela guarda, organização e controle de materiais armazenados",
      competencias_chave: ["Organização", "Método", "Controle", "Sistematização", "Paciência"]
    },
    {
      id: "PIC",
      nome: "Picking",
      descricao: "Área responsável pela separação de pedidos e preparação para expedição",
      competencias_chave: ["Agilidade", "Precisão", "Concentração", "Ritmo acelerado", "Atenção aos detalhes"]
    },
    {
      id: "EXP",
      nome: "Expedição",
      descricao: "Área responsável pela conferência final, embalagem e envio de mercadorias",
      competencias_chave: ["Senso de urgência", "Multitarefa", "Conferência", "Resolução de problemas", "Trabalho sob pressão"]
    },
    {
      id: "INV",
      nome: "Inventário",
      descricao: "Área responsável pela contagem, auditoria e acuracidade de estoques",
      competencias_chave: ["Análise", "Precisão", "Meticulosidade", "Pensamento crítico", "Documentação"]
    }
  ] as Sector[],

  questionario_1_setores: {
    titulo: "Questionário 1 - Identificação de Setor Ideal",
    total_questoes: 30,
    questoes: [
      { id: "Q1", texto: "Gosto de trabalhar com documentação e conferência de papéis/notas fiscais", pontuacao: { REC: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, MOV: {"1": 5, "2": 4, "3": 2, "4": 1, "5": 0}, EST: {"1": 1, "2": 2, "3": 2, "4": 3, "5": 3}, PIC: {"1": 2, "2": 2, "3": 2, "4": 2, "5": 2}, EXP: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, INV: {"1": 0, "2": 1, "3": 2, "4": 3, "5": 4} } },
      { id: "Q2", texto: "Prefiro trabalhar em atividades que exigem movimentação física constante", pontuacao: { REC: {"1": 5, "2": 4, "3": 2, "4": 1, "5": 0}, MOV: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, EST: {"1": 3, "2": 3, "3": 3, "4": 2, "5": 1}, PIC: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, EXP: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, INV: {"1": 4, "2": 3, "3": 2, "4": 2, "5": 1} } },
      { id: "Q3", texto: "Sou meticuloso(a) e percebo pequenos detalhes que outros não notam", pontuacao: { REC: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, MOV: {"1": 3, "2": 3, "3": 3, "4": 2, "5": 1}, EST: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 4}, PIC: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, EXP: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, INV: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5} } },
      { id: "Q4", texto: "Me adapto bem a ambientes com ritmo acelerado e prazos apertados", pontuacao: { REC: {"1": 3, "2": 3, "3": 3, "4": 3, "5": 3}, MOV: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4}, EST: {"1": 4, "2": 3, "3": 2, "4": 2, "5": 1}, PIC: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, EXP: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, INV: {"1": 3, "2": 3, "3": 3, "4": 3, "5": 2} } },
      { id: "Q5", texto: "Gosto de organizar e criar sistemas de controle e ordem", pontuacao: { REC: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 4}, MOV: {"1": 3, "2": 3, "3": 3, "4": 2, "5": 2}, EST: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, PIC: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 4}, EXP: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 4}, INV: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5} } },
      { id: "Q6", texto: "Tenho habilidade para operar equipamentos e máquinas (empilhadeiras, paleteiras)", pontuacao: { REC: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4}, MOV: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, EST: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, PIC: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, EXP: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, INV: {"1": 3, "2": 3, "3": 3, "4": 2, "5": 2} } },
      { id: "Q7", texto: "Prefiro trabalhar com dados, números e análises a atividades operacionais", pontuacao: { REC: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, MOV: {"1": 5, "2": 4, "3": 3, "4": 2, "5": 1}, EST: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 4}, PIC: {"1": 3, "2": 3, "3": 3, "4": 2, "5": 2}, EXP: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, INV: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5} } },
      { id: "Q8", texto: "Consigo manter foco e concentração em tarefas repetitivas por longos períodos", pontuacao: { REC: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4}, MOV: {"1": 3, "2": 3, "3": 3, "4": 3, "5": 2}, EST: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, PIC: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, EXP: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, INV: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5} } },
      { id: "Q9", texto: "Gosto de ser o primeiro contato/interface com fornecedores e transportadoras", pontuacao: { REC: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, MOV: {"1": 3, "2": 3, "3": 3, "4": 2, "5": 2}, EST: {"1": 4, "2": 3, "3": 3, "4": 2, "5": 1}, PIC: {"1": 3, "2": 3, "3": 3, "4": 2, "5": 2}, EXP: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 4}, INV: {"1": 3, "2": 3, "3": 3, "4": 3, "5": 2} } },
      { id: "Q10", texto: "Me sinto confortável trabalhando em um ritmo constante sem muita variação", pontuacao: { REC: {"1": 3, "2": 3, "3": 3, "4": 3, "5": 3}, MOV: {"1": 3, "2": 3, "3": 3, "4": 3, "5": 2}, EST: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, PIC: {"1": 4, "2": 3, "3": 3, "4": 2, "5": 1}, EXP: {"1": 5, "2": 4, "3": 3, "4": 2, "5": 1}, INV: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 4} } },
      { id: "Q11", texto: "Identifico rapidamente divergências entre documentos e materiais físicos", pontuacao: { REC: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, MOV: {"1": 3, "2": 3, "3": 3, "4": 2, "5": 2}, EST: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 4}, PIC: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 4}, EXP: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, INV: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5} } },
      { id: "Q12", texto: "Tenho facilidade para trabalhar com sistemas WMS e coletores de dados", pontuacao: { REC: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4}, MOV: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4}, EST: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5}, PIC: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5}, EXP: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4}, INV: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5} } },
      { id: "Q13", texto: "Prefiro trabalhar sozinho(a) a trabalhar em grupo", pontuacao: { REC: {"1": 4, "2": 3, "3": 3, "4": 2, "5": 1}, MOV: {"1": 3, "2": 3, "3": 3, "4": 3, "5": 3}, EST: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 5}, PIC: {"1": 3, "2": 3, "3": 3, "4": 3, "5": 4}, EXP: {"1": 5, "2": 4, "3": 3, "4": 2, "5": 1}, INV: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 5} } },
      { id: "Q14", texto: "Gosto de fazer contagens e conferências minuciosas", pontuacao: { REC: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 4}, MOV: {"1": 5, "2": 4, "3": 3, "4": 2, "5": 1}, EST: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, PIC: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, EXP: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4}, INV: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5} } },
      { id: "Q15", texto: "Trabalho bem com múltiplas tarefas simultâneas e interrupções frequentes", pontuacao: { REC: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 5}, MOV: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4}, EST: {"1": 5, "2": 4, "3": 3, "4": 2, "5": 1}, PIC: {"1": 3, "2": 3, "3": 3, "4": 3, "5": 3}, EXP: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, INV: {"1": 4, "2": 3, "3": 3, "4": 2, "5": 1} } },
      { id: "Q16", texto: "Tenho boa memória visual e localizações espaciais", pontuacao: { REC: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, MOV: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5}, EST: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5}, PIC: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, EXP: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, INV: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 4} } },
      { id: "Q17", texto: "Priorizo segurança e procedimentos estabelecidos acima da velocidade", pontuacao: { REC: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5}, MOV: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, EST: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5}, PIC: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, EXP: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, INV: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5} } },
      { id: "Q18", texto: "Sinto-me energizado(a) ao completar grandes volumes de tarefas rapidamente", pontuacao: { REC: {"1": 3, "2": 3, "3": 3, "4": 3, "5": 3}, MOV: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4}, EST: {"1": 4, "2": 3, "3": 3, "4": 2, "5": 1}, PIC: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, EXP: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, INV: {"1": 3, "2": 3, "3": 3, "4": 3, "5": 2} } },
      { id: "Q19", texto: "Gosto de investigar e resolver divergências ou problemas de acuracidade", pontuacao: { REC: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 4}, MOV: {"1": 4, "2": 3, "3": 3, "4": 2, "5": 1}, EST: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 4}, PIC: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, EXP: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 4}, INV: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5} } },
      { id: "Q20", texto: "Prefiro rotinas previsíveis a variações constantes no dia a dia", pontuacao: { REC: {"1": 4, "2": 3, "3": 3, "4": 2, "5": 2}, MOV: {"1": 3, "2": 3, "3": 3, "4": 3, "5": 2}, EST: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, PIC: {"1": 3, "2": 3, "3": 3, "4": 3, "5": 3}, EXP: {"1": 5, "2": 4, "3": 3, "4": 2, "5": 1}, INV: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 4} } },
      { id: "Q21", texto: "Tenho facilidade para trabalhar com embalagens e acondicionamento de produtos", pontuacao: { REC: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, MOV: {"1": 3, "2": 3, "3": 3, "4": 3, "5": 2}, EST: {"1": 3, "2": 3, "3": 3, "4": 3, "5": 2}, PIC: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4}, EXP: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, INV: {"1": 3, "2": 3, "3": 3, "4": 2, "5": 2} } },
      { id: "Q22", texto: "Consigo identificar produtos rapidamente por códigos, SKUs ou características visuais", pontuacao: { REC: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 4}, MOV: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, EST: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5}, PIC: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, EXP: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 4}, INV: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5} } },
      { id: "Q23", texto: "Me adapto bem a trabalhar em horários flexíveis ou turnos variados", pontuacao: { REC: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 5}, MOV: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4}, EST: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, PIC: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4}, EXP: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 5}, INV: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5} } },
      { id: "Q24", texto: "Gosto de trabalhar com endereçamento e organização de posições de armazenagem", pontuacao: { REC: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, MOV: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4}, EST: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, PIC: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 4}, EXP: {"1": 3, "2": 3, "3": 3, "4": 2, "5": 2}, INV: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5} } },
      { id: "Q25", texto: "Tenho resistência física para ficar em pé e caminhar por longos períodos", pontuacao: { REC: {"1": 3, "2": 3, "3": 3, "4": 3, "5": 3}, MOV: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, EST: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, PIC: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, EXP: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4}, INV: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5} } },
      { id: "Q26", texto: "Sou criterioso(a) ao validar prazos de validade e condições de produtos", pontuacao: { REC: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, MOV: {"1": 3, "2": 3, "3": 3, "4": 2, "5": 2}, EST: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, PIC: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 4}, EXP: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 4}, INV: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5} } },
      { id: "Q27", texto: "Trabalho bem sob supervisão próxima e com metas diárias claras", pontuacao: { REC: {"1": 3, "2": 3, "3": 3, "4": 3, "5": 3}, MOV: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4}, EST: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4}, PIC: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5}, EXP: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4}, INV: {"1": 3, "2": 3, "3": 3, "4": 3, "5": 2} } },
      { id: "Q28", texto: "Prefiro trabalhos que exigem atenção ao processo completo do início ao fim", pontuacao: { REC: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5}, MOV: {"1": 3, "2": 3, "3": 3, "4": 2, "5": 2}, EST: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4}, PIC: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, EXP: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5}, INV: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5} } },
      { id: "Q29", texto: "Tenho facilidade em identificar padrões e inconsistências em grandes volumes de dados", pontuacao: { REC: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4}, MOV: {"1": 4, "2": 3, "3": 3, "4": 2, "5": 1}, EST: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5}, PIC: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, EXP: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4}, INV: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5} } },
      { id: "Q30", texto: "Me sinto realizado(a) ao garantir que entregas saiam corretas e no prazo", pontuacao: { REC: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4}, MOV: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, EST: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, PIC: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5}, EXP: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, INV: {"1": 2, "2": 2, "3": 3, "4": 4, "5": 4} } }
    ] as Question[]
  },

  questionario_2_perfil: {
    titulo: "Questionário 2 - Perfil Gestão ou Técnico",
    total_questoes: 20,
    perfis: [
      { id: "GESTAO", nome: "Gestão/Liderança", descricao: "Perfil adequado para posições de supervisão, coordenação e gestão de equipes e processos logísticos", caracteristicas: ["Liderança", "Visão estratégica", "Comunicação", "Tomada de decisão", "Gestão de pessoas"] },
      { id: "TECNICO", nome: "Técnico/Especialista", descricao: "Perfil adequado para posições operacionais especializadas e técnicas dentro dos setores logísticos", caracteristicas: ["Especialização técnica", "Execução", "Precisão", "Foco operacional", "Expertise específica"] }
    ] as Profile[],
    questoes: [
      { id: "Q2_01", texto: "Gosto de coordenar e distribuir tarefas entre pessoas", pontuacao: { GESTAO: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, TECNICO: {"1": 5, "2": 4, "3": 3, "4": 2, "5": 1} } },
      { id: "Q2_02", texto: "Prefiro me aprofundar tecnicamente em uma atividade específica a ter visão ampla de várias", pontuacao: { GESTAO: {"1": 5, "2": 4, "3": 3, "4": 2, "5": 1}, TECNICO: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5} } },
      { id: "Q2_03", texto: "Tenho facilidade para resolver conflitos e mediar situações entre pessoas", pontuacao: { GESTAO: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, TECNICO: {"1": 3, "2": 3, "3": 3, "4": 2, "5": 1} } },
      { id: "Q2_04", texto: "Me sinto confortável sendo responsável por resultados de outras pessoas", pontuacao: { GESTAO: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, TECNICO: {"1": 4, "2": 3, "3": 3, "4": 2, "5": 1} } },
      { id: "Q2_05", texto: "Gosto de trabalhar diretamente com as mãos e equipamentos operacionais", pontuacao: { GESTAO: {"1": 4, "2": 3, "3": 3, "4": 2, "5": 1}, TECNICO: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5} } },
      { id: "Q2_06", texto: "Tenho interesse em analisar indicadores, KPIs e métricas de desempenho", pontuacao: { GESTAO: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, TECNICO: {"1": 3, "2": 3, "3": 3, "4": 3, "5": 2} } },
      { id: "Q2_07", texto: "Prefiro executar tarefas específicas com excelência a gerenciar múltiplas atividades", pontuacao: { GESTAO: {"1": 5, "2": 4, "3": 3, "4": 2, "5": 1}, TECNICO: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5} } },
      { id: "Q2_08", texto: "Gosto de participar de reuniões e discussões estratégicas", pontuacao: { GESTAO: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, TECNICO: {"1": 4, "2": 3, "3": 3, "4": 2, "5": 1} } },
      { id: "Q2_09", texto: "Tenho habilidade para dar feedback e desenvolver pessoas", pontuacao: { GESTAO: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, TECNICO: {"1": 3, "2": 3, "3": 3, "4": 2, "5": 1} } },
      { id: "Q2_10", texto: "Me motivo ao me tornar referência técnica em uma área específica", pontuacao: { GESTAO: {"1": 3, "2": 3, "3": 3, "4": 3, "5": 2}, TECNICO: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5} } },
      { id: "Q2_11", texto: "Consigo tomar decisões rápidas mesmo com informações incompletas", pontuacao: { GESTAO: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, TECNICO: {"1": 3, "2": 3, "3": 3, "4": 2, "5": 1} } },
      { id: "Q2_12", texto: "Prefiro seguir procedimentos técnicos estabelecidos a criar novos processos", pontuacao: { GESTAO: {"1": 4, "2": 3, "3": 3, "4": 2, "5": 1}, TECNICO: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5} } },
      { id: "Q2_13", texto: "Gosto de planejar recursos, escalas e organizar operações", pontuacao: { GESTAO: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, TECNICO: {"1": 3, "2": 3, "3": 3, "4": 2, "5": 1} } },
      { id: "Q2_14", texto: "Me sinto mais confortável recebendo orientações claras do que decidindo a estratégia", pontuacao: { GESTAO: {"1": 5, "2": 4, "3": 3, "4": 2, "5": 1}, TECNICO: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5} } },
      { id: "Q2_15", texto: "Tenho visão de longo prazo e gosto de pensar em melhorias futuras", pontuacao: { GESTAO: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, TECNICO: {"1": 3, "2": 3, "3": 3, "4": 2, "5": 2} } },
      { id: "Q2_16", texto: "Prefiro trabalhar focado(a) em minha produtividade individual a gerenciar a de outros", pontuacao: { GESTAO: {"1": 5, "2": 4, "3": 3, "4": 2, "5": 1}, TECNICO: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5} } },
      { id: "Q2_17", texto: "Gosto de representar a equipe em comunicações com outras áreas/clientes", pontuacao: { GESTAO: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, TECNICO: {"1": 4, "2": 3, "3": 3, "4": 2, "5": 1} } },
      { id: "Q2_18", texto: "Me motiva dominar ferramentas, sistemas e tecnologias específicas", pontuacao: { GESTAO: {"1": 2, "2": 2, "3": 3, "4": 3, "5": 3}, TECNICO: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5} } },
      { id: "Q2_19", texto: "Tenho facilidade para comunicar ideias e influenciar pessoas", pontuacao: { GESTAO: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, TECNICO: {"1": 3, "2": 3, "3": 3, "4": 2, "5": 1} } },
      { id: "Q2_20", texto: "Valorizo mais reconhecimento por resultados da equipe do que por performance individual", pontuacao: { GESTAO: {"1": 0, "2": 1, "3": 2, "4": 4, "5": 5}, TECNICO: {"1": 4, "2": 3, "3": 3, "4": 2, "5": 1} } }
    ] as Question[]
  },

  recomendacoes_finais: {
    matriz_combinacao: [
      { setor: "REC", perfil: "GESTAO", cargo_sugerido: "Supervisor de Recebimento", descricao: "Coordenar equipe de conferentes, gerenciar agendamento de fornecedores e controlar KPIs." },
      { setor: "REC", perfil: "TECNICO", cargo_sugerido: "Conferente Especialista / Analista de Recebimento", descricao: "Especializar-se em conferência técnica, validação de qualidade e WMS avançado." },
      { setor: "MOV", perfil: "GESTAO", cargo_sugerido: "Supervisor de Movimentação", descricao: "Gerenciar equipe de operadores, coordenar frota e otimizar fluxos internos." },
      { setor: "MOV", perfil: "TECNICO", cargo_sugerido: "Operador Especialista de Equipamentos", descricao: "Referência em operação de empilhadeiras, manutenção preventiva e segurança." },
      { setor: "EST", perfil: "GESTAO", cargo_sugerido: "Supervisor de Estoque", descricao: "Gerenciar organização do armazém, controlar acuracidade e liderar melhorias de layout." },
      { setor: "EST", perfil: "TECNICO", cargo_sugerido: "Analista de Estoque / Especialista em Endereçamento", descricao: "Especialista em gestão de endereços, curva ABC e sistemas de armazenagem." },
      { setor: "PIC", perfil: "GESTAO", cargo_sugerido: "Supervisor de Picking", descricao: "Coordenar equipe de separadores, otimizar rotas e gerenciar produtividade." },
      { setor: "PIC", perfil: "TECNICO", cargo_sugerido: "Separador Especialista / Picker Sênior", descricao: "Alcançar alta produtividade e dominar diferentes modalidades de separação." },
      { setor: "EXP", perfil: "GESTAO", cargo_sugerido: "Supervisor de Expedição", descricao: "Coordenar carregamentos, gerenciar interface com transportadoras e controlar prazos." },
      { setor: "EXP", perfil: "TECNICO", cargo_sugerido: "Conferente de Expedição / Analista de Packing", descricao: "Foco em conferência final, técnicas de embalagem e documentação fiscal." },
      { setor: "INV", perfil: "GESTAO", cargo_sugerido: "Coordenador de Inventário", descricao: "Planejar inventários, analisar divergências e implementar melhorias de acuracidade." },
      { setor: "INV", perfil: "TECNICO", cargo_sugerido: "Analista de Inventário / Auditor de Estoque", descricao: "Especialista em contagens cíclicas, investigação de divergências e auditoria." }
    ]
  }
};
