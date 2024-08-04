import {el, mount, setAttr} from 'redom';
import { renderLogin } from './scripts/LoginForm/renderLoginForm';
import { validateInput, validateLoginForm } from './scripts/LoginForm/validateFunctions';
import { renderErrorMessage } from './scripts/LoginForm/renderErrorMessage';
import { renderAccount } from './scripts/Account/renderAccount';
import {SERVER_URL} from './scripts/constantValues';
import './style.css';

export let AUTH_TOKEN;

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
mount(app, renderLogin());

export const inputArr = [document.getElementById('login'), document.getElementById('password')];

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
  if (payload) {
    AUTH_TOKEN = payload.token;
  }
  if (error) {
    mount(event.target, renderErrorMessage(error));
  } else {
    renderAccount();
  }
});
// валидация и отправка формы нового перевода
// переход на страницу детализацию истории переводов и баланса
