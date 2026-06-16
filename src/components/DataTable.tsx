import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  title: string;
  width?: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pagination?: boolean;
  rowKey: keyof T;
}

export default function DataTable<T extends object>({
  columns,
  data,
  rowKey,
}: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-sm shadow-card overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="table-header px-4 py-3 text-left"
                  style={{ width: col.width }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-slate-400"
                >
                  暂无数据
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={String(row[rowKey])}
                  className="hover:bg-slate-50 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className="table-cell">
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key as string] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
        <p className="text-sm text-slate-500">
          共 <span className="font-medium text-slate-700">{data.length}</span> 条记录
        </p>
        <div className="flex items-center gap-2">
          <button className="p-1.5 border border-slate-200 rounded-sm hover:bg-slate-50 disabled:opacity-50">
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <button className="px-3 py-1 bg-police-600 text-white text-sm rounded-sm">
            1
          </button>
          <button className="px-3 py-1 border border-slate-200 text-sm rounded-sm hover:bg-slate-50">
            2
          </button>
          <button className="px-3 py-1 border border-slate-200 text-sm rounded-sm hover:bg-slate-50">
            3
          </button>
          <button className="p-1.5 border border-slate-200 rounded-sm hover:bg-slate-50">
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
