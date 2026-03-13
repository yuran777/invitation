import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")?.trim()
  if (!slug) return NextResponse.json({ message: "slug 필요" }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from("guestbooks")
    .select("*")
    .eq("slug", slug)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
  const body = await request.json()
  const slug = String(body.slug ?? "").trim()
  const name = String(body.name ?? "").trim()
  const message = String(body.message ?? "").trim()

  if (!slug || !name || !message)
    return NextResponse.json({ message: "slug, name, message 필수" }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from("guestbooks")
    .insert({ slug, name, message })
    .select()
    .single()

  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const id = String(body.id ?? "").trim()
  if (!id) return NextResponse.json({ message: "id 필요" }, { status: 400 })

  const { data, error } = await supabaseAdmin.rpc("increment_guestbook_like", { target_id: id })
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })

  const updated = Array.isArray(data) ? data[0] : data
  return NextResponse.json(updated)
}

export async function DELETE(request: Request) {
  const body = await request.json()
  const { id, adminPassword } = body

  if (adminPassword !== process.env.GUESTBOOK_ADMIN_PASSWORD)
    return NextResponse.json({ message: "비밀번호 오류" }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from("guestbooks")
    .delete()
    .eq("id", id)
    .select()
    .single()

  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json({ deleted: data })
}
