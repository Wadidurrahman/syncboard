import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = 'https://bdvfhwcmbqkmpgplsxst.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdmZod2NtYnFrbXBncGxzeHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNjQ2OTYsImV4cCI6MjEwNDk0MDY5Nn0.ahqlXEsu3rmmX4hoCR56VWIptAC0yIQwooRXFfG-lyQ'
const supabase = createClient(supabaseUrl, supabaseKey)

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const systemId = searchParams.get('system_id')
  const marquee = searchParams.get('marquee')

  try {
    if (marquee === 'true') {
      const { data, error } = await supabase
        .from('tickets')
        .select('title, status, system_id')
        .eq('status', 'in_progress')
        .order('created_at', { ascending: false })
        .limit(3)
      if (error) throw error
      return NextResponse.json({ data }, { headers: corsHeaders() })
    }

    if (systemId) {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('system_id', systemId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return NextResponse.json({ data }, { headers: corsHeaders() })
    }

    const { data } = await supabase.from('tickets').select('*').order('created_at', { ascending: false })
    return NextResponse.json({ data }, { headers: corsHeaders() })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() })
  }
}

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
    return NextResponse.json({ data }, { status: 201, headers: corsHeaders() })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() })
  }
}