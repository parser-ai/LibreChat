// TODO: use env vars!
export const msalConfig = {
  auth: {
    clientId: '414d921d-d386-4be9-a2f4-041bbd194460',
    authority: 'https://login.microsoftonline.com/77b1e4b3-5306-4842-908b-ff6f89a9abeb',
    redirectUri: 'http://localhost:3000',
    postLogoutRedirectUri: '/',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: true,
  },
};

export const loginRequest = {
  scopes: ['User.Read'],
};
