import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { TreeAnalysisRequest } from '../models/trees.model'
import { analyzeTrees, fetchTreeHistory } from '../services/trees.service'

export const treesQueryKeys = {
  all: ['trees'] as const,
  history: () => [...treesQueryKeys.all, 'history'] as const,
}

export function useTreeHistoryQuery() {
  return useQuery({
    queryKey: treesQueryKeys.history(),
    queryFn: fetchTreeHistory,
  })
}

export function useTreeAnalysisMutation() {
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  const mutation = useMutation({
    mutationFn: (payload: TreeAnalysisRequest) => analyzeTrees(payload),
  })

  return {
    uploadFile,
    setUploadFile,
    analyze: mutation.mutate,
    analyzeAsync: mutation.mutateAsync,
    isAnalyzing: mutation.isPending,
    analysisError: mutation.error,
    analysisData: mutation.data,
    resetAnalysis: mutation.reset,
  }
}
