'use client'

import { useTickets } from '@/hooks/useTickets'
import QueueTable from '@/components/QueueTable'

export default function Dashboard() {
  const { data, loading, updateStatus } = useTickets()

  // Menghitung statistik secara real-time dari data tabel
  const totalTickets = data?.length || 0
  const pendingTickets = data?.filter(t => t.status === 'pending').length || 0
  const doneTickets = data?.filter(t => t.status === 'done').length || 0

  return (
    <main className="p-8 max-w-7xl mx-auto">
      {/* HEADER & OVERVIEW CARDS */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <p className="text-xs font-bold text-gray-500 tracking-wider mb-2">TOTAL MASUK</p>
            <p className="text-4xl font-extrabold text-blue-600">{totalTickets}</p>
          </div>
          
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <p className="text-xs font-bold text-gray-500 tracking-wider mb-2">MENUNGGU (PENDING)</p>
            <p className="text-4xl font-extrabold text-orange-500">{pendingTickets}</p>
          </div>
          
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <p className="text-xs font-bold text-gray-500 tracking-wider mb-2">SELESAI DIKERJAKAN</p>
            <p className="text-4xl font-extrabold text-green-500">{doneTickets}</p>
          </div>
        </div>
      </div>

      {/* QUEUE TABLE */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Daftar Antrean Utama</h2>
        <QueueTable 
          data={data} 
          loading={loading} 
          onUpdateStatus={updateStatus} 
        />
      </div>
    </main>
  )
}