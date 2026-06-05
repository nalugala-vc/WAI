import { ENDPOINTS } from '../constants/api.constants'
import type {
  AnalyzeTreesPayload,
  TreeAnalysisHistory,
  TreeAnalysisResult,
  TreeQuota,
} from '../models/trees.model'
import { apiClient } from './api.client'

function normalizeTreeResult(raw: TreeAnalysisResult): TreeAnalysisResult {
  return {
    ...raw,
    observations: raw.observations ?? [],
    recommendations: raw.recommendations ?? [],
    tree_health: raw.tree_health ?? {
      healthy: 0,
      needs_care: 0,
      needs_replacement: 0,
    },
    confidence_score: raw.confidence_score ?? 0,
    total_tree_count: raw.total_tree_count ?? 0,
    low_confidence: raw.low_confidence ?? true,
  }
}

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
    { params: { ai: false } },
  )
  return normalizeTreeResult(data)
}

export async function fetchTreeHistory(
  limit = 20,
  cursor?: string,
): Promise<TreeAnalysisHistory> {
  const { data } = await apiClient.get<TreeAnalysisHistory>(
    ENDPOINTS.TREES_HISTORY,
    {
      params: {
        ai: false,
        limit,
        ...(cursor ? { cursor } : {}),
      },
    },
  )
  return {
    ...data,
    analyses: (data.analyses ?? []).map(normalizeTreeResult),
  }
}

export async function fetchTreeQuota(): Promise<TreeQuota> {
  const { data } = await apiClient.get<TreeQuota>(ENDPOINTS.TREES_QUOTA, {
    params: { ai: false },
  })
  return data
}
