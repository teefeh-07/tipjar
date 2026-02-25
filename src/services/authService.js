// Authentication service
// Session management using @stacks/connect

import { AppConfig, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export function authenticate() {
  showConnect({
    appDetails: {
      name: 'Tipjar',
      icon: window.location.origin + '/logo.png',
    },
    redirectTo: '/',
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  });
}

export function logout() {
  userSession.signUserOut(window.location.origin);
}

export function isAuthenticated() {
  return userSession.isUserSignedIn();
}

export function getUserData() {
  if (!isAuthenticated()) return null;
  return userSession.loadUserData();
}

export function getStxAddress() {
  const userData = getUserData();
  if (!userData) return null;
  return userData.profile?.stxAddress?.testnet || userData.profile?.stxAddress?.mainnet || null;
}

export { userSession };
