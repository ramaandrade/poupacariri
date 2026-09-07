# PoupaCariri (URCA) v2.0 – Simulador de Finanças Pessoais Gamificado

> **Projeto:** PoupaCariri – Simulador de Finanças Pessoais Gamificado para a URCA  
> **Versão:** 2.0 (MVP)  
> **Instituição:** Universidade Regional do Cariri (URCA) – Campus Crato  
> **Público-Alvo:** Estudantes iniciantes de Ciências Econômicas, Administração e Gestão da URCA  
> **Persona de Referência:** Camila Alencar (19 anos), aluna do 1º período de Ciências Econômicas  
> **Arquitetura:** Single-Page Application (SPA) 100% Client-Side, Responsiva e Mobile-First  

---

## 🎯 1. Visão Geral e Desafio Pedagógico

A educação financeira não se limita a fórmulas matemáticas; ela exige mudança de comportamento, estimulando hábitos orçamentários saudáveis, controle consciente de gastos e metas de longo prazo **[1]**. Para os estudantes recém-ingressos na URCA — muitos gerenciando pela primeira vez a própria bolsa de auxílio ou estágio —, planilhas financeiras tradicionais costumam parecer áridas e entediantes **[7]**.

O **PoupaCariri** resolve esse desafio transformando a vivência financeira em uma **simulação interativa de 4 rodadas (meses)** que representam um semestre letivo completo. Em uma **única tela dinâmica (SPA)**, o estudante gerencia suas receitas, garante as despesas essenciais, toma decisões de lazer, utiliza a poupança como escudo protetor contra imprevistos regionais e aloca excedentes em investimentos estruturados por perfil de risco **[2, 3, 4, 9, 10]**.

---

## 👩‍🎓 2. A Persona: Camila Alencar

- **Idade:** 19 anos.
- **Curso:** Ciências Econômicas (1º Semestre) – Campus Crato da URCA.
- **Residência & Deslocamento:** Reside em Barbalha e se desloca diariamente até o Crato de transporte universitário.
- **Renda:** Bolsa de Iniciação Científica de R$ 700,00 mensais + eventuais bicos e trabalhos informais no Cariri.
- **Despesas Essenciais:** R$ 400,00 fixos mensais (Transporte Barbalha-Crato: R$ 160; Alimentação/RU da URCA: R$ 180; Xerox e materiais acadêmicos: R$ 60).
- **Desafio:** Conciliar as contas básicas, evitar as armadilhas de crédito fácil (cartão rotativo a 12% a.m.) e manter a qualidade de vida sem esgotamento mental nem superendividamento.

---

## 🏗️ 3. Arquitetura da Tela Única (SPA)

O PoupaCariri segue rigorosamente o layout definido no PRD:

```
+--------------------------------------------------------------------------+
|                           POUPACARIRI (URCA)                             |
| [Mês: 1 de 4]      [Estabilidade: 75%]      [Felicidade/Qualidade: 80%]  |
+------------------------------------+-------------------------------------+
|                                    |                                     |
| 1. MONITOR DE SALDOS & ORÇAMENTO   | 2. DECISÕES DE CONSUMO & PRODUTOS   |
|                                    |                                     |
| * Conta Corrente: R$ 100,00        | **Despesas do Mês (Orçamento):**    |
| * Poupança (Reserva): R$ 200,00    | Essenciais: R$ 400,00 (Transporte,  |
| * Investimentos: R$ 300,00         |             Aluguel, Xerox)         |
| * Cartão de Crédito: R$ 0,00       | Supérfluas (Escolha):               |
|                                    | [ ] Lanche no Crato (R$ 45)         |
| **Alocação de Investimentos:**     | [ ] Festa da URCA (R$ 75)           |
| [ ] Títulos (Baixo Risco)          |                                     |
| [ ] Fundos (Médio Risco)           | **Opções de Crédito (Uso com juros):|
| [ ] Ações (Alto Risco)             | [ ] Usar Cartão de Crédito [4, 9]   |
|                                    | [ ] Pegar Empréstimo Pessoal [9]    |
|                                    |                                     |
|                                    |  >> [ CONFIRMAR DECISÕES DO MÊS ]   |
+------------------------------------+-------------------------------------+
| 3. FEEDBACK DIDÁTICO & CONQUISTAS (RODAPÉ)                               |
| * Mensagem do App: "Parabéns! Sua poupança protegeu você do imprevisto." |
| * Medalhas: [Orçamentista Sem Dívidas] [Investidor Consciente]           |
| * Gráficos Visuais: Evolução Patrimonial e Composição dos Gastos         |
+--------------------------------------------------------------------------+
```

---

