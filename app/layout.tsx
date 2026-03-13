import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "모바일 청첩장",
  description: "모바일 청첩장",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
          crossOrigin="anonymous" async />
      </head>
      <body>{children}</body>
    </html>
  )
}
