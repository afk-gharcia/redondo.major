/**
 * @file Renders stage tabs dynamically for the predictions page.
 * @author afk-gharcia
 * @description Creates and displays stage tabs using phase names from the backend for the Redondo CS2 Major frontend.
 */

export function renderStageTabs(phases) {
  const tabsContainer = document.getElementById('stage-tabs');
  tabsContainer.innerHTML = '';
  if (!phases || !phases.length) return;
  phases.forEach(phase => {
    const tab = document.createElement('div');
    tab.className = 'stage-tab';
    tab.textContent = phase.label;
    tabsContainer.appendChild(tab);
  });
}
