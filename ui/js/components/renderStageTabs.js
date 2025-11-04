/**
 * @file Renders stage tabs dynamically for the predictions page.
 * @author afk-gharcia
 * @description Creates and displays stage tabs using phase names from the backend for the Redondo CS2 Major frontend.
 * Now supports tab activation, state, and callback on select.
 */

export function renderStageTabs(phases, onTabSelect, initialIdx) {
  const tabsContainer = document.getElementById('stage-tabs');
  tabsContainer.innerHTML = '';
  if (!phases || !phases.length) return;
  let activeIdx = null;
  phases.forEach((phase, idx) => {
    const tab = document.createElement('div');
    tab.className = 'stage-tab';
    tab.textContent = phase.major_phase_name || phase.label || `Fase ${idx+1}`;
    tab.style.cursor = 'pointer';
    tab.addEventListener('click', () => {
      if (activeIdx === idx) {
        tab.classList.remove('active');
        activeIdx = null;
        if (onTabSelect) onTabSelect(null, null);
      } else {
        
        tabsContainer.querySelectorAll('.stage-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeIdx = idx;
        if (onTabSelect) onTabSelect(phase, idx);
      }
    });
    tabsContainer.appendChild(tab);
  });
  if (typeof initialIdx === 'number' && phases[initialIdx]) {
    const initialTab = tabsContainer.children[initialIdx];
    if (initialTab) {
      initialTab.classList.add('active');
      activeIdx = initialIdx;
      if (onTabSelect) onTabSelect(phases[initialIdx], initialIdx);
    }
  }
}
