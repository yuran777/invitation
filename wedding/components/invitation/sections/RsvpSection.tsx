"use client"
import { useState } from "react"
import type { InvitationConfig } from "@/types/invitation"
import SectionTitle from "../SectionTitle"

type Meal = "yes" | "no" | "unknown"
type Side = "groom" | "bride"

export default function RsvpSection({ config, slug }: { config: InvitationConfig; slug: string }) {
  const [showPopup, setShowPopup] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [side, setSide] = useState<Side>("groom")
  const [name, setName] = useState("")
  const [phoneLast4, setPhoneLast4] = useState("")
  const [memo, setMemo] = useState("")
  const [meal, setMeal] = useState<Meal>("yes")
  const [guestCount, setGuestCount] = useState(1)

  const handleSubmit = async () => {
    if (!name.trim()) return alert("성함을 입력해주세요.")
    setLoading(true)
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, side, name: name.trim(), phone_last4: phoneLast4, memo, meal, guest_count: guestCount }),
      })
      if (res.ok) setSubmitted(true)
      else { const e = await res.json(); alert(e.message) }
    } catch { alert("오류가 발생했습니다.") }
    finally { setLoading(false) }
  }

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-center gap-4 border-b border-gray-50 px-6 py-4">
      <label className="w-16 text-sm font-medium text-gray-900">{label}</label>
      <div className="flex-1">{children}</div>
    </div>
  )

  return (
    <>
      <section className="px-6 py-12 md:px-10">
        <SectionTitle en="RSVP" ko="참석의사 전달하기" />
        <div className="rounded-2xl border border-gray-200 p-8 text-center">
          <div className="mb-6 text-sm leading-7 text-gray-600">
            <p>모든 분들께</p>
            <p>부족함 없는 예식을 준비하기 위해</p>
            <p>참석 및 식사 여부를 미리 여쭙고자 합니다.</p>
            <br />
            <p>부담없이 알려주시면 정성껏 준비하겠습니다.</p>
          </div>
          <button onClick={() => { setShowPopup(true); setSubmitted(false) }}
            className="w-full rounded-lg bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-800">
            참석의사 전달하기
          </button>
        </div>
      </section>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          onClick={() => setShowPopup(false)}>
          <div className="relative overflow-y-auto rounded-xl bg-white"
            style={{ width: "65%", maxWidth: 420, maxHeight: "80vh" }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowPopup(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 text-xl z-10">✕</button>

            {!submitted ? (
              <div className="pb-6">
                <div className="border-b border-gray-100 px-6 py-5">
                  <h2 className="text-base font-medium tracking-widest text-gray-900">참석의사 전달하기</h2>
                </div>
                <Field label="구분">
                  <div className="flex overflow-hidden rounded-md border border-gray-200">
                    {(["groom", "bride"] as Side[]).map(s => (
                      <button key={s} onClick={() => setSide(s)}
                        className={`flex-1 py-2.5 text-sm transition ${side === s ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-800 hover:bg-gray-100"}`}>
                        {s === "groom" ? "신랑" : "신부"}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="성함">
                  <input placeholder="참석자 성함" value={name} onChange={e => setName(e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-700" />
                </Field>
                <Field label="전화번호">
                  <input placeholder="끝 4자리" value={phoneLast4}
                    onChange={e => setPhoneLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-700" />
                </Field>
                <Field label="메모">
                  <input value={memo} onChange={e => setMemo(e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-700" />
                </Field>
                <Field label="식사">
                  <div className="flex gap-5">
                    {([["yes", "예정"], ["no", "불참"], ["unknown", "미정"]] as [Meal, string][]).map(([v, l]) => (
                      <label key={v} className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-900">
                        <input type="radio" name="meal" checked={meal === v} onChange={() => setMeal(v)} className="accent-blue-500" />
                        {l}
                      </label>
                    ))}
                  </div>
                </Field>
                <Field label="참석인원">
                  <select value={guestCount} onChange={e => setGuestCount(Number(e.target.value))}
                    className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>총 {n}명 {n === 1 ? "(본인 포함)" : ""}</option>
                    ))}
                  </select>
                </Field>
                <div className="px-6 pt-2">
                  <button onClick={handleSubmit} disabled={loading}
                    className="w-full rounded-lg bg-gray-900 py-3 text-sm font-medium tracking-widest text-white disabled:opacity-50 hover:bg-gray-800">
                    {loading ? "전송 중..." : "SEND"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-9 py-16 text-center">
                <p className="mb-8 text-base text-gray-600 leading-8">참석 의사를 전달해주셨습니다 🤍</p>
                <button onClick={() => setShowPopup(false)}
                  className="w-full rounded-lg bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-800">닫기</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
