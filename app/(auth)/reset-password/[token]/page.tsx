import React from 'react'
import ResetForm from './ResetForm'

const Page = ({ params }: { params: { token: string } }) => {
  const { token } = params
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <ResetForm token={token} />
    </main>
  )
}

export default Page
