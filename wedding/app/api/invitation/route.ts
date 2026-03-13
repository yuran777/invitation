import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")?.trim()

  if (!slug) return NextResponse.json({ message: "slug 필요" }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from("invitation_config")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { slug, ...updates } = body

  if (!slug) return NextResponse.json({ message: "slug 필요" }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from("invitation_config")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("slug", slug)
    .select()
    .single()

  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json(data)
}
