'use client'

import QueueTable from '@/components/QueueTable'
import { useTickets } from '@/hooks/useTickets'

export default function MasterQueuePage() {
  const { tickets, loading, updateTicketStatus } = useTickets()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Master Queue</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola dan perbarui status laporan/kendala secara real-time.</p>
      </div>

      <QueueTable 
        data={tickets} 
        loading={loading} 
        onUpdateStatus={updateTicketStatus} 
      />
    </div>
  )
}