import { el, mount } from 'redom';

export function renderCurrencyChange(currency) {
  return el('li', 
    [
      { classList: `currency-item ${currency.from}-${currency.to} ${currency.change == 1 ? 'up' : 'down'}`},
      el('p.currency-item-name', { textContent: `${currency.from}/${currency.to}` }),
      el('p.currency-course-value', { textContent: currency.rate.toFixed(2) })
    ]
  )
}