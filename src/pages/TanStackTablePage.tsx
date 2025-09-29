// @ts-nocheck
import { useState, useMemo } from "react";
import TanTable from "../tanstack-table/TanTable";

// Sample data for the TanStack table
const sampleData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    department: "Engineering",
    salary: 85000,
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    department: "Marketing",
    salary: 75000,
    status: "Active",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    department: "Sales",
    salary: 70000,
    status: "Inactive",
  },
  {
    id: 4,
    name: "Alice Wilson",
    email: "alice@example.com",
    department: "Engineering",
    salary: 90000,
    status: "Active",
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie@example.com",
    department: "HR",
    salary: 65000,
    status: "Active",
  },
];

export default function TanStackTablePage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Define columns for the TanStack table
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 60,
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
      },
      {
        accessorKey: "department",
        header: "Department",
        size: 120,
      },
      {
        accessorKey: "salary",
        header: "Salary",
        size: 100,
        cell: (info) => `$${info.getValue().toLocaleString()}`,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 100,
        cell: (info) => (
          <span
            style={{
              color: info.getValue() === "Active" ? "#28a745" : "#dc3545",
              fontWeight: "bold",
            }}
          >
            {info.getValue()}
          </span>
        ),
      },
    ],
    []
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="tanstack-table-page">
      <div className="card">
        <h1>Employee Directory - TanStack Table</h1>
        <p>
          This table demonstrates TanStack Table functionality with sorting,
          filtering, and custom cell rendering.
        </p>

        <div className="external-search" style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              width: "300px",
            }}
          />
        </div>

        <div style={{ height: "500px", overflow: "auto" }}>
          <TanTable
            columns={columns}
            data={sampleData}
            enableExpandableRows={false}
            externalSearch={searchQuery}
          />
        </div>
      </div>
    </div>
  );
}
