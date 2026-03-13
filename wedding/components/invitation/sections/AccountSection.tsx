"use client"
import { useMemo, useState } from "react"
import { Check, ChevronDown, Copy } from "lucide-react"
import type { Account } from "@/types/invitation"
import SectionTitle from "../SectionTitle"

export default function AccountSection({ accounts }: { accounts: Account[] }) {
  const [openSide, setOpenSide] = useState<"groom" | "bride" | null>(null)
  const [toast, setToast] = useState("")
  const [copied, setCopied] = useState("")

  const groomAccounts = useMemo(() => accounts.filter(a => a.side === "groom"), [accounts])
  const brideAccounts = useMemo(() => accounts.filter(a => a.side === "bride"), [accounts])

  const handleCopy = async (account: Account) => {
    try {
      await navigator.clipboard.writeText(account.account_number)
      setCopied(account.account_number)
      setToast("계좌번호가 복사되었습니다.")
      setTimeout(() => { setToast(""); setCopied("") }, 1800)
    } catch { setToast("복사 실패"); setTimeout(() => setToast(""), 1800) }
  }

  return (
    <section className="px-6 py-12 md:px-10">
      <SectionTitle en="ACCOUNT" ko="마음 전하실 곳" />
      <div className="mb-10 text-center text-[17px] leading-[2] text-gray-700">
        <p>멀리서도 축하의 마음을 전하고 싶으신 분들을 위해</p>
        <p>계좌번호를 안내드립니다.</p>
      </div>
      {[{ side: "groom" as const, label: "신랑측 계좌번호", list: groomAccounts },
        { side: "bride" as const, label: "신부측 계좌번호", list: brideAccounts }].map(({ side, label, list }) => (
        <div key={side} className="border-b border-gray-200">
          <button type="button" onClick={() => setOpenSide(p => p === side ? null : side)}
            className="flex w-full items-center justify-between py-6">
            <span className="text-[18px] font-semibold text-gray-900">{label}</span>
            <ChevronDown size={24} className={`text-gray-400 transition-transform ${openSide === side ? "rotate-180" : ""}`} />
          </button>
          {openSide === side && (
            <div className="pb-6 space-y-4">
              {list.map((acc, i) => (
                <div key={i} className="flex items-center justify-between rounded-[18px] bg-gray-50 px-6 py-5">
                  <div>
                    <p className="mb-1 text-[17px] font-semibold text-gray-900">{acc.label}</p>
                    <p className="text-[15px] text-gray-600">{acc.bank} (예금주: {acc.holder}) {acc.account_number}</p>
                  </div>
                  <button type="button" onClick={() => handleCopy(acc)} className="ml-4 shrink-0 text-gray-500">
                    {copied === acc.account_number ? <Check size={24} /> : <Copy size={24} />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {toast && (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </section>
  )
}
