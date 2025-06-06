// @ts-nocheck
import ReactDOMServer from "react-dom/server";
import { AgGridReact } from "ag-grid-react";
import { useState, memo, useMemo } from "react";
import data from "./grid-data.js";

import "./Table.css";

import {
  AgChartsCommunityModule,
  AgSparklineOptions,
} from "ag-charts-community";

import {
  themeQuartz,
  iconOverrides,
  ClientSideRowModelModule,
  ValidationModule,
  ModuleRegistry,
} from "ag-grid-community";
import {
  ClipboardModule,
  ContextMenuModule,
  SparklinesModule,
} from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  // ClientSideRowModelModule,
  SparklinesModule.with(AgChartsCommunityModule),
  // ClipboardModule,
  // ContextMenuModule,
  // ValidationModule /* Development Only */,
]);

const amendedData = data.map((d) => ({
  ...d,
  sparkline: [1, 2, -6, -7, -2, -7, 3, 4, -3, -8],
}));

// to use myTheme in an application, pass it to the theme grid option
const myTheme = themeQuartz
  .withPart(
    iconOverrides({
      cssImports: ["https://use.fontawesome.com/releases/v5.6.3/css/all.css"],
      type: "font",
      weight: "bold",
      family: "Font Awesome 5 Free",
      color: "green",
      icons: {
        asc: "\u{f062}",
        desc: "\u{f063}",
        "tree-closed": "\u{f105}",
        "tree-indeterminate": "\u{f068}",
        "tree-open": "\u{f107}",
        filter: "\u{f0b0}",
      },
    })
  )
  .withParams({
    borderColor: "var(--clr-pink)",
    borderRadius: 4,
    browserColorScheme: "light",
    fontFamily: {
      googleFont: "Inter",
    },
    fontSize: 16,
    foregroundColor: "#181D1F",
    headerBackgroundColor: "#FFFFFF",
    headerFontSize: 16,
    wrapperBorderRadius: 0,
    rowBorder: { width: 0 },
  });

import type { CustomCellRendererProps } from "ag-grid-react";
import { SparklineChart } from "../sparkLine-chart/Sparkline.js";
import AM5Chart from "../sparkLine-chart/SparklineAM5";
import Rechart, { ReactSparkline } from "../sparkLine-chart/RechartsSparkline";

const NavigableCellRenderer = (params: CustomCellRendererProps) => {
  console.log({ params });
  return <a href="#">{params.value}</a>;
};

export default function Table({ isRowNavigation = true }) {
  const [rowData /*, setRowData */] = useState(amendedData);
  const [quickFilter, setQuickFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [colDefs] = useState([
    {
      field: "mission",
      filter: true,
      pinned: "left",
      lockPosition: true,
      // aggFunc: "count",
      // rowGroup: true,
    },
    { field: "company", aggFunc: "comp" },
    { field: "location", aggfunc: "first" },
    { field: "date", aggFunc: "last" },
    { field: "price", aggFunc: "sum" },
    { field: "successful" },
    {
      field: "sparkline",
      // cellRenderer: ReactSparkline,
      cellRenderer: Rechart,
      // cellRenderer: AM5Chart,
      // cellRenderer: (params) => {
      //   console.log({ params });
      //   return <AM5Chart />;
      // },
      // cellRenderer: "agSparklineCellRenderer",
      // cellRendererParams: {
      //   sparklineOptions: {
      //     type: "area",
      //   } as AgSparklineOptions,
      // },
    },
    { field: "rocket", pinned: "right", lockPosition: true },
  ]);

  //   const cols = colDefs.map((colDef) => ({
  //     ...colDef,
  // cellRenderer: NavigableCellRenderer,
  //   }));
  // Fetch data & update rowData state
  //   useEffect(() => {
  //     fetch("https://www.ag-grid.com/example-assets/space-mission-data.json") // Fetch data from server
  //       .then((result) => result.json()) // Convert to JSON
  //       .then((rowData) => setRowData(rowData)); // Update state of `rowData`
  //   }, []);
  //   console.log({ rowData, colDefs });

  const handleFilter = (event) => {
    console.log({ value: event.target?.value });
    setQuickFilter(event.target?.value);
  };

  const Loader = () => {
    return <div className="loading-container">Loading...</div>;
  };

  const aggFunc = useMemo(() => {
    return {
      price: (param) => {
        const value = param.values[0];
        return value;
      },
      comp: (param) => {
        console.log({ param });
        const uniqueCount = new Set(param.values)?.size;
        return `Total Comps: ${uniqueCount}`;
      },
    };
  }, []);

  return (
    <>
      <div className="card">
        <h1>Some cool stuff here</h1>
        <button style={{ width: "100px" }} onClick={() => setLoading(!loading)}>
          toggle loading
        </button>
        <div className="external-search">
          <input
            type="text"
            placeholder="Quick Filter"
            onChange={handleFilter}
          />
          <div className="button-container">
            <button type="button">hi</button>
          </div>
        </div>
        <div
          className="ag-theme-alpine"
          style={{ height: "100%", width: "100%" }}
        >
          <AgGridReact
            rowData={rowData}
            // columnDefs={isRowNavigation ? cols : colDefs}
            columnDefs={colDefs}
            quickFilterText={quickFilter}
            theme={myTheme}
            loadingOverlayComponent={Loader}
            loading={loading}
            // suppressAnimationFrame={true}
            // rowBuffer={20}
            // gridOptions={{ headerHeight: 0 }}
            grandTotalRow="bottom"
            aggFuncs={aggFunc}
          />
        </div>
      </div>
    </>
  );
}
