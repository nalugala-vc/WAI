export interface TreeHealthBreakdown {
  healthy: number
  needs_care: number
  needs_replacement: number
}

export interface CVDebug {
  orig_resolution: string
  work_resolution: string
  canopy_px: number
  peaks_detected: number
  after_area_filter: number
}

export interface TreeAnalysisResult {
  analysis_id: string
  timestamp: string
  farmer_id: string | null
  county: string | null
  location: string | null
  land_acres: number | null
  total_tree_count: number
  tree_density_per_acre: number | null
  confidence_score: number
  canopy_coverage_pct: number
  tree_health: TreeHealthBreakdown
  low_confidence: boolean
  tree_species_guess: string | null
  observations: string[]
  recommendations: string[]
  original_image_url: string
  overlay_image_url: string
  cv_debug: CVDebug
}

export interface TreeAnalysisHistory {
  analyses: TreeAnalysisResult[]
  next_cursor: string | null
}

export interface TreeQuota {
  plan: string
  used: number
  limit: number
  remaining: number
  unlimited: boolean
  resets_at: string
}

export interface AnalyzeTreesPayload {
  image: File
  farmerId?: string
  county?: string
  landAcres?: number
  location?: string
  notes?: string
}
