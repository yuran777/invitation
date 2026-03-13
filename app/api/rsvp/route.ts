import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")?.trim()
  if (!slug) return NextResponse.json({ message: "slug 필요" }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from("rsvp")
    .select("*")
    .eq("slug", slug)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
  const body = await request.json()
  const { slug, side, name, phone_last4, memo, meal, guest_count } = body

  if (!slug || !side || !name)
    return NextResponse.json({ message: "필수 항목 누락" }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from("rsvp")
    .insert({ slug, side, name, phone_last4, memo, meal, guest_count })
    .select()
    .single()

  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
