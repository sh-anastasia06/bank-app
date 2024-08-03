import {el, mount, setAttr} from 'redom';

import './style.css';

const SERVER_URL = 'http://localhost:3000';
let AUTH_TOKEN;

// app & static elements
const app = el('div');
const header = el('.header');
const headerContainer = el('.container.header-container');
const logo = el('h1', {textContent: 'Coin.'});

setAttr(app, {
  id: 'app',
  className: 'app-wrap',
});
setAttr(logo, {
  className: 'logo',
});

mount(headerContainer, logo)
mount(header, headerContainer);
mount(document.body, header);
mount(document.body, app);

// elements 
function renderNavigation() {
  const nav = el('div', { className: 'nav-list' });
  nav.append(
    el('a', { textContent: 'Банкоматы', className: 'nav-item' }),
    el('a', { textContent: 'Счета', className: 'nav-item active' }),
    el('a', { textContent: 'Валюта', className: 'nav-item' }),
    el('a', { textContent: 'Выйти', className: 'nav-item' })
  );
  return nav;
}

// help functions
async function sortAccounts(arr, prop) {
  let copyArr = [...arr];
  return copyArr.sort(function(a,b) {
    if(a[prop] < b[prop]) return -1;
  })
}

function monthDiff(dateFrom, dateTo) {
 return dateTo.getMonth() - dateFrom.getMonth() + 
   (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
}

function formatDate(dateString) {
  const date = new Date(dateString);

  return (
    `${date.getDay() < 10 ? '0' + date.getDay() : date.getDay()}.` +
    `${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}.` +
    `${date.getFullYear()}`
  )
}

// login
function renderLogin() {
  const loginWrap = el('.login');
  const loginTitle = el('h2', { textContent: 'Вход в аккаунт', className: 'login-title' });
  const loginForm = el('form', { className: 'login-form' });
  const loginLoginInput = el('.input-wrap', [
    el('label', { textContent: 'Логин' }),
    el('input', { id: 'login' })
  ]);
  const loginPasswordInput = el('.input-wrap', [
    el('label', { textContent: 'Пароль' }),
    el('input', { id: 'password', type: 'password' })
  ]);
  const loginBtn = el('button', { className: 'login-btn', type: 'submit', disabled: true, textContent: 'Войти' });

  mount(loginForm, loginLoginInput);
  mount(loginForm, loginPasswordInput);
  mount(loginForm, loginBtn);
  mount(loginWrap, loginTitle);
  mount(loginWrap, loginForm);
  

  return el('.container.login-container', loginWrap);
}

mount(app, renderLogin());

const inputArr = [document.getElementById('login'), document.getElementById('password')];
inputArr.forEach((inp) => {
  inp.addEventListener('blur', function(event) {
    if (!validateInput(event.target.value)) {
      event.target.classList.add('validation-mistake');
    } else {
      event.target.classList.remove('validation-mistake');
    }
    validateLoginForm();
  });
});

function validateInput(value) {
  return new RegExp(/^(\w|\-){6,}$/gm).test(value);
}

function validateLoginForm() {
  const formNotValid = inputArr.some((inp) => {
    return !validateInput(inp.value);
  });

  const loginData = {
    login: inputArr[0].value,
    password: inputArr[1].value
  };

  !formNotValid ? document.querySelector('.login-btn').disabled = false : document.querySelector('.login-btn').disabled = true;
}

document.querySelector('.login-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  if (document.querySelector('.login-error')) {
    document.querySelector('.login-error').remove();
  }

  const loginData = {
    login: inputArr[0].value,
    password: inputArr[1].value
  };

  const response = await fetch(`${SERVER_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginData),
  });
  const {payload, error} = await response.json();
  AUTH_TOKEN = payload.token;
  if (error) {
    mount(event.target, renderErrorMessage(error));
  } else {
    renderAccount();
  }
});

function renderErrorMessage(text) {
  const errorWrap = el('.login-error', el('p', { textContent: text }));
  return errorWrap;
}

// account
async function renderAccount() {
  app.innerHTML = '';

  mount(header.children[0], renderNavigation());

  const page = el('.page-container.container');
  const pageTitle = el('h2', { textContent: 'Ваши счета', className: 'page-title' });
  const pageSelected = el('input', { id: 'selected', className: 'selected', type: 'text', readOnly: true, placeholder: 'Сортировка'})
  const pageSelect = el(
    '.dropdown', 
    pageSelected,
    el('ul', 
      el('li', {className: 'option', textContent: 'По номеру'}), 
      el('li', {className: 'option', textContent: 'По балансу'}), 
      el('li', {className: 'option', textContent: 'По последней транзакции'})
    )
  );
  const newAccountBtn = el('button', { className: 'add-account-btn', textContent: 'Создать новый счёт' });

  const pageAccounts = el('.accounts');

  async function renderAccounts(data) {
    let accountData;
    if (!data) {
      const response = await fetch(`${SERVER_URL}/accounts`, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${AUTH_TOKEN}`
        }
      });
      accountData = await response.json();
    } else {
      accountData = data;
    }
    
    const userAccounts = !data ? accountData.payload : accountData;
    userAccounts.forEach((account) => {
      const date = account.transactions[0] ? new Date(account.transactions[0].date) : '';
      let month = account.transactions[0] ? date.getMonth() : '';
      switch(month) {
        case 0:
          month = 'января';
          break;
        case 1:
          month = 'февраля';
          break;
        case 2:
          month = 'марта';
          break;
        case 3:
          month = 'апреля';
          break;
        case 4:
          month = 'мая';
          break;
        case 5:
          month = 'июня';
          break;
        case 6:
          month = 'июля';
          break;
        case 7:
          month = 'августа';
          break;
        case 8:
          month = 'сентября';
          break;
        case 9:
          month = 'октября';
          break;
        case 10:
          month = 'ноября';
          break;
        case 11:
          month = 'декабря';
          break;
      }

      const btn = el('button', { className: 'account-btn', textContent: 'Открыть' });
      const accountWrap = el('.account-wrap', 
        el('h3', { className: 'account-number', textContent: account.account }),
        el('p', { className: 'account-balance', textContent: account.balance + ' ₽' }),
        el('.account-bottom', 
          el('.account-transaction',
            account.transactions[0] ? 
            (
              el('p', { textContent: 'Последняя транзакция:'}),
              el('span', {textContent: `${date.getDay()} ${month} ${date.getFullYear()}`})
            )
            :
            el('p', { textContent: 'Транзакций нет'})
          ),
          btn 
        )  
      );
      mount(pageAccounts, accountWrap);

      btn.addEventListener('click', async function() {
        const accountData = await fetch(`${SERVER_URL}/account/${account.account}`, {
          method: 'GET',
            headers: {
            Authorization: `Basic ${AUTH_TOKEN}`
          }
        }).then((res) => res.json());
        console.log(accountData);
        app.innerHTML = '';
        await renderAccountData(accountData.payload)
      });
    });

    return userAccounts;
  }
  
  let accountsList = await renderAccounts();

  mount(page, el('.page-top', pageTitle, pageSelect, newAccountBtn));
  mount(page, pageAccounts);
  mount(app, el('.page', page));

  page.querySelectorAll('.option').forEach((opt) => {
    opt.addEventListener('click', async function (event) {
      pageSelected.value = opt.textContent;
      page.querySelectorAll('.option').forEach((opt) => opt.classList.remove('checked'))
      opt.classList.add('checked');
      let filteredList;
      switch(event.target.textContent) {
        case 'По номеру':
          filteredList = await sortAccounts(accountsList, 'account');
          console.log(filteredList)
          pageAccounts.innerHTML = '';
          await renderAccounts(filteredList);
          break;
        case 'По балансу':
          filteredList = await sortAccounts(accountsList, 'balance');
          pageAccounts.innerHTML = '';
          await renderAccounts(filteredList);
          break;
        case 'По последней транзакции':
          filteredList = await sortAccounts(accountsList, 'transactions');
          pageAccounts.innerHTML = '';
          await renderAccounts(filteredList);
          break;
      }
    });
  });

  pageSelect.addEventListener('click', function(event) {
    event.stopPropagation();
    pageSelect.classList.toggle('opened');
  });

  newAccountBtn.addEventListener('click', async function(event) {
    event.preventDefault();
    const newAccount = await fetch(`${SERVER_URL}/create-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${AUTH_TOKEN}`
      },
      body: JSON.stringify({})
    }).then((res) => res.json()).then((data) => console.log(data));

    pageAccounts.innerHTML = '';
    await renderAccounts();
  });
}


