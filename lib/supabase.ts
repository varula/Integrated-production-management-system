'use server'

// Google Sheets Database Client - Pure server-only, no dependencies
// Uses only native Node.js fetch (available in 18.0+)

const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY
const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets'

export async function getSheetData(sheetName: string) {
  if (!SHEET_ID || !API_KEY) {
    console.error('[v0] Missing Google Sheets credentials')
    return []
  }

  try {
    const url = `${SHEETS_API}/${SHEET_ID}/values/${sheetName}!A:Z?key=${API_KEY}`
    const response = await fetch(url, { cache: 'no-store' })
    
    if (!response.ok) {
      console.error('[v0] Sheet fetch error:', response.status)
      return []
    }

    const result = (await response.json()) as any
    const rows = result.values || []
    
    if (rows.length === 0) return []

    const headers = rows[0]
    return rows.slice(1).map((row: any[]) => {
      const obj: any = {}
      headers.forEach((header: string, i: number) => {
        obj[header] = row[i] ?? null
      })
      return obj
    })
  } catch (error) {
    console.error('[v0] Sheet error:', error)
    return []
  }
}

export async function getSheetDataFiltered(sheetName: string, factoryId: string) {
  const data = await getSheetData(sheetName)
  return data.filter((row: any) => row.factory_id === factoryId)
}

  try {
    const url = `${SHEETS_API}/${SHEET_ID}/values/${sheetName}!${range}?key=${API_KEY}`
    const response = await fetch(url)
    const result = await response.json() as any

    if (!response.ok) {
      return { data: null, error: result.error }
    }

    const rows = result.values || []
    if (rows.length === 0) return { data: [], error: null }

    const headers = rows[0]
    const data = rows.slice(1).map((row: any[]) => {
      const obj: any = {}
      headers.forEach((header: string, i: number) => {
        obj[header] = row[i] ?? null
      })
      return obj
    })

    return { data, error: null }
  } catch (error) {
    console.error('[v0] Error fetching sheet data:', error)
    return { data: null, error }
  }
}

// Append data to sheet
async function appendSheetData(sheetName: string, values: any[][]) {
  if (!SHEET_ID || !API_KEY) {
    return { data: null, error: 'Missing Sheet ID or API Key' }
  }

  try {
    const url = `${SHEETS_API}/${SHEET_ID}/values/${sheetName}!A:Z:append?valueInputOption=RAW&key=${API_KEY}`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { data: null, error }
    }

    return { data: { success: true }, error: null }
  } catch (error) {
    console.error('[v0] Error appending sheet data:', error)
    return { data: null, error }
  }
}

