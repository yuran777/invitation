export default function SectionTitle({ en, ko }: { en: string; ko: string }) {
  return (
    <div className="mb-10 text-center">
      <p className="mb-2 text-xs tracking-[0.4em] text-gray-400">{en}</p>
      <h2 className="text-[28px] font-light text-gray-900">{ko}</h2>
      <div className="mx-auto mt-3 h-px w-10 bg-gray-300" />
    </div>
  )
}
