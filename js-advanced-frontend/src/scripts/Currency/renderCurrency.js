import { el, mount } from "redom";
import { app, headerContainer } from "../../main";
import { getAllCurencies, getCurrencies } from "../api";
import { renderCurrencyList } from "./renderCurrencyList";
import { renderExchangeForm } from "./renderExchangeForm";
import { renderCurrencyChange } from "./renderCurrencyChange";
import { spinner } from "../Spinner/spinner";

export async function renderCurrency() {
  app.innerHTML = '';

  const loading = spinner();
  mount(app, loading);
  const clientCurrencyData = await getCurrencies();
  loading.remove();
  
  if (headerContainer.querySelector('.nav-item.active')) {
    headerContainer.querySelector('.nav-item.active').classList.remove('active');
  }
  
  document.getElementById('currency').classList.add('active');

  const page = el('.currency-page-container.container');
  const pageWrap = el('.page', page);
  const pageContent = el('.currency-content');

  const pageTitle = el('h2', { className: 'page-title currency-page-title', textContent: 'Валютный обмен' });
  mount(page, pageTitle);

  const clientCurrency = el('.currency-client.currency-box-1');
  if (clientCurrencyData.error == '') {
    mount(clientCurrency, el('h3', { className: 'account-page-mini-title', textContent: 'Ваши валюты' }));
    mount(clientCurrency, renderCurrencyList(clientCurrencyData.payload));
  } else {
    mount(clientCurrency, el('h3', { className: 'account-page-mini-title', textContent: 'У вас отсутствуют валюты' }));
  }
  mount(page, clientCurrency);


  const currencyCourse = el('.currency-course', el('h3', {
    textContent: 'Изменение курсов в реальном времени',
    className: 'account-page-mini-title'
  }));
  const ws = new WebSocket('ws://localhost:3000/currency-feed');
  const currencyCourseList = el('ul.currency-list');
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if ( message.change !== 0) {
      if (currencyCourseList.querySelector(`${message.from}-${message.to}`)){
        currencyCourseList.querySelector(`${message.from}-${message.to}`).replaceWith(renderCurrencyChange(message));
      } else {
        mount(currencyCourseList, renderCurrencyChange(message))
      }
      
    }
  }
  mount(currencyCourse, currencyCourseList);

  const currencyExchange = el('.currency-exchange.currency-box-1');
  if (clientCurrencyData.error == '') {
    mount(currencyExchange, el('h3', { className: 'account-page-mini-title', textContent: 'Обмен валюты' }));
    mount(currencyExchange, await renderExchangeForm(Object.keys(clientCurrencyData.payload)));
  } else {
    mount(currencyExchange, el('h3', { className: 'account-page-mini-title', textContent: 'У вас отсутствуют валюты' }));
  }

  mount(pageContent, el('.currency-left', clientCurrency, currencyExchange));
  mount(pageContent, currencyCourse);

  

  mount(page, pageContent);
  mount(app, pageWrap);

  currencyCourse.style.height = pageContent.querySelector('.currency-left').offsetHeight + 'px';
  currencyCourseList.style.height = currencyCourse.offsetHeight - 148 + 'px';
}