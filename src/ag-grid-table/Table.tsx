import ReactDOMServer from "react-dom/server";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import data from "./grid-data.js";

import "./Table.css";

import { themeQuartz, iconOverrides } from "ag-grid-community";

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
    borderColor: "#CCCCCC",
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

const NavigableCellRenderer = (params: CustomCellRendererProps) => {
  console.log({ params });
  return <a href="#">{params.value}</a>;
};

export default function Table({ isRowNavigation = true }) {
  const [rowData /*, setRowData */] = useState(data);
  const [quickFilter, setQuickFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [colDefs] = useState([
    { field: "mission", filter: true, pinned: "left", lockPosition: true },
    { field: "company" },
    { field: "location" },
    { field: "date" },
    { field: "price" },
    { field: "successful" },
    {
      field: "Sparkline",
      cellRenderer: (params) => {
        // console.log({ params });
        return <SparklineChart id={`id-${params.node.id}`} />;
      },
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
            // overlayLoadingTemplate={ReactDOMServer.renderToString(<Loader />)}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
}
