import { el, mount } from 'redom';
import { app, headerContainer } from '../../main';
import { getBanks } from '../api';
import ymaps from 'ymaps';

export async function renderMap() {
  app.innerHTML = '';

  headerContainer.querySelector('.nav-item.active').classList.remove('active');
  document.getElementById('atm').classList.add('active');

  const page = el('.map-page-container.container');
  const pageWrap = el('.page', page);

  const pageTitle = el('h2', { className: 'page-title map-page-title', textContent: 'Карта банкоматов' });
  mount(page, pageTitle);

  const marks = await getBanks().then((res) => res.payload);
  console.log(marks)

  const mapWrap = el('.map-wrap', { id: 'map' });
  function init() {
    let map = new ymaps.Map('map', {
      center: [55.75399399999374, 37.62209300000001],
      zoom: 10
    });
    marks.forEach((mark) => {
      let placemark = new ymaps.Placemark([mark.lat, mark.lon], {
        balloonContentHeader: `
          <div class="balloon-header">
            <div class="ballon-img"></div>
            <p>Банкомат Coin.</p>
          </div>
        `,
        balloonContentBody: `
          <div class="balloon-body">
            <p>Адрес:</p>
            <p>г.Москва, ул.Восточная, д.12-А</p>
          </div>
        `,
        balloonContentFooter: `
          <div class="balloon-footer">
            <p class="ballon-time">Время работы:</p>
            <p class="ballon-time">24/7</p>
          </div>
        `
      }, {});

      map.geoObjects.add(placemark);
    })
  }
  ymaps.ready(init);

  mount(page, mapWrap);
  mount(app, pageWrap);
}