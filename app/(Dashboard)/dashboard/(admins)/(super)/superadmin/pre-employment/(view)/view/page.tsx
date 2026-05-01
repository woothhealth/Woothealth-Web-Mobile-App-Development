import React, { Suspense } from 'react'
import ViewClient from './ViewClient'

function ViewClientSkeleton() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-slate-500">Loading...</div>
    </div>
  )
}

const page = () => {
  return (
    <Suspense fallback={<ViewClientSkeleton />}>
      <ViewClient />
    </Suspense>
  )
}

export default page