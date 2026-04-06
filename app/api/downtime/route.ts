'use server'

import { NextRequest, NextResponse } from 'next/server'

// POST: Create downtime record (demo mode)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // In demo mode, just return success
    return NextResponse.json({ data: { ...body, id: Date.now() }, error: null })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create downtime record' }, { status: 500 })
  }
}

    if (!factory_id || !line_id || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('downtime')
      .insert([{
        factory_id,
        line_id,
        reason,
        start_time: start_time || new Date().toISOString(),
        end_time: end_time || null,
        duration_minutes: duration_minutes || 0,
        created_by: created_by || 'system',
      }])
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/downtime error:', error)
    return NextResponse.json({ error: 'Failed to create downtime record' }, { status: 500 })
  }
}

// PUT: Update downtime record
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Downtime ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('downtime')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[v0] PUT /api/downtime error:', error)
    return NextResponse.json({ error: 'Failed to update downtime record' }, { status: 500 })
  }
}

// DELETE: Delete downtime record
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Downtime ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('downtime')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/downtime error:', error)
    return NextResponse.json({ error: 'Failed to delete downtime record' }, { status: 500 })
  }
}
