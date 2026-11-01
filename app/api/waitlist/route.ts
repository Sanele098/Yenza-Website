import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}

export async function POST(request: Request) {
  const supabase = getSupabase()
  try {
    const body = await request.json()
    const required = ['full_name', 'email', 'user_type', 'location']
    if (required.some((key) => typeof body[key] !== 'string' || !body[key].trim())) {
      return NextResponse.json({ error: 'Please complete the required fields.' }, { status: 400 })
    }
    const { error } = await supabase.from('yenza_waitlist').insert({
      full_name: body.full_name.trim(), email: body.email.trim().toLowerCase(),
      mobile_number: body.mobile_number?.trim() || null, user_type: body.user_type,
      location: body.location.trim(), skills_services: body.skills_services?.trim() || null,
      training_programmes: body.training_programmes?.trim() || null,
      organisation_name: body.organisation_name?.trim() || null,
      message: body.message?.trim() || null, marketing_consent: Boolean(body.marketing_consent),
    })
    if (error?.code === '23505') return NextResponse.json({ error: 'This email is already on the waitlist.' }, { status: 409 })
    if (error) return NextResponse.json({ error: 'We could not save your registration. Please try again.' }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Please check your details and try again.' }, { status: 400 }) }
}
