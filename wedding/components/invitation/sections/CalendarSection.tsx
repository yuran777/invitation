"use client"
import { useEffect, useMemo, useState } from "react"
import type { InvitationConfig } from "@/types/invitation"
import SectionTitle from "../SectionTitle"

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"]

function getTimeLeft(target: Date) {
  const diff = target.getTime() - new Date().getTime()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

const TIMER_LABELS = ["DAYS", "HOUR", "MIN", "SEC"] as const

export default function CalendarSection({ config }: { config: InvitationConfig }) {
  const wedding = useMemo(() => new Date(config.wedding_date), [config.wedding_date])
  const year = wedding.getFullYear()
  const month = wedding.getMonth()
  const date = wedding.getDate()

  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    setMounted(true)
    setTimeLeft(getTimeLeft(wedding))
    const t = setInterval(() => setTimeLeft(getTimeLeft(wedding)), 1000)
    return () => clearInterval(t)
  }, [wedding])

  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const lastDate = new Date(year, month + 1, 0).getDate()
    return [...Array(firstDay).fill(null), ...Array.from({ length: lastDate }, (_, i) => i + 1)]
  }, [year, month])

  const timerValues = [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds]

  return (
    <section className="px-6 py-12 md:px-10">
      <SectionTitle en="CALENDAR" ko="예식 일정" />
      <div className="overflow-hidden rounded-[22px]">
        <div className="relative" style={{ backgroundImage: "url('" + process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/calendar-bg/calendar-bg')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative z-10 px-6 py-8 text-white">
            <h3 className="mb-8 text-center text-[28px] font-semibold">{year}년 {month + 1}월</h3>
            <div className="grid grid-cols-7 gap-y-5 text-center">
              {WEEKDAYS.map((d, i) => (
                <div key={d} className={`text-[18px] font-semibold ${i === 0 ? "text-rose-200" : i === 6 ? "text-blue-200" : "text-white/85"}`}>{d}</div>
              ))}
              {cells.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} className="h-12" />
                const wd = i % 7
                const isWedding = day === date
                return (
                  <div key={`day-${day}`} className="flex h-12 items-center justify-center">
                    {isWedding ? (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-pink-200 bg-white text-[18px] font-bold text-pink-600 shadow-lg">{day}</div>
                    ) : (
                      <span className={`text-[18px] font-semibold ${wd === 0 ? "text-rose-200" : wd === 6 ? "text-blue-200" : "text-white"}`}>{day}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-16 text-center">
        {mounted ? (
          <>
            <div className="flex items-end justify-center gap-3">
              {TIMER_LABELS.map((label, i) => (
                <div key={label} className="flex items-end gap-3">
                  <div className="w-[72px] text-center">
                    <p className="mb-2 text-[13px] font-semibold tracking-wide text-gray-400">{label}</p>
                    <p className="text-[54px] font-extralight leading-none text-gray-800">
                      {String(timerValues[i]).padStart(2, "0")}
                    </p>
                  </div>
                  {i < 3 && <span className="pb-1 text-5xl font-light text-gray-400">:</span>}
                </div>
              ))}
            </div>
            <p className="mt-12 text-[18px] font-medium text-gray-600">
              {config.groom_name}, {config.bride_name}의 결혼식이{" "}
              <span className="font-bold text-rose-500">{timeLeft.days}일</span> 남았습니다.
            </p>
          </>
        ) : (
          <div className="h-32" />
        )}
      </div>
    </section>
  )
}
