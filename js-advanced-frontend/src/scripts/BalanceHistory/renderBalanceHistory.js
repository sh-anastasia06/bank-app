import {el, mount} from 'redom';
import { renderBalanceData } from '../TransactionsHistory/renderBalance';
import { renderTransactionsHistory } from '../TransactionsHistory/renderTransactionsHistory';
import { headerContainer } from '../../main';
import { renderAccountData } from '../AccountData/renderAccountData';
import { app } from '../../main';
import { renderRatioBalance } from '../TransactionsHistory/renderRatioBalance';

export function renderBalanceHistory(payload) {
  app.innerHTML = '';
  const page = el('.history-page-container.container');
  const pageWrap = el('.page', page);

  const pageTitle = el('h2', { className: 'page-title account-page-title', textContent: 'История баланса' });
  const accountNumber = el('p', { className: 'account-page-number', textContent: `№ ${payload.account}` });
  const backBtn = el('button', { className: 'back-btn', textContent: 'Вернуться назад' });
  const balanceTitle = el('p', { textContent: 'Баланс' });
  const balanceValue = el('span', { textContent: payload.balance + ' ₽'});

  backBtn.addEventListener('click', async function() {
    headerContainer.querySelectorAll('.nav-item')[1].classList.add('active');
    await renderAccountData(payload.account);
  })

  mount(
    page, 
    el('.account-page-top', 
      el('div', pageTitle, accountNumber),
      el('div', backBtn, el('.account-page-balance', balanceTitle, balanceValue))
    )
  );

  const mainContent = el('.page-main-content');

  const balanceDinamic = el('.balance-dinamic-wrap.balance-dinamic-wrap-huge');
  if (payload.transactions.length) {
    const balanceChart = renderBalanceData(payload, 12);
    mount(balanceDinamic, el('h3', { className: 'account-page-mini-title', textContent: 'Динамика баланса' }));
    mount(balanceDinamic, balanceChart);
  } else {
    mount(balanceDinamic, el('h3', { className: 'account-page-mini-title', textContent: 'Динамика баланса отсутствует' }) )
  }

  mount(mainContent, balanceDinamic);

  const balanceRatio = el('.balance-dinamic-wrap.balance-dinamic-wrap-huge');
  if (payload.transactions.length) {
    const balanceChart = renderRatioBalance(payload);
    mount(balanceRatio, el('h3', { className: 'account-page-mini-title', textContent: 'Соотношение входящих исходящих транзакций' }));
    mount(balanceRatio, balanceChart);
  } else {
    mount(balanceRatio, el('h3', { className: 'account-page-mini-title', textContent: 'Соотношение входящих исходящих транзакций отсутствует' }) )
  }

  mount(mainContent, balanceRatio);

  const historyWrap = el('.history-wrap');
  if (payload.transactions.length) {
    const historyTable = renderTransactionsHistory(payload.transactions, payload.account, payload.transactions.length);
    mount(historyWrap, el('h3', { className: 'account-page-mini-title', textContent: 'История переводов' }));
    mount(historyWrap, historyTable);
  } else {
    mount(historyWrap, el('h3', { className: 'account-page-mini-title', textContent: 'История переводов отсутствует' }));
  }

  mount(mainContent, historyWrap);


  mount(page, mainContent);

  mount(app, pageWrap);
}
