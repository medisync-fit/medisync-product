import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  // Log the preorder (replace with DB/email service in production)
  console.log('📦 New preorder received:', JSON.stringify(body, null, 2))

  // Generate a reference number
  const ref = `MS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

  return NextResponse.json({ success: true, reference: ref })
}
