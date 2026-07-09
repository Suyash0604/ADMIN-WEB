import { useOutletContext } from "react-router-dom";
import OverviewHero from "../components/dashboard/OverviewHero";
import EntityGrid from "../components/dashboard/EntityGrid";

const OverviewPage = () => {
  const { search } = useOutletContext();

  return (
    <>
      <OverviewHero />
      <EntityGrid search={search} />
    </>
  );
};

export default OverviewPage;
