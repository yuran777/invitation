"use client"
import { useEffect, useState } from "react"
import SectionTitle from "../SectionTitle"

type GuestbookItem = {
  id: string
  name: string
  message: string
  likes: number
  created_at: string
}

export default function GuestbookSection({ slug }: { slug: string }) {
  const [items, setItems] = useState<GuestbookItem[]>([])
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")

  const fetchItems = async () => {
    try {
      setFetching(true)
      const res = await fetch(`/api/guestbook?slug=${slug}`, { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setItems(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류")
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => { fetchItems() }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) { setError("이름과 메시지를 입력해주세요."); return }
    setError("")
    try {
      setLoading(true)
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setItems(prev => [data, ...prev])
      setName(""); setMessage("")
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류")
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (id: string) => {
    if (localStorage.getItem(`liked-${id}`)) { alert("이미 좋아요를 눌렀어요."); return }
    try {
      const res = await fetch("/api/guestbook", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setItems(prev => prev.map(item => item.id === id ? { ...item, likes: data.likes } : item))
      localStorage.setItem(`liked-${id}`, "true")
    } catch (e) { alert(e instanceof Error ? e.message : "오류") }
  }

  const handleDelete = async (id: string) => {
    const pw = window.prompt("관리자 비밀번호를 입력해주세요.")
    if (!pw) return
    try {
      const res = await fetch("/api/guestbook", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, adminPassword: pw }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setItems(prev => prev.filter(item => item.id !== id))
    } catch (e) { alert(e instanceof Error ? e.message : "오류") }
  }

  return (
    <section className="px-6 py-12 md:px-10">
      <SectionTitle en="GUESTBOOK" ko="마음 전하실 곳" />

      <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded-2xl border border-gray-200 p-5">
        <input type="text" placeholder="이름" value={name} onChange={e => setName(e.target.value)} maxLength={20}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900" />
        <textarea placeholder="축하 메시지를 남겨주세요" value={message} onChange={e => setMessage(e.target.value)}
          maxLength={300} rows={4}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 resize-none" />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full rounded-lg bg-gray-900 py-3 text-sm font-medium text-white disabled:opacity-60">
          {loading ? "등록 중..." : "방명록 남기기"}
        </button>
      </form>

      <div className="overflow-y-auto space-y-3" style={{ maxHeight: "360px" }}>
        {fetching ? (
          <p className="text-center text-sm text-gray-400">불러오는 중...</p>
        ) : items.length === 0 ? (
          <p className="text-center text-sm text-gray-400">첫 번째 축하 메시지를 남겨보세요.</p>
        ) : items.map(item => (
          <article key={item.id} className="rounded-xl border border-gray-200 p-3">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <strong className="text-xs font-semibold text-gray-900">{item.name}</strong>
              <span className="text-[11px] text-gray-400">{new Date(item.created_at).toLocaleString("ko-KR")}</span>
            </div>
            <p className="mb-2.5 whitespace-pre-line text-xs leading-5 text-gray-700">{item.message}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => handleLike(item.id)}
                className="rounded-md border border-pink-200 px-2 py-1 text-xs text-pink-600 hover:bg-pink-50">
                ❤️ 좋아요 {item.likes ?? 0}
              </button>
              <button type="button" onClick={() => handleDelete(item.id)}
                className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50">
                삭제
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
