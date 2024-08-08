/// <reference types="cypress" />

describe('Тесты для проверки функционала счетов', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
    cy.get('input[id="login"]').type('developer');
    cy.get('input[id="password"]').type('skillbox');
    cy.get('input[id="password"]').blur();
    cy.contains('Войти').click();
  });

  it('Счёт успешно создаётся', () => {
    cy.get('div[class="accounts"]').children().then(list => {
      let lengthBefore = list.length + 1;
      cy.contains('Создать новый счёт').click();
      cy.get('div[class="accounts"]').children().should('have.length', lengthBefore);
    });
  });

  it('Перевод со счёта на счёт', () => {
    cy.get('button[class="account-btn"]').eq(1).click();
    cy.get('.account-page-balance > span').then(($span) => {
      const text = parseInt($span.text()) - 10;
      cy.get('#account-number').type('61253747452820828268825011');
      cy.get('#transaction-amount').type('10');
      cy.get('#transaction-amount').blur();
      cy.contains('Отправить').click();
      cy.get('.account-page-balance > span').should('contain.text', text);
    });
  });

  it('Перевод средств с нового счёта', () => {
    cy.contains('Создать новый счёт').click();
    cy.get('button[class="account-btn"]').last().click();
    cy.get('.account-page-balance > span').then(($span) => {
      const text = parseInt($span.text()) - 10;
      cy.get('#account-number').type('61253747452820828268825011');
      cy.get('#transaction-amount').type('10');
      cy.get('#transaction-amount').blur();
      cy.contains('Отправить').click();
      cy.get('.transaction-error').should('have.text', 'Недостаточно средств для перевода');
    });
  })
});