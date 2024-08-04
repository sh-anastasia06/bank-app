import {el} from 'redom';
export function renderNavigation() {
  const nav = el('div', { className: 'nav-list' });
  nav.append(
    el('a', { textContent: 'Банкоматы', className: 'nav-item' }),
    el('a', { textContent: 'Счета', className: 'nav-item active' }),
    el('a', { textContent: 'Валюта', className: 'nav-item' }),
    el('a', { textContent: 'Выйти', className: 'nav-item' })
  );
  return nav;
}
