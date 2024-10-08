"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CommnadLineIcon, VideoIcon } from "@/components/icons";

const data: Client[] = [
  {
    ip: "127.0.0.1",
    isOnline: true,
  },
  {
    ip: "127.1.0.1",
    isOnline: false,
  },
  {
    ip: "127.0.0.1",
    isOnline: true,
  },
  {
    ip: "127.1.0.1",
    isOnline: false,
  },
  {
    ip: "127.0.0.1",
    isOnline: true,
  },
  {
    ip: "127.1.0.1",
    isOnline: false,
  },
  {
    ip: "127.0.0.1",
    isOnline: true,
  },
  {
    ip: "127.1.0.1",
    isOnline: false,
  },
  {
    ip: "127.0.0.1",
    isOnline: true,
  },
  {
    ip: "127.1.0.1",
    isOnline: false,
  },
  {
    ip: "127.0.0.1",
    isOnline: true,
  },
  {
    ip: "127.1.0.1",
    isOnline: false,
  },
  {
    ip: "127.0.0.1",
    isOnline: true,
  },
  {
    ip: "127.1.0.1",
    isOnline: false,
  },
  {
    ip: "127.0.0.1",
    isOnline: true,
  },
  {
    ip: "127.1.0.1",
    isOnline: false,
  },
  {
    ip: "127.0.0.1",
    isOnline: true,
  },
  {
    ip: "127.1.0.1",
    isOnline: false,
  },
];

export type Client = {
  ip: string;
  isOnline: boolean;
};

interface ConnectionTableProps {
  onCommandLine: (ip: string, isOnline: boolean) => void;
  onRemoteControl: (ip: string, isOnline: boolean) => void;
  onBoth: (ip: string, isOnline: boolean) => void;
}
const ConnectionTable: React.FC<ConnectionTableProps> = ({
  onCommandLine,
  onRemoteControl,
  onBoth,
}) => {
  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "isOnline",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div
          className={`capitalize ${
            row.getValue("isOnline") ? "text-green-600" : "text-red-600"
          } `}
        >
          {row.getValue("isOnline") ? "Online" : "Offline"}
        </div>
      ),
    },
    {
      accessorKey: "ip",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            IP address
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("ip")}</div>,
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>open with</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onCommandLine(row.getValue("ip"), row.getValue("isOnline"))}
              >
                Command line
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onRemoteControl(row.getValue("ip"), row.getValue("isOnline"))}
              >
                Remote Control
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onBoth(row.getValue("ip"), row.getValue("isOnline"))}
              >
                Both 
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 5, // This limits the rows displayed per page
      },
    },
  });

  return (
    <div className="w-full">
      <div className="">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter IPs..."
            value={(table.getColumn("ip")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("ip")?.setFilterValue(event.target.value)
            }
            className="max-w-32"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionTable;
