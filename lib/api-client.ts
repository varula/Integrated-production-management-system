'use client'

// Production Plans API calls
export async function createProductionPlan(data: any) {
  const response = await fetch('/api/production-plans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create production plan')
  return await response.json()
}

export async function updateProductionPlan(id: string, data: any) {
  const response = await fetch('/api/production-plans', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  })
  if (!response.ok) throw new Error('Failed to update production plan')
  return await response.json()
}

export async function deleteProductionPlan(id: string) {
  const response = await fetch(`/api/production-plans?id=${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete production plan')
  return await response.json()
}

// Hourly Production API calls
export async function createHourlyProduction(data: any) {
  const response = await fetch('/api/hourly-production', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create hourly production record')
  return await response.json()
}

export async function updateHourlyProduction(id: string, data: any) {
  const response = await fetch('/api/hourly-production', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  })
  if (!response.ok) throw new Error('Failed to update hourly production record')
  return await response.json()
}

export async function deleteHourlyProduction(id: string) {
  const response = await fetch(`/api/hourly-production?id=${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete hourly production record')
  return await response.json()
}

// Downtime API calls
export async function createDowntime(data: any) {
  const response = await fetch('/api/downtime', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create downtime record')
  return await response.json()
}

export async function updateDowntime(id: string, data: any) {
  const response = await fetch('/api/downtime', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  })
  if (!response.ok) throw new Error('Failed to update downtime record')
  return await response.json()
}

export async function deleteDowntime(id: string) {
  const response = await fetch(`/api/downtime?id=${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete downtime record')
  return await response.json()
}
