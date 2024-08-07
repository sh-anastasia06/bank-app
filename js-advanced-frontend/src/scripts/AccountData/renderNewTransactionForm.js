import {el, mount, setAttr, unmount} from 'redom';
import { transferMoney, getAccountData } from '../api';
import { getFromLS, saveInLS } from '../utils';
import { renderErrorMessage } from './renderTransactionError';
import { renderAccountData } from './renderAccountData';

const amountRegex = new RegExp(/^\d+(\.|\,)\d{2}$/gm);

export function renderNewTransactionForm(accountNumber) {

  const LS = getFromLS() || [];
  const pageSelect = el('.dropdown.accounts-dropdown');
  const dropdown = el('ul');
  mount(pageSelect, dropdown);
  mount(pageSelect, el('input', {id: 'account-number'}))

  const newTransactionForm = el('form', { className: 'new-transaction-form'});
  const accountNumberInput = el('.input-wrap', [
    el('label', { textContent: 'Номер счёта получателя' }),
    pageSelect
  ]);
  const transactionAmountInput = el('.input-wrap', [
    el('label', { textContent: 'Сумма перевода' }),
    el('input', { id: 'transaction-amount' })
  ]);
  const newTransactionBtn = el('button', { className: 'transaction-btn', type: 'submit', disabled: true, textContent: 'Отправить' });
  const accountNumberError = el('span.input-error', {textContent: 'Номер счёта должен составлять из 26 символов'});

  const inputArr = [accountNumberInput.querySelector('input'), transactionAmountInput.querySelector('input')];

  inputArr.forEach((inp) => inp.setAttribute('autocomplete', 'off'));

  function validateForm() {
    if (inputArr[0].value.length > 0 && inputArr[1].value.length > 0) {
      newTransactionForm.querySelector('button').disabled = false;
    } else {
      newTransactionForm.querySelector('button').disabled = true;
    }
  }

  pageSelect.addEventListener('click', function() {
    if (LS.length !== 0 ) {
      pageSelect.classList.toggle('opened');
    
      if(pageSelect.classList.contains('opened')) {
        dropdown.innerHTML = '';
        LS.forEach((num) => {
          const option = el('li.option', {textContent: num});
          option.addEventListener('click', function(event) {
            inputArr[0].value = event.target.textContent;
          });
          mount(dropdown, option);
      });
      }
    }
  });

  inputArr[0].addEventListener('keypress', function(event) {
    if (!event.key.match(/\d/gm)) {
      event.preventDefault()
    }
  });

  inputArr[0].addEventListener('blur', function() {
    validateForm();
  });

  inputArr[1].addEventListener('keypress', function(event) {
    let inputValue = event.target.value;
    if (inputValue.length == 0 && !event.key.match(/\d/gm)) {
      event.preventDefault();
    } else {
      if (!event.key.match(/\d|\./gm)) {
        event.preventDefault()
      } else if (inputValue.includes('.') && event.key.match(/\./gm)) {
        event.preventDefault()
      } else if (inputValue.includes('.')){
        const dotPos = inputValue.indexOf('.');
        if (inputValue.length > dotPos + 2) {
          event.preventDefault()
        }
      }
    }
  });

  inputArr[1].addEventListener('blur', function(event) {
    const dotPos = event.target.value.indexOf('.');
    if (event.target.value.length === dotPos + 1 && dotPos !== -1) {
      event.target.value += '00';
    } else if ( event.target.value.length === dotPos + 2 && dotPos !== -1) {
      event.target.value += '0';
    }
    validateForm();
  });

  newTransactionForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const response = await transferMoney(accountNumber, inputArr[0].value, inputArr[1].value);

    if (response.payload !== null) {
      if (!LS.includes(inputArr[0].value)) {
        LS.push(inputArr[0].value);
        saveInLS(LS);
      }

      inputArr.forEach((inp) => {
        inp.value = '';
      });

      const accountData = await getAccountData(accountNumber);
      await renderAccountData(accountData.payload);
    } else {
      mount(event.target, renderErrorMessage(response.error))
    }
  });
  
  mount(newTransactionForm, accountNumberInput);
  mount(newTransactionForm, transactionAmountInput);
  mount(newTransactionForm, newTransactionBtn);

  return newTransactionForm;
}