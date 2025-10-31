/**
 * @file Loads and renders the navigation bar for frontend.
 * @author afk-gharcia
 * @description Dynamically loads the nav component and adds the Admin menu for admin users.
 */

import { API_BASE_URL } from '../config.js';

export function loadNav(activePage) {
  fetch('components/nav.html')
    .then(resp => resp.text())
    .then(async html => {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const nav = temp.querySelector('nav');
      if (!nav) return;

      let isAdmin = false;
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/players?id=${encodeURIComponent(userId)}`);
          if (res.ok) {
            const data = await res.json();
            
            const player = Array.isArray(data) ? data[0] : (data.data || data);
            if (player && player.is_admin) isAdmin = true;
          }
        } catch (e) {}
      }

      if (isAdmin) {
        const adminLink = document.createElement('a');
        adminLink.href = 'admin.html';
        adminLink.id = 'nav-admin';
        adminLink.textContent = 'Admin';
        nav.appendChild(adminLink);
        if (activePage === 'admin') adminLink.classList.add('active');
      }

      if (activePage) {
        const active = nav.querySelector(`#nav-${activePage}`);
        if (active) active.classList.add('active');
      }

      const oldNav = document.querySelector('nav');
      if (oldNav) {
        oldNav.replaceWith(nav);
      } else {
        document.body.insertBefore(nav, document.body.firstChild);
      }
    });
}
