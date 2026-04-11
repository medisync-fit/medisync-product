import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST() {
    console.log('TEST API HIT')
    return NextResponse.json({ ok: true })
}