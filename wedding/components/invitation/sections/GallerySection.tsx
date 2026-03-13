"use client"
import { useState } from "react"
import type { GalleryImage } from "@/types/invitation"
import SectionTitle from "../SectionTitle"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export default function GallerySection({ gallery }: { gallery: GalleryImage[]; slug: string }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? gallery : gallery.slice(0, 9)

  return (
    <section className="px-6 py-12 md:px-10">
      <SectionTitle en="GALLERY" ko="웨딩 사진" />
      <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
        {visible.map((img, i) => (
          <img key={img.id} src={img.url} alt={`갤러리 ${i + 1}`}
            className="aspect-square cursor-pointer rounded-lg object-cover transition-transform hover:scale-[1.03]"
            onClick={() => setSelected(gallery.findIndex(g => g.id === img.id))} />
        ))}
      </div>
      {gallery.length > 9 && !showAll && (
        <div className="mt-6 text-center">
          <button onClick={() => setShowAll(true)}
            className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800">
            더보기
          </button>
        </div>
      )}

      {selected !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4"
          onClick={() => setSelected(null)}>
          <button className="absolute right-6 top-6 text-4xl text-white" onClick={() => setSelected(null)}>×</button>
          <div className="w-full max-w-[960px]" onClick={e => e.stopPropagation()}>
            <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }}
              initialSlide={selected} spaceBetween={16} className="w-full">
              {gallery.map((img, i) => (
                <SwiperSlide key={img.id}>
                  <div className="flex items-center justify-center">
                    <img src={img.url} alt={`갤러리 ${i + 1}`}
                      className="max-h-[88vh] max-w-[90vw] rounded-xl object-contain" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </section>
  )
}
