/**
 * PoupaCariri v2.0 - Gerenciador de Interface (UI & Gráficos)
 * Single-Page Application responsiva, interativa e orientada a dados
 */

import { formatBRL } from "./config.js";

export class UIManager {
  constructor(engine) {
    this.engine = engine;
    this.netWorthChart = null;
    this.expensesPieChart = null;
  }

  init() {
    this.bindEvents();
    this.renderAll();
    this.initCharts();
  }

  renderAll() {
    this.renderHeader();
    this.renderPersona();
    this.renderBalances();
    this.renderMonthlyDecisions();
    this.renderMentorFeedback();
    this.renderBadges();
    this.updateCharts();
  }

  renderHeader() {
    const state = this.engine.getState();
    const monthElem = document.getElementById("current-month-badge");
    if (monthElem) {
      monthElem.textContent = `Mês ${state.currentMonth} de ${state.totalMonths}`;
    }

    const monthNameElem = document.getElementById("current-month-name");
    if (monthNameElem) {
      monthNameElem.textContent = state.monthNames[state.currentMonth - 1] || "Semestre Concluído";
    }

    // Estabilidade (Health Bar)
    const stabVal = state.stats.stability;
    const stabBar = document.getElementById("stability-bar");
    const stabText = document.getElementById("stability-text");
    const stabBadge = document.getElementById("stability-badge");

    if (stabBar) {
      stabBar.style.width = `${stabVal}%`;
      stabBar.className = `h-full rounded-full transition-all duration-500 ${
        stabVal >= 70 ? "bg-emerald-500" : stabVal >= 40 ? "bg-amber-500" : "bg-red-500"
      }`;
    }
    if (stabText) stabText.textContent = `${stabVal}%`;
    if (stabBadge) {
      if (stabVal >= 70) {
        stabBadge.textContent = "Excelente";
        stabBadge.className = "text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800";
      } else if (stabVal >= 40) {
        stabBadge.textContent = "Alerta";
        stabBadge.className = "text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800";
      } else {
        stabBadge.textContent = "Crítico";
        stabBadge.className = "text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800";
      }
    }

    // Felicidade / Qualidade de Vida
    const hapVal = state.stats.happiness;
    const hapBar = document.getElementById("happiness-bar");
    const hapText = document.getElementById("happiness-text");
    const hapBadge = document.getElementById("happiness-badge");

    if (hapBar) {
      hapBar.style.width = `${hapVal}%`;
      hapBar.className = `h-full rounded-full transition-all duration-500 ${
        hapVal >= 70 ? "bg-rose-500" : hapVal >= 40 ? "bg-amber-500" : "bg-slate-500"
      }`;
    }
    if (hapText) hapText.textContent = `${hapVal}%`;
    if (hapBadge) {
      if (hapVal >= 70) {
        hapBadge.textContent = "Radiante";
        hapBadge.className = "text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800";
      } else if (hapVal >= 40) {
        hapBadge.textContent = "Razoável";
        hapBadge.className = "text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800";
      } else {
        hapBadge.textContent = "Esgotada";
        hapBadge.className = "text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800";
      }
    }
  }

  renderPersona() {
    const p = this.engine.getState().persona;
    const nameElem = document.getElementById("persona-name");
    const bioElem = document.getElementById("persona-bio");
    if (nameElem) nameElem.textContent = `${p.name}, ${p.age} anos`;
    if (bioElem) bioElem.textContent = `${p.course} • ${p.campus} • Mora em ${p.residence}`;
  }

  renderBalances() {
    const state = this.engine.getState();
    const bal = state.balances;

    // Monitor de Saldos
    this.setText("val-checking", formatBRL(bal.checking));
    this.setText("val-savings", formatBRL(bal.savings));
    
    const totalInv = this.engine.getTotalInvestments();
    this.setText("val-investments-total", formatBRL(totalInv));
    this.setText("val-bonds", formatBRL(bal.investments.bonds));
    this.setText("val-funds", formatBRL(bal.investments.funds));
    this.setText("val-stocks", formatBRL(bal.investments.stocks));

    const totalDebts = this.engine.getTotalDebts();
    this.setText("val-debts-total", formatBRL(totalDebts));
    this.setText("val-credit-card", formatBRL(bal.creditCardDebt));
    this.setText("val-personal-loan", formatBRL(bal.personalLoanDebt));

    this.setText("val-net-worth", formatBRL(this.engine.getNetWorth()));

    // Destaque visual caso haja dívidas ativas
    const debtCard = document.getElementById("card-debts");
    if (debtCard) {
      if (totalDebts > 0) {
        debtCard.classList.add("border-red-400", "bg-red-50/50");
      } else {
        debtCard.classList.remove("border-red-400", "bg-red-50/50");
      }
    }
  }

