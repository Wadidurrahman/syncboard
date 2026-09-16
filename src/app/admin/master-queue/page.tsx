'use client'

import { useTickets } from '@/hooks/useTickets'
import QueueTable from '@/components/QueueTable'

export default function MasterQueuePage() {
  const { data, loading, updateStatus } = useTickets()

  return (
    <main className="p-8">
      <QueueTable 
        data={data} 
        loading={loading} 
        onUpdateStatus={updateStatus} 
      />
    </main>
  )
}