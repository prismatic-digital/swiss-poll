import App from "../../components/frontend/App";
import BaseLayoutUnauthorized from "../../components/layout/BaseLayoutUnauthorized";
import Loading from "../../components/Loading";
import MessagePage from "../../components/MessagePage";
import { useNoCodeFormPublic } from "../../lib/noCodeForm";
import { useRouter } from "next/router";
import Image from "next/image";
import getConfig from "next/config";
import { classNames } from "../../lib/utils";

const { publicRuntimeConfig } = getConfig();
const { publicPrivacyUrl, publicImprintUrl } = publicRuntimeConfig;

function NoCodeFormPublic() {
  const router = useRouter();
  const formId = router.query.id?.toString();
  const { noCodeForm, isLoadingNoCodeForm, isErrorNoCodeForm } =
    useNoCodeFormPublic(formId);

  if (isLoadingNoCodeForm) {
    return <Loading />;
  }

  if (isErrorNoCodeForm || !noCodeForm?.published) {
    return (
      <MessagePage text="Form not found. Are you sure this is the right URL?" />
    );
  }

  const css = `:root {
    --hex-color-custom-background: ${noCodeForm.backgroundColor};
  }`

  return (

    <BaseLayoutUnauthorized title="snoopForms">
      <style>{css}</style>
      <div className={classNames(
        `bg-custom-background`,
        "flex flex-col justify-between min-h-screen"
      )}>
        {noCodeForm.closed ? (
          <div className="flex min-h-screen bg-ui-gray-light">
            <div className="flex flex-col justify-center flex-1 px-4 py-12 mx-auto sm:px-6 lg:flex-none lg:px-20 xl:px-24">
              <div className="w-full max-w-sm p-8 mx-auto lg:w-96">
                <div>
                  <Image
                    src="/img/snoopforms-logo.svg"
                    alt="snoopForms logo"
                    width={500}
                    height={89}
                  />
                </div>
                <div className="mt-8">
                  <h1 className="mb-4 font-bold text-center leading-2">
                    Form closed!
                  </h1>
                  <p className="text-center">
                    This form is closed for any further submissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <App formId={formId} blocks={noCodeForm.blocks} noCodeForm={noCodeForm} />
        )}
        {(publicPrivacyUrl || publicImprintUrl) && (
          <footer className="flex items-center justify-center w-full h-10 text-xs text-gray-300">
            {publicImprintUrl && (
              <>
                <a href={publicImprintUrl} target="_blank" rel="noreferrer">
                  Imprint
                </a>
              </>
            )}
            {publicImprintUrl && publicPrivacyUrl && (
              <span className="px-2">|</span>
            )}
            {publicPrivacyUrl && (
              <a href={publicPrivacyUrl} target="_blank" rel="noreferrer">
                Privacy Policy
              </a>
            )}
          </footer>
        )}
      </div>
    </BaseLayoutUnauthorized>
  );
}

NoCodeFormPublic.getInitialProps = () => {
  return {};
};

export default NoCodeFormPublic;