  renderMonthlyDecisions() {
    const state = this.engine.getState();
    const month = state.currentMonth;
    const isOver = state.isGameOver;

    const optionsContainer = document.getElementById("superfluous-options-container");
    const btnConfirm = document.getElementById("btn-confirm-month");

    if (isOver) {
      if (optionsContainer) {
        optionsContainer.innerHTML = `
          <div class="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <i class="fa-solid fa-graduation-cap text-4xl text-emerald-600 mb-2"></i>
            <h4 class="font-bold text-emerald-900 text-lg">Semestre Acadêmico Concluído!</h4>
            <p class="text-sm text-emerald-700 mt-1">Parabéns por concluir as 4 rodadas financeiras do 1º período na URCA.</p>
            <button id="btn-show-summary" class="mt-4 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-all">
              <i class="fa-solid fa-file-lines mr-1.5"></i> Ver Boletim Financeiro Completo
            </button>
          </div>
        `;
        document.getElementById("btn-show-summary")?.addEventListener("click", () => this.showSemesterSummaryModal());
      }
      if (btnConfirm) {
        btnConfirm.disabled = true;
        btnConfirm.classList.add("opacity-50", "cursor-not-allowed");
        btnConfirm.innerHTML = `<i class="fa-solid fa-check-double mr-2"></i> Semestre Finalizado`;
      }
      return;
    }

    if (btnConfirm) {
      btnConfirm.disabled = false;
      btnConfirm.classList.remove("opacity-50", "cursor-not-allowed");
      btnConfirm.innerHTML = `<span>Confirmar Decisões do Mês ${month}</span> <i class="fa-solid fa-arrow-right ml-2"></i>`;
    }

    const options = state.monthlyOptions[month] || [];
    if (!optionsContainer) return;

    let html = "";
    options.forEach(opt => {
      html += `
        <label class="superfluous-item flex items-start p-3.5 bg-white border border-slate-200 hover:border-emerald-300 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow group">
          <input type="checkbox" name="superfluous" value="${opt.id}" class="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer">
          <div class="ml-3 flex-1">
            <div class="flex items-center justify-between">
              <span class="font-medium text-slate-800 group-hover:text-emerald-800 text-sm">${opt.name}</span>
              <span class="font-bold text-slate-900 text-sm bg-slate-100 px-2 py-0.5 rounded">${formatBRL(opt.cost)}</span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">${opt.desc}</p>
            <div class="flex items-center gap-3 mt-2 text-xs">
              <span class="text-rose-600 font-medium flex items-center">
                <i class="fa-solid fa-heart mr-1"></i> +${opt.happiness}% Felicidade
              </span>
              ${opt.stability !== 0 ? `
                <span class="${opt.stability > 0 ? 'text-emerald-600' : 'text-amber-600'} font-medium flex items-center">
                  <i class="fa-solid fa-shield-halved mr-1"></i> ${opt.stability > 0 ? '+' : ''}${opt.stability}% Estabilidade
                </span>
              ` : ''}
            </div>
          </div>
        </label>
      `;
    });

    optionsContainer.innerHTML = html;

    // Vincula atualização do resumo dinâmico de escolhas
    const checkboxes = optionsContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.addEventListener("change", () => this.updateDecisionSummary());
    });

    this.updateDecisionSummary();
  }

  updateDecisionSummary() {
    const state = this.engine.getState();
    const month = state.currentMonth;
    const options = state.monthlyOptions[month] || [];
    const checked = Array.from(document.querySelectorAll('input[name="superfluous"]:checked')).map(c => c.value);

    let totalSuperfluous = 0;
    let addedHappiness = 0;

    options.forEach(opt => {
      if (checked.includes(opt.id)) {
        totalSuperfluous += opt.cost;
        addedHappiness += opt.happiness;
      }
    });

    const income = state.persona.monthlyIncome; // 700
    const essential = state.persona.essentialExpenses; // 400
    const projectedRemaining = (state.balances.checking + income) - (essential + totalSuperfluous);

    this.setText("preview-essential-cost", formatBRL(essential));
    this.setText("preview-superfluous-cost", formatBRL(totalSuperfluous));
    this.setText("preview-total-expenses", formatBRL(essential + totalSuperfluous));
    
    const previewBal = document.getElementById("preview-projected-balance");
    if (previewBal) {
      previewBal.textContent = formatBRL(projectedRemaining);
      if (projectedRemaining >= 0) {
        previewBal.className = "text-sm font-bold text-emerald-600";
      } else {
        previewBal.className = "text-sm font-bold text-red-600";
      }
    }

    const previewAlert = document.getElementById("preview-privation-alert");
    if (previewAlert) {
      if (checked.length === 0) {
        previewAlert.classList.remove("hidden");
        previewAlert.innerHTML = `
          <i class="fa-solid fa-triangle-exclamation text-amber-600 mr-1.5"></i>
          <span><strong>Atenção:</strong> Nenhum lazer selecionado. Privação extrema reduzirá -18% de Felicidade por esgotamento psicológico!</span>
        `;
      } else if (projectedRemaining < 0) {
        previewAlert.classList.remove("hidden");
        previewAlert.innerHTML = `
          <i class="fa-solid fa-circle-exclamation text-red-600 mr-1.5"></i>
          <span><strong>Déficit Orçamentário!</strong> Faltará ${formatBRL(Math.abs(projectedRemaining))}, ativando juros de 12% ao mês no rotativo do cartão!</span>
        `;
      } else {
        previewAlert.classList.add("hidden");
      }
    }
  }

  renderMentorFeedback() {
    const feedback = this.engine.mentorFeedback;
    const card = document.getElementById("mentor-card");
    const title = document.getElementById("mentor-title");
    const msg = document.getElementById("mentor-message");

    if (!card || !title || !msg) return;

    title.innerHTML = `<i class="fa-solid fa-user-graduate mr-2 text-emerald-600"></i> ${feedback.title}`;
    msg.innerHTML = feedback.message;

    if (feedback.type === "warning") {
      card.className = "p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-slate-800 shadow-sm transition-all";
    } else if (feedback.type === "success") {
      card.className = "p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-slate-800 shadow-sm transition-all";
    } else {
      card.className = "p-4 sm:p-5 rounded-2xl bg-sky-50/80 border border-sky-200 text-slate-800 shadow-sm transition-all";
    }
  }

  renderBadges() {
    const badges = this.engine.getAllBadges();
    const container = document.getElementById("badges-container");
    if (!container) return;

    let html = "";
    badges.forEach(b => {
      const isUnlocked = b.unlocked;
      html += `
        <div class="relative group p-3 rounded-xl border ${
          isUnlocked 
            ? "bg-gradient-to-br from-white to-slate-50 border-emerald-300 shadow-sm shadow-emerald-100" 
            : "bg-slate-50 border-slate-200 opacity-40 grayscale"
        } transition-all duration-300">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-tr ${b.color} shadow-sm">
              <i class="fa-solid ${b.icon} text-lg"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <h5 class="text-xs font-bold text-slate-800 truncate">${b.name}</h5>
                ${isUnlocked ? '<span class="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.2 rounded">Conquistada</span>' : '<i class="fa-solid fa-lock text-[11px] text-slate-400"></i>'}
              </div>
              <p class="text-[11px] text-slate-500 line-clamp-2 mt-0.5">${b.description}</p>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  initCharts() {
    const ctxNetWorth = document.getElementById("chart-net-worth")?.getContext("2d");
    const ctxExpenses = document.getElementById("chart-expenses")?.getContext("2d");

    if (ctxNetWorth && typeof Chart !== "undefined") {
      this.netWorthChart = new Chart(ctxNetWorth, {
        type: "line",
        data: {
          labels: ["Início", "Mês 1", "Mês 2", "Mês 3", "Mês 4"],
          datasets: [
            {
              label: "Patrimônio Líquido",
              data: [600],
              borderColor: "#10b981",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              fill: true,
              tension: 0.3,
              borderWidth: 2.5
            },
            {
              label: "Dívidas Totais",
              data: [0],
              borderColor: "#ef4444",
              borderDash: [5, 5],
              fill: false,
              tension: 0.3,
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "top", labels: { boxWidth: 12, font: { size: 11 } } },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${formatBRL(ctx.raw)}`
              }
            }
          },
          scales: {
            y: {
              ticks: {
                callback: (val) => "R$ " + val,
                font: { size: 10 }
              }
            },
            x: {
              ticks: { font: { size: 10 } }
            }
          }
        }
      });
    }

    if (ctxExpenses && typeof Chart !== "undefined") {
      this.expensesPieChart = new Chart(ctxExpenses, {
        type: "doughnut",
        data: {
          labels: ["Essenciais (URCA/Vida)", "Lazer & Supérfluos", "Juros Pagos", "Investimentos"],
          datasets: [
            {
              data: [400, 100, 0, 300],
              backgroundColor: ["#0284c7", "#f59e0b", "#ef4444", "#10b981"]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "right", labels: { boxWidth: 12, font: { size: 10 } } },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.label}: ${formatBRL(ctx.raw)}`
              }
            }
          },
          cutout: "65%"
        }
      });
    }
  }

  updateCharts() {
    const history = this.engine.getHistory();
    if (!history || history.length === 0) return;

    if (this.netWorthChart) {
      const labels = history.map(h => h.label);
      const netWorthData = history.map(h => Math.round(h.netWorth));
      const debtsData = history.map(h => Math.round(h.totalDebts));

      this.netWorthChart.data.labels = labels;
      this.netWorthChart.data.datasets[0].data = netWorthData;
      this.netWorthChart.data.datasets[1].data = debtsData;
      this.netWorthChart.update();
    }

    if (this.expensesPieChart) {
      // Acumula os dados
      let totalEss = 0;
      let totalSup = 0;
      let totalInt = this.engine.getState().stats.totalInterestPaid;
      let totalInv = this.engine.getTotalInvestments();

      history.forEach(h => {
        if (h.extra) {
          if (h.extra.essentialCost) totalEss += h.extra.essentialCost;
          if (h.extra.superfluousCost) totalSup += h.extra.superfluousCost;
        }
      });

      if (totalEss === 0) totalEss = 400; // inicial ilustrativo
      this.expensesPieChart.data.datasets[0].data = [
        Math.round(totalEss),
        Math.round(totalSup),
        Math.round(totalInt),
        Math.round(totalInv)
      ];
      this.expensesPieChart.update();
    }
  }

  showEventModal(outcome) {
    const modal = document.getElementById("modal-cariri-event");
    if (!modal) return;

    const ev = outcome.event;
    const isExpense = ev.category === "expense";
    const shielded = outcome.shielded;

    document.getElementById("event-modal-icon").className = `fa-solid ${ev.icon} text-3xl ${isExpense ? 'text-amber-600' : 'text-emerald-600'}`;
    document.getElementById("event-modal-badge").textContent = ev.badge;
    document.getElementById("event-modal-title").textContent = ev.title;
    document.getElementById("event-modal-desc").textContent = ev.description;
    document.getElementById("event-modal-concept").textContent = ev.didacticConcept;

    const outcomeBox = document.getElementById("event-modal-outcome");
    if (outcomeBox) {
      if (isExpense) {
        if (shielded) {
          outcomeBox.className = "p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900";
          outcomeBox.innerHTML = `
            <div class="flex items-start">
              <i class="fa-solid fa-circle-check text-emerald-600 text-xl mt-0.5 mr-3"></i>
              <div>
                <h5 class="font-bold text-sm">Reserva de Emergência em Ação!</h5>
                <p class="text-xs mt-1">O custo de <strong>${formatBRL(ev.cost)}</strong> foi 100% coberto pelo seu saldo na Poupança. Você não precisou de crédito rotativo nem pagou juros abusivos!</p>
              </div>
            </div>
          `;
        } else {
          outcomeBox.className = "p-4 rounded-xl bg-red-50 border border-red-200 text-red-900";
          outcomeBox.innerHTML = `
            <div class="flex items-start">
              <i class="fa-solid fa-triangle-exclamation text-red-600 text-xl mt-0.5 mr-3"></i>
              <div>
                <h5 class="font-bold text-sm">Poupança Insuficiente! Dívida com Juros!</h5>
                <p class="text-xs mt-1">Sua poupança cobriu apenas ${formatBRL(outcome.amountUsedFromSavings)}. O valor restante de <strong>${formatBRL(outcome.amountSentToDebt)}</strong> virou dívida no cartão de crédito rotativo com juros de 12% ao mês!</p>
              </div>
            </div>
          `;
        }
      } else {
        outcomeBox.className = "p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900";
        outcomeBox.innerHTML = `
          <div class="flex items-start">
            <i class="fa-solid fa-sack-dollar text-emerald-600 text-xl mt-0.5 mr-3"></i>
            <div>
              <h5 class="font-bold text-sm">Renda Extra Creditada!</h5>
              <p class="text-xs mt-1">Você recebeu <strong>${formatBRL(outcome.gainAdded)}</strong> na sua Conta Corrente. Aproveite para reforçar a poupança e planejar o próximo mês!</p>
            </div>
          </div>
        `;
      }
    }

    modal.classList.remove("hidden");
  }

  showSemesterSummaryModal() {
    const modal = document.getElementById("modal-semester-summary");
    if (!modal) return;

    const state = this.engine.getState();
    const netWorth = this.engine.getNetWorth();
    const totalDebts = this.engine.getTotalDebts();
    const happiness = state.stats.happiness;
    const stability = state.stats.stability;
    const interestPaid = state.stats.totalInterestPaid;
    const badgesCount = this.engine.getUnlockedBadges().length;

    // Cálculo da Nota Pedagógica do Semestre
    let grade = "A";
    let gradeText = "Excelente desempenho financeiro e acadêmico!";
    let gradeColor = "text-emerald-600";

    if (totalDebts === 0 && happiness >= 70 && netWorth >= 600) {
      grade = "A+";
      gradeText = "Mestria Financeira! Equilíbrio impecável entre estudos, reserva e lazer.";
      gradeColor = "text-emerald-600";
    } else if (totalDebts === 0 && happiness >= 55) {
      grade = "A";
      gradeText = "Ótimo controle orçamentário e proteção sólida contra imprevistos.";
      gradeColor = "text-emerald-600";
    } else if (totalDebts <= 150 && happiness >= 50) {
      grade = "B";
      gradeText = "Bom resultado, embora pequenos desvios tenham gerado juros evitáveis.";
      gradeColor = "text-blue-600";
    } else if (totalDebts > 150 && happiness < 50) {
      grade = "C";
      gradeText = "Atenção: endividamento e estresse comprometeram a qualidade de vida.";
      gradeColor = "text-amber-600";
    } else {
      grade = "D";
      gradeText = "Risco de inadimplência severo. Necessária reestruturação orçamentária urgente.";
      gradeColor = "text-red-600";
    }

    this.setText("summary-grade", grade);
    const gradeElem = document.getElementById("summary-grade");
    if (gradeElem) gradeElem.className = `text-5xl font-extrabold ${gradeColor}`;
    this.setText("summary-grade-desc", gradeText);

    this.setText("summary-net-worth", formatBRL(netWorth));
    this.setText("summary-total-debts", formatBRL(totalDebts));
    this.setText("summary-interest-paid", formatBRL(interestPaid));
    this.setText("summary-happiness", `${happiness}%`);
    this.setText("summary-stability", `${stability}%`);
    this.setText("summary-badges-count", `${badgesCount} / 6`);

    modal.classList.remove("hidden");
  }

  bindEvents() {
    // Botão Confirmar Decisões
    document.getElementById("btn-confirm-month")?.addEventListener("click", () => {
      const checkedBoxes = Array.from(document.querySelectorAll('input[name="superfluous"]:checked')).map(c => c.value);
      const result = this.engine.processMonthEnd(checkedBoxes);
      this.renderAll();
      if (result.eventOutcome) {
        this.showEventModal(result.eventOutcome);
      }
      if (result.isGameOver) {
        setTimeout(() => {
          this.showSemesterSummaryModal();
        }, 1200);
      }
    });

    // Fechar modal de evento
    document.getElementById("btn-close-event-modal")?.addEventListener("click", () => {
      document.getElementById("modal-cariri-event")?.classList.add("hidden");
    });

    // Modal de transferência (Poupança)
    document.getElementById("btn-open-savings-modal")?.addEventListener("click", () => {
      document.getElementById("modal-savings")?.classList.remove("hidden");
    });
    document.getElementById("btn-close-savings-modal")?.addEventListener("click", () => {
      document.getElementById("modal-savings")?.classList.add("hidden");
    });

    // Submissão de transferência para poupança
    document.getElementById("form-savings-transfer")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const action = document.querySelector('input[name="savings-action"]:checked')?.value;
      const amount = parseFloat(document.getElementById("savings-amount-input")?.value);

      let res;
      if (action === "deposit") {
        res = this.engine.transferCheckingToSavings(amount);
      } else {
        res = this.engine.transferSavingsToChecking(amount);
      }

      const feedback = document.getElementById("savings-modal-feedback");
      if (feedback) {
        feedback.textContent = res.msg;
        feedback.className = `text-xs font-semibold p-2 rounded-lg mt-2 ${res.success ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`;
        feedback.classList.remove("hidden");
      }

      if (res.success) {
        this.renderAll();
        setTimeout(() => {
          document.getElementById("modal-savings")?.classList.add("hidden");
          if (feedback) feedback.classList.add("hidden");
        }, 1000);
      }
    });

    // Modal de Investimentos
    document.getElementById("btn-open-investments-modal")?.addEventListener("click", () => {
      document.getElementById("modal-investments")?.classList.remove("hidden");
    });
    document.getElementById("btn-close-investments-modal")?.addEventListener("click", () => {
      document.getElementById("modal-investments")?.classList.add("hidden");
    });

    document.getElementById("form-investments-action")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const action = document.querySelector('input[name="inv-action"]:checked')?.value;
      const asset = document.getElementById("inv-asset-select")?.value;
      const amount = parseFloat(document.getElementById("inv-amount-input")?.value);

      let res;
      if (action === "invest") {
        res = this.engine.investCheckingToAsset(asset, amount);
      } else {
        res = this.engine.redeemAssetToChecking(asset, amount);
      }

      const feedback = document.getElementById("inv-modal-feedback");
      if (feedback) {
        feedback.textContent = res.msg;
        feedback.className = `text-xs font-semibold p-2 rounded-lg mt-2 ${res.success ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`;
        feedback.classList.remove("hidden");
      }

      if (res.success) {
        this.renderAll();
        setTimeout(() => {
          document.getElementById("modal-investments")?.classList.add("hidden");
          if (feedback) feedback.classList.add("hidden");
        }, 1000);
      }
    });

    // Modal de Dívidas / Empréstimos
    document.getElementById("btn-open-debts-modal")?.addEventListener("click", () => {
      document.getElementById("modal-debts")?.classList.remove("hidden");
    });
    document.getElementById("btn-close-debts-modal")?.addEventListener("click", () => {
      document.getElementById("modal-debts")?.classList.add("hidden");
    });

    document.getElementById("form-debts-action")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const action = document.querySelector('input[name="debt-action"]:checked')?.value;
      const amount = parseFloat(document.getElementById("debt-amount-input")?.value);

      let res;
      if (action === "pay_card") {
        res = this.engine.payDebt("creditCard", amount);
      } else if (action === "pay_loan") {
        res = this.engine.payDebt("personalLoan", amount);
      } else if (action === "take_loan") {
        res = this.engine.takePersonalLoan(amount);
      }

      const feedback = document.getElementById("debts-modal-feedback");
      if (feedback) {
        feedback.textContent = res.msg;
        feedback.className = `text-xs font-semibold p-2 rounded-lg mt-2 ${res.success ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`;
        feedback.classList.remove("hidden");
      }

      if (res.success) {
        this.renderAll();
        setTimeout(() => {
          document.getElementById("modal-debts")?.classList.add("hidden");
          if (feedback) feedback.classList.add("hidden");
        }, 1000);
      }
    });

    // Reiniciar Simulação
    document.getElementById("btn-restart-simulation")?.addEventListener("click", () => {
      if (confirm("Deseja realmente reiniciar a simulação do semestre letivo da Camila?")) {
        this.engine.reset();
        document.getElementById("modal-semester-summary")?.classList.add("hidden");
        this.renderAll();
      }
    });

    // Modal de Ajuda Didática
    document.getElementById("btn-open-help-modal")?.addEventListener("click", () => {
      document.getElementById("modal-help")?.classList.remove("hidden");
    });
    document.getElementById("btn-close-help-modal")?.addEventListener("click", () => {
      document.getElementById("modal-help")?.classList.add("hidden");
    });
  }

  setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }
}
