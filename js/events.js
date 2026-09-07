/**
 * PoupaCariri v2.0 - Banco de Eventos Aleatórios do Cariri
 * Simula imprevistos e oportunidades regionais da vida universitária na URCA.
 */

export const CARIRI_EVENTS = [
  {
    id: "moto_quebrou",
    title: "Moto quebrou na ladeira do Crato!",
    category: "expense",
    cost: 150.00,
    icon: "fa-motorcycle",
    badge: "Imprevisto de Transporte",
    description: "A moto usada para chegar à parada do ônibus da URCA arrebentou a corrente e furou o pneu a caminho do Campus Pimenta.",
    didacticConcept: "A reserva de emergência serve exatamente para imprevistos do dia a dia. Sem ela, o estudante recorre ao cartão e perde o controle.",
    sourceTag: "[3, 9]"
  },
  {
    id: "dente_quebrado",
    title: "Emergência odontológica urgente!",
    category: "expense",
    cost: 200.00,
    icon: "fa-tooth",
    badge: "Imprevisto de Saúde",
    description: "Uma dor de dente severa exigiu atendimento particular de emergência em Juazeiro do Norte e compra de antibióticos.",
    didacticConcept: "Saúde não espera. Ter liquidez imediata na poupança evita ter que aceitar empréstimos com taxas abusivas.",
    sourceTag: "[3, 9]"
  },
  {
    id: "celular_onibus",
    title: "Celular caiu no ônibus Barbalha-Crato",
    category: "expense",
    cost: 160.00,
    icon: "fa-mobile-screen",
    badge: "Imprevisto Tecnológico",
    description: "Na lotação do transporte universitário, o celular caiu e o display quebrou. O reparo é urgente para acompanhar os grupos acadêmicos e o portal URCA.",
    didacticConcept: "Equipamentos de estudo essenciais necessitam de socorro rápido. A poupança fornece tranquilidade mental nessas horas.",
    sourceTag: "[3, 9]"
  },
  {
    id: "livros_xerox_extra",
    title: "Livro e apostilas obrigatórias da URCA",
    category: "expense",
    cost: 90.00,
    icon: "fa-book-bookmark",
    badge: "Despesa Acadêmica Extra",
    description: "O professor de Introdução à Economia exigiu um caderno de exercícios aplicados e cópias de textos clássicos que não estavam previstos.",
    didacticConcept: "Gastos com materiais imprevistos ao longo do semestre desestruturam quem vive com o orçamento na régua sem margem de segurança.",
    sourceTag: "[3]"
  },
  {
    id: "virose_chapada",
    title: "Virose da Chapada do Araripe",
    category: "expense",
    cost: 110.00,
    icon: "fa-prescription-bottle-medical",
    badge: "Imprevisto de Saúde",
    description: "A mudança de tempo no pé de serra trouxe uma forte gripe e crise alérgica, demandando xaropes e antialérgicos na farmácia de Barbalha.",
    didacticConcept: "Gastos médicos inesperados são a causa nº 1 de endividamento familiar no Brasil. Pequenas reservas evitam juros de cartão.",
    sourceTag: "[3, 4]"
  },
  {
    id: "freela_mostra_urca",
    title: "Oportunidade: Freela na Mostra da URCA!",
    category: "income",
    gain: 140.00,
    icon: "fa-graduation-cap",
    badge: "Renda Extra Universitária",
    description: "Camila foi convidada para trabalhar no apoio e credenciamento da Semana Universitária da URCA no Campus Crato durante o sábado.",
    didacticConcept: "Renda extra não deve ser tratada como convite ao consumo imediato: o destino ideal é reforçar a reserva e investir.",
    sourceTag: "[3, 7]"
  },
  {
    id: "bico_expocrato",
    title: "Oportunidade: Bico na Feira/Expocrato!",
    category: "income",
    gain: 180.00,
    icon: "fa-cow",
    badge: "Renda Extra Regional",
    description: "Um comerciante local de Barbalha contratou Camila para organizar planilhas de estoque e caixa para a tradicional feira regional.",
    didacticConcept: "Aplicar conhecimentos do curso (Ciências Econômicas) para gerar renda ativa antecipa a prática profissional e melhora o patrimônio.",
    sourceTag: "[6, 7]"
  },
  {
    id: "auxilio_retroativo",
    title: "Oportunidade: Auxílio transporte retroativo!",
    category: "income",
    gain: 120.00,
    icon: "fa-bus",
    badge: "Benefício Estudantil",
    description: "A URCA liberou uma parcela pendente de auxílio transporte estudantil referente a meses anteriores.",
    didacticConcept: "Recebimentos retroativos devem ser alocados com sabedoria: guardar parte na poupança assegura tranquilidade para os próximos meses.",
    sourceTag: "[3, 9]"
  }
];

/**
 * Seleciona um evento aleatório baseado no mês
 * Garante que os meses alternem entre imprevistos reais e oportunidades
 */
export function getRandomCaririEvent(month, usedEventIds = []) {
  let pool = CARIRI_EVENTS.filter(e => !usedEventIds.includes(e.id));
  
  if (pool.length === 0) {
    pool = CARIRI_EVENTS;
  }
  
  // No Mês 1 e 2 testamos a reserva com imprevistos; Mês 3 pode ter oportunidade ou imprevisto
  let filtered = pool;
  if (month === 1) {
    // Imprevisto clássico do PRD (moto ou dente)
    const priority = pool.filter(e => e.id === "moto_quebrou" || e.id === "dente_quebrado");
    filtered = priority.length > 0 ? priority : pool.filter(e => e.category === "expense");
  } else if (month === 2) {
    filtered = pool.filter(e => e.category === "expense");
  } else if (month === 3) {
    // Pode ser ganho ou gasto
    filtered = pool;
  } else {
    // Mês 4
    filtered = pool;
  }
  
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}
