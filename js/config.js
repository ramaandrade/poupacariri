/**
 * PoupaCariri v2.0 - Configurações e Modelos de Dados
 * Grounded nas diretrizes de Educação Financeira para a URCA
 */

export const INITIAL_STATE = {
  currentMonth: 1,
  totalMonths: 4,
  persona: {
    name: "Camila Alencar",
    age: 19,
    course: "Ciências Contábeis (1º Semestre)",
    campus: "Campus Crato - URCA",
    residence: "Barbalha - CE",
    commute: "Ônibus universitário Barbalha <-> Crato",
    monthlyIncome: 700.00,
    essentialExpenses: 400.00,
    details: "Estudante de 19 anos, ingressante em Contabilidade na URCA. Reside em Barbalha e se desloca diariamente até o Crato. Recebe R$ 700 de bolsa de Iniciação Científica e gerencia seu primeiro orçamento independente."
  },
  balances: {
    checking: 100.00,        // Conta Corrente
    savings: 200.00,         // Poupança (Reserva de Emergência)
    investments: {
      bonds: 100.00,         // Títulos Públicos (Baixo risco)
      funds: 100.00,         // Fundos de Investimento (Médio risco)
      stocks: 100.00         // Ações (Alto risco)
    },
    creditCardDebt: 0.00,    // Dívida Cartão de Crédito
    personalLoanDebt: 0.00   // Dívida Empréstimo Pessoal
  },
  stats: {
    stability: 75,
    happiness: 80,
    totalInterestPaid: 0.00,
    totalInvestedReturns: 0.00
  },
  monthNames: [
    "Mês 1 (Início do Semestre - Março)",
    "Mês 2 (Provas Parciais - Abril)",
    "Mês 3 (Eventos & Mostras - Maio)",
    "Mês 4 (Encerramento Semestral - Junho)"
  ],
  rates: {
    savingsMonthly: 0.005,       // 0.5% a.m.
    bondsMonthly: 0.0085,        // 0.85% a.m. (Tesouro Selic/CDB)
    fundsRange: [-0.010, 0.024], // -1.0% a +2.4%
    stocksRange: [-0.065, 0.095],// -6.5% a +9.5%
    creditCardRate: 0.12,        // 12% a.m. (Rotativo agressivo)
    personalLoanRate: 0.06       // 6% a.m. (Empréstimo consignado/pessoal)
  },
  monthlyOptions: {
    1: [
      { id: "opt_lanche_crato", name: "Lanche na Praça da Sé (Crato)", cost: 45, happiness: 10, stability: 0, desc: "Momento de descompressão com colegas após a aula de Contabilidade." },
      { id: "opt_calourada", name: "Ingresso da Calourada da URCA", cost: 75, happiness: 18, stability: -2, desc: "Festa tradicional de integração universitária com forró pé de serra." },
      { id: "opt_acai_juaz", name: "Açaí com amigos na Leão Sampaio", cost: 25, happiness: 8, stability: 0, desc: "Passeio rápido no fim de semana até Juazeiro do Norte." },
      { id: "opt_livro_contab", name: "Livro de Contabilidade Básica no sebo", cost: 50, happiness: 6, stability: 6, desc: "Material de apoio valioso para gabaritar a disciplina de introdução." },
      { id: "opt_feira_barbalha", name: "Roupas e bijuterias na feira de Barbalha", cost: 60, happiness: 5, stability: -4, desc: "Compra emocional não planejada ao passar pela feira municipal." }
    ],
    2: [
      { id: "opt_cantina_urca", name: "Café reforçado e tapioca na cantina da URCA", cost: 35, happiness: 9, stability: 0, desc: "Energia extra para encarar o turno das provas parciais." },
      { id: "opt_mirante_caldas", name: "Passeio no Mirante do Caldas (Barbalha)", cost: 60, happiness: 15, stability: 0, desc: "Dia relaxante na chapada com banho de bica e ar puro." },
      { id: "opt_pizza_estudo", name: "Rateio de pizza com o grupo de trabalho", cost: 40, happiness: 10, stability: 0, desc: "Reunião de estudo para o trabalho de Teoria da Contabilidade." },
      { id: "opt_curso_excel", name: "Minicurso online de Excel e Dashboards", cost: 55, happiness: 7, stability: 7, desc: "Habilidade de alta demanda para conseguir bolsas e estágios." },
      { id: "opt_delivery_noite", name: "Lanches por aplicativo de entrega tarde da noite", cost: 50, happiness: 5, stability: -3, desc: "Gasto com delivery por pura preguiça de preparar a janta." }
    ],
    3: [
      { id: "opt_centro_cultural", name: "Passeio no Centro Cultural do Cariri (Crato)", cost: 35, happiness: 12, stability: 2, desc: "Visita cultural com oficinas artísticas e exposições históricas." },
      { id: "opt_churrasco_sala", name: "Confraternização da turma de Contabilidade", cost: 70, happiness: 16, stability: -2, desc: "Churrasco no Crato para celebrar a aprovação nas provas intermediárias." },
      { id: "opt_shopping_cinema", name: "Cinema com pipoca no Cariri Shopping", cost: 45, happiness: 11, stability: 0, desc: "Tarde de lazer descontraída com amigos em Juazeiro." },
      { id: "opt_apostila_fiscal", name: "Apostila especializada de Matemática Financeira", cost: 40, happiness: 5, stability: 6, desc: "Guia prático para dominar juros simples, compostos e amortização." },
      { id: "opt_promo_online", name: "Compras em promoção relâmpago de roupas", cost: 65, happiness: 6, stability: -5, desc: "Compra por impulso seduzida por 'frete grátis' e desconto ilusório." }
    ],
    4: [
      { id: "opt_festa_fim_semestre", name: "Festa de encerramento do semestre da URCA", cost: 80, happiness: 20, stability: -2, desc: "Comemoração inesquecível da aprovação em todas as cadeiras do 1º período." },
      { id: "opt_almoco_familia", name: "Almoço especial de agradecimento em Barbalha", cost: 60, happiness: 14, stability: 2, desc: "Almoço em família celebrando a jornada acadêmica e conquistas." },
      { id: "opt_sorvete_amigos", name: "Sorvete artesanal na Praça Siqueira Campos", cost: 25, happiness: 8, stability: 0, desc: "Momento afetuoso de despedida antes do recesso universitário." },
      { id: "opt_reserva_ferias", name: "Curso livre de Férias: Análise de Custos", cost: 50, happiness: 6, stability: 6, desc: "Avanço de competências para o próximo semestre de Contabilidade." },
      { id: "opt_lembrancas_expo", name: "Lembranças e artesanato regional da Expocrato", cost: 55, happiness: 7, stability: -4, desc: "Presentinhos e artesanato de couro na feira tradicional do Cariri." }
    ]
  }
};

export function formatBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}
