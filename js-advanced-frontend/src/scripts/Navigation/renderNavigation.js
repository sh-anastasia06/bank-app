import {el, mount} from 'redom';
import { app, AUTH_TOKEN } from '../../main';
import { renderLogin } from '../LoginForm/renderLoginForm';
import { renderCurrency } from '../Currency/renderCurrency';
export function renderNavigation() {
  const nav = el('div', { className: 'nav-list' });

  const atm = el('a', { textContent: 'Банкоматы', className: 'nav-item', id: 'atm' });
  const accounts = el('a', { textContent: 'Счета', className: 'nav-item', id: 'accounts' });
  const currency = el('a', { textContent: 'Валюта', className: 'nav-item', id: 'currency' });
  const exit = el('a', { textContent: 'Выйти', className: 'nav-item', id: 'exit' });

  nav.append(atm, accounts, currency, exit);

  currency.addEventListener('click', async function() {
    await renderCurrency();
  })

  return nav;
}
