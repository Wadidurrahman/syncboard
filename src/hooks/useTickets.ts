import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Ticket } from '@/types/database'

export function useTickets() {
  const [data, setData] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTickets = async () => {
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setData(tickets || [])
    setLoading(false)
  }

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('tickets')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) console.error('Gagal update status:', error)
  }

  useEffect(() => {
    fetchTickets()

    const channel = supabase
      .channel('realtime tickets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => {
        fetchTickets() 
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { data, loading, updateStatus }
}