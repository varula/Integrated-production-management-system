'use server'

import { NextRequest, NextResponse } from 'next/server'

// Demo mode API - return mock data
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
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

    // Log audit
    if (user && data && data[0]) {
      await logCreate(user.id, factory_id, 'production_plans', data[0].id, data[0])
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/production-plans error:', error)
    return NextResponse.json({ error: 'Failed to create production plan' }, { status: 500 })
  }
}

// PUT: Update production plan
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    const body = await request.json()
    const { id, factory_id, ...updateData } = body

    if (!id || !factory_id) {
      return NextResponse.json({ error: 'Production plan ID and factory ID are required' }, { status: 400 })
    }

    // Get old values before update
    const { data: oldData } = await supabase
      .from('production_plans')
      .select('*')
      .eq('id', id)
      .single()

    const { data, error } = await supabase
      .from('production_plans')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) throw error

    // Log audit
    if (user && data && data[0]) {
      await logUpdate(user.id, factory_id, 'production_plans', id, oldData || {}, data[0])
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[v0] PUT /api/production-plans error:', error)
    return NextResponse.json({ error: 'Failed to update production plan' }, { status: 500 })
  }
}

// DELETE: Delete production plan
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const factory_id = searchParams.get('factory_id')

    if (!id || !factory_id) {
      return NextResponse.json({ error: 'Production plan ID and factory ID are required' }, { status: 400 })
    }

    // Get old values before deletion
    const { data: oldData } = await supabase
      .from('production_plans')
      .select('*')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('production_plans')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Log audit
    if (user && oldData) {
      await logDelete(user.id, factory_id, 'production_plans', id, oldData)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/production-plans error:', error)
    return NextResponse.json({ error: 'Failed to delete production plan' }, { status: 500 })
  }
}
