import { monthDiff } from '../utils';
import { el, mount } from 'redom';

export function renderBalanceData(payload, period) {
  const todayDate = new Date();

  const latestTransactions = payload.transactions.filter((t) => {
    if (monthDiff(todayDate, new Date(t.date)) <= period && monthDiff(todayDate, new Date(t.date)) >= 0) {
      return true;
    }
    return false;
  });

  const monthData = [];
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