"use client"

import { useEffect, useRef, useState } from "react"
import type { InvitationConfig, GalleryImage, Account, Section } from "@/types/invitation"
import HeroSection from "./sections/HeroSection"
import MessageSection from "./sections/MessageSection"
import CalendarSection from "./sections/CalendarSection"
import LocationSection from "./sections/LocationSection"
import GallerySection from "./sections/GallerySection"
import AccountSection from "./sections/AccountSection"
import RsvpSection from "./sections/RsvpSection"
import GuestbookSection from "./sections/GuestbookSection"
import ShareSection from "./sections/ShareSection"
import RevealSection from "./RevealSection"

type Props = {
  config: InvitationConfig
  gallery: GalleryImage[]
  accounts: Account[]
  slug: string
}

const SECTION_MAP: Record<string, (props: Props & { audioRef: React.RefObject<HTMLAudioElement>, isPlaying: boolean, toggleMusic: () => void }) => React.ReactNode> = {
  hero: ({ config, isPlaying, toggleMusic }) => (
    <HeroSection config={config} isPlaying={isPlaying} toggleMusic={toggleMusic} />
  ),
  message: ({ config }) => (
    <RevealSection><MessageSection config={config} /></RevealSection>
  ),
  calendar: ({ config }) => (
    <RevealSection><CalendarSection config={config} /></RevealSection>
  ),
  location: ({ config }) => (
    <RevealSection><LocationSection config={config} /></RevealSection>
  ),
  gallery: ({ gallery, slug }) => (
    <RevealSection><GallerySection gallery={gallery} slug={slug} /></RevealSection>
  ),
  account: ({ accounts }) => (
    <RevealSection><AccountSection accounts={accounts} /></RevealSection>
  ),
  rsvp: ({ config, slug }) => (
    <RevealSection><RsvpSection config={config} slug={slug} /></RevealSection>
  ),
  guestbook: ({ slug }) => (
    <RevealSection><GuestbookSection slug={slug} /></RevealSection>
  ),
  share: ({ config, slug }) => (
    <RevealSection><ShareSection config={config} slug={slug} /></RevealSection>
  ),
}

export default function InvitationClient({ config, gallery, accounts, slug }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const toggleMusic = async () => {
    const audio = audioRef.current
    if (!audio) return
    try {
      if (audio.paused) { await audio.play(); setIsPlaying(true) }
      else { audio.pause(); setIsPlaying(false) }
    } catch (e) { console.error(e) }
  }

  const sortedSections: Section[] = [...(config.sections ?? [])]
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <>
      <audio ref={audioRef} src={process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/bgm/wedding-bgm.mp3"} loop preload="auto" />
      <main className="mx-auto min-h-screen w-full max-w-[720px] bg-white shadow-lg">
        {sortedSections.map(section => {
          const renderer = SECTION_MAP[section.id]
          if (!renderer) return null
          return (
            <div key={section.id}>
              {renderer({ config, gallery, accounts, slug, audioRef, isPlaying, toggleMusic })}
            </div>
          )
        })}
      </main>
    </>
  )
}
