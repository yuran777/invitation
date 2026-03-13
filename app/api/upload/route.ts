import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file") as File
  const bucket = formData.get("bucket") as string
  const path = formData.get("path") as string

  if (!file || !bucket || !path)
    return NextResponse.json({ message: "file, bucket, path 필요" }, { status: 400 })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (error) return NextResponse.json({ message: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(path)

  return NextResponse.json({ url: publicUrl })
}
