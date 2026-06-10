'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAdminClaims } from '@/lib/api'
import { preloadPaCode } from '@/lib/hooks/usePaCodeData'

const AdminClaimsContext = createContext<any>(null)

export function AdminClaimsProvider({ children }: { children: React.ReactNode }) {
  const { data: claimsData, isLoading, error, refetch } = useAdminClaims()

  const rawClaims = claimsData?.data || []
  const [claims, setClaims] = useState<any[]>(rawClaims)
  const total = claimsData?.total || 0
  const claimsPrice = claimsData?.totalPrice || 0

  useEffect(() => {
    let mounted = true
    setClaims(rawClaims)

    const enrich = async () => {
      try {
        const paKeys = new Map<string, number[]>()
        rawClaims.forEach((c: any, idx: number) => {
          const paKey = (c.paCode || c.authorizationCode || c.pa_code || '') as string
          if (paKey) {
            const existing = paKeys.get(paKey) || []
            existing.push(idx)
            paKeys.set(paKey, existing)
          }
        })

        if (paKeys.size === 0) return

        const fetched = new Map<string, any>()

        for (const paKey of paKeys.keys()) {
          let pa: any = null
          try {
            pa = await preloadPaCode(paKey as string)
          } catch (e) {
            pa = null
          }

          if (!pa) {
            try {
              const res = await fetch('/api/admin/pa-codes', { cache: 'no-store' })
              if (res.ok) {
                const list = await res.json().catch(() => null)
                const arr = Array.isArray(list?.data) ? list.data : (Array.isArray(list) ? list : [])
                pa = arr.find((p: any) => String(p.authorizationCode || p.authorization_code || '').toLowerCase() === paKey.toLowerCase())
              }
            } catch (e) {
              pa = null
            }
          }

          if (pa) {
            if (pa.treatmentItems && !pa.treatment) pa.treatment = pa.treatmentItems
            if (Array.isArray(pa.treatment)) {
              pa.treatment = pa.treatment.map((it: any) => {
                const item = { ...(it || {}) }
                const qty = Number(item.quantity ?? item.Quantity ?? 1) || 1
                const price = Number(item.unitPrice ?? item.unit_price ?? item.price ?? item.Amount ?? item.amount) || 0
                item.unitPrice = price
                const existingAmount = Number(item.Amount ?? item.amount ?? 0) || 0
                item.Amount = existingAmount || price * qty
                item.amount = item.Amount
                return item
              })
            }
            if ((pa.totalAmount == null || pa.totalAmount === 0) && Array.isArray(pa.treatment)) {
              try { pa.totalAmount = pa.treatment.reduce((s: number, it: any) => s + (Number(it.Amount || it.amount || 0) || 0), 0) } catch (e) {}
            }

            fetched.set(paKey, pa)
          }
        }

        if (!mounted) return

        if (fetched.size > 0) {
          const merged = rawClaims.map((c: any) => {
            const paKey = (c.paCode || c.authorizationCode || c.pa_code || '') as string
            const pa = paKey ? fetched.get(paKey) : null
            if (pa) {
              return {
                ...pa,
                ...c,
                hospitalProvider: c.hospitalProvider || pa.providerName || pa.provider || c.hospitalProvider,
                dateOfService: c.dateOfService || pa.createdDate || c.dateOfService,
                amount: c.amount || pa.totalAmount || c.amount,
                userId: c.userId || pa.patientId || c.userId,
                userName: c.userName || pa.patientName || c.userName,
                paCode: c.paCode || pa.$id || pa.id || pa.authorizationCode || c.paCode,
                treatment: c.treatment && c.treatment.length ? c.treatment : pa.treatment || c.treatment,
              }
            }
            return c
          })

          setClaims(merged)
        }
      } catch (e) {
        // ignore
        // eslint-disable-next-line no-console
        console.debug('Claim enrichment failed', e)
      }
    }

    enrich()

    return () => { mounted = false }
  }, [rawClaims])

  return (
    <AdminClaimsContext.Provider value={{
      claims,
      total,
      claimsPrice,
      loading: isLoading,
      error,
      refetch
    }}>
      {children}
    </AdminClaimsContext.Provider>
  )
}

export function useAdminClaimsContext() {
  const ctx = useContext(AdminClaimsContext)
  if (!ctx) {
    throw new Error('useAdminClaimsContext must be used within AdminClaimsProvider')
  }
  return ctx
}