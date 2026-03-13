"use client"
import { useState } from "react"
import type { InvitationConfig, Contact } from "@/types/invitation"

export default function MessageSection({ config }: { config: InvitationConfig }) {
  const [showContacts, setShowContacts] = useState(false)
  const contacts = config.contacts ?? []

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  return (
    <section className="px-8 py-16 text-center md:px-14">
      <p className="whitespace-pre-line text-sm leading-8 text-gray-700 md:text-base">
        {config.message}
      </p>

      {(config.groom_father || config.bride_father) && (
        <div className="mt-10 space-y-3 text-sm text-gray-600">
          {config.groom_father && (
            <p>{config.groom_father} · {config.groom_mother}의 아들 <strong className="ml-1 text-gray-900">{config.groom_name}</strong></p>
          )}
          {config.bride_father && (
            <p>{config.bride_father} · {config.bride_mother}의 딸 <strong className="ml-1 text-gray-900">{config.bride_name}</strong></p>
          )}
        </div>
      )}

      {contacts.length > 0 && (
        <div className="mt-10">
          {contacts.length === 1 ? (
            <button
              onClick={() => handleCall(contacts[0].phone)}
              className="inline-block rounded-xl bg-gray-900 px-10 py-3.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              연락하기
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowContacts(v => !v)}
                className="inline-block rounded-xl bg-gray-900 px-10 py-3.5 text-sm font-medium text-white hover:bg-gray-800"
              >
                연락하기
              </button>
              {showContacts && (
                <div className="mt-4 space-y-2">
                  {contacts.map((c, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-gray-200 px-5 py-3 text-sm">
                      <span className="text-gray-700">
                        {c.role === "groom" ? "신랑" : "신부"} {c.name}
                      </span>
                      <button
                        onClick={() => handleCall(c.phone)}
                        className="rounded-lg bg-gray-900 px-4 py-1.5 text-xs text-white hover:bg-gray-700"
                      >
                        전화하기
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  )
}
