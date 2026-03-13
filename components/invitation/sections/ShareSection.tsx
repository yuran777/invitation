"use client"
import type { InvitationConfig } from "@/types/invitation"
import SectionTitle from "../SectionTitle"

declare global {
  interface Window {
    Kakao: { init: (k: string) => void; isInitialized: () => boolean; Share: { sendDefault: (o: unknown) => void } }
  }
}

export default function ShareSection({ config, slug }: { config: InvitationConfig; slug: string }) {
  const handleKakao = () => {
    const { Kakao } = window
    if (!Kakao) { alert("카카오 SDK가 로드되지 않았어요."); return }
    if (!Kakao.isInitialized()) Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY!)
    const url = `${window.location.origin}/invitation/${slug}`
    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: `${config.groom_name} · ${config.bride_name} 결혼합니다`,
        description: `${config.wedding_date_text} | ${config.venue_name} ${config.venue_hall}`,
        imageUrl: `${window.location.origin}/thumbnail.jpg`,
        link: { mobileWebUrl: url, webUrl: url },
      },
      buttons: [{ title: "청첩장 보러가기", link: { mobileWebUrl: url, webUrl: url } }],
    })
  }

  const handleCopy = async () => {
    const url = `${window.location.origin}/invitation/${slug}`
    try { await navigator.clipboard.writeText(url); alert("링크가 복사되었어요.") }
    catch { alert("링크 복사에 실패했어요.") }
  }

  return (
    <section className="px-6 py-12 pb-20 md:px-10">
      <SectionTitle en="SHARE" ko="공유하기" />
      <div className="mx-auto max-w-md space-y-3">
        <button onClick={handleKakao}
          className="w-full rounded-xl bg-yellow-300 py-3 text-sm font-semibold text-black">
          카카오톡 공유하기
        </button>
        <button onClick={handleCopy}
          className="w-full rounded-xl border border-gray-300 bg-white py-3 text-sm font-medium text-gray-800">
          링크 복사하기
        </button>
      </div>
    </section>
  )
}
