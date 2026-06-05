export interface GeocodingResult {
  lat: number
  lon: number
  displayName: string
  city: string
  region: string
  country: string
  countryCode: string
}

export interface NominatimAddress {
  city?: string
  town?: string
  village?: string
  municipality?: string
  county?: string
  state?: string
  country?: string
  country_code?: string
}

export interface NominatimSearchResult {
  lat: string
  lon: string
  display_name: string
  address?: NominatimAddress
}
