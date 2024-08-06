import {el} from 'redom';
export function renderErrorMessage(text) {
  const errorWrap = el('.login-error.transaction-error', el('p', { textContent: text }));
  return errorWrap;
}