import { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';

const MSALHandler = () => {
  const { instance } = useMsal();

  useEffect(() => {
    instance.handleRedirectPromise()
      .then((response) => {
        console.log('Checking storage immediately after redirect...');
        console.log('MSAL Accounts:', instance.getAllAccounts());
        console.log('Active Account:', instance.getActiveAccount());
        console.log('Storage:', localStorage);

        if (response && response.account) {
          instance.setActiveAccount(response.account);
          localStorage.setItem('msal_account', JSON.stringify(response.account));
        } else {
          const accounts = instance.getAllAccounts();
          if (accounts.length > 0) {
            instance.setActiveAccount(accounts[0]);
          }
        }
      })
      .catch((error) => {
        console.error('MSAL Redirect Error:', error);
      });

  }, []);

  // return (
  //   <div>
  //     <h1>MSAL Test</h1>
  //     <button onClick={() => instance.loginRedirect(loginRequest)}>Login with Microsoft</button>
  //     <button onClick={() => console.log('MSAL Accounts:', instance.getAllAccounts())}>Check MSAL State</button>
  //   </div>
  // );
};

export default MSALHandler;
