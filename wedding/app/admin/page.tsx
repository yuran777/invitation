"use client"
import { useEffect, useRef, useState } from "react"
import type { InvitationConfig, Account, GalleryImage } from "@/types/invitation"

const SLUG = "sample"
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ADMIN_PASSWORD = "rlamg3972!A"

type Tab = "basic" | "media" | "sections" | "gallery" | "accounts"

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pwInput, setPwInput] = useState("")
  const [pwError, setPwError] = useState(false)
  const [tab, setTab] = useState<Tab>("basic")
  const [config, setConfig] = useState<InvitationConfig | null>(null)
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState("")

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500) }

  useEffect(() => {
    fetch(`/api/invitation?slug=${SLUG}`).then(r => r.json()).then(setConfig)
    fetch(`/api/gallery?slug=${SLUG}`).then(r => r.json()).then(setGallery)
    fetch(`/api/accounts?slug=${SLUG}`).then(r => r.json()).then(setAccounts)
  }, [])

  const saveConfig = async () => {
    if (!config) return
    setSaving(true)
    try {
      const res = await fetch("/api/invitation", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })
      if (res.ok) showToast("저장되었습니다 ✓")
      else showToast("저장 실패")
    } finally { setSaving(false) }
  }

  if (!authed) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-lg font-semibold text-gray-900">관리자 로그인</h1>
        <p className="mb-6 text-center text-xs text-gray-400">청첩장 어드민 페이지</p>
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={pwInput}
          onChange={e => { setPwInput(e.target.value); setPwError(false) }}
          onKeyDown={e => {
            if (e.key === "Enter") {
              if (pwInput === ADMIN_PASSWORD) { setAuthed(true) }
              else { setPwError(true); setPwInput("") }
            }
          }}
          className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 outline-none ${
            pwError ? "border-red-400 bg-red-50" : "border-gray-300 focus:border-gray-700"
          }`}
        />
        {pwError && <p className="mt-2 text-xs text-red-500 text-center">비밀번호가 올바르지 않아요.</p>}
        <button
          onClick={() => {
            if (pwInput === ADMIN_PASSWORD) { setAuthed(true) }
            else { setPwError(true); setPwInput("") }
          }}
          className="mt-4 w-full rounded-lg bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-800">
          확인
        </button>
      </div>
    </div>
  )

  if (!config) return (
    <div className="flex h-screen items-center justify-center text-gray-400 text-sm">불러오는 중...</div>
  )

  const tabs: { id: Tab; label: string }[] = [
    { id: "basic", label: "기본 정보" },
    { id: "media", label: "미디어" },
    { id: "sections", label: "섹션 관리" },
    { id: "gallery", label: "갤러리" },
    { id: "accounts", label: "계좌번호" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">청첩장 어드민</h1>
          <p className="text-xs text-gray-400 mt-0.5">slug: {SLUG}</p>
        </div>
        <div className="flex gap-3">
          <a href={`/invitation/${SLUG}`} target="_blank"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            미리보기 →
          </a>
          <button onClick={saveConfig} disabled={saving}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-gray-800">
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </header>

      {/* 탭 */}
      <div className="bg-white border-b border-gray-200 px-6 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab === t.id ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* 기본 정보 탭 */}
        {tab === "basic" && (
          <div className="space-y-6">
            <Card title="신랑 / 신부">
              <div className="grid grid-cols-2 gap-4">
                <Field label="신랑 이름"><Input value={config.groom_name} onChange={v => setConfig({ ...config, groom_name: v })} /></Field>
                <Field label="신부 이름"><Input value={config.bride_name} onChange={v => setConfig({ ...config, bride_name: v })} /></Field>
                <Field label="신랑 아버지"><Input value={config.groom_father} onChange={v => setConfig({ ...config, groom_father: v })} /></Field>
                <Field label="신랑 어머니"><Input value={config.groom_mother} onChange={v => setConfig({ ...config, groom_mother: v })} /></Field>
                <Field label="신부 아버지"><Input value={config.bride_father} onChange={v => setConfig({ ...config, bride_father: v })} /></Field>
                <Field label="신부 어머니"><Input value={config.bride_mother} onChange={v => setConfig({ ...config, bride_mother: v })} /></Field>
              </div>
            </Card>

            <Card title="예식 정보">
              <div className="space-y-4">
                <Field label="예식 날짜 (ISO)"><Input value={config.wedding_date} onChange={v => setConfig({ ...config, wedding_date: v })} placeholder="2026-07-12T14:00:00" /></Field>
                <Field label="예식 날짜 텍스트"><Input value={config.wedding_date_text} onChange={v => setConfig({ ...config, wedding_date_text: v })} placeholder="2026년 7월 12일 일요일 오후 2시" /></Field>
                <Field label="예식장 이름"><Input value={config.venue_name} onChange={v => setConfig({ ...config, venue_name: v })} /></Field>
                <Field label="홀 이름"><Input value={config.venue_hall} onChange={v => setConfig({ ...config, venue_hall: v })} /></Field>
                <Field label="주소"><Input value={config.venue_address} onChange={v => setConfig({ ...config, venue_address: v })} /></Field>
              </div>
            </Card>

            <Card title="인사말">
              <textarea value={config.message} rows={6}
                onChange={e => setConfig({ ...config, message: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-700 resize-none" />
            </Card>

            <Card title="지도 링크">
              <div className="space-y-4">
                <Field label="카카오맵"><Input value={config.map_kakao} onChange={v => setConfig({ ...config, map_kakao: v })} placeholder="https://kko.to/..." /></Field>
                <Field label="네이버지도"><Input value={config.map_naver} onChange={v => setConfig({ ...config, map_naver: v })} placeholder="https://naver.me/..." /></Field>
                <Field label="구글맵"><Input value={config.map_google} onChange={v => setConfig({ ...config, map_google: v })} placeholder="https://maps.app.goo.gl/..." /></Field>
              </div>
            </Card>

            <Card title="교통 정보">
              <div className="space-y-4">
                <ArrayField label="지하철" items={config.location_subway ?? []} onChange={v => setConfig({ ...config, location_subway: v })} />
                <ArrayField label="버스" items={config.location_bus ?? []} onChange={v => setConfig({ ...config, location_bus: v })} />
                <ArrayField label="주차" items={config.location_parking ?? []} onChange={v => setConfig({ ...config, location_parking: v })} />
              </div>
            </Card>

            <Card title="연락처">
              <p className="mb-4 text-xs text-gray-400">인사말 섹션 하단의 연락하기 버튼에 사용돼요.</p>
              <div className="space-y-3">
                {(config.contacts ?? []).map((c, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 p-4">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <Field label="구분">
                        <select
                          value={c.role}
                          onChange={e => {
                            const next = [...(config.contacts ?? [])]
                            next[i] = { ...next[i], role: e.target.value as "groom" | "bride" }
                            setConfig({ ...config, contacts: next })
                          }}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-700"
                        >
                          <option value="groom">신랑</option>
                          <option value="bride">신부</option>
                        </select>
                      </Field>
                      <Field label="이름">
                        <Input value={c.name} onChange={v => {
                          const next = [...(config.contacts ?? [])]
                          next[i] = { ...next[i], name: v }
                          setConfig({ ...config, contacts: next })
                        }} />
                      </Field>
                    </div>
                    <Field label="전화번호">
                      <div className="flex gap-2">
                        <Input value={c.phone} placeholder="01012345678" onChange={v => {
                          const next = [...(config.contacts ?? [])]
                          next[i] = { ...next[i], phone: v }
                          setConfig({ ...config, contacts: next })
                        }} />
                        <button
                          onClick={() => {
                            const next = (config.contacts ?? []).filter((_, j) => j !== i)
                            setConfig({ ...config, contacts: next })
                          }}
                          className="shrink-0 rounded-lg border border-red-200 px-3 py-2 text-xs text-red-500 hover:bg-red-50"
                        >삭제</button>
                      </div>
                    </Field>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const next = [...(config.contacts ?? []), { role: "groom" as const, name: "", phone: "" }]
                    setConfig({ ...config, contacts: next })
                  }}
                  className="w-full rounded-lg border border-dashed border-gray-300 py-2.5 text-sm text-gray-500 hover:border-gray-500 hover:text-gray-700"
                >
                  + 연락처 추가
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* 미디어 탭 */}
        {tab === "media" && (
          <div className="space-y-6">
            <MediaUploadCard
              title="메인 비주얼 (Hero 이미지)"
              description="청첩장 첫 화면에 표시되는 대표 사진이에요."
              bucket="hero"
              uploadPath="hero-image"
              accept="image/*"
              currentUrl={`${SUPABASE_URL}/storage/v1/object/public/hero/hero-image`}
              previewType="image"
              onSuccess={url => showToast("Hero 이미지 업로드 완료 ✓")}
            />
            <MediaUploadCard
              title="캘린더 배경 이미지"
              description="캘린더 섹션 뒤에 깔리는 배경 사진이에요."
              bucket="calendar-bg"
              uploadPath="calendar-bg"
              accept="image/*"
              currentUrl={`${SUPABASE_URL}/storage/v1/object/public/calendar-bg/calendar-bg`}
              previewType="image"
              onSuccess={url => showToast("캘린더 배경 업로드 완료 ✓")}
            />
            <MediaUploadCard
              title="오시는 길 약도 이미지"
              description="오시는 길 섹션에 표시되는 약도 이미지예요."
              bucket="location-map"
              uploadPath="location-map"
              accept="image/*"
              currentUrl={`${SUPABASE_URL}/storage/v1/object/public/location-map/location-map`}
              previewType="image"
              onSuccess={url => showToast("약도 이미지 업로드 완료 ✓")}
            />
            <MediaUploadCard
              title="BGM"
              description="청첩장 배경음악이에요. mp3 파일을 업로드하세요."
              bucket="bgm"
              uploadPath="wedding-bgm.mp3"
              accept="audio/*"
              currentUrl={`${SUPABASE_URL}/storage/v1/object/public/bgm/wedding-bgm.mp3`}
              previewType="audio"
              onSuccess={url => showToast("BGM 업로드 완료 ✓")}
            />
          </div>
        )}

        {/* 섹션 관리 탭 */}
        {tab === "sections" && (
          <Card title="섹션 순서 및 활성화">
            <p className="text-xs text-gray-400 mb-4">위/아래 버튼으로 순서를 변경하고, 토글로 섹션을 켜고 끌 수 있어요.</p>
            <div className="space-y-2">
              {[...(config.sections ?? [])].sort((a, b) => a.order - b.order).map((section, idx, arr) => (
                <div key={section.id} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <button disabled={idx === 0}
                      onClick={() => {
                        const prev = arr[idx - 1]
                        const updated = config.sections.map(s => {
                          if (s.id === section.id) return { ...s, order: prev.order }
                          if (s.id === prev.id) return { ...s, order: section.order }
                          return s
                        })
                        setConfig({ ...config, sections: updated })
                      }}
                      className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none">▲</button>
                    <button disabled={idx === arr.length - 1}
                      onClick={() => {
                        const next = arr[idx + 1]
                        const updated = config.sections.map(s => {
                          if (s.id === section.id) return { ...s, order: next.order }
                          if (s.id === next.id) return { ...s, order: section.order }
                          return s
                        })
                        setConfig({ ...config, sections: updated })
                      }}
                      className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none">▼</button>
                  </div>
                  <span className="flex-1 text-sm font-medium text-gray-800">{section.label}</span>
                  <button
                    onClick={() => {
                      const updated = config.sections.map(s =>
                        s.id === section.id ? { ...s, enabled: !s.enabled } : s
                      )
                      setConfig({ ...config, sections: updated })
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${section.enabled ? "bg-gray-900" : "bg-gray-300"}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${section.enabled ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={saveConfig} disabled={saving}
              className="mt-6 w-full rounded-lg bg-gray-900 py-3 text-sm font-medium text-white disabled:opacity-50">
              {saving ? "저장 중..." : "저장하기"}
            </button>
          </Card>
        )}

        {/* 갤러리 탭 */}
        {tab === "gallery" && (
          <Card title="갤러리 이미지">
            <p className="text-xs text-gray-400 mb-4">이미지를 직접 업로드하거나 URL로 추가할 수 있어요.</p>

            {/* 파일 업로드 */}
            <GalleryUploader slug={SLUG} onAdd={img => { setGallery(prev => [...prev, img]); showToast("추가되었습니다 ✓") }} galleryCount={gallery.length} />

            {/* URL 직접 입력 */}
            <div className="mt-3 flex gap-2">
              <input id="gallery-url-input" placeholder="또는 이미지 URL 직접 입력"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-700" />
              <button onClick={async () => {
                const input = document.getElementById("gallery-url-input") as HTMLInputElement
                const url = input.value.trim()
                if (!url) return
                const res = await fetch("/api/gallery", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ slug: SLUG, url, order_index: gallery.length }),
                })
                const data = await res.json()
                if (res.ok) { setGallery(prev => [...prev, data]); input.value = ""; showToast("추가되었습니다 ✓") }
                else showToast("추가 실패")
              }}
                className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800">
                추가
              </button>
            </div>

            {/* 이미지 목록 */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {gallery.map((img, i) => (
                <div key={img.id} className="relative group aspect-square">
                  <img src={img.url} alt={`갤러리 ${i + 1}`} className="w-full h-full object-cover rounded-lg" />
                  <button onClick={async () => {
                    await fetch("/api/gallery", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: img.id }),
                    })
                    setGallery(prev => prev.filter(g => g.id !== img.id))
                    showToast("삭제되었습니다")
                  }}
                    className="absolute top-1 right-1 hidden group-hover:flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                    ×
                  </button>
                </div>
              ))}
            </div>
            {gallery.length === 0 && <p className="text-center text-sm text-gray-400 py-8">이미지가 없어요.</p>}
          </Card>
        )}

        {/* 계좌번호 탭 */}
        {tab === "accounts" && (
          <div className="space-y-4">
            {(["groom", "bride"] as const).map(side => (
              <Card key={side} title={side === "groom" ? "신랑측 계좌" : "신부측 계좌"}>
                <div className="space-y-3">
                  {accounts.filter(a => a.side === side).map((acc) => (
                    <div key={acc.id} className="rounded-xl border border-gray-200 p-4 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Field label="이름(라벨)"><Input value={acc.label} onChange={v => setAccounts(prev => prev.map(a => a.id === acc.id ? { ...a, label: v } : a))} /></Field>
                        <Field label="은행"><Input value={acc.bank} onChange={v => setAccounts(prev => prev.map(a => a.id === acc.id ? { ...a, bank: v } : a))} /></Field>
                        <Field label="예금주"><Input value={acc.holder} onChange={v => setAccounts(prev => prev.map(a => a.id === acc.id ? { ...a, holder: v } : a))} /></Field>
                        <Field label="계좌번호"><Input value={acc.account_number} onChange={v => setAccounts(prev => prev.map(a => a.id === acc.id ? { ...a, account_number: v } : a))} /></Field>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={async () => {
                          const res = await fetch("/api/accounts", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(acc) })
                          if (res.ok) showToast("저장되었습니다 ✓")
                          else showToast("저장 실패")
                        }} className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white">저장</button>
                        <button onClick={async () => {
                          await fetch("/api/accounts", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: acc.id }) })
                          setAccounts(prev => prev.filter(a => a.id !== acc.id))
                          showToast("삭제되었습니다")
                        }} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50">삭제</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={async () => {
                    const newAcc = { slug: SLUG, side, label: "", bank: "", holder: "", account_number: "", order_index: accounts.filter(a => a.side === side).length }
                    const res = await fetch("/api/accounts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newAcc) })
                    const data = await res.json()
                    if (res.ok) { setAccounts(prev => [...prev, data]); showToast("추가되었습니다 ✓") }
                  }}
                    className="w-full rounded-lg border border-dashed border-gray-300 py-2.5 text-sm text-gray-500 hover:border-gray-500">
                    + 계좌 추가
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900 px-5 py-2.5 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

// ─── 미디어 업로드 카드 ───────────────────────────────────────────────
function MediaUploadCard({
  title, description, bucket, uploadPath, accept, currentUrl, previewType, onSuccess,
}: {
  title: string
  description: string
  bucket: string
  uploadPath: string
  accept: string
  currentUrl: string
  previewType: "image" | "audio"
  onSuccess: (url: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploaded, setUploaded] = useState(false)

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("bucket", bucket)
      formData.append("path", uploadPath)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (res.ok) {
        setPreview(data.url + "?t=" + Date.now())
        setUploaded(true)
        onSuccess(data.url)
      }
    } finally { setUploading(false) }
  }

  return (
    <Card title={title}>
      <p className="mb-4 text-xs text-gray-400">{description}</p>

      {/* 현재 미디어 미리보기 */}
      {previewType === "image" && (
        <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
          <img
            src={preview ?? (currentUrl + "?t=" + Date.now())}
            alt={title}
            className="w-full max-h-48 object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = "none" }}
          />
        </div>
      )}
      {previewType === "audio" && (
        <div className="mb-4">
          <audio controls className="w-full" src={preview ?? currentUrl} key={preview ?? currentUrl}>
            브라우저가 오디오를 지원하지 않아요.
          </audio>
        </div>
      )}

      {/* 업로드 버튼 */}
      <input ref={fileRef} type="file" accept={accept} className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f) }} />
      <button onClick={() => fileRef.current?.click()} disabled={uploading}
        className={`w-full rounded-lg border-2 border-dashed py-4 text-sm font-medium transition
          ${uploaded ? "border-green-400 bg-green-50 text-green-700" : "border-gray-300 text-gray-600 hover:border-gray-500 hover:bg-gray-50"}
          disabled:opacity-50`}>
        {uploading ? "업로드 중..." : uploaded ? "✓ 업로드 완료 (다시 업로드하려면 클릭)" : "클릭해서 파일 선택"}
      </button>
    </Card>
  )
}

// ─── 갤러리 파일 업로더 ───────────────────────────────────────────────
function GalleryUploader({ slug, onAdd, galleryCount }: {
  slug: string
  galleryCount: number
  onAdd: (img: GalleryImage) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFiles = async (files: FileList) => {
    setUploading(true)
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const path = `${slug}/${Date.now()}-${i}-${file.name}`
      const formData = new FormData()
      formData.append("file", file)
      formData.append("bucket", "gallery")
      formData.append("path", path)

      try {
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
        const uploadData = await uploadRes.json()
        if (!uploadRes.ok) continue

        const saveRes = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, url: uploadData.url, order_index: galleryCount + i }),
        })
        const saved = await saveRes.json()
        if (saveRes.ok) onAdd(saved)
      } catch {}
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ""
  }

  return (
    <>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
        onChange={e => { if (e.target.files?.length) handleFiles(e.target.files) }} />
      <button onClick={() => fileRef.current?.click()} disabled={uploading}
        className="w-full rounded-lg border-2 border-dashed border-gray-300 py-4 text-sm font-medium text-gray-600 hover:border-gray-500 hover:bg-gray-50 disabled:opacity-50">
        {uploading ? "업로드 중..." : "📷 이미지 파일 선택 (여러 장 가능)"}
      </button>
    </>
  )
}

// ─── 공통 UI ─────────────────────────────────────────────────────────
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="mb-5 text-sm font-semibold text-gray-900">{title}</h3>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-500">{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-700" />
  )
}

function ArrayField({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-medium text-gray-500">{label}</label>
        <button onClick={() => onChange([...items, ""])} className="text-xs text-gray-400 hover:text-gray-700">+ 추가</button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input value={item} onChange={e => { const next = [...items]; next[i] = e.target.value; onChange(next) }}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-700" />
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-sm px-2">×</button>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-gray-400">항목이 없어요.</p>}
      </div>
    </div>
  )
}
