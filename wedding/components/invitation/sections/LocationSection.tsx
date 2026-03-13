import type { InvitationConfig } from "@/types/invitation"
import SectionTitle from "../SectionTitle"

export default function LocationSection({ config }: { config: InvitationConfig }) {
  return (
    <section className="px-6 py-12 md:px-10">
      <SectionTitle en="LOCATION" ko="오시는 길" />
      <div className="overflow-hidden rounded-[22px] border border-gray-200">
        <img
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/location-map/location-map`}
          alt="약도"
          className="w-full object-cover"
          onError={e => { (e.target as HTMLImageElement).style.display = "none" }}
        />
      </div>
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900">{config.venue_name}</h3>
        <p className="mt-2 text-sm text-gray-500">{config.venue_hall}</p>
        <p className="mt-2 text-sm text-gray-600">{config.venue_address}</p>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {config.map_kakao && (
          <a href={config.map_kakao} target="_blank" rel="noreferrer"
            className="rounded-lg px-4 py-2 text-sm font-medium text-black" style={{ backgroundColor: "#FAE100" }}>
            카카오맵
          </a>
        )}
        {config.map_naver && (
          <a href={config.map_naver} target="_blank" rel="noreferrer"
            className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white">
            네이버지도
          </a>
        )}
        {config.map_google && (
          <a href={config.map_google} target="_blank" rel="noreferrer"
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white">
            구글맵
          </a>
        )}
      </div>
      <div className="mt-10 space-y-6 rounded-[22px] bg-gray-50 p-5">
        {config.location_subway?.length > 0 && <InfoBlock title="지하철" items={config.location_subway} />}
        {config.location_bus?.length > 0 && <InfoBlock title="버스" items={config.location_bus} />}
        {config.location_parking?.length > 0 && <InfoBlock title="주차" items={config.location_parking} />}
      </div>
    </section>
  )
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-gray-900">{title}</p>
      {items.map((item, i) => <p key={i} className="text-sm leading-6 text-gray-600">{item}</p>)}
    </div>
  )
}
