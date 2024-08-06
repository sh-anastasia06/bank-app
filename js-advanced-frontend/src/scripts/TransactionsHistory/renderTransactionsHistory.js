import { formatDate, getLatestDates } from '../utils';
import { el, mount } from 'redom';

export function renderTransactionsHistory(transactions, accountNumber, number) {
  const historyTable = el('table.history-table',
    el('thead',
      el('th', { textContent: 'Счёт отправителя'}),
      el('th', { textContent: 'Счёт получателя'}),
      el('th', { textContent: 'Сумма'}),
      el('th', { textContent: 'Дата'})
    )
  );

  const latestTransactions = getLatestDates(transactions, number);
  const tBody = el('tbody');

  function renderListByPages(page) {
    tBody.innerHTML = '';
    let currentPage = page;

    let currentPageTransactions = latestTransactions.slice(currentPage, currentPage + 24);

    currentPageTransactions.forEach((t) => {
      const tRow = el('tr',
        el('td', {textContent: t['from'] }),
        el('td', {textContent: t['to'] }),
        el('td', { 
          textContent: t['from'] !== accountNumber ? `+${t['amount']} ₽` : `-${t['amount']} ₽`, 
          style: {
            color: t['from'] !== accountNumber ? `green` : `red`
          }
        }),
        el('td', { textContent: formatDate(t['date'])})
      );

      mount(tBody, tRow);
    });
  }

  if (latestTransactions.length > 25) {
    const nextTable = el('button.table-nav-item.next');
    const prevTable = el('button.table-nav-item.previous');
    const tableNav = el('.table-nav', prevTable, nextTable);

    let page = 0;

    renderListByPages(0);
    prevTable.disabled = true;

    nextTable.addEventListener('click', function() {
      page += 25
      renderListByPages(page);
      if (latestTransactions.length > page) {
        nextTable.disabled = false;
        prevTable.disabled = false;
      } else {
        prevTable.disabled = false;
        nextTable.disabled = true;
      } 
    });

    prevTable.addEventListener('click', function() {
      page -= 25;
      renderListByPages(page);
      if (page == 0 || page == 25) {
        prevTable.disabled = true
      }
    })

    mount(historyTable, el('tfoot', 
      el('tr', el('td', [{colspan: 4}, tableNav]))
    ));
  } else {
    latestTransactions.forEach((t) => {
      const tRow = el('tr',
        el('td', {textContent: t['from'] }),
        el('td', {textContent: t['to'] }),
        el('td', { 
          textContent: t['from'] !== accountNumber ? `+${t['amount']} ₽` : `-${t['amount']} ₽`, 
          style: {
            color: t['from'] !== accountNumber ? `green` : `red`
          }
        }),
        el('td', { textContent: formatDate(t['date'])})
      );

      mount(tBody, tRow);
    });
  }

  
  

  mount(historyTable, tBody);
  return(historyTable)
}

