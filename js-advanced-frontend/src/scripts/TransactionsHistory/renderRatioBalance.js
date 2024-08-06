import { el, mount, text } from "redom";
import { monthDiff } from "../utils";

export function renderRatioBalance(payload) {
  const todayDate = new Date();

  const latestTransactions = payload.transactions.filter((t) => {
    if (monthDiff(todayDate, new Date(t.date)) <= 12 && monthDiff(todayDate, new Date(t.date)) >= 0) {
      return true;
    }
    return false;
  });

  const monthData = [];
  latestTransactions.forEach((t) => {
    console.log(t)
    const month = new Date(t.date).getMonth();

    const flag = monthData.find((m) => m.month === month);
    if (flag) {
      monthData.forEach((m) => {
        if (m.month === month) {
           if (t.from == payload.account) {
            m.sent += t.amount
           } else {
            m.received += t.amount
           }
        }
      })
    } else {
      if (t.from == payload.account) {
        monthData.push({
          month: month,
          received: 0,
          sent: t.amount
        });
      } else {
       monthData.push({
          month: month,
          received: t.amount,
          sent: 0
        });
      }
    }
  });

  monthData.sort((a,b) => b['received'] - a['received']);
  const maxRecieved = monthData[0].received.toFixed(2);
  monthData.sort((a,b) => b['sent'] - a['sent']);
  const maxSend = monthData[0].sent.toFixed(2);
  const maxVal = Math.max(maxRecieved, maxSend);

  const chartWrap = el('.chart-wrap');
  const chartValues = el('.chart-values.chart-values-ratio', 
    el('p', { 
      textContent:  maxRecieved, 
      style: {
        order: maxVal == maxRecieved ? 1 : 2,
        bottom: maxVal == maxRecieved ? '150px' : `${(maxRecieved / maxVal) * 150}px`
      } 
    }),
    el('p', { 
      textContent: maxSend, 
      style: {
        order: maxVal == maxSend ? 1 : 2,
        bottom:  maxVal == maxSend ? '150px' : `${(maxSend / maxVal) * 150}px`
      } 
    }),
    el('p', { textContent: '0', style: {order: 3}, bottom: 0 })
  );
  const chartData = el('.chart-data');

  monthData.sort((a,b) => a['month'] - b['month']);
  monthData.forEach((m) => {
    const sentHeight = m.sent > 0 ? `${((m.sent / maxVal) * 100).toFixed(0)}%` : '0%';

    const monthName = el('span', {className: 'chart-month'});
    const monthRecieved = el('div', {style: {height: `${((m.received / maxVal) * 100).toFixed(0)}%`, backgroundColor: '#76CA66', zIndex: m.received <= m.sent ? 100 : 10}});
    const monthSend = el('div', {style: {height: sentHeight, backgroundColor: '#FD4E5D', zIndex: m.sent < m.received ? 100 : 10}});
    const monthBlock = el('.month-block', [{style: {height: '100%'}}, monthRecieved, monthSend]);
    const monthValue = el('.month-value');
    mount(monthValue, monthBlock);

    console.log(m.sent, maxSend)

    monthBlock.animate(
      [{height: 0}, {height: `100%`}],
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