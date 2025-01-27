import { useLocalize } from '~/hooks';
import { BlinkAnimation } from './BlinkAnimation';
import { TStartupConfig } from 'librechat-data-provider';
import SocialLoginRender from './SocialLoginRender';
import { ThemeSelector } from '~/components/ui';
import { Banner } from '../Banners';
import Footer from './Footer';
import ParserFullLogoIcon from '../svg/ParserFullLogo';

const ErrorRender = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-16 flex justify-center">
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-md border border-red-500 bg-red-500/10 px-3 py-2 text-sm text-gray-600 dark:text-gray-200"
    >
      {children}
    </div>
  </div>
);

function AuthLayout({
  children,
  header,
  isFetching,
  startupConfig,
  startupConfigError,
  pathname,
  error,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  isFetching: boolean;
  startupConfig: TStartupConfig | null | undefined;
  startupConfigError: unknown | null | undefined;
  pathname: string;
  error: string | null;
}) {
  const localize = useLocalize();

  const hasStartupConfigError = startupConfigError !== null && startupConfigError !== undefined;
  const DisplayError = () => {
    if (hasStartupConfigError) {
      return <ErrorRender>{localize('com_auth_error_login_server')}</ErrorRender>;
    } else if (error === 'com_auth_error_invalid_reset_token') {
      return (
        <ErrorRender>
          {localize('com_auth_error_invalid_reset_token')}{' '}
          <a className="font-semibold text-brand-blue-600 hover:underline" href="/forgot-password">
            {localize('com_auth_click_here')}
          </a>{' '}
          {localize('com_auth_to_try_again')}
        </ErrorRender>
      );
    } else if (error != null && error) {
      return <ErrorRender>{localize(error)}</ErrorRender>;
    }
    return null;
  };

  return (
    <div className="relative flex justify-center min-h-screen flex-col bg-white dark:bg-gray-900">
      <Banner />
      <DisplayError />
      <div className="absolute bottom-0 left-0 md:m-4">
        <ThemeSelector />
      </div>

      <div className="flex items-center justify-cente m-auto">
        <div className="flex flex-col items-center text-gray-800 w-96 bg-[#6d6d6d66] rounded-2xl p-10 shadow-lg backdrop-blur-sm">
          <BlinkAnimation active={isFetching}>
            <div className="mb-6 w-24 h-24 bg-cover">
              <img
                src="/assets/agent-ai.png"
                className="h-full w-full object-cover"
                alt={localize('com_ui_logo', startupConfig?.appTitle ?? 'Parser AI')}
              />
            </div>
          </BlinkAnimation>

          {!hasStartupConfigError && !isFetching && (
            <h1
              className="mb-4 text-center text-3xl font-semibold text-black dark:text-white"
              style={{ userSelect: 'none' }}
            >Parser AI</h1>
          )}

          {children}

          {(pathname.includes('login') || pathname.includes('register')) && (
            <SocialLoginRender startupConfig={startupConfig} />
          )}
        </div>
      </div>
      <div className="mt-6 h-6 bg-cover">
        <ParserFullLogoIcon className='h-full w-full object-contain' />
      </div>
      <Footer startupConfig={startupConfig} />
    </div>
  );
}

export default AuthLayout;
