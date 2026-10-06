export interface Band {
  id: number
  name: string
  name_slug: string
  description: string
  country: string
  city: string
  status: 'Active' | 'Split-up' | 'On hold' | 'Changed name' | 'Disputed' | 'Unknown'
  formed_in: string
  years_active: string
  genres: string
  themes: string
  label: string
  links: SocialLink[]
  logo_url: string | null
  photo_url: string | null
  discography: Album[]
  current_lineup: MemberLineUp[]
  past_lineup: MemberLineUp[]
  updated_at: string
}

export interface SocialLink {
  social: string
  url: string
}

export interface Album {
  id: number
  title: string
  title_slug: string
  band_ids: number[]
  band_names: string[]
  band_names_slug: string[]
  type: 'Full-length' | 'EP' | 'Single' | 'Demo' | 'Split'
  release_date: string
  label: string
  cover_url: string | null
  cover_loading: boolean
  tracklist: Track[]
  current_lineup: MemberLineUp[]
  updated_at: string
}

export interface MemberLineUp {
  id: number
  fullname: string
  fullname_slug: string
  role: string
  other_bands: {
    id: number
    name: string
    name_slug: string
  }[]
  url: string
}
export interface ArtistBand {
  id: number | null
  name: string
  name_slug: string
  albums: []
  role: string
}

export interface BandArtist {
  id: number
  fullname: string
  fullname_slug: string
  age: string
  biography?: string
  gender: string
  guest_session: ArtistBand[]
  links: SocialLink[]
  live: ArtistBand[]
  misc_staff: ArtistBand[]
  active_bands: ArtistBand[]
  past_bands: ArtistBand[]
  photo_url?: string
  place_of_birth?: string
  updated_at: string
}

export interface Track {
  id: number | string | null
  number: number
  title: string
  duration: string
  lyrics: string
  cd_number: number | null
  side: number | null
  show_lyrics: boolean | null
  is_edit?: boolean
  url: string
}
