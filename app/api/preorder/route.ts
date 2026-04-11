import { NextResponse } from 'next/server'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { getFirebaseDb } from '@/lib/firebase'
import { sendPreorderEmails } from '@/lib/mailer'

type PreorderPayload = {
  mode: 'b2c' | 'b2b'
  form: Record<string, unknown>
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PreorderPayload

    if (!body?.mode || !body?.form || !['b2c', 'b2b'].includes(body.mode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid preorder payload' },
        { status: 400 },
      )
    }

    const email = String(body.form.email || '')
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 },
      )
    }

    const db = getFirebaseDb()

    const docRef = await addDoc(collection(db, 'preorders'), {
      mode: body.mode,
      form: body.form,
      createdAt: serverTimestamp(),
    })

    const reference = docRef.id
    await sendPreorderEmails({
      mode: body.mode,
      reference,
      form: body.form,
    })

    return NextResponse.json({ success: true, reference })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error },
      { status: 500 },
    )
  }
}
