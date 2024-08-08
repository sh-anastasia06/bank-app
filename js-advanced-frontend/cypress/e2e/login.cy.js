/// <reference types="cypress" />

describe('Тесты на авторизацию', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  it('Логин и пароль верные', () => {
    cy.get('input[id="login"]').type('developer');
    cy.get('input[id="password"]').type('skillbox');
    cy.get('input[id="password"]').blur();
    cy.contains('Войти').should('not.be.disabled');
  });

  it('Пароль не верный', () => {
    cy.get('input[id="login"]').type('developer');
    cy.get('input[id="password"]').type('skillb');
    cy.get('input[id="password"]').blur();
    cy.contains('Войти').click();
    cy.get('div[class="login-error"]');
  });

  it('Логин не верный', () => {
    cy.get('input[id="login"]').type('develo');
    cy.get('input[id="password"]').type('skillbox');
    cy.get('input[id="password"]').blur();
    cy.contains('Войти').click();
    cy.get('div[class="login-error"]');
  });

  it('Пароль или логин слишком короткие', () => {
    cy.get('input[id="login"]').type('devel');
    cy.get('input[id="login"]').blur();
    cy.get('input[id="login"]').should('contain.class', 'validation-mistake');
  });
});