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
  onViewDetail: (ticket: any) => void;
}

// KAMUS SMART MAPPING: Menerjemahkan ID menjadi Nama Sistem BPS
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
          <p className="font-bold text-gray-800 text-sm">{info.getValue()}</p>
        </div>
      ),
    }),
    columnHelper.accessor('system_id', {
      header: 'Sistem Klien',
      cell: info => (
        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded border border-indigo-200 uppercase tracking-widest">
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
          'bg-gray-50 text-gray-600 border-gray-200'
        return (
          <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase border ${color}`}>
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
         if (status === 'pending') statusStyle = 'text-orange-500 bg-orange-50 px-2 py-1 rounded border border-orange-200'
         else if (status === 'in_progress') statusStyle = 'text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-200'
         else if (status === 'done') statusStyle = 'text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200'
         
         return (
           <span className={`capitalize text-[10px] font-black ${statusStyle}`}>
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
            <button 
              onClick={() => onViewDetail(ticket)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded text-xs transition-colors border border-slate-300">
              Detail
            </button>

            {/* DROPDOWN UBAH STATUS MANUAL */}
            <select 
              value={ticket.status}
              onChange={(e) => onUpdateStatus(ticket.id, e.target.value)}
              className="bg-white border border-slate-300 text-slate-700 font-bold px-2 py-1.5 rounded text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="pending">Menunggu (Pending)</option>
              <option value="in_progress">Sedang Dikerjakan</option>
              <option value="done">Selesai (Tuntas)</option>
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
  })

  if (loading) return <div className="p-12 text-center text-gray-500 text-sm font-bold">MENGAMBIL DATA...</div>

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead className="bg-gray-50 border-b border-gray-100">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {table.getRowModel()?.rows?.map(row => (
            <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
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
  )
}