const NAMESPACE = 'solo-link';

function makeKey(key) {
  return `${NAMESPACE}-${key}`;
}

export function getItem(key) {
  return localStorage.getItem(makeKey(key));
}

export function hasItem(key) {
  return getItem(key) !== null;
}

export function setItem(key, value) {
  return localStorage.setItem(makeKey(key), value);
}

export function removeItem(key) {
  return localStorage.removeItem(makeKey(key));
}
