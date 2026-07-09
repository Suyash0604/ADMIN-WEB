import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import AccessRoute from "./routes/AccessRoute";
import DefaultRedirect from "./routes/DefaultRedirect";
import PublicRoute from "./routes/PublicRoute";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import OverviewPage from "./pages/OverviewPage";
import UsersPage from "./pages/rbac/UsersPage";
import RolesPage from "./pages/rbac/RolesPage";
import DesignationsPage from "./pages/rbac/DesignationsPage";
import DesignationRolesPage from "./pages/rbac/DesignationRolesPage";
import BuLocationsPage from "./pages/rbac/BuLocationsPage";
import MappingsPage from "./pages/rbac/MappingsPage";
import ClientsPage from "./pages/client/ClientsPage";
import LegalDocumentsPage from "./pages/client/LegalDocumentsPage";
import MasterDocumentsPage from "./pages/client/MasterDocumentsPage";
import ProductsPage from "./pages/client/ProductsPage";
import ChannelsPage from "./pages/client/ChannelsPage";
import ProductChannelsPage from "./pages/client/ProductChannelsPage";
import CallingConfigPage from "./pages/client/CallingConfigPage";
import ProvidersPage from "./pages/ai/ProvidersPage";
import LlmModelsPage from "./pages/ai/LlmModelsPage";
import SttModelsPage from "./pages/ai/SttModelsPage";
import TtsModelsPage from "./pages/ai/TtsModelsPage";
import LanguagesPage from "./pages/ai/LanguagesPage";
import LanguageSttMapPage from "./pages/ai/LanguageSttMapPage";
import LanguageTtsMapPage from "./pages/ai/LanguageTtsMapPage";
import { ROUTES } from "./lib/constants";

const App = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path={ROUTES.login} element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AccessRoute />}>
          <Route element={<AppLayout />}>
          <Route path={ROUTES.overview} element={<OverviewPage />} />
          <Route path={ROUTES.rbac.users} element={<UsersPage />} />
          <Route path={ROUTES.rbac.roles} element={<RolesPage />} />
          <Route path={ROUTES.rbac.designations} element={<DesignationsPage />} />
          <Route
            path={ROUTES.rbac.designationRoles}
            element={<DesignationRolesPage />}
          />
          <Route path={ROUTES.rbac.buLocations} element={<BuLocationsPage />} />
          <Route path={ROUTES.rbac.mappings} element={<MappingsPage />} />
          <Route path={ROUTES.client.clients} element={<ClientsPage />} />
          <Route
            path={ROUTES.client.legalDocuments}
            element={<LegalDocumentsPage />}
          />
          <Route
            path={ROUTES.client.masterDocuments}
            element={<MasterDocumentsPage />}
          />
          <Route path={ROUTES.client.products} element={<ProductsPage />} />
          <Route path={ROUTES.client.channels} element={<ChannelsPage />} />
          <Route
            path={ROUTES.client.productChannels}
            element={<ProductChannelsPage />}
          />
          <Route
            path={ROUTES.client.callingConfig}
            element={<CallingConfigPage />}
          />
          <Route path={ROUTES.ai.providers} element={<ProvidersPage />} />
          <Route path={ROUTES.ai.llmModels} element={<LlmModelsPage />} />
          <Route path={ROUTES.ai.sttModels} element={<SttModelsPage />} />
          <Route path={ROUTES.ai.ttsModels} element={<TtsModelsPage />} />
          <Route path={ROUTES.ai.languages} element={<LanguagesPage />} />
          <Route
            path={ROUTES.ai.languageSttMap}
            element={<LanguageSttMapPage />}
          />
          <Route
            path={ROUTES.ai.languageTtsMap}
            element={<LanguageTtsMapPage />}
          />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<DefaultRedirect />} />
    </Routes>
  );
};

export default App;
