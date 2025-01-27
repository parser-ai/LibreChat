import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { LoaderIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MicrosoftLogo from '../svg/MicrosoftLogo';
import { loginRequest } from './config';

function Login() {
  const navigate = useNavigate();
  const { instance, accounts } = useMsal();
  const [isLoadingSilentCredentials, setIsLoadingSilentCredentials] = useState(false);

  const handleLoginRequest = () => {
    instance.loginRedirect(loginRequest);
  };

  const handleLogin = async () => {
    if (accounts?.length) {
      setIsLoadingSilentCredentials(true);
      try {
        await instance.acquireTokenSilent({
          account: accounts[0],
          ...loginRequest,
        });

        // Redirect to the main app page
        navigate('/');
      } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
          handleLoginRequest();
        } else {
          console.error('Error during login:', error);
        }
      } finally {
        setIsLoadingSilentCredentials(false);
      }
    } else {
      handleLoginRequest();
    }
  };
  return (
    <button
      className="
        w-full bg-white text-gray-800 h-[50px] rounded-lg text-sm flex flex-row items-center justify-center
        border-none transition-all duration-300 ease-in-out p-2 shadow-md relative overflow-hidden
        hover:bg-gradient-to-r hover:from-[#272c42] hover:to-[rgb(76.89,86.74,130.11)] hover:text-white"
      onClick={handleLogin}
      disabled={isLoadingSilentCredentials}
    >
      {isLoadingSilentCredentials ? (
        <LoaderIcon className="animate-spin w-5 h-5" />
      ) : (
        <>
          <MicrosoftLogo className="w-6 h-6 mr-2" />
          <span>Login with Microsoft</span>
        </>
      )}
    </button>
  );
}

export default Login;
