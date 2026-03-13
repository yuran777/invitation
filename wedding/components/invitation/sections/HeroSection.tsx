"use client"
import { useEffect, useState } from "react"
import type { InvitationConfig } from "@/types/invitation"

type Props = {
  config: InvitationConfig
  isPlaying: boolean
  toggleMusic: () => void
}

export default function HeroSection({ config, isPlaying, toggleMusic }: Props) {
  const [step, setStep] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timers = [
      setTimeout(() => setStep(1), 200),
      setTimeout(() => setStep(2), 900),
      setTimeout(() => setStep(3), 1600),
      setTimeout(() => setStep(4), 2300),
      setTimeout(() => setStep(5), 3000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const fade = (v: boolean) =>
    `transform transition-all duration-1000 ease-out ${v ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`

  // 서버에서는 모두 숨겨진 상태로 렌더링
  if (!mounted) {
    return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden text-center">
        <img src={process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/hero/hero-image"} alt="메인" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/50" />
      </section>
    )
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden text-center">
      <img src={process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/hero/hero-image"} alt="메인" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/50" />

      <button
        onClick={toggleMusic}
        className="fixed right-4 top-4 z-50 rounded-full bg-black/45 px-4 py-2 text-sm font-medium text-white shadow-md backdrop-blur transition hover:scale-105"
      >
        {isPlaying ? "🎵 음악 끄기" : "🎵 음악 재생"}
      </button>

      <div className="relative z-10 px-6 text-white md:px-10">
        <p className={`mb-5 text-xs tracking-[0.4em] text-white/85 ${fade(step >= 1)}`}>WEDDING INVITATION</p>
        <p className={`mb-4 text-sm leading-7 text-white/90 ${fade(step >= 2)}`}>소중한 분들을 초대합니다</p>
        <h1 className={`text-4xl font-light leading-tight md:text-5xl ${fade(step >= 3)}`}>
          {config.groom_name}
          <span className="mx-3 text-white/70">·</span>
          {config.bride_name}
        </h1>
        <p className={`mt-6 whitespace-pre-line text-sm leading-7 text-white/90 ${fade(step >= 4)}`}>
          {config.message?.split("\n").slice(0, 2).join("\n")}
        </p>
        <div className={`mt-8 space-y-2 text-sm text-white/85 ${fade(step >= 5)}`}>
          <p>{config.wedding_date_text}</p>
          <p>{config.venue_name} {config.venue_hall}</p>
        </div>
      </div>
      <div className="absolute bottom-10 z-10 animate-bounce text-xs tracking-[0.3em] text-white/80">SCROLL</div>
    </section>
  )
}
