export type Section = {
  id: string
  label: string
  enabled: boolean
  order: number
}

export type Contact = {
  role: "groom" | "bride"
  name: string
  phone: string
}

export type Account = {
  id?: string
  side: "groom" | "bride"
  label: string
  bank: string
  holder: string
  account_number: string
  order_index?: number
}

export type GalleryImage = {
  id: string
  url: string
  order_index: number
}

export type InvitationConfig = {
  id?: string
  slug: string
  groom_name: string
  bride_name: string
  groom_father: string
  groom_mother: string
  bride_father: string
  bride_mother: string
  wedding_date: string
  wedding_date_text: string
  venue_name: string
  venue_hall: string
  venue_address: string
  message: string
  map_kakao: string
  map_naver: string
  map_google: string
  location_subway: string[]
  location_bus: string[]
  location_parking: string[]
  contacts: Contact[]
  sections: Section[]
}
