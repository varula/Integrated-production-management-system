'use server'

import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// POST: Create new production plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order_id, buyer_name, style, color, size_range, planned_qty, target_end_date, factory_id } = body

    if (!factory_id || !order_id || !planned_qty) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('production_plans')
      .insert([{
        order_id,
        buyer_name,
        style,
        color,
        size_range,
        planned_qty,
        target_end_date,
        factory_id,
        status: 'NOT_STARTED',
      }])
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/production-plans error:', error)
    return NextResponse.json({ error: 'Failed to create production plan' }, { status: 500 })
  }
}

// PUT: Update production plan
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Production plan ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('production_plans')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[v0] PUT /api/production-plans error:', error)
    return NextResponse.json({ error: 'Failed to update production plan' }, { status: 500 })
  }
}

// DELETE: Delete production plan
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Production plan ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('production_plans')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/production-plans error:', error)
    return NextResponse.json({ error: 'Failed to delete production plan' }, { status: 500 })
  }
}
