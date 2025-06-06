// @ts-nocheck
import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function AdvancedTable({
  columns,
  data,
  enableExpandableRows = false,
  externalSearch = "",
}) {
  const [sorting, setSorting] = useState([]);
  const [columnOrder, setColumnOrder] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnOrder,
      globalFilter: externalSearch,
    },
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(enableExpandableRows
      ? { getExpandedRowModel: getExpandedRowModel() }
      : {}),
    enableSorting: true,
    enableColumnResizing: true,
    enableColumnReordering: true,
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className="sticky top-0 bg-white border-b p-2 text-left cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: " \u25B2",
                    desc: " \u25BC",
                  }[header.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <React.Fragment key={row.id}>
              <tr>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border-b p-2 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {row.getIsExpanded() && enableExpandableRows ? (
                <tr>
                  <td
                    colSpan={row.getVisibleCells().length}
                    className="p-2 bg-gray-100"
                  >
                    Expanded content for {row.id}
                  </td>
                </tr>
              ) : null}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
