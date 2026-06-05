import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import type {
  AnalyzeTreesPayload,
  TreeAnalysisResult,
  TreeQuota,
} from '../models/trees.model'
import {
  analyzeTrees,
  fetchTreeHistory,
  fetchTreeQuota,
} from '../services/trees.service'

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export function useTreesViewModel() {
  const queryClient = useQueryClient()

  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')
  const [currentResult, setCurrentResult] = useState<TreeAnalysisResult | null>(
    null,
  )

  const [farmerId, setFarmerId] = useState('')
  const [county, setCounty] = useState('')
  const [landAcres, setLandAcres] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')

  const historyQuery = useQuery({
    queryKey: ['tree-history'],
    queryFn: () => fetchTreeHistory(20),
  })

  const quotaQuery = useQuery({
    queryKey: ['tree-quota'],
    queryFn: fetchTreeQuota,
  })

  const uploadMutation = useMutation({
    mutationFn: analyzeTrees,
    onMutate: () => {
      setUploadStatus('uploading')
    },
    onSuccess: (data) => {
      setCurrentResult(data)
      setUploadStatus('success')
      void queryClient.invalidateQueries({ queryKey: ['tree-history'] })
    },
    onError: () => {
      setUploadStatus('error')
    },
  })

  const uploadAnalysis = useCallback(
    (payload: AnalyzeTreesPayload) => {
      uploadMutation.mutate(payload)
    },
    [uploadMutation],
  )

  const selectResult = useCallback((result: TreeAnalysisResult) => {
    setCurrentResult(result)
    setUploadStatus('success')
  }, [])

  const reset = useCallback(() => {
    setCurrentResult(null)
    setUploadStatus('idle')
    setFarmerId('')
    setCounty('')
    setLandAcres('')
    setLocation('')
    setNotes('')
    uploadMutation.reset()
  }, [uploadMutation])

  const history: TreeAnalysisResult[] = historyQuery.data?.analyses ?? []
  const quota: TreeQuota | null = quotaQuery.data ?? null

  return {
    uploadStatus,
    uploadAnalysis,
    currentResult,
    farmerId,
    county,
    landAcres,
    location,
    notes,
    setFarmerId,
    setCounty,
    setLandAcres,
    setLocation,
    setNotes,
    history,
    isHistoryLoading: historyQuery.isLoading,
    quota,
    selectResult,
    reset,
  }
}