async function renderAccountData(payload) {
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
  const balanceDinamic = el('.balance-dinamic-wrap', el('h3', { className: 'account-page-mini-title', textContent: 'Динамика баланса' }));
  const balanceChart = await renderBalanceData(payload);

  mount(balanceDinamic, balanceChart);
  /*__________________________________HISTORY______________________________*/
  const historyWrap = el('.history-wrap', el('h3', { className: 'account-page-mini-title', textContent: 'История переводов' }));
  const historyTable = renderTransactionsHistory(payload.transactions);

  mount(historyWrap, historyTable);

  mount(newTransactionForm, accountNumberInput);
  mount(newTransactionForm, transactionAmountInput);
  mount(newTransactionForm, newTransactionBtn);
  mount(newTransactionWrap, newTransactionForm);
  mount(page, el('.page-center', newTransactionWrap, balanceDinamic));
  mount(page, historyWrap);

  mount(app, pageWrap);
}

async function renderBalanceData(payload) {
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

function renderTransactionsHistory(transactions) {
  const historyTable = el('table.history-table',
    el('thead',
      el('th', { textContent: 'Счёт отправителя'}),
      el('th', { textContent: 'Счёт получателя'}),
      el('th', { textContent: 'Сумма отправителя'}),
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
        textContent: t['amount'] > 0 ? `+${t['amount']} ₽` : `-${t['amount']} ₽`, 
        style: {
          color: t['amount'] > 0 ? `green` : `red`
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

// валидация и отправка формы нового перевода
// переход на страницу детализацию истории переводов и баланса