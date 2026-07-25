import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

type LeadPayload = {
  full_name: string
  phone: string
  email?: string
  city?: string
  district?: string
  loan_need?: string
  asset?: string
  source_page?: string
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Supabase chưa cấu hình')
  }

  return createClient(url, key)
}

async function syncToLms(payload: LeadPayload, cmsLeadId?: string) {
  const lmsUrl = process.env.LMS_API_URL || 'http://localhost:3002'
  const secret = process.env.WEBSITE_LEAD_SYNC_SECRET

  if (!secret) {
    console.warn('[leads] WEBSITE_LEAD_SYNC_SECRET chưa cấu hình — bỏ qua đồng bộ LMS')
    return null
  }

  const response = await fetch(`${lmsUrl}/api/public/website-leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-website-lead-secret': secret,
    },
    body: JSON.stringify({
      ...payload,
      cms_lead_id: cmsLeadId,
    }),
  })

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(body.error || `LMS sync failed (${response.status})`)
  }

  return body
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const payload = req.body as LeadPayload

  if (!payload?.full_name?.trim() || !payload?.phone?.trim()) {
    return res.status(400).json({ error: 'Họ tên và số điện thoại là bắt buộc' })
  }

  try {
    const supabase = getSupabase()

    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        full_name: payload.full_name.trim(),
        phone: payload.phone.trim(),
        email: payload.email?.trim() || null,
        city: payload.city?.trim() || null,
        district: payload.district?.trim() || null,
        loan_need: payload.loan_need?.trim() || null,
        asset: payload.asset?.trim() || null,
      })
      .select('id')
      .single()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    let lmsSync: unknown = null
    let lmsWarning: string | undefined

    try {
      lmsSync = await syncToLms(payload, lead?.id)
    } catch (syncError) {
      lmsWarning =
        syncError instanceof Error
          ? syncError.message
          : 'Không đồng bộ được sang LMS'
      console.error('[leads] LMS sync error:', syncError)
    }

    return res.status(201).json({
      ok: true,
      lead_id: lead?.id,
      lms_synced: Boolean(lmsSync),
      lms_warning: lmsWarning,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gửi đăng ký thất bại'
    return res.status(500).json({ error: message })
  }
}
