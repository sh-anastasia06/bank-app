import {el, mount} from 'redom';
import { renderAccount } from '../Account/renderAccount';
import {app, headerContainer} from '../../main';
import { renderNewTransactionForm } from './renderNewTransactionForm';
import { renderTransactionsHistory } from '../TransactionsHistory/renderTransactionsHistory';
import { renderBalanceData } from '../TransactionsHistory/renderBalance';
import { renderBalanceHistory } from '../BalanceHistory/renderBalanceHistory';

export async function renderAccountData(payload) {
  app.innerHTML = '';
  if (headerContainer.querySelector('.nav-item.active')) {
    headerContainer.querySelector('.nav-item.active').classList.remove('active');
  }
  
  
  const page = el('.account-page-container.container');
  const pageWrap = el('.page', page);

  /*_________________________________TOP PART______________________________*/
  const pageTitle = el('h2', { className: 'page-title account-page-title', textContent: 'Просмотр счёта' });
  const accountNumber = el('p', { className: 'account-page-number', textContent: `№ ${payload.account}` });
  const backBtn = el('button', { className: 'back-btn', textContent: 'Вернуться назад' });
  const balanceTitle = el('p', { textContent: 'Баланс' });
  const balanceValue = el('span', { textContent: payload.balance + ' ₽'});

  backBtn.addEventListener('click', async function() {
    headerContainer.querySelectorAll('.nav-item')[1].classList.add('active');
    await renderAccount();
  })

  mount(
    page, 
    el('.account-page-top', 
      el('div', pageTitle, accountNumber),
      el('div', backBtn, el('.account-page-balance', balanceTitle, balanceValue))
    )
  );

  /*______________________________NEW TRANSACTION___________________________*/
  const newTransactionWrap = el('.new-tansaction-wrap', el('h3', { className: 'account-page-mini-title', textContent: 'Новый перевод' }));
  const newTransactionForm = renderNewTransactionForm(payload.account);
  mount(newTransactionWrap, newTransactionForm);
  
  /*_______________________________BALANCE DINAMIC_______________________________*/
  const balanceDinamic = el('.balance-dinamic-wrap');
  if (payload.transactions.length) {
    const balanceChart = renderBalanceData(payload, 6);
    mount(balanceDinamic, el('h3', { className: 'account-page-mini-title', textContent: 'Динамика баланса' }));
    mount(balanceDinamic, balanceChart);
  } else {
    mount(balanceDinamic, el('h3', { className: 'account-page-mini-title', textContent: 'Динамика баланса отсутствует' }) )
  }
  
  /*__________________________________HISTORY______________________________*/
  const historyWrap = el('.history-wrap');

  if (payload.transactions.length) {
    const historyTable = renderTransactionsHistory(payload.transactions, payload.account, 10);
    mount(historyWrap, el('h3', { className: 'account-page-mini-title', textContent: 'История переводов' }));
    mount(historyWrap, historyTable);
  } else {
    mount(historyWrap, el('h3', { className: 'account-page-mini-title', textContent: 'История переводов отсутствует' }));
  }


  [balanceDinamic, historyWrap].forEach((el) => {
    el.addEventListener('click', () => {
      renderBalanceHistory(payload);
    })
  })

  
  mount(page, el('.page-center', newTransactionWrap, balanceDinamic));
  mount(page, historyWrap);

  mount(app, pageWrap);
}