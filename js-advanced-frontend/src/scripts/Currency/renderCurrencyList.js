import {el, mount} from 'redom';

export function renderCurrencyList(currencies) {
  const list = el('ul.currency-list');

  Object.keys(currencies).forEach((key) => {
    if (currencies[key]['amount'] > 0) {
      const item = el('li.currency-item', 
        el('p.currency-item-name', { textContent: currencies[key]['code'] }),
        el('p.currency-item-value', { textContent: currencies[key]['amount'].toFixed(2) })
      );

      mount(list, item);
    }
  });

  return list;
}