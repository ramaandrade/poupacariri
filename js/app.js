/**
 * PoupaCariri v2.0 - Main Application Entrypoint
 */

import { SimulationEngine } from "./engine.js?v=2.2";
import { UIManager } from "./ui.js?v=2.2";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Inicializando PoupaCariri (URCA) v2.0...");
  const engine = new SimulationEngine();
  const ui = new UIManager(engine);
  ui.init();

  // Expor para depuração se necessário no console
  window.PoupaCariri = { engine, ui };
});