// Update sheet data
async function updateSheetData(sheetName: string, range: string, values: any[][]) {
  if (!SHEET_ID || !API_KEY) {
    return { data: null, error: 'Missing Sheet ID or API Key' }
  }

  try {
    const url = `${SHEETS_API}/${SHEET_ID}/values/${sheetName}!${range}?valueInputOption=RAW&key=${API_KEY}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { data: null, error }
    }

    return { data: { success: true }, error: null }
  } catch (error) {
    console.error('[v0] Error updating sheet data:', error)
    return { data: null, error }
  }
}

// Query builder for Google Sheets
class GoogleSheetsQuery {
  private sheet: string
  private filters: Array<{ column: string; value: any; operator?: string }> = []
  private selectedColumns: string[] = []

  constructor(sheet: string) {
    this.sheet = sheet
  }

  select(columns?: string) {
    if (columns) {
      this.selectedColumns = columns.split(',').map(c => c.trim())
    }
    return this
  }

  eq(column: string, value: any) {
    this.filters.push({ column, value, operator: 'eq' })
    return this
  }

  async execute() {
    const { data, error } = await getSheetData(this.sheet)

    if (error) return { data: null, error }
    if (!data) return { data: [], error: null }

    let filtered = [...data]

    // Apply filters
    for (const filter of this.filters) {
      filtered = filtered.filter(row => {
        const cellValue = row[filter.column]
        if (filter.operator === 'eq') {
          return cellValue == filter.value
        }
        return cellValue === filter.value
      })
    }

    // Select columns if specified
    if (this.selectedColumns.length > 0) {
      filtered = filtered.map(row => {
        const newRow: any = {}
        this.selectedColumns.forEach(col => {
          newRow[col] = row[col] ?? null
        })
        return newRow
      })
    }

    return { data: filtered, error: null }
  }

  async single() {
    const { data, error } = await this.execute()
    if (error) return { data: null, error }
    return { data: data && data.length > 0 ? data[0] : null, error: null }
  }

  async insert(records: any[]) {
    if (!records || records.length === 0) {
      return { data: [], error: null }
    }

    const { data: existingData, error: fetchError } = await getSheetData(this.sheet)

    if (fetchError && existingData === null) {
      return { data: null, error: fetchError }
    }

    const headers = existingData && existingData.length > 0
      ? Object.keys(existingData[0])
      : Object.keys(records[0])

    const values = records.map(record => {
      return headers.map(header => record[header] ?? '')
    })

    return await appendSheetData(this.sheet, values)
  }

  async update(updates: any) {
    if (this.filters.length === 0) {
      return { data: null, error: 'Update requires at least one filter (.eq())' }
    }

    const { data: allData, error } = await getSheetData(this.sheet)

    if (error) return { data: null, error }
    if (!allData) return { data: null, error: 'No data found' }

    const headers = Object.keys(allData[0] ?? {})
    const rows = [headers]

    for (const row of allData) {
      const matches = this.filters.every(f => row[f.column] == f.value)
      if (matches) {
        const updatedRow = { ...row, ...updates }
        rows.push(headers.map(h => updatedRow[h] ?? ''))
      } else {
        rows.push(headers.map(h => row[h] ?? ''))
      }
    }

    const { error: updateError } = await updateSheetData(this.sheet, `A:${String.fromCharCode(64 + headers.length)}`, rows)

    return { data: updates, error: updateError }
  }

  async delete() {
    if (this.filters.length === 0) {
      return { data: null, error: 'Delete requires at least one filter (.eq())' }
    }

    const { data: allData, error } = await getSheetData(this.sheet)

    if (error) return { data: null, error }
    if (!allData) return { data: null, error: 'No data found' }

    const headers = Object.keys(allData[0] ?? {})
    const rows = [headers]

    for (const row of allData) {
      const matches = this.filters.every(f => row[f.column] == f.value)
      if (!matches) {
        rows.push(headers.map(h => row[h] ?? ''))
      }
    }

    const { error: updateError } = await updateSheetData(this.sheet, `A:${String.fromCharCode(64 + headers.length)}`, rows)

    return { data: { success: true }, error: updateError }
  }

  select() {
    return this
  }
}

// Supabase-compatible API
export const supabase = {
  from: (table: string) => {
    const query = new GoogleSheetsQuery(table)
    return {
      select: (columns?: string) => new GoogleSheetsQuery(table).select(columns),
      insert: (data: any[]) => new GoogleSheetsQuery(table).insert(data),
      update: (data: any) => new GoogleSheetsQuery(table).update(data),
      delete: () => new GoogleSheetsQuery(table).delete(),
      eq: (column: string, value: any) => new GoogleSheetsQuery(table).eq(column, value),
    }
  },
}

export type Database = {
  public: {
    Tables: {
      factories: {
        Row: {
          id: string
          name: string
          code: string
          location: string
          created_at: string
          updated_at: string
        }
      }
      lines: {
        Row: {
          id: string
          factory_id: string
          line_code: string
          line_name: string
          line_type: 'SEWING' | 'FINISHING'
          line_leader_name: string | null
          capacity_per_hour: number
          created_at: string
          updated_at: string
        }
      }
      production_plans: {
        Row: {
          id: string
          factory_id: string
          order_id: string
          buyer_name: string
          style: string
          color: string | null
          size_range: string | null
          planned_qty: number
          target_end_date: string
          status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD'
          created_at: string
          updated_at: string
        }
      }
      hourly_production: {
        Row: {
          id: string
          factory_id: string
          line_id: string
          production_plan_id: string
          hour_slot: string
          hour_index: number
          produced_qty: number
          passed_qty: number
          defect_qty: number
          date: string
          created_at: string
          updated_at: string
        }
      }
      downtime: {
        Row: {
          id: string
          factory_id: string
          line_id: string
          start_time: string
          end_time: string
          duration_minutes: number
          reason: 'MECHANICAL' | 'ELECTRICAL' | 'MATERIAL' | 'SKILL' | 'POWER' | 'OTHER'
          created_by: string | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
