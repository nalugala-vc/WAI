import { ENDPOINTS } from '../constants/api.constants'
import type {
  AnalyzeTreesPayload,
  TreeAnalysisHistory,
  TreeAnalysisResult,
  TreeQuota,
} from '../models/trees.model'
import { apiClient } from './api.client'

function appendIfDefined(
  formData: FormData,
  key: string,
  value: string | number | undefined,
): void {
  if (value !== undefined && value !== '') {
    formData.append(key, String(value))
  }
}

export async function analyzeTrees(
  payload: AnalyzeTreesPayload,
): Promise<TreeAnalysisResult> {
  const formData = new FormData()
  formData.append('image', payload.image)

  appendIfDefined(formData, 'farmer_id', payload.farmerId)
  appendIfDefined(formData, 'county', payload.county)
  appendIfDefined(formData, 'land_acres', payload.landAcres)
  appendIfDefined(formData, 'location', payload.location)
  appendIfDefined(formData, 'notes', payload.notes)

  const { data } = await apiClient.post<TreeAnalysisResult>(
    ENDPOINTS.TREES_ANALYZE,
    formData,
  )
  return data
}

export async function fetchTreeHistory(
  limit = 20,
  cursor?: string,
): Promise<TreeAnalysisHistory> {
  const { data } = await apiClient.get<TreeAnalysisHistory>(
    ENDPOINTS.TREES_HISTORY,
    {
      params: {
        limit,
        ...(cursor ? { cursor } : {}),
      },
    },
  )
  return data
}

export async function fetchTreeQuota(): Promise<TreeQuota> {
  const { data } = await apiClient.get<TreeQuota>(ENDPOINTS.TREES_QUOTA)
  return data
}
