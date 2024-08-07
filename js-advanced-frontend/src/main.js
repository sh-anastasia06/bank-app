import {el, mount, setAttr} from 'redom';
import { renderLogin } from './scripts/LoginForm/renderLoginForm';
import './style.css';

export const app = el('div');
export const header = el('.header');
export const headerContainer = el('.container.header-container');
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
await renderLogin();
