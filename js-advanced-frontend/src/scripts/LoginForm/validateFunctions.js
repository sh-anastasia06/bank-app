import '../../style.css';
import { inputArr } from '../../main';
export function validateInput(value) {
  return new RegExp(/^(\w|\-){6,}$/gm).test(value);
}

export function validateLoginForm() {
  const formNotValid = inputArr.some((inp) => {
    return !validateInput(inp.value);
  });

  !formNotValid ? document.querySelector('.login-btn').disabled = false : document.querySelector('.login-btn').disabled = true;
}