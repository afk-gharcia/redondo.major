/**
 * @file Displays a popup for selecting or clearing a team for a classification position.
 * @author afk-gharcia
 * @description Provides a modal dialog for users to pick or clear a team for a classification slot in the Redondo CS2 Major predictions page.
 */

export function showFormPredictPopup({ teams, type, index }) {
  
  let overlay = document.createElement('div');
  overlay.className = 'popup-overlay';
  overlay.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:#000a;z-index:9999;display:flex;align-items:center;justify-content:center;';
  
  let popup = document.createElement('div');
  popup.className = 'popup-box';
  popup.style = 'background:#23272b;border-radius:18px;padding:32px 24px;box-shadow:0 8px 40px #000c,0 2px 0 #ffd70044 inset;min-width:260px;max-width:90vw;max-height:80vh;overflow:auto;display:flex;flex-direction:column;align-items:center;';
  
  let title = document.createElement('div');
  title.textContent = 'Selecione um time';
  title.style = 'color:#ffd700;font-weight:700;font-size:1.18em;margin-bottom:18px;letter-spacing:1px;text-align:center;';
  popup.appendChild(title);

  let list = document.createElement('ul');
  list.style = 'list-style:none;padding:0;margin:0;width:100%;max-width:320px;';

  const allPicks = Array.from(document.querySelectorAll('.classification-pick'));
  const pickedTeamNames = allPicks.map(el => el.textContent.trim()).filter(Boolean);

  let clearLi = document.createElement('li');
  clearLi.textContent = 'Limpar';
  clearLi.style = 'background:#181818;border-radius:8px;padding:10px 16px;margin-top:10px;color:#ffd700;font-weight:700;cursor:pointer;transition:background 0.18s;';
  clearLi.onmouseover = () => clearLi.style.background = '#ffd70022';
  clearLi.onmouseout = () => clearLi.style.background = '#181818';
  clearLi.onclick = () => {
    const picksInTab = Array.from(document.querySelectorAll('.stage-content-tab .classification-pick'));
    if (picksInTab[index]) {
      picksInTab[index].textContent = '';
      picksInTab[index].classList.remove('classification-pick-selected');
    }
    document.body.removeChild(overlay);
  };

  teams.forEach(team => {
    let li = document.createElement('li');
    li.textContent = team.team_name || '-';
    li.style = 'background:#181818;border-radius:8px;padding:10px 16px;margin-bottom:10px;color:#fff;font-weight:600;cursor:pointer;transition:background 0.18s;';
    
    if (pickedTeamNames.includes(team.team_name)) {
      li.style.opacity = '0.4';
      li.style.pointerEvents = 'none';
    }
    li.onmouseover = () => { if (li.style.pointerEvents !== 'none') li.style.background = '#ffd70022'; };
    li.onmouseout = () => { if (li.style.pointerEvents !== 'none') li.style.background = '#181818'; };
    li.onclick = () => {

      const picksInTab = Array.from(document.querySelectorAll('.stage-content-tab .classification-pick'));
      if (picksInTab[index]) {
        picksInTab[index].textContent = team.team_name;
        picksInTab[index].classList.add('classification-pick-selected');
      }
      document.body.removeChild(overlay);
    };
    list.appendChild(li);
  });
  list.appendChild(clearLi);
  popup.appendChild(list);


  let closeBtn = document.createElement('button');
  closeBtn.textContent = 'Cancelar';
  closeBtn.style = 'margin-top:18px;padding:8px 22px;border-radius:8px;background:#23272b;color:#ffd700;border:1.5px solid #ffd70099;font-weight:700;font-size:1em;cursor:pointer;transition:background 0.18s;';
  closeBtn.onmouseover = () => closeBtn.style.background = '#ffd70022';
  closeBtn.onmouseout = () => closeBtn.style.background = '#23272b';
  closeBtn.onclick = () => document.body.removeChild(overlay);
  popup.appendChild(closeBtn);

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  setTimeout(() => {
    const picksInTab = Array.from(document.querySelectorAll('.stage-content-tab .classification-pick'));
    picksInTab.forEach(pick => {
      const observer = new MutationObserver(() => {
        if (!pick.textContent.trim()) {
          pick.classList.remove('classification-pick-selected');
        }
      });
      observer.observe(pick, { childList: true, characterData: true, subtree: true });
    });
  }, 100);
}