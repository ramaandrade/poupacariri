/**
 * PoupaCariri v2.0 - Motor de Cálculo Financeiro & Lógica de Negócio
 * Grounded nas seções 5, 6 e 7 do PRD
 */

import { INITIAL_STATE, formatBRL } from "./config.js";
import { getRandomCaririEvent } from "./events.js";
import { BADGE_DEFINITIONS } from "./badges.js";

export class SimulationEngine {
  constructor() {
    this.reset();
  }

  reset() {
    // Clona o estado inicial
    this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
    this.history = [];
    this.unlockedBadges = new Set();
    this.usedEventIds = [];
    this.lastEventResult = null;
    this.mentorFeedback = {
      title: "Bem-vinda ao PoupaCariri, Camila!",
      message: "Você acaba de ingressar em Ciências Contábeis na URCA! Seu desafio neste semestre é honrar os R$ 400 de gastos essenciais, equilibrar seu lazer para não se sobrecarregar, proteger-se com a poupança e começar a investir o que sobrar.",
      type: "info"
    };
    this.hasShieldedIncident = false;
    this.recordHistory(0, "Início do Semestre");
  }

  getState() {
    return this.state;
  }

  getHistory() {
    return this.history;
  }

  getUnlockedBadges() {
    return Array.from(this.unlockedBadges).map(id => BADGE_DEFINITIONS.find(b => b.id === id)).filter(Boolean);
  }

  getAllBadges() {
    return BADGE_DEFINITIONS.map(b => ({
      ...b,
      unlocked: this.unlockedBadges.has(b.id)
    }));
  }

  getTotalInvestments() {
    const inv = this.state.balances.investments;
    return inv.bonds + inv.funds + inv.stocks;
  }

  getTotalDebts() {
    return this.state.balances.creditCardDebt + this.state.balances.personalLoanDebt;
  }

  getNetWorth() {
    const totalAssets = this.state.balances.checking + this.state.balances.savings + this.getTotalInvestments();
    return totalAssets - this.getTotalDebts();
  }

