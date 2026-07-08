import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import OverviewHero from "./components/OverviewHero";
import EntityGrid from "./components/EntityGrid";

const App = () => {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex h-screen flex-col bg-canvas text-ink">
      <Topbar
        search={search}
        onSearchChange={setSearch}
        collapsed={collapsed}
        onToggleSidebar={() => setCollapsed((prev) => !prev)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar active="overview" collapsed={collapsed} />

        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-8">
            <OverviewHero />
            <EntityGrid search={search} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
