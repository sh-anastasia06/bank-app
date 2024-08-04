import {el, mount} from 'redom';
import { renderAccount } from '../Account/renderAccount';
import {app, headerContainer} from '../../main';
import { monthDiff, formatDate } from '../utils';

export async function renderAccountData(payload) {
  document.querySelector('.nav-item.active').classList.remove('active');
  
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
  const newTransactionForm = el('form', { className: 'new-transaction-form'});
  const accountNumberInput = el('.input-wrap', [
    el('label', { textContent: 'Номер счёта получателя' }),
    el('input', { id: 'account-number', type: 'number' })
  ]);
  const transactionAmountInput = el('.input-wrap', [
    el('label', { textContent: 'Сумма перевода' }),
    el('input', { id: 'transaction-amount', type: 'number' })
  ]);
  const newTransactionBtn = el('button', { className: 'transaction-btn', type: 'submit', disabled: true, textContent: 'Отправить' });

  /*_______________________________BALANCE DINAMIC_______________________________*/
  const balanceDinamic = el('.balance-dinamic-wrap');
  if (payload.transactions.length) {
    const balanceChart = await renderBalanceData(payload);
    mount(balanceDinamic, el('h3', { className: 'account-page-mini-title', textContent: 'Динамика баланса' }));
    mount(balanceDinamic, balanceChart);
  } else {
    mount(balanceDinamic, el('h3', { className: 'account-page-mini-title', textContent: 'Динамика баланса отсутствует' }) )
  }
  
  /*__________________________________HISTORY______________________________*/
  const historyWrap = el('.history-wrap');

  if (payload.transactions.length) {
    const historyTable = renderTransactionsHistory(payload.transactions, payload.account);
    mount(historyWrap, el('h3', { className: 'account-page-mini-title', textContent: 'История переводов' }));
    mount(historyWrap, historyTable);
  } else {
    mount(historyWrap, el('h3', { className: 'account-page-mini-title', textContent: 'История переводов отсутствует' }));
  }
  

  mount(newTransactionForm, accountNumberInput);
  mount(newTransactionForm, transactionAmountInput);
  mount(newTransactionForm, newTransactionBtn);
  mount(newTransactionWrap, newTransactionForm);
  mount(page, el('.page-center', newTransactionWrap, balanceDinamic));
  mount(page, historyWrap);

  mount(app, pageWrap);
}

export async function renderBalanceData(payload) {
  const todayDate = new Date();

  const latestTransactions = payload.transactions.filter((t) => {
    if (monthDiff(todayDate, new Date(t.date)) <= 6 && monthDiff(todayDate, new Date(t.date)) >= 0) {
      return true;
    }
    return false;
  });

  const monthData = [
    // {
    //   month: 6,
    //   sum: 100000
    // },
    // {
    //   month: 5,
    //   sum: 150000
    // },
    // {
    //   month: 4,
    //   sum: 50000
    // },
    // {
    //   month: 3,
    //   sum: 640000
    // },
    // {
    //   month: 2,
    //   sum: 81000
    // }
  ];
  latestTransactions.forEach((t) => {
    const month = new Date(t.date).getMonth();

    const flag = monthData.find((m) => m.month === month);
    if (flag) {
      monthData.forEach((m) => {
        if (m.month === month) {
           m.sum += t.amount;
        }
      })
    } else {
      monthData.push({'month': month, 'sum': t.amount})
    }
  });

  monthData.sort((a,b) => b['sum'] - a['sum']);
  const maxVal = monthData[0].sum.toFixed(2);

  const chartWrap = el('.chart-wrap');
  const chartValues = el('.chart-values', 
    el('p', { textContent:  maxVal}),
    el('p', { textContent: '0' })
  );
  const chartData = el('.chart-data');

  monthData.sort((a,b) => a['month'] - b['month']);
  monthData.forEach((m) => {
    const monthName = el('span', {className: 'chart-month'});
    const monthBlock = (el('div', {style: {height: `${((m.sum / maxVal) * 100).toFixed(0)}%`}}))
    const monthValue = el('.month-value');
    mount(monthValue, monthBlock);

    monthBlock.animate(
      [{height: 0}, {height: `${((m.sum / maxVal) * 100).toFixed(0)}%`}],
      {duration: 1500, iterations: 1, easing: 'ease'}
    )

    switch(m.month) {
      case 0:
        monthName.textContent = 'янв';
        break;
      case 1:
        monthName.textContent = 'фев';
        break;
      case 2:
        monthName.textContent = 'мар';
        break;
      case 3:
        monthName.textContent = 'апр';
        break;
      case 4:
        monthName.textContent = 'май';
        break;
      case 5:
        monthName.textContent = 'июн';
        break;
      case 6:
        monthName.textContent = 'июл';
        break;
      case 7:
        monthName.textContent = 'авг';
        break;
      case 8:
        monthName.textContent = 'сен';
        break;
      case 9:
        monthName.textContent = 'окт';
        break;
      case 10:
        monthName.textContent = 'ноя';
        break;
      case 11:
        monthName.textContent = 'дек';
        break;
    }
    const chartEl = el('.chart-el', {style: {width: `${(510 - (monthData.length - 1) * 28)/monthData.length}px`}})
    mount(chartEl, monthName);
    mount(chartEl,monthValue)
    mount(chartData, chartEl);
  });

  mount(chartWrap, chartData);
  mount(chartWrap, chartValues);
  return chartWrap;
}

export function renderTransactionsHistory(transactions, accountNumber) {
  const historyTable = el('table.history-table',
    el('thead',
      el('th', { textContent: 'Счёт отправителя'}),
      el('th', { textContent: 'Счёт получателя'}),
      el('th', { textContent: 'Сумма'}),
      el('th', { textContent: 'Дата'})
    )
  );

  const latestTransactions = [];
  for (let i = transactions.length - 1; i >= transactions.length - 10; i--) {
    latestTransactions.push(transactions[i]);
  }
  latestTransactions.reverse();

  const tBody = el('tbody');
  latestTransactions.forEach((t) => {
    const tRow = el('tr',
      el('td', {textContent: t['from'] }),
      el('td', {textContent: t['to'] }),
      el('td', { 
        textContent: t['from'] !== accountNumber > 0 ? `+${t['amount']} ₽` : `-${t['amount']} ₽`, 
        style: {
          color: t['from'] !== accountNumber > 0 ? `green` : `red`
        }
      }),
      el('td', { textContent: formatDate(t['date'])})
    );

    mount(tBody, tRow);
  })

  console.log(latestTransactions)

  mount(historyTable, tBody);
  return(historyTable)
}