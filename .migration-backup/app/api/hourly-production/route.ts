'use server'

import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// POST: Create hourly production record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { factory_id, line_id, production_plan_id, hour_index, hour_slot, produced_qty, passed_qty, defect_qty, date } = body

    if (!factory_id || !line_id || hour_index === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('hourly_production')
      .insert([{
        factory_id,
        line_id,
        production_plan_id,
        hour_index,
        hour_slot,
        produced_qty: produced_qty || 0,
        passed_qty: passed_qty || 0,
        defect_qty: defect_qty || 0,
        date: date || new Date().toISOString().split('T')[0],
      }])
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/hourly-production error:', error)
    return NextResponse.json({ error: 'Failed to create hourly production record' }, { status: 500 })
  }
}

// PUT: Update hourly production record
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Hourly production ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('hourly_production')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[v0] PUT /api/hourly-production error:', error)
    return NextResponse.json({ error: 'Failed to update hourly production record' }, { status: 500 })
  }
}

// DELETE: Delete hourly production record
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Hourly production ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('hourly_production')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/hourly-production error:', error)
    return NextResponse.json({ error: 'Failed to delete hourly production record' }, { status: 500 })
  }
}
