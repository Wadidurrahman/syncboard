import { NextResponse } from 'next/server'
import { supabase } from './../../../lib/supabase'

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID Tiket tidak diberikan' }, 
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      )
    }

    const { data, error } = await supabase
      .from('tickets')
      .select('id, title, status, priority')
      .eq('id', id)
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data }, {
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