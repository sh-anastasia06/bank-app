import {el, mount} from 'redom';
import { SERVER_URL } from '../constantValues';
import { sortAccounts } from '../utils';
import {app, headerContainer, AUTH_TOKEN} from '../../main';
import { renderNavigation } from '../Navigation/renderNavigation';
import { renderAccountData } from '../AccountData/renderAccountData';
import { createAccount, getAccountData, getAccounts } from '../api';

export async function renderAccount() {
  app.innerHTML = '';

  if (!headerContainer.querySelector('.nav-list')) {
    mount(headerContainer, renderNavigation());
  }

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
      accountData = await getAccounts();
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
              el('span', {textContent: `${date.getDate()} ${month} ${date.getFullYear()}`})
            )
            :
            el('p', { textContent: 'Транзакций нет'})
          ),
          btn 
        )  
      );
      mount(pageAccounts, accountWrap);

      btn.addEventListener('click', async function() {
        const accountData = await getAccountData(account.account);
        await renderAccountData(accountData.payload);
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
          filteredList = sortAccounts(accountsList, 'account');
          console.log(filteredList)
          pageAccounts.innerHTML = '';
          await renderAccounts(filteredList);
          break;
        case 'По балансу':
          filteredList = sortAccounts(accountsList, 'balance');
          pageAccounts.innerHTML = '';
          await renderAccounts(filteredList);
          break;
        case 'По последней транзакции':
          filteredList = sortAccounts(accountsList, 'transactions');
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
    const newAccount = await createAccount();

    pageAccounts.innerHTML = '';
    await renderAccounts();
  });
}