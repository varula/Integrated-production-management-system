'use server'

import { NextRequest, NextResponse } from 'next/server'

const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY
const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets'

export async function GET(request: NextRequest) {
  const factoryId = request.nextUrl.searchParams.get('factory_id')
  
  if (!factoryId) {
    return NextResponse.json({ error: 'factory_id required' }, { status: 400 })
  }

  if (!SHEET_ID || !API_KEY) {
    return NextResponse.json({ error: 'Missing Google Sheets credentials' }, { status: 500 })
  }

  try {
    const url = `${SHEETS_API}/${SHEET_ID}/values/downtime!A:Z?key=${API_KEY}`
    const response = await fetch(url)
    const result = await response.json() as any

    if (!response.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    const rows = result.values || []
    if (rows.length === 0) return NextResponse.json({ data: [] })

    const headers = rows[0]
    const data = rows.slice(1).map((row: any[]) => {
      const obj: any = {}
      headers.forEach((header: string, i: number) => {
        obj[header] = row[i] ?? null
      })
      return obj
    })

    // Filter by factory_id
    const filtered = data.filter((item: any) => item.factory_id === factoryId)

    return NextResponse.json({ data: filtered })
  } catch (error) {
    console.error('[v0] Error fetching downtime:', error)
    return NextResponse.json({ error: 'Failed to fetch downtime' }, { status: 500 })
  }
}
