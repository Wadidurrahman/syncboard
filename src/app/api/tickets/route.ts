import { NextResponse } from 'next/server'
import { supabase } from './../../lib/supabase'

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

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

    if (screenshot && screenshot.size > 0) {
      const ext = screenshot.name.split('.').pop()
      const fileName = `screenshot-${Date.now()}.${ext}`
      const { error } = await supabase.storage
        .from('attachments')
        .upload(fileName, screenshot)
        
      if (!error) {
        screenshot_url = supabase.storage.from('attachments').getPublicUrl(fileName).data.publicUrl
      }
    }

    if (voice && voice.size > 0) {
      const ext = voice.name.split('.').pop()
      const fileName = `voice-${Date.now()}.${ext}`
      const { error } = await supabase.storage
        .from('attachments')
        .upload(fileName, voice)
        
      if (!error) {
        voice_url = supabase.storage.from('attachments').getPublicUrl(fileName).data.publicUrl
      }
    }

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
      .select()

    if (dbError) throw dbError

    return NextResponse.json({ 
      success: true, 
      message: 'Laporan berhasil dikirim',
      ticket_id: ticket[0].id
    }, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' }
    })

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    })
  }
}