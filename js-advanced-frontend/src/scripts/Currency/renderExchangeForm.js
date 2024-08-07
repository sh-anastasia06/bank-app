import { el, mount } from "redom";
import { buyCurrency, getAllCurencies } from "../api";
import { renderCurrency } from "./renderCurrency";
import { renderErrorMessage } from "../LoginForm/renderErrorMessage";

export async function renderExchangeForm(fromArr) {
  const toArr = await getAllCurencies().then((res) => res.payload);

  const form = el('form.exchange-form');
  let errorMessage;
  
  const fromSelected = el('input', { id: 'from-selected', className: 'selected', type: 'text', readOnly: true });
  const fromUl = el('ul');
  const fromSelect = el('.dropdown.dropdown-exchange', fromSelected, fromUl);
  fromArr.forEach((c) => {
    mount(fromUl, el('li', {className: 'option', textContent: c} ))
  });
  const toSelected = el('input', { id: 'from-selected', className: 'selected', type: 'text', readOnly: true });
  const toUl = el('ul');
  const toSelect = el('.dropdown.dropdown-exchange', toSelected, toUl);
  toArr.forEach((c) => {
    mount(toUl, el('li', {className: 'option', textContent: c} ))
  });
  const amountInput = el('input', { id: 'exchange-amount '});

  const fromInputWrap = el('.input-wrap', 
    el('label', { textContent: 'Из' }),
    fromSelect
  );
  const toInputWrap = el('.input-wrap',
    el('label', { textContent: 'в' }),
    toSelect
  );
  const amountInputWrap = el('.input-wrap', 
    el('label', { textContent: 'Сумма' }),
    amountInput
  );
  const btn = el('button', { type: 'submit', className: 'exchange-form-button', disabled: true, textContent: 'Обменять'});

  mount(form, el('.exchange-form-inputs',
    el('.exchange-form-top', fromInputWrap, toInputWrap),
    amountInputWrap
  ));
  mount(form, btn);

  function validateForm() {
    if (fromSelected.value != '' && toSelected.value != '' && amountInput.value != '') {
      btn.disabled = false;
    } else {
      btn.disabled = true;
    }
  }

  fromSelect.addEventListener('click', function(event) {
    event.stopPropagation();
    fromSelect.classList.toggle('opened');
  });

  toSelect.addEventListener('click', function(event) {
    event.stopPropagation();
    toSelect.classList.toggle('opened');
  });

  fromSelect.querySelectorAll('.option').forEach((opt) => {
    opt.addEventListener('click', function() {
      fromSelected.value = opt.textContent;
      fromSelect.querySelectorAll('.option').forEach((opt) => opt.classList.remove('checked'));
      opt.classList.add('checked');
    });
  });

  toSelect.querySelectorAll('.option').forEach((opt) => {
    opt.addEventListener('click', function() {
      toSelected.value = opt.textContent;
      toSelect.querySelectorAll('.option').forEach((opt) => opt.classList.remove('checked'));
      opt.classList.add('checked');
    });
  });

  amountInput.addEventListener('keypress', function(event) {
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

  amountInput.addEventListener('blur', function(event) {
    const dotPos = event.target.value.indexOf('.');
    if (event.target.value.length === dotPos + 1 && dotPos !== -1) {
      event.target.value += '00';
    } else if ( event.target.value.length === dotPos + 2 && dotPos !== -1) {
      event.target.value += '0';
    }
    validateForm();
  });

  form.addEventListener('submit', async function(event) {
    event.preventDefault();

    if (document.querySelector('.login-error')) {
      document.querySelector('.login-error').remove();
    }

    const response = await buyCurrency(fromSelected.value, toSelected.value, amountInput.value);
    alert(JSON.stringify(response))
    if (response.error == '') {
      await renderCurrency();
    } else {
      const errorMessage = renderErrorMessage('Недостаточно средств для перевода');
      mount(form, errorMessage);
    }
  })

  return form;
}

// обработка ошибок