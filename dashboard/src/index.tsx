import type { FC } from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import OnboardingPage from "./pages/onboarding";
import ApiKeysPage from "./pages/api-keys";
import ConnectionsPage from "./pages/connections";
import { UserStateProvider } from "./context/UserStateContext";
import NotionConnectorPage from "./pages/connectors/notion";
import GoogleDriveConnectorPage from "./pages/connectors/google-drive";
import ZendeskConnectorPage from "./pages/connectors/zendesk";
import SlackConnectorPage from "./pages/connectors/slack";
import DropboxConnectorPage from "./pages/connectors/dropbox";
import HubspotConnectorPage from "./pages/connectors/hubspot";
import SalesforceConnectorPage from "./pages/connectors/salesforce";
import { RedirectPage } from "./pages/oauth/redirect";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "./lib/supabaseClient";
import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
import ConfluenceConnectorPage from "./pages/connectors/confluence";
import SettingsPage from "./pages/settings";
import SyncsPage from "./pages/syncs";
import CreateConnectionPage from "./pages/create-connection";
import { useUserStateContext } from "./context/UserStateContext";
import ReadmeConnectorPage from "./pages/connectors/readme";
import WebsiteConnectorPage from "./pages/connectors/website";

const container = document.getElementById("root");

if (typeof (window as any).global === "undefined") {
  (window as any).global = window;
}

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);

function App() {
  const [session, setSession] = useLocalStorage("session", null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/oauth/redirect" element={<RedirectPage />} />
          <Route
            path="*"
            element={
              <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="mb-4 w-full max-w-md rounded bg-white px-8 pb-8 pt-6 shadow-md">
                  <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    providers={["google"]}
                  />
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    );
  } else {
    return (
      <Flowbite theme={{ theme }}>
        <UserStateProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RootPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/api-keys" element={<ApiKeysPage />} />
              <Route path="/connections" element={<ConnectionsPage />} />
              <Route
                path="/connectors/notion"
                element={<NotionConnectorPage />}
              />
              <Route
                path="/connectors/google-drive"
                element={<GoogleDriveConnectorPage />}
              />
              <Route
                path="/connectors/zendesk"
                element={<ZendeskConnectorPage />}
              />
              <Route
                path="/connectors/confluence"
                element={<ConfluenceConnectorPage />}
              />
              <Route
                path="/connectors/slack"
                element={<SlackConnectorPage />}
              />
              <Route
                path="/connectors/dropbox"
                element={<DropboxConnectorPage />}
              />
              <Route
                path="/connectors/hubspot"
                element={<HubspotConnectorPage />}
              />
              <Route
                path="/connectors/salesforce"
                element={<SalesforceConnectorPage />}
              />
              <Route
                path="/connectors/readme"
                element={<ReadmeConnectorPage />}
              />
              <Route
                path="/connectors/website"
                element={<WebsiteConnectorPage />}
              />
              <Route path="/oauth/redirect" element={<RedirectPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/syncs" element={<SyncsPage />} />
              <Route path="/playground" element={<CreateConnectionPage />} />
              <Route
                path="/create-connection"
                element={<CreateConnectionPage />}
              />
            </Routes>
          </BrowserRouter>
        </UserStateProvider>
      </Flowbite>
    );
  }
}

const RootPage: FC = () => {
  const [showOnboardingPage, setShowOnboardingPage] = useLocalStorage(
    "showOnboardingPage",
    false
  );
  const { completedOnboarding } = useUserStateContext();

  useEffect(() => {
    if (completedOnboarding != showOnboardingPage) {
      setShowOnboardingPage(completedOnboarding);
    }
  }, []);

  if (showOnboardingPage) {
    return <OnboardingPage />;
  }
  return <OnboardingPage />;
};

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
