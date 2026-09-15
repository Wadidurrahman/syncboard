import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 1. Menangani Preflight CORS (Penting untuk akses lintas domain)
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

// 2. Menangani Request POST dari Widget
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
    const system_id = formData.get('system_id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const priority = formData.get('priority') as string || 'standard'
    
    const screenshot = formData.get('screenshot') as File | null
    const voice = formData.get('voice') as File | null

    let screenshot_url = null
    let voice_url = null

    // 3. Upload Screenshot jika ada
    if (screenshot && screenshot.size > 0) {
      const ext = screenshot.name.split('.').pop()
      const fileName = `screenshot-${Date.now()}.${ext}`
      const { data, error } = await supabase.storage
        .from('attachments')
        .upload(fileName, screenshot)
        
      if (!error) {
        screenshot_url = supabase.storage.from('attachments').getPublicUrl(fileName).data.publicUrl
      }
    }

    // 4. Upload Voice Note jika ada
    if (voice && voice.size > 0) {
      const ext = voice.name.split('.').pop()
      const fileName = `voice-${Date.now()}.${ext}`
      const { data, error } = await supabase.storage
        .from('attachments')
        .upload(fileName, voice)
        
      if (!error) {
        voice_url = supabase.storage.from('attachments').getPublicUrl(fileName).data.publicUrl
      }
    }

    // 5. Simpan Data ke Tabel Tickets
    const { data: ticket, error: dbError } = await supabase
      .from('tickets')
      .insert([
        {
          system_id,
          title,
          description,
          priority,
          screenshot_url,
          voice_url,
          status: 'pending'
        }
      ])

    if (dbError) throw dbError

    return NextResponse.json({ success: true, message: 'Laporan berhasil dikirim' }, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' }
    })

  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    })
  }
}