  /**
   * Transferência entre Conta Corrente e Poupança (Reserva)
   */
  transferCheckingToSavings(amount) {
    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0) return { success: false, msg: "Informe um valor válido maior que zero." };
    if (this.state.balances.checking < amount) {
      return { success: false, msg: `Saldo insuficiente na Conta Corrente (${formatBRL(this.state.balances.checking)}).` };
    }
    this.state.balances.checking -= amount;
    this.state.balances.savings += amount;
    this.updateIndicators();
    this.checkBadges();
    return { 
      success: true, 
      msg: `Transferido ${formatBRL(amount)} para a Poupança (Reserva de Emergência).` 
    };
  }

  transferSavingsToChecking(amount) {
    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0) return { success: false, msg: "Informe um valor válido maior que zero." };
    if (this.state.balances.savings < amount) {
      return { success: false, msg: `Saldo insuficiente na Poupança (${formatBRL(this.state.balances.savings)}).` };
    }
    this.state.balances.savings -= amount;
    this.state.balances.checking += amount;
    this.updateIndicators();
    this.checkBadges();
    return { 
      success: true, 
      msg: `Resgatado ${formatBRL(amount)} da Poupança para a Conta Corrente.` 
    };
  }

  /**
   * Alocação em Investimentos
   * assetType: 'bonds' | 'funds' | 'stocks'
   */
  investCheckingToAsset(assetType, amount) {
    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0) return { success: false, msg: "Informe um valor válido." };
    if (this.state.balances.checking < amount) {
      return { success: false, msg: `Saldo insuficiente na Conta Corrente (${formatBRL(this.state.balances.checking)}).` };
    }
    if (!['bonds', 'funds', 'stocks'].includes(assetType)) {
      return { success: false, msg: "Tipo de investimento inválido." };
    }

    this.state.balances.checking -= amount;
    this.state.balances.investments[assetType] += amount;
    this.updateIndicators();
    this.checkBadges();

    const assetNames = { bonds: "Títulos Públicos", funds: "Fundos de Investimento", stocks: "Ações" };
    return { 
      success: true, 
      msg: `Alocado ${formatBRL(amount)} em ${assetNames[assetType]}.` 
    };
  }

  redeemAssetToChecking(assetType, amount) {
    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0) return { success: false, msg: "Informe um valor válido." };
    if (!['bonds', 'funds', 'stocks'].includes(assetType)) {
      return { success: false, msg: "Tipo de investimento inválido." };
    }
    if (this.state.balances.investments[assetType] < amount) {
      return { success: false, msg: `Saldo insuficiente nesta aplicação (${formatBRL(this.state.balances.investments[assetType])}).` };
    }

    this.state.balances.investments[assetType] -= amount;
    this.state.balances.checking += amount;
    this.updateIndicators();
    this.checkBadges();

    const assetNames = { bonds: "Títulos Públicos", funds: "Fundos de Investimento", stocks: "Ações" };
    return { 
      success: true, 
      msg: `Resgatado ${formatBRL(amount)} de ${assetNames[assetType]} para a Conta Corrente.` 
    };
  }

  /**
   * Operações de Crédito e Pagamento de Dívidas
   */
  takePersonalLoan(amount) {
    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0) return { success: false, msg: "Informe um valor válido." };
    
    this.state.balances.checking += amount;
    this.state.balances.personalLoanDebt += amount;
    this.updateIndicators();
    
    return {
      success: true,
      msg: `Empréstimo pessoal de ${formatBRL(amount)} contratado com taxa de 6% ao mês.`
    };
  }

  payDebt(debtType, amount) {
    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0) return { success: false, msg: "Informe um valor válido." };
    if (this.state.balances.checking < amount) {
      return { success: false, msg: `Saldo insuficiente na Conta Corrente para pagar a dívida.` };
    }

    if (debtType === "creditCard") {
      const payable = Math.min(amount, this.state.balances.creditCardDebt);
      this.state.balances.checking -= payable;
      this.state.balances.creditCardDebt -= payable;
      this.updateIndicators();
      return { success: true, msg: `Pago ${formatBRL(payable)} da fatura do Cartão de Crédito.` };
    } else if (debtType === "personalLoan") {
      const payable = Math.min(amount, this.state.balances.personalLoanDebt);
      this.state.balances.checking -= payable;
      this.state.balances.personalLoanDebt -= payable;
      this.updateIndicators();
      return { success: true, msg: `Amortizado ${formatBRL(payable)} do Empréstimo Pessoal.` };
    }

    return { success: false, msg: "Tipo de dívida inválido." };
  }

  /**
   * Processamento da Virada de Mês (Confirmar Decisões)
   * selectedSuperfluousIds: array com os IDs das opções supérfluas escolhidas
   */
  processMonthEnd(selectedSuperfluousIds = []) {
    const month = this.state.currentMonth;
    const availableOptions = this.state.monthlyOptions[month] || [];
    const selectedOptions = availableOptions.filter(opt => selectedSuperfluousIds.includes(opt.id));

    // 1. Creditando Renda Mensal (Bolsa de IC R$ 700 da URCA)
    const monthlyIncome = this.state.persona.monthlyIncome;
    this.state.balances.checking += monthlyIncome;

    // 2. Debitando Despesas Essenciais Obrigatórias (R$ 400)
    const essentialCost = this.state.persona.essentialExpenses;
    this.state.balances.checking -= essentialCost;

    // 3. Calculando Despesas Supérfluas
    let superfluousCost = 0;
    let superfluousHappiness = 0;
    let superfluousStability = 0;

    selectedOptions.forEach(opt => {
      superfluousCost += opt.cost;
      superfluousHappiness += opt.happiness;
      superfluousStability += opt.stability;
    });

    this.state.balances.checking -= superfluousCost;

    // Efeito Psicológico Pedagógico:
    // Se selecionou ZERO supérfluos, privação extrema gera queda de felicidade!
    let privationPenalty = 0;
    if (selectedOptions.length === 0) {
      privationPenalty = 18;
      this.state.stats.happiness = Math.max(10, this.state.stats.happiness - privationPenalty);
    } else {
      this.state.stats.happiness = Math.min(100, this.state.stats.happiness + superfluousHappiness);
    }
    this.state.stats.stability = Math.max(0, Math.min(100, this.state.stats.stability + superfluousStability));

    // 4. Cobrança de Juros das Dívidas do Mês Anterior
    let interestPaidThisMonth = 0;
    if (this.state.balances.creditCardDebt > 0) {
      const ccInterest = this.state.balances.creditCardDebt * this.state.rates.creditCardRate;
      this.state.balances.creditCardDebt += ccInterest;
      interestPaidThisMonth += ccInterest;
    }
    if (this.state.balances.personalLoanDebt > 0) {
      const loanInterest = this.state.balances.personalLoanDebt * this.state.rates.personalLoanRate;
      this.state.balances.personalLoanDebt += loanInterest;
      interestPaidThisMonth += loanInterest;
    }
    this.state.stats.totalInterestPaid += interestPaidThisMonth;

    // 5. Aplicação de Rentabilidade dos Investimentos e Poupança
    // Poupança: 0.5% a.m.
    const savingsYield = this.state.balances.savings * this.state.rates.savingsMonthly;
    this.state.balances.savings += savingsYield;

    // Títulos: 0.85% a.m.
    const bondsYield = this.state.balances.investments.bonds * this.state.rates.bondsMonthly;
    this.state.balances.investments.bonds += bondsYield;

    // Fundos: flutua entre -1% e +2.4%
    const fundsRate = this.randomBetween(this.state.rates.fundsRange[0], this.state.rates.fundsRange[1]);
    const fundsYield = this.state.balances.investments.funds * fundsRate;
    this.state.balances.investments.funds = Math.max(0, this.state.balances.investments.funds + fundsYield);

    // Ações: flutua entre -6.5% e +9.5%
    const stocksRate = this.randomBetween(this.state.rates.stocksRange[0], this.state.rates.stocksRange[1]);
    const stocksYield = this.state.balances.investments.stocks * stocksRate;
    this.state.balances.investments.stocks = Math.max(0, this.state.balances.investments.stocks + stocksYield);

    const totalYield = savingsYield + bondsYield + fundsYield + stocksYield;
    this.state.stats.totalInvestedReturns += totalYield;

    // 6. Tratamento de Saldo Negativo na Conta Corrente
    let debtTriggered = 0;
    if (this.state.balances.checking < 0) {
      // Falta de planejamento: cobre com cheque especial/rotativo do cartão
      const deficit = Math.abs(this.state.balances.checking);
      this.state.balances.creditCardDebt += deficit;
      debtTriggered = deficit;
      this.state.balances.checking = 0;
      this.state.stats.stability = Math.max(0, this.state.stats.stability - 18);
      this.state.stats.happiness = Math.max(0, this.state.stats.happiness - 15);
    }

    // 7. Sorteio do Evento Aleatório do Cariri
    const caririEvent = getRandomCaririEvent(month, this.usedEventIds);
    this.usedEventIds.push(caririEvent.id);

    let eventOutcome = {
      event: caririEvent,
      shielded: false,
      amountUsedFromSavings: 0,
      amountSentToDebt: 0,
      gainAdded: 0
    };

    if (caririEvent.category === "expense") {
      const cost = caririEvent.cost;
      if (this.state.balances.savings >= cost) {
        // Poupança protege 100%!
        this.state.balances.savings -= cost;
        eventOutcome.shielded = true;
        eventOutcome.amountUsedFromSavings = cost;
        this.hasShieldedIncident = true;
        // Bônus pedagógico de alívio
        this.state.stats.stability = Math.min(100, this.state.stats.stability + 3);
        this.state.stats.happiness = Math.min(100, this.state.stats.happiness + 2);
      } else {
        // Poupança insuficiente!
        const covered = this.state.balances.savings;
        const remainder = cost - covered;
        this.state.balances.savings = 0;
        // Restante vai para dívida no cartão de crédito rotativo
        this.state.balances.creditCardDebt += remainder;
        eventOutcome.shielded = false;
        eventOutcome.amountUsedFromSavings = covered;
        eventOutcome.amountSentToDebt = remainder;
        this.state.stats.stability = Math.max(0, this.state.stats.stability - 15);
        this.state.stats.happiness = Math.max(0, this.state.stats.happiness - 12);
      }
    } else if (caririEvent.category === "income") {
      const gain = caririEvent.gain;
      this.state.balances.checking += gain;
      eventOutcome.gainAdded = gain;
      this.state.stats.happiness = Math.min(100, this.state.stats.happiness + 8);
      this.state.stats.stability = Math.min(100, this.state.stats.stability + 5);
    }

    this.lastEventResult = eventOutcome;

    // 8. Atualização Geral dos Indicadores
    this.updateIndicators();

    // 9. Registro no Histórico do Semestre
    this.recordHistory(month, `Fim do Mês ${month}`, {
      income: monthlyIncome,
      essentialCost,
      superfluousCost,
      totalYield,
      interestPaidThisMonth,
      debtTriggered,
      eventOutcome
    });

    // 10. Atualização de Conquistas (Badges)
    this.checkBadges();

    // 11. Geração de Feedback Didático do Orientador de Finanças da URCA
    this.generateMentorFeedback(eventOutcome, privationPenalty, debtTriggered, interestPaidThisMonth);

    // 12. Avanço de Mês ou Fim de Jogo
    if (this.state.currentMonth < this.state.totalMonths) {
      this.state.currentMonth += 1;
    } else {
      this.state.isGameOver = true;
      this.checkBadges(); // Checa badges de fim de semestre (Equilíbrio Perfeito, Mestre da Contabilidade)
    }

    return {
      success: true,
      eventOutcome,
      mentorFeedback: this.mentorFeedback,
      isGameOver: Boolean(this.state.isGameOver)
    };
  }

  updateIndicators() {
    const savings = this.state.balances.savings;
    const checking = this.state.balances.checking;
    const totalDebt = this.getTotalDebts();
    const totalInvest = this.getTotalInvestments();

    // Cálculo da Estabilidade Financeira (0 - 100)
    // - Ter reserva >= 200 pontua bem
    // - Dívidas derrubam drasticamente
    // - Investimentos e saldo positivo agregam
    let stabilityScore = 40;
    
    // Reserva de emergência: até +35 pontos
    stabilityScore += Math.min(35, (savings / 300) * 35);

    // Investimentos estruturados: até +15 pontos
    stabilityScore += Math.min(15, (totalInvest / 400) * 15);

    // Saldo em conta corrente: até +10 pontos
    stabilityScore += Math.min(10, (checking / 200) * 10);

    // Penalidade por dívidas: até -50 pontos
    if (totalDebt > 0) {
      stabilityScore -= Math.min(50, (totalDebt / 200) * 50);
    }

    this.state.stats.stability = Math.max(5, Math.min(100, Math.round(stabilityScore)));

    // Felicidade é afetada negativamente pelo estresse de dívidas
    if (totalDebt > 100) {
      this.state.stats.happiness = Math.max(10, this.state.stats.happiness - 2);
    }
  }

  checkBadges() {
    BADGE_DEFINITIONS.forEach(badge => {
      if (!this.unlockedBadges.has(badge.id)) {
        const isUnlocked = badge.checkUnlocked(this.state, this.history, {
          shieldedIncident: this.hasShieldedIncident
        });
        if (isUnlocked) {
          this.unlockedBadges.add(badge.id);
        }
      }
    });
  }

  generateMentorFeedback(eventOutcome, privationPenalty, debtTriggered, interestPaid) {
    const professorGreetings = [
      "Prof. Valmir (Coordenação de Ciências Contábeis - URCA):",
      "Profª. Helena (Orientadora de Educação Financeira da URCA):",
      "Núcleo de Apoio Contábil e Fiscal (NAF/URCA):"
    ];
    const header = professorGreetings[Math.floor(Math.random() * professorGreetings.length)];

    let tips = [];

    if (eventOutcome.event.category === "expense") {
      if (eventOutcome.shielded) {
        tips.push(`🛡️ **Excelente proteção!** Sua Poupança (Reserva de Emergência) absorveu o custo de ${formatBRL(eventOutcome.event.cost)} sem você precisar recorrer a crédito rotativo. Isso é exatamente a teoria de finanças aplicada na prática!`);
      } else {
        tips.push(`⚠️ **Atenção aos Imprevistos!** Você não tinha reserva suficiente e ${formatBRL(eventOutcome.amountSentToDebt)} virou dívida no cartão de crédito. Lembre-se: imprevistos no Cariri acontecem, e a reserva de emergência é sua primeira linha de defesa.`);
      }
    } else if (eventOutcome.event.category === "income") {
      tips.push(`💡 **Renda Extra no Cariri!** Entrou ${formatBRL(eventOutcome.gainAdded)} na sua conta. Como futura contadora, aproveite para reforçar sua reserva na poupança ou alocar em títulos antes de gastar por impulso.`);
    }

    if (debtTriggered > 0) {
      tips.push(`🚨 **Cuidado com o Rotativo!** Seu saldo ficou negativo em ${formatBRL(debtTriggered)} e o banco aplicou taxa de 12% ao mês. Priorize quitar essa dívida o quanto antes!`);
    }

    if (interestPaid > 0) {
      tips.push(`💸 **Custo dos Juros:** Você pagou ${formatBRL(interestPaid)} apenas em juros de dívida nesta rodada. Dinheiro que poderia estar rendendo a seu favor em investimentos.`);
    }

    if (privationPenalty > 0) {
      tips.push(`🧘 **Equilíbrio é Saúde:** Você cortou 100% do lazer este mês. Uma vida financeira saudável precisa de pequenos momentos de lazer planejados para evitar frustração e desmotivação acadêmica.`);
    }

    if (this.getTotalInvestments() > 250) {
      tips.push(`📈 **Visão de Futuro:** Você está mantendo uma boa carteira de investimentos. Isso protege seu poder de compra para metas de médio e longo prazo (como a sua formatura na URCA).`);
    }

    if (tips.length === 0) {
      tips.push("Mês equilibrado! Camila conseguiu honrar as contas essenciais e manter a estabilidade sob controle. Continue monitorando os pequenos gastos.");
    }

    this.mentorFeedback = {
      title: header,
      message: tips.join("<br><br>"),
      type: (debtTriggered > 0 || !eventOutcome.shielded && eventOutcome.event.category === "expense") ? "warning" : "success"
    };
  }

  recordHistory(month, label, extra = {}) {
    const snapshot = {
      month,
      label,
      balances: JSON.parse(JSON.stringify(this.state.balances)),
      stats: JSON.parse(JSON.stringify(this.state.stats)),
      netWorth: this.getNetWorth(),
      totalInvestments: this.getTotalInvestments(),
      totalDebts: this.getTotalDebts(),
      extra
    };
    this.history.push(snapshot);
  }

  randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }
}
