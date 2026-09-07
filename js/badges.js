/**
 * PoupaCariri v2.0 - Sistema de Conquistas e Medalhas (Badges)
 * Grounded na Seção 6 do PRD
 */

export const BADGE_DEFINITIONS = [
  {
    id: "poupador_cariri",
    name: "Poupador do Cariri",
    icon: "fa-shield-halved",
    color: "from-amber-500 to-yellow-600",
    description: "Manteve a Poupança (Reserva de Emergência) ativa acima de R$ 100,00 por pelo menos 3 meses consecutivos.",
    pedagogicalValue: "A consistência em manter uma reserva de emergência salva a vida financeira de qualquer universitário contra imprevistos.",
    checkUnlocked: (state, history) => {
      // Verifica se houve pelo menos 3 meses com poupança >= 100
      const qualifyingMonths = history.filter(h => h.balances.savings >= 100).length;
      return qualifyingMonths >= 3 || (qualifyingMonths >= 2 && state.balances.savings >= 100 && state.currentMonth >= 3);
    }
  },
  {
    id: "investidor_consciente",
    name: "Investidor Consciente",
    icon: "fa-chart-pie",
    color: "from-emerald-500 to-teal-600",
    description: "Alocou dinheiro em mais de uma classe de investimento (Títulos, Fundos ou Ações) praticando diversificação de risco.",
    pedagogicalValue: "Não colocar todos os ovos na mesma cesta é a regra de ouro dos investimentos: equilibrar risco e retorno.",
    checkUnlocked: (state) => {
      const inv = state.balances.investments;
      const activeClasses = [inv.bonds > 20, inv.funds > 20, inv.stocks > 20].filter(Boolean).length;
      return activeClasses >= 2;
    }
  },
  {
    id: "muralha_anti_crise",
    name: "Muralha Anti-Crise",
    icon: "fa-fort-awesome",
    color: "from-blue-500 to-indigo-600",
    description: "Enfrentou com sucesso um imprevisto financeiro usando 100% da poupança, sem recorrer ao cartão com juros.",
    pedagogicalValue: "Comprovou a utilidade prática da reserva: amortizar despesas inesperadas sem comprometer a renda futura.",
    checkUnlocked: (state, history, context) => {
      return context && context.shieldedIncident === true;
    }
  },
  {
    id: "zero_dividas",
    name: "Orçamentista Sem Dívidas",
    icon: "fa-ban",
    color: "from-purple-500 to-pink-600",
    description: "Concluiu as rodadas sem acumular dívidas no rotativo do cartão nem contrair empréstimos pessoais desnecessários.",
    pedagogicalValue: "Evitou o ciclo perverso dos juros compostos cobrados pelas instituições de crédito rotativo.",
    checkUnlocked: (state) => {
      return state.balances.creditCardDebt === 0 && state.balances.personalLoanDebt === 0 && state.currentMonth >= 2;
    }
  },
  {
    id: "equilibrio_perfeito",
    name: "Equilíbrio Perfeito",
    icon: "fa-scale-balanced",
    color: "from-amber-600 to-emerald-600",
    description: "Finalizou o semestre letivo com saldo positivo, sem dívidas e com a barra de Felicidade acima de 70%.",
    pedagogicalValue: "Demonstrou que finanças saudáveis não significam privação extrema, mas sim escolhas equilibradas e conscientes.",
    checkUnlocked: (state) => {
      if (state.currentMonth < 4 && !state.isGameOver) return false;
      const hasPositiveNetWorth = (state.balances.checking + state.balances.savings + 
        state.balances.investments.bonds + state.balances.investments.funds + state.balances.investments.stocks) > 0;
      const noDebts = (state.balances.creditCardDebt === 0 && state.balances.personalLoanDebt === 0);
      return hasPositiveNetWorth && noDebts && state.stats.happiness >= 70;
    }
  },
  {
    id: "mestre_contabilidade",
    name: "Orgulho da Contabilidade URCA",
    icon: "fa-award",
    color: "from-cyan-500 to-blue-700",
    description: "Aumentou o patrimônio líquido total da Camila ao final do semestre letivo em comparação ao início.",
    pedagogicalValue: "Aplicou na prática o princípio contábil da evolução patrimonial positiva com superávit orçamentário.",
    checkUnlocked: (state) => {
      if (state.currentMonth < 4 && !state.isGameOver) return false;
      const currentNetWorth = (state.balances.checking + state.balances.savings +
        state.balances.investments.bonds + state.balances.investments.funds + state.balances.investments.stocks) -
        (state.balances.creditCardDebt + state.balances.personalLoanDebt);
      // Inicial: 100 + 200 + 100 + 100 + 100 = 600
      return currentNetWorth > 600;
    }
  }
];
