'use client'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

const columnHelper = createColumnHelper<any>()

interface QueueTableProps {
  data: any[];
  loading: boolean;
  onUpdateStatus: (id: string, newStatus: string) => void;
}

export default function QueueTable({ data, loading, onUpdateStatus }: QueueTableProps) {
  const columns = [
    columnHelper.accessor('title', {
      header: 'Laporan / Kendala',
      cell: info => <span className="font-medium text-gray-800">{info.getValue()}</span>,
    }),
    columnHelper.accessor('priority', {
      header: 'Prioritas',
      cell: info => {
        const priority = info.getValue()
        const color = 
          priority === 'urgent' ? 'bg-red-100 text-red-700' : 
          priority === 'standard' ? 'bg-yellow-100 text-yellow-700' : 
          'bg-gray-100 text-gray-700'
        return (
          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${color}`}>
            {priority}
          </span>
        )
      },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span className="capitalize text-sm text-gray-600 font-medium">
          {info.getValue().replace('_', ' ')}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Aksi',
      cell: info => {
        const ticket = info.row.original
        return (
          <div className="flex gap-2">
            {ticket.status === 'pending' && (
              <button 
                onClick={() => onUpdateStatus(ticket.id, 'in_progress')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                Kerjakan
              </button>
            )}
            {ticket.status === 'in_progress' && (
              <button 
                onClick={() => onUpdateStatus(ticket.id, 'done')}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
                Selesaikan
              </button>
            )}
          </div>
        )
      },
    }),
  ]

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (loading) return <p className="text-gray-500">Memuat antrian...</p>

  return (
    <div className="overflow-x-auto bg-white shadow-sm border rounded-lg">
      <table className="min-w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="p-4 text-sm font-semibold text-gray-600">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-100">
          {table.getRowModel()?.rows?.map(row => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="p-4 text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {(!data || data.length === 0) && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-gray-500">
                Tidak ada antrian saat ini.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}