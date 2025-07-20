import { type ReactNode } from "react";

interface TableProps {
  headers?: string[];
  children: ReactNode;
}

interface TableCellProps {
  children: ReactNode;
  colSpan?: number;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
}

interface TableHeaderCellProps {
  children: ReactNode;
}

interface TableBodyProps {
  children: ReactNode;
}

interface TableHeaderProps {
  children: ReactNode;
}

const Table = ({ headers, children }: TableProps) => {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        {headers && (
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
      </table>
    </div>
  );
};

const TableHeader = ({ children }: TableHeaderProps) => (
  <thead className="bg-gray-50">{children}</thead>
);

const TableHeaderCell = ({ children }: TableHeaderCellProps) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const TableBody = ({ children }: TableBodyProps) => (
  <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
);

const TableRow = ({ children }: TableRowProps) => (
  <tr className="hover:bg-gray-50">{children}</tr>
);

const TableCell = ({ children, colSpan, className = "" }: TableCellProps) => (
  <td
    colSpan={colSpan}
    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}
  >
    {children}
  </td>
);

// Compound component pattern
Table.Header = TableHeader;
Table.HeaderCell = TableHeaderCell;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;

export { Table };
