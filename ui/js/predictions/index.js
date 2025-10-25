/**
 * Main script for the predictions page.
 * Loads and renders the major stages form for user predictions.
 */
import { loadMajorStages } from './loadMajorStages.js';

window.loadMajorStages = loadMajorStages;

document.addEventListener('DOMContentLoaded', () => {
  loadMajorStages();
});
