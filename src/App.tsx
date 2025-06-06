// @ts-nocheck
import { useEffect, useState } from "react";
import { ModuleRegistry } from "ag-grid-community";
import {
  AllEnterpriseModule,
  LicenseManager,
  IntegratedChartsModule,
} from "ag-grid-enterprise";
import Table from "./ag-grid-table/Table";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";

// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import SparklineChart from "./sparkLine-chart/SparklineAM5";
import { MyForm } from "./RHFwithZod";
// import { SparklineChart } from "./sparkLine-chart/Sparkline";

// Register all Community and Enterprise features
ModuleRegistry.registerModules([
  AllEnterpriseModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
]);

LicenseManager.setLicenseKey(
  "[TRIAL]_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-086015}_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_purchasing_a_production_key_please_contact_info@ag-grid.com___You_are_granted_a_{Single_Application}_Developer_License_for_one_application_only___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_{14 May 2025}____[v3]_[0102]_MTc0NzE3NzIwMDAwMA==1127112b2eb5fda550f75b9d26691ef0"
);

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
          <div>{/* <SparklineChart /> */}</div>
        </header>
        <main>
          {/* <MyForm /> */}
          <Table />
        </main>
      </section>
    </>
  );
}

export default App;
