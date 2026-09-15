'use client'

import { useTickets } from '@/hooks/useTickets'
import QueueTable from '@/components/QueueTable'

export default function DashboardPage() {
  const { data, loading, updateStatus } = useTickets()

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Master Queue - SyncBoard</h1>
        <QueueTable 
          data={data} 
          loading={loading} 
          onUpdateStatus={updateStatus} 
        />
      </div>
    </main>
  )
}