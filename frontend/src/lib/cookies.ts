// Cookie handling utilities

export const setCookie = (name: string, value: string, days = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax${window.location.protocol === 'https:' ? ';Secure' : ''}`;
};

export const getCookie = (name: string): string | null => {
  const nameLenPlus = (name.length + 1);
  return document.cookie
    .split(';')
    .map(c => c.trim())
    .filter(cookie => cookie.substring(0, nameLenPlus) === `${name}=`)
    .map(cookie => decodeURIComponent(cookie.substring(nameLenPlus)))[0] || null;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};
