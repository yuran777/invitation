import { supabaseAdmin } from "@/lib/supabase-admin"
import InvitationClient from "@/components/invitation/InvitationClient"
import type { Metadata } from "next"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data } = await supabaseAdmin.from("invitation_config").select("*").eq("slug", slug).single()
  if (!data) return { title: "청첩장" }
  return {
    title: `${data.groom_name} · ${data.bride_name} 결혼합니다`,
    description: `${data.wedding_date_text} ${data.venue_name} ${data.venue_hall}`,
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params

  const [{ data: config }, { data: gallery }, { data: accounts }] = await Promise.all([
    supabaseAdmin.from("invitation_config").select("*").eq("slug", slug).single(),
    supabaseAdmin.from("gallery_images").select("*").eq("slug", slug).order("order_index"),
    supabaseAdmin.from("accounts").select("*").eq("slug", slug).order("order_index"),
  ])

  if (!config) {
    return <div className="p-10 text-center text-gray-500">존재하지 않는 청첩장입니다.</div>
  }

  return (
    <InvitationClient
      config={config}
      gallery={gallery ?? []}
      accounts={accounts ?? []}
      slug={slug}
    />
  )
}
