'use client'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

const columnHelper = createColumnHelper<any>()

interface QueueTableProps {
  data: any[];
  loading: boolean;
  onUpdateStatus: (id: string, newStatus: string) => void;
  onViewDetail?: (ticket: any) => void;
}

const getSystemName = (id: string) => {
  if (id === '22dd4848-57d6-4ae4-8369-ab8f55315039') return 'INOVAZI BPS';
  if (id === 'a7eba848-0529-4bc2-8bf1-9112df1c13e5') return 'ANTREAN BPS';
  return id ? String(id).substring(0, 8) : 'UMUM';
}

export default function QueueTable({ data, loading, onUpdateStatus, onViewDetail }: QueueTableProps) {
  const columns = [
    columnHelper.accessor('title', {
      header: 'Laporan / Kendala',
      cell: info => (
        <div className="min-w-[220px] whitespace-normal">
          <p className="text-slate-800 font-semibold text-sm">{info.getValue()}</p>
        </div>
      ),
    }),
    columnHelper.accessor('system_id', {
      header: 'Sistem Klien',
      cell: info => (
        <span className="text-slate-600 text-xs font-bold bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
          {getSystemName(info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor('priority', {
      header: 'Prioritas',
      cell: info => {
        const priority = info.getValue()
        const color = 
          priority === 'urgent' ? 'bg-red-50 text-red-600 border-red-200' : 
          priority === 'standard' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 
          'bg-slate-50 text-slate-600 border-slate-200'
        return (
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase border ${color}`}>
            {priority}
          </span>
        )
      },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
         const status = info.getValue()
         let statusStyle = ''
         if (status === 'pending') statusStyle = 'text-orange-500'
         else if (status === 'in_progress') statusStyle = 'text-blue-600'
         else if (status === 'done') statusStyle = 'text-emerald-600'
         
         return (
           <span className={`capitalize font-bold text-xs ${statusStyle}`}>
             {status.replace('_', ' ')}
           </span>
         )
      }
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Aksi & Update',
      cell: info => {
        const ticket = info.row.original
        return (
          <div className="flex gap-2 min-w-[200px] items-center">
            {onViewDetail && (
              <button 
                onClick={() => onViewDetail(ticket)}
                className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors border border-slate-300 shadow-sm">
                Detail
              </button>
            )}

            <select 
              value={ticket.status}
              onChange={(e) => onUpdateStatus(ticket.id, e.target.value)}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-2 py-1.5 rounded-lg text-xs focus:outline-none cursor-pointer transition-colors border border-slate-700 shadow-sm"
            >
              <option value="pending" className="bg-white text-slate-700">Menunggu</option>
              <option value="in_progress" className="bg-white text-slate-700">In Progress</option>
              <option value="done" className="bg-white text-slate-700">Selesaikan</option>
            </select>
          </div>
        )
      },
    }),
  ]

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 8 }, 
    },
  })

  if (loading) return <div className="p-12 text-center text-slate-500 text-sm font-bold flex-1 flex items-center justify-center">MENGAMBIL DATA...</div>

  return (
    <div className="flex-1 flex flex-col w-full h-full overflow-hidden bg-white">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm border-b border-slate-200">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel()?.rows?.map(row => (
              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {table.getPageCount() > 1 && (
        <div className="shrink-0 flex items-center justify-between px-6 py-3 bg-white border-t border-slate-200">
          <span className="text-xs text-slate-500 font-bold">
            Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => table.previousPage()} 
              disabled={!table.getCanPreviousPage()} 
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-40 transition-colors shadow-sm">
              Sebelumnya
            </button>
            <button 
              onClick={() => table.nextPage()} 
              disabled={!table.getCanNextPage()} 
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-40 transition-colors shadow-sm">
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  )
}