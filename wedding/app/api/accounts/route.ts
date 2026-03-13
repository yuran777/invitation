import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")?.trim()
  if (!slug) return NextResponse.json({ message: "slug 필요" }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from("accounts")
    .select("*")
    .eq("slug", slug)
    .order("order_index")

  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
  const body = await request.json()
  const { data, error } = await supabaseAdmin
    .from("accounts")
    .insert(body)
    .select()
    .single()
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { id, ...updates } = body
  const { data, error } = await supabaseAdmin
    .from("accounts")
    .update(updates)
    .eq("id", id)
    .select()
    .single()
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: Request) {
  const body = await request.json()
  const { error } = await supabaseAdmin
    .from("accounts")
    .delete()
    .eq("id", body.id)
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
