// @ts-nocheck
import { AgGridReact } from "ag-grid-react";
import { useState, useMemo } from "react";
import treeData from "./tree-data.js";
import "./Table.css";

import {
  themeQuartz,
  iconOverrides,
  ClientSideRowModelModule,
  ModuleRegistry,
} from "ag-grid-community";
import {
  ClipboardModule,
  ContextMenuModule,
  RowGroupingModule,
  TreeDataModule,
} from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ClipboardModule,
  ContextMenuModule,
  RowGroupingModule,
  TreeDataModule,
]);

// Custom theme for tree table
const treeTheme = themeQuartz
  .withPart(
    iconOverrides({
      cssImports: ["https://use.fontawesome.com/releases/v5.6.3/css/all.css"],
      type: "font",
      weight: "bold",
      family: "Font Awesome 5 Free",
      color: "#007bff",
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
    borderColor: "#e9ecef",
    borderRadius: 4,
    browserColorScheme: "light",
    fontFamily: {
      googleFont: "Inter",
    },
    fontSize: 14,
    foregroundColor: "#212529",
    headerBackgroundColor: "#f8f9fa",
    headerFontSize: 14,
    wrapperBorderRadius: 4,
    rowBorder: { width: 1, color: "#e9ecef" },
  });

// Custom cell renderer for hierarchy levels
const HierarchyRenderer = (params) => {
  const level = params.data?.orgLevel || 1;
  const hasChildren = params.data?.subordinates > 0;

  const levelColors = {
    1: "#dc3545", // CEO - Red
    2: "#fd7e14", // VP - Orange
    3: "#ffc107", // Director - Yellow
    4: "#28a745", // Senior - Green
    5: "#6c757d", // Individual - Gray
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span
        style={{
          backgroundColor: levelColors[level] || "#6c757d",
          color: "white",
          padding: "2px 6px",
          borderRadius: "3px",
          fontSize: "10px",
          fontWeight: "bold",
        }}
      >
        L{level}
      </span>
      <span>{params.value}</span>
      {hasChildren && (
        <span style={{ color: "#6c757d", fontSize: "12px" }}>
          ({params.data.subordinates} reports)
        </span>
      )}
    </div>
  );
};

// Custom cell renderer for salary with formatting
const SalaryRenderer = (params) => {
  if (!params.value) return "";
  return (
    <span style={{ fontWeight: "bold", color: "#28a745" }}>
      ${params.value.toLocaleString()}
    </span>
  );
};

// Custom cell renderer for employee type with badges
const EmployeeTypeRenderer = (params) => {
  const typeColors = {
    Executive: "#dc3545",
    VP: "#fd7e14",
    Director: "#ffc107",
    "Senior Engineer": "#20c997",
    "Senior Manager": "#20c997",
    "Account Manager": "#6f42c1",
    Engineer: "#17a2b8",
    "Sales Rep": "#6c757d",
  };

  const bgColor = typeColors[params.value] || "#6c757d";

  return (
    <span
      style={{
        backgroundColor: bgColor,
        color: "white",
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "11px",
        fontWeight: "bold",
      }}
    >
      {params.value}
    </span>
  );
};

export default function TreeTable() {
  const [rowData] = useState(treeData);
  const [quickFilter, setQuickFilter] = useState("");

  // Selection state management: 'included', 'excluded', 'neutral', 'mixed'
  const [selectionState, setSelectionState] = useState({});

  // Utility functions for hierarchical selection
  const findAllChildren = (nodeId) => {
    const allChildren = [];
    const node = rowData.find((row) => row.id === nodeId);

    if (!node || !node.children) {
      console.log(`No children found for node ${nodeId}`);
      return allChildren;
    }

    const collectChildren = (childrenIds) => {
      childrenIds.forEach((childId) => {
        allChildren.push(childId);
        const childNode = rowData.find((row) => row.id === childId);
        if (childNode && childNode.children && childNode.children.length > 0) {
          collectChildren(childNode.children); // Recursive for nested children
        }
      });
    };

    collectChildren(node.children);
    console.log(`All children of node ${nodeId}:`, allChildren);
    return allChildren;
  };

  const findDirectChildren = (nodeId) => {
    const node = rowData.find((row) => row.id === nodeId);
    const directChildren = node?.children || [];
    console.log(`Direct children of node ${nodeId}:`, directChildren);
    return directChildren;
  };

  const findParent = (nodeId) => {
    const node = rowData.find((row) => row.id === nodeId);
    return node?.parentId;
  };

  const updateChildrenSelection = (parentId, state, currentState) => {
    const children = findAllChildren(parentId);
    const newState = { ...currentState }; // Use the passed current state, not the old selectionState

    children.forEach((childId) => {
      newState[childId] = state;
    });

    return newState;
  };

  const updateParentSelection = (childId, newState) => {
    const parentId = findParent(childId);
    if (!parentId) {
      console.log(
        `No parent found for child ${childId}, returning state:`,
        newState
      );
      return newState;
    }

    console.log(`Updating parent ${parentId} based on child ${childId}`);

    // Use the direct children array from the parent node instead of filtering
    const directChildren = findDirectChildren(parentId);
    console.log(`Direct children of parent ${parentId}:`, directChildren);

    const siblingStates = directChildren.map(
      (childId) => newState[childId] || "neutral"
    );
    console.log(`Child states:`, siblingStates);

    // Determine parent state based on children
    const includedCount = siblingStates.filter(
      (state) => state === "included"
    ).length;
    const excludedCount = siblingStates.filter(
      (state) => state === "excluded"
    ).length;
    const totalChildren = directChildren.length;

    let parentState;
    if (includedCount === totalChildren) {
      parentState = "included";
    } else if (excludedCount === totalChildren) {
      parentState = "excluded";
    } else if (includedCount > 0 || excludedCount > 0) {
      parentState = "mixed";
    } else {
      parentState = "neutral";
    }

    console.log(`Setting parent ${parentId} to state: ${parentState}`);
    newState[parentId] = parentState;

    console.log(`State before recursive call:`, newState);

    // Recursively update grandparent
    const updatedState = updateParentSelection(parentId, newState);

    console.log(`State after recursive call:`, updatedState);
    return updatedState;
  };

  const handleSelectionChange = (nodeId, selectionType) => {
    let newState = { ...selectionState };
    const currentState = newState[nodeId] || "neutral";

    console.log(
      `handleSelectionChange: nodeId=${nodeId}, selectionType=${selectionType}, currentState=${currentState}`
    );

    const previousState = currentState; // Store previous state to detect neutral transitions

    if (selectionType === "included") {
      // If already included, make neutral; otherwise include
      newState[nodeId] = currentState === "included" ? "neutral" : "included";
    } else if (selectionType === "excluded") {
      // If already excluded, make neutral; otherwise exclude
      newState[nodeId] = currentState === "excluded" ? "neutral" : "excluded";
    }

    console.log(
      `After direct update: nodeId=${nodeId}, newState=${newState[nodeId]}`
    );

    // Update children based on parent selection
    const shouldUpdateChildren =
      newState[nodeId] !== "neutral" || // Parent has a definite state (included/excluded)
      (previousState !== "neutral" && newState[nodeId] === "neutral"); // Parent went from included/excluded to neutral

    if (shouldUpdateChildren) {
      newState = updateChildrenSelection(nodeId, newState[nodeId], newState);
      console.log(
        `After updating children (${
          shouldUpdateChildren ? "should update" : "no update"
        }):`,
        newState
      );
    }

    // Update parent chain based on this change
    console.log(
      `About to update parent chain for node ${nodeId}, current state:`,
      newState
    );
    newState = updateParentSelection(nodeId, newState);
    console.log(`After updating parent chain:`, newState);

    console.log(`Final newState for node ${nodeId}:`, newState[nodeId]);
    console.log(`Full new state:`, newState);

    setSelectionState(newState);
  };

  // Custom Selection Cell Renderer with dual checkboxes
  const SelectionRenderer = (params) => {
    const nodeId = params.data?.id;
    const currentState = selectionState[nodeId] || "neutral";

    // Debug logging
    console.log(
      `Node ${nodeId} (${params.data?.name}): currentState = ${currentState}`
    );

    const includedChecked =
      currentState === "included" || currentState === "mixed";
    const excludedChecked =
      currentState === "excluded" || currentState === "mixed";
    const isMixed = currentState === "mixed";

    console.log(
      `Node ${nodeId}: includedChecked = ${includedChecked}, excludedChecked = ${excludedChecked}, isMixed = ${isMixed}`
    );

    const handleIncludeChange = (e) => {
      e.stopPropagation();
      console.log(
        `Include clicked for node ${nodeId}, current state: ${currentState}`
      );
      handleSelectionChange(nodeId, "included");
    };

    const handleExcludeChange = (e) => {
      e.stopPropagation();
      console.log(
        `Exclude clicked for node ${nodeId}, current state: ${currentState}`
      );
      handleSelectionChange(nodeId, "excluded");
    };

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "4px 0",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            cursor: "pointer",
            color: isMixed ? "#fd7e14" : "#28a745",
            fontWeight: includedChecked ? "bold" : "normal",
          }}
        >
          <input
            type="checkbox"
            checked={includedChecked}
            onChange={handleIncludeChange}
            style={{
              accentColor: isMixed ? "#fd7e14" : "#28a745",
              transform: "scale(1.1)",
            }}
            aria-label={`Include ${params.data?.name}`}
            key={`include-${nodeId}-${currentState}`}
          />
          <span style={{ fontSize: "12px" }}>Include</span>
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            cursor: "pointer",
            color: isMixed ? "#fd7e14" : "#dc3545",
            fontWeight: excludedChecked ? "bold" : "normal",
          }}
        >
          <input
            type="checkbox"
            checked={excludedChecked}
            onChange={handleExcludeChange}
            style={{
              accentColor: isMixed ? "#fd7e14" : "#dc3545",
              transform: "scale(1.1)",
            }}
            aria-label={`Exclude ${params.data?.name}`}
            key={`exclude-${nodeId}-${currentState}`}
          />
          <span style={{ fontSize: "12px" }}>Exclude</span>
        </label>

        {isMixed && (
          <span
            style={{
              fontSize: "10px",
              color: "#fd7e14",
              fontWeight: "bold",
              padding: "2px 4px",
              backgroundColor: "#fff3cd",
              borderRadius: "3px",
              border: "1px solid #ffeaa7",
            }}
          >
            MIXED
          </span>
        )}
      </div>
    );
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Selection",
        cellRenderer: SelectionRenderer,
        cellRendererParams: {
          selectionState: selectionState, // Pass state to force re-render
        },
        minWidth: 200,
        maxWidth: 200,
        sortable: false,
        filter: false,
        resizable: false,
        pinned: "left",
      },
      {
        field: "name",
        headerName: "Employee",
        cellRenderer: HierarchyRenderer,
        minWidth: 250,
      },
      {
        field: "title",
        headerName: "Job Title",
        minWidth: 200,
      },
      {
        field: "department",
        headerName: "Department",
        minWidth: 120,
      },
      {
        field: "employeeType",
        headerName: "Type",
        cellRenderer: EmployeeTypeRenderer,
        minWidth: 140,
      },
      {
        field: "salary",
        headerName: "Salary",
        cellRenderer: SalaryRenderer,
        minWidth: 120,
        sort: "desc",
      },
      {
        field: "location",
        headerName: "Location",
        minWidth: 120,
      },
      {
        field: "startDate",
        headerName: "Start Date",
        minWidth: 120,
        valueFormatter: (params) => {
          if (!params.value) return "";
          return new Date(params.value).toLocaleDateString();
        },
      },
      {
        field: "email",
        headerName: "Email",
        minWidth: 200,
        cellRenderer: (params) => (
          <a href={`mailto:${params.value}`} style={{ color: "#007bff" }}>
            {params.value}
          </a>
        ),
      },
    ],
    [selectionState, SelectionRenderer]
  );

  const getDataPath = useMemo(() => {
    return (data) => data.hierarchy;
  }, []);

  const autoGroupColumnDef = useMemo(
    () => ({
      headerName: "Organization Structure",
      minWidth: 300,
      checkboxSelection: false,
      headerCheckboxSelection: false,
      cellRendererParams: {
        suppressCount: true,
        checkbox: false,
      },
    }),
    []
  );

  const handleFilter = (event) => {
    setQuickFilter(event.target.value);
  };

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
      floatingFilter: true,
    }),
    []
  );

  return (
    <div className="card">
      <h1>Organizational Tree Structure</h1>
      <p>
        Hierarchical view of company organization with tri-state selection
        system.
      </p>
      <div
        style={{
          marginBottom: "1rem",
          padding: "12px",
          backgroundColor: "#e3f2fd",
          borderRadius: "4px",
          border: "1px solid #bbdefb",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#1565c0" }}>
          How Selection Works:
        </h4>
        <ul
          style={{
            margin: "0",
            paddingLeft: "16px",
            fontSize: "12px",
            color: "#1565c0",
          }}
        >
          <li>
            Use <strong>Include</strong> and <strong>Exclude</strong> checkboxes
            to set employee status
          </li>
          <li>
            When a parent is selected, all children inherit the same state
          </li>
          <li>
            When all children have the same state, the parent automatically
            updates
          </li>
          <li>
            Parents show <strong>MIXED</strong> when children have different
            states
          </li>
          <li>Click the same checkbox again to return to neutral state</li>
        </ul>
      </div>

      <div className="external-search" style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search organization..."
          onChange={handleFilter}
          style={{
            padding: "0.5rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            width: "300px",
          }}
        />
        <div className="button-container">
          <button type="button" onClick={() => setQuickFilter("")}>
            Clear Filter
          </button>
          <button
            type="button"
            onClick={() => setSelectionState({})}
            style={{ marginLeft: "8px" }}
          >
            Clear All Selections
          </button>
        </div>
      </div>

      {/* Selection Summary */}
      <div
        style={{
          marginBottom: "1rem",
          padding: "12px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
          border: "1px solid #e9ecef",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#495057" }}>
          Selection Summary:
        </h4>
        <div style={{ display: "flex", gap: "20px", fontSize: "12px" }}>
          <span style={{ color: "#28a745", fontWeight: "bold" }}>
            Included:{" "}
            {
              Object.values(selectionState).filter((s) => s === "included")
                .length
            }
          </span>
          <span style={{ color: "#dc3545", fontWeight: "bold" }}>
            Excluded:{" "}
            {
              Object.values(selectionState).filter((s) => s === "excluded")
                .length
            }
          </span>
          <span style={{ color: "#fd7e14", fontWeight: "bold" }}>
            Mixed:{" "}
            {Object.values(selectionState).filter((s) => s === "mixed").length}
          </span>
          <span style={{ color: "#6c757d" }}>
            Neutral:{" "}
            {rowData.length -
              Object.keys(selectionState).length +
              Object.values(selectionState).filter((s) => s === "neutral")
                .length}
          </span>
        </div>
      </div>

      <div
        className="ag-theme-alpine"
        style={{ height: "600px", width: "100%" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          treeData={true}
          getDataPath={getDataPath}
          autoGroupColumnDef={autoGroupColumnDef}
          groupDefaultExpanded={2} // Expand first 2 levels by default
          quickFilterText={quickFilter}
          theme={treeTheme}
          defaultColDef={defaultColDef}
          animateRows={true}
          enableRangeSelection={true}
        />
      </div>
    </div>
  );
}