## ⚙️ 4. Mecânicas de Jogo e Conceitos Didáticos

### 4.1 O Orçamento e a Diferenciação de Despesas [3, 5]
- **Gastos Essenciais (Fixos):** R$ 400,00 deduzidos obrigatoriamente para garantir a frequência e permanência estudantil no Cariri.
- **Gastos Supérfluos / Lazer:** Opções dinâmicas a cada mês (lanches na Praça da Sé, calourada da URCA, passeio no Mirante do Caldas, açaí na Leão Sampaio, cursos extracurriculares).
- **Impacto Pedagógico:**
  - *Privação Extrema (0 opções selecionadas):* Penalidade severa de Felicidade (-18%) por esgotamento psicológico e desmotivação.
  - *Gastos Excessivos:* Saldo negativo ativa automaticamente o rotativo do cartão de crédito.

### 4.2 A Poupança como Reserva para Imprevistos [3, 9]
- A Poupança rende 0,5% a.m. com liquidez imediata.
- **Função de Escudo:** No encerramento da rodada, eventos aleatórios regionais do Cariri (moto que quebrou na ladeira do Crato, emergência odontológica em Juazeiro, livros extras na URCA) desafiam o aluno:
  - Se houver reserva na poupança: o custo é debitado sem incidência de juros, preservando a estabilidade!
  - Se a reserva for insuficiente: o saldo faltante é lançado como dívida no cartão de crédito rotativo com juros pesados de 12% ao mês.

### 4.3 Prevenção de Dívidas & O Perigo dos Juros Compostos [4, 9]
- O simulador ilustra o perigo do crédito rotativo (12% a.m.) e empréstimos pessoais (6% a.m.).
- O aluno pode gerenciar dívidas e amortizá-las a qualquer momento pelo modal dedicado.

### 4.4 Alocação de Investimentos e Perfil de Risco [4, 10]
- **Títulos Públicos (Tesouro Selic/CDB):** Baixo risco, retorno garantido de 0,85% a.m.
- **Fundos Multimercado:** Médio risco, retorno moderado flutuante (-1,0% a +2,4% a.m.).
- **Ações:** Alto risco e volatilidade (-6,5% a +9,5% a.m.).
- Demonstra na prática que diversificar ativos melhora a relação risco/retorno.

### 4.5 Sistema de Conquistas e Medalhas (Badges) [5]
- 🛡️ **Poupador do Cariri:** Manteve a reserva na poupança acima de R$ 100 por pelo menos 3 meses.
- 📊 **Investidor Consciente:** Praticou diversificação alocando em mais de uma classe de ativos.
- 🏰 **Muralha Anti-Crise:** Cobriu um imprevisto grave 100% com a reserva sem recorrer a dívidas.
- 🚫 **Orçamentista Sem Dívidas:** Concluiu as rodadas sem entrar no rotativo nem contrair empréstimos.
- ⚖️ **Equilíbrio Perfeito:** Finalizou o semestre com saldo positivo, sem dívidas e Felicidade >= 70%.
- 🎓 **Orgulho da Economia URCA:** Encerrou o semestre letivo com patrimônio líquido superior ao inicial.

---

## 💻 5. Como Executar

O PoupaCariri é **100% Client-Side** (RNF-01). **Não requer Node.js, compilação nem banco de dados**.

### Opção 1: Abrir diretamente no Navegador
Basta dar dois cliques no arquivo `index.html` ou abri-lo pelo seu navegador favorito (Chrome, Firefox, Edge, Safari).

### Opção 2: Servir via Servidor Estático Local (Opcional)
Se preferir rodar com servidor HTTP local:

```bash
# Navegar até a pasta do projeto:
cd C:\Users\ramal\.gemini\antigravity\scratch\poupacariri

# Iniciar servidor Python:
python -m http.server 8080
```
Em seguida, acesse no navegador: `http://localhost:8080`

---

## 📁 6. Estrutura de Arquivos

```
poupacariri/
├── index.html          # SPA completa com todas as seções e modais interativos
├── css/
│   └── styles.css      # Estilização com identidade URCA, animações e responsividade
├── js/
│   ├── config.js       # Dados da persona Camila, valores iniciais e taxas
│   ├── events.js       # Banco de eventos dinâmicos regionais do Cariri
│   ├── badges.js       # Sistema de 6 medalhas e conquistas pedagógicas
│   ├── engine.js       # Motor financeiro, cálculos, juros, oscilação e histórico
│   ├── ui.js           # Gerenciador de interface, modais e gráficos Chart.js
│   └── app.js          # Ponto de entrada e inicialização da aplicação
└── README.md           # Este guia didático e técnico
```
