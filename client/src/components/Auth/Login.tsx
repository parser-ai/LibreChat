import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { signInWithRedirect } from 'aws-amplify/auth';
import { LoaderIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MicrosoftLogo from '../svg/MicrosoftLogo';

export const loginRequest = {
  scopes: ['User.Read'],
};

// TODO: style and more
function Login() {
  const [isLoadingSilentCredentials, setIsLoadingSilentCredentials] = useState(false);
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  const handleLoginRequest = () => {
    instance.loginRedirect(loginRequest);
  };

  const handleLogin = async () => {
    if (accounts?.length) {
      setIsLoadingSilentCredentials(true);

      try {
        const result = await instance.acquireTokenSilent({
          account: accounts[0],
          ...loginRequest,
        });

        // Use Amplify to sign in with the Azure token
        await signInWithRedirect({
          provider: {
            custom: process.env.REACT_APP_AZURE_PROVIDER_NAME!
          },
          customState: result.idToken,
        });
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
          Login with Microsoft
        </>
      )}
    </button>
  );
}

export default Login;
