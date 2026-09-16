import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabase'

export function useTickets() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTickets = async () => {
    try {
      const { data: tickets, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error(error)
      } else {
        setData(tickets || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) console.error(error)
    } catch (err) {
      console.error(err)
    }
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