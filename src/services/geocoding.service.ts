import axios from 'axios'
import {
  NOMINATIM_BASE_URL,
  NOMINATIM_USER_AGENT,
} from '../constants/geocoding.constants'
import type {
  GeocodingResult,
  NominatimSearchResult,
} from '../models/geocoding.model'

const nominatimClient = axios.create({
  baseURL: NOMINATIM_BASE_URL,
  timeout: 12_000,
  headers: {
    Accept: 'application/json',
    'Accept-Language': 'en',
  },
})

nominatimClient.interceptors.request.use((config) => {
  config.headers['User-Agent'] = NOMINATIM_USER_AGENT
  return config
})

function pickCity(address: NominatimSearchResult['address']): string {
  if (!address) return ''
  return (
    address.city ??
    address.town ??
    address.village ??
    address.municipality ??
    ''
  )
}

function mapNominatimResult(entry: NominatimSearchResult): GeocodingResult {
  const lat = Number.parseFloat(entry.lat)
  const lon = Number.parseFloat(entry.lon)
  const city = pickCity(entry.address)
  const region = entry.address?.state ?? entry.address?.county ?? ''
  const country = entry.address?.country ?? ''
  const countryCode = (entry.address?.country_code ?? '').toUpperCase()

  return {
    lat,
    lon,
    displayName: entry.display_name,
    city: city || entry.display_name.split(',')[0]?.trim() || 'Unknown',
    region,
    country,
    countryCode,
  }
}

export async function geocodePlace(query: string): Promise<GeocodingResult> {
  const trimmed = query.trim()
  if (!trimmed) {
    throw new Error('Enter a place name or coordinates.')
  }

  try {
    return await fetchNominatim(trimmed)
  } catch (error) {
    if (axios.isAxiosError(error) && !error.response) {
      throw new Error(
        'Could not reach the geocoding service. Check your connection or try again.',
      )
    }
    throw error
  }
}

async function fetchNominatim(trimmed: string): Promise<GeocodingResult> {
  const { data } = await nominatimClient.get<NominatimSearchResult[]>('/search', {
    params: {
      q: trimmed,
      format: 'json',
      limit: 1,
      addressdetails: 1,
    },
  })

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`No results for "${trimmed}". Try a city or region name.`)
  }

  const result = mapNominatimResult(data[0])
  if (Number.isNaN(result.lat) || Number.isNaN(result.lon)) {
    throw new Error('Geocoding returned invalid coordinates.')
  }

  return result
}

