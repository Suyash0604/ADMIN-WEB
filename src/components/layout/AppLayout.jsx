import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { rbacResourceList } from "../../config/rbacResources";
import { clientResourceList } from "../../config/clientResources";
import { aiResourceList } from "../../config/aiResources";

const allResources = [...rbacResourceList, ...clientResourceList, ...aiResourceList];

const titleForPath = (pathname) => {
  const match = allResources.find((r) => r.path === pathname);
  return match?.title ?? "Overview";
};

const AppLayout = () => {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    setSearch("");
  }, [pathname]);

  return (
    <div className="flex h-screen flex-col bg-canvas text-ink">
      <Topbar
        title={titleForPath(pathname)}
        search={search}
        onSearchChange={setSearch}
        collapsed={collapsed}
        onToggleSidebar={() => setCollapsed((prev) => !prev)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={collapsed} />

        <main className="flex-1 overflow-y-auto pl-2 pr-8 py-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-8">
            <Outlet context={{ search }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
