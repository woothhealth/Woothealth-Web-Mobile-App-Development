export function normalizeType(s?: any) {
  if (!s) return ''
  return String(s).toLowerCase().replace(/\s+/g, '').replace(/clinic|center|hospital|facility/g, '').trim()
}

export const buildTierKeys = (t: string) => {
  if (!t) return [] as string[]
  // remove leading "tier" if present, e.g. "Tier C" -> "C"; preserve plus signs
  const cleaned = t.toString().replace(/tier/i, '').replace(/\s+/g, '').replace(/\+/g, 'Plus')
  return [
    `tier${cleaned}`,
    `tier${cleaned.toLowerCase()}`,
    `tier${cleaned.toUpperCase()}`,
    `price${cleaned}`,
    `price${cleaned.toLowerCase()}`,
    `price${cleaned.toUpperCase()}`,
    cleaned,
    cleaned.toLowerCase(),
    cleaned.toUpperCase(),
  ].filter(Boolean)
}

export const findAmount = (t: any, tierCandidates: string[]) => {
  const nestedKeys = ['prices', 'price', 'tiers', 'amounts', 'rates']
  if (!t) return null
  for (const k of tierCandidates) {
    if (t[k] != null) return Number(t[k])
  }
  for (const nk of nestedKeys) {
    const obj = t[nk]
    if (obj && typeof obj === 'object') {
      for (const k of tierCandidates) {
        if (obj[k] != null) return Number(obj[k])
      }
      const vals = Object.values(obj).filter((v) => v != null && (typeof v === 'number' || !Number.isNaN(Number(v))))
      if (vals.length > 0) return Number(vals[0])
    }
  }
  if (t.amount != null) return Number(t.amount)
  if (t.price != null) return Number(t.price)
  return null
}

export function matchProviderToTariff(providerType?: any, providerTier?: any, tariffRecord?: any) {
  if (!tariffRecord) return false
  const pType = normalizeType(providerType)
  const tType = normalizeType(tariffRecord.providerType || tariffRecord.provider_type || tariffRecord.type)
  if (!pType || !tType) return false
  // require exact match of normalized types
  if (pType !== tType) return false

  // check tier presence on tariff record
  const tierCandidates = buildTierKeys(String(providerTier || ''))
  if (tierCandidates.length === 0) return false

  // look for any candidate key with a non-empty value
  for (const k of tierCandidates) {
    if (Object.prototype.hasOwnProperty.call(tariffRecord, k) && tariffRecord[k] != null && tariffRecord[k] !== '') return true
  }

  // check nested containers commonly used for prices
  const nestedKeys = ['prices', 'price', 'tiers', 'amounts', 'rates']
  for (const nk of nestedKeys) {
    const obj = tariffRecord[nk]
    if (obj && typeof obj === 'object') {
      for (const k of tierCandidates) {
        if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] != null && obj[k] !== '') return true
      }
    }
  }

  return false
}

// convenience async fetch-and-match (allows changing endpoint)
export async function fetchProviderAndMatch(endpoint = '/api/pr/profile', fetchImpl = fetch, providerTier?: any, providerType?: any, tariffRecord?: any) {
  try {
    const res = await fetchImpl(endpoint, { credentials: 'include' })
    if (!res.ok) return false
    const data = await res.json().catch(() => null)
    const payload = data && data.success && data.data ? data.data : data
    const tier = providerTier ?? (payload?.tier || payload?.planTier || '')
    const type = providerType ?? (payload?.providerType || payload?.type || payload?.provider_type || '')
    return matchProviderToTariff(type, tier, tariffRecord)
  } catch (e) {
    return false
  }
}
