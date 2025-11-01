import React from 'react'

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-20 h-20 rounded-full border-4 border-t-transparent border-white/10 animate-spin" />
      <div className="text-white/60">Loading earthquakes...</div>
    </div>
  )
}
