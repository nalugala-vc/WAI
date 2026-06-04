import { TREES_ENDPOINTS } from '../constants/api.constants'
import type {
  TreeAnalysisRequest,
  TreeAnalysisResponse,
  TreeHistoryEntry,
} from '../models/trees.model'
import { apiClient } from './api.client'

export async function analyzeTrees(
  payload: TreeAnalysisRequest,
): Promise<TreeAnalysisResponse> {
  const { data } = await apiClient.post<TreeAnalysisResponse>(
    TREES_ENDPOINTS.ANALYZE,
    payload,
  )
  return data
}

export async function fetchTreeHistory(): Promise<TreeHistoryEntry[]> {
  const { data } = await apiClient.get<TreeHistoryEntry[]>(
    TREES_ENDPOINTS.HISTORY,
  )
  return data
}
