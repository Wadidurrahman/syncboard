import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// FUNGSI GET: Untuk mengambil Riwayat & Marquee di Widget
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const systemId = searchParams.get('system_id')
  const marquee = searchParams.get('marquee')

  try {
    // 1. Jika Widget meminta data Marquee (Bug yang sedang dikerjakan)
    if (marquee === 'true') {
      const { data, error } = await supabase
        .from('tickets')
        .select('title, status, system_id')
        .eq('status', 'in_progress')
        .order('created_at', { ascending: false })
        .limit(3)
      if (error) throw error
      return NextResponse.json({ data })
    }

    // 2. Jika Widget meminta Riwayat berdasarkan Sistem Klien
    if (systemId) {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('system_id', systemId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return NextResponse.json({ data })
    }

    // 3. Default Get All (Untuk Admin)
    const { data } = await supabase.from('tickets').select('*').order('created_at', { ascending: false })
    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// FUNGSI POST: Untuk mengirim laporan baru dari Widget
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { data, error } = await supabase
      .from('tickets')
      .insert([
        {
          title: body.title,
          description: body.description,
          priority: body.priority || 'standard',
          system_id: body.system_id || 'unknown',
          voice_url: body.voice_url || null,
          screenshot_url: body.screenshot_url || null,
          status: 'pending'
        }
      ])
      .select()

    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}