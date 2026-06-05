import type { VercelRequest, VercelResponse } from '@vercel/node'

export const config = {
  api: {
    bodyParser: false,
  },
}

const UPSTREAM = 'https://api.weather-ai.co'

const FORWARD_RESPONSE_HEADERS = [
  'content-type',
  'x-ai-requested',
  'x-ai-allow',
  'x-ai-applied',
]

function readRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function resolveUpstreamPath(req: VercelRequest): string {
  const fromQuery = req.query.path
  if (fromQuery) {
    const parts = Array.isArray(fromQuery) ? fromQuery : [String(fromQuery)]
    return parts.join('/')
  }

  const rawUrl = req.url ?? ''
  const pathname = rawUrl.split('?')[0] ?? ''
  const prefix = '/api/wai/'
  if (pathname.startsWith(prefix)) {
    return pathname.slice(prefix.length)
  }

  return ''
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  const apiKey = process.env.VITE_WAI_API_KEY
  if (!apiKey) {
    res.status(500).json({
      error: 'Weather-AI API key is not configured on the server.',
    })
    return
  }

  const upstreamPath = resolveUpstreamPath(req)
  if (!upstreamPath) {
    res.status(400).json({ error: 'Missing Weather-AI API path.' })
    return
  }

  const url = new URL(`${UPSTREAM}/${upstreamPath}`)

  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'path' || value === undefined) continue
    if (Array.isArray(value)) {
      for (const entry of value) url.searchParams.append(key, entry)
    } else {
      url.searchParams.set(key, String(value))
    }
  }

  const method = req.method ?? 'GET'
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
  }

  const contentType = req.headers['content-type']
  if (contentType) {
    headers['Content-Type'] = contentType
  }

  let body: Buffer | undefined
  if (method !== 'GET' && method !== 'HEAD') {
    body = await readRawBody(req)
  }

  try {
    const upstream = await fetch(url.toString(), {
      method,
      headers,
      body: body?.length ? body : undefined,
    })

    for (const name of FORWARD_RESPONSE_HEADERS) {
      const value = upstream.headers.get(name)
      if (value) res.setHeader(name, value)
    }

    const payload = await upstream.arrayBuffer()
    res.status(upstream.status).send(Buffer.from(payload))
  } catch {
    res.status(502).json({ error: 'Failed to reach Weather-AI API.' })
  }
}
