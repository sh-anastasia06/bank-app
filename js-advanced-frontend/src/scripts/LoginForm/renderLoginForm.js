import {el, mount} from 'redom';

export function renderLogin() {
  const loginWrap = el('.login');
  const loginTitle = el('h2', { textContent: 'Вход в аккаунт', className: 'login-title' });
  const loginForm = el('form', { className: 'login-form' });
  const loginLoginInput = el('.input-wrap', [
    el('label', { textContent: 'Логин' }),
    el('input', { id: 'login' })
  ]);
  const loginPasswordInput = el('.input-wrap', [
    el('label', { textContent: 'Пароль' }),
    el('input', { id: 'password', type: 'password' })
  ]);
  const loginBtn = el('button', { className: 'login-btn', type: 'submit', disabled: true, textContent: 'Войти' });

  mount(loginForm, loginLoginInput);
  mount(loginForm, loginPasswordInput);
  mount(loginForm, loginBtn);
  mount(loginWrap, loginTitle);
  mount(loginWrap, loginForm);

  return el('.container.login-container', loginWrap);
}