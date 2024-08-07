import {el, mount} from 'redom';
import { app, headerContainer } from '../../main';
import { SERVER_URL } from '../constantValues';
import {renderErrorMessage} from './renderErrorMessage';
import {renderAccount} from '../Account/renderAccount';
export let AUTH_TOKEN;

export async function renderLogin() {
  app.innerHTML = '';

  if (headerContainer.querySelector('.nav-list')) {
    headerContainer.querySelector('.nav-list').remove();
  }

  const loginWrap = el('.login');
  const loginTitle = el('h2', { textContent: 'Вход в аккаунт', className: 'login-title' });
  const loginForm = el('form', { className: 'login-form' });
  const loginInput = el('input', { id: 'login' });
  const loginLoginInput = el('.input-wrap', [
    el('label', { textContent: 'Логин' }),
    loginInput
  ]);
  const loginPassword = el('input', { id: 'password', type: 'password' });
  const loginPasswordInput = el('.input-wrap', [
    el('label', { textContent: 'Пароль' }),
    loginPassword
  ]);
  const loginBtn = el('button', { className: 'login-btn', type: 'submit', disabled: true, textContent: 'Войти' });

  mount(loginForm, loginLoginInput);
  mount(loginForm, loginPasswordInput);
  mount(loginForm, loginBtn);
  mount(loginWrap, loginTitle);
  mount(loginWrap, loginForm);

  const inputArr = [loginInput, loginPassword];

  function validateInput(value) {
    return new RegExp(/^(\w|\-){6,}$/gm).test(value);
  }

  function validateLoginForm() {
    const formNotValid = inputArr.some((inp) => {
      return !validateInput(inp.value);
    });

    !formNotValid ? document.querySelector('.login-btn').disabled = false : document.querySelector('.login-btn').disabled = true;
  }

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

  loginForm.addEventListener('submit', async function(event) {
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

  mount(app, el('.container.login-container', loginWrap));
}