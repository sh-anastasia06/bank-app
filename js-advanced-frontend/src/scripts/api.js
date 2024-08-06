import { SERVER_URL } from "./constantValues";
import { AUTH_TOKEN } from "../main";

export async function createAccount() {
  const result = await fetch(`${SERVER_URL}/create-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${AUTH_TOKEN}`
      },
      body: JSON.stringify({})
    }).then((res) => res.json());
  return result;
}

export async function getAccounts() {
  const response = await fetch(`${SERVER_URL}/accounts`, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${AUTH_TOKEN}`
    }
  }).then((res) => res.json());

  return response;
}

export async function getAccountData(accountNumber) {
  const response = await fetch(`${SERVER_URL}/account/${accountNumber}`, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${AUTH_TOKEN}`
    }
  }).then((res) => res.json());

  return response;
}

export async function transferMoney(from, to, amount) {
  const response = await fetch(`${SERVER_URL}/transfer-funds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${AUTH_TOKEN}`
    },
    body: JSON.stringify({from, to, amount})
  }).then((res) => res.json());

  return response;
}