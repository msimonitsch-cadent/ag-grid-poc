import { useEffect, useState } from "react";
import { ModuleRegistry } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";

// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import Table from "./ag-grid-table/Table";
import { SparklineChart } from "./sparkLine-chart/Sparkline";

// Register all Community and Enterprise features
ModuleRegistry.registerModules([AllEnterpriseModule]);

function App() {
  // useEffect(() => {
  //   fetch("https://dev-assets.cadent.tv/variables/platformMetadata.json")
  //     .then((response) => response.json())
  //     .then((data) => console.log(data))
  //     .catch((error) => console.error(error));
  // }, []);

  return (
    <>
      <section>
        <header>
          <div>
            <a href="https://cadent.app" target="_blank">
              <img
                src="https://dev-assets.cadent.tv/branding/full-cadent-logo.svg"
                className="logo"
                alt="Cadent logo"
              />
            </a>
          </div>
        </header>
        <main>
          <Table />
        </main>
      </section>
    </>
  );
}

export default App;
