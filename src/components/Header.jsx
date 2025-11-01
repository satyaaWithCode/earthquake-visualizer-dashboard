import React from 'react'
import { motion } from 'framer-motion'

export default function Header({ onRefresh }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-md bg-gradient-to-br from-[#081226] to-[#07101a] flex items-center justify-center ring-1 ring-white/6">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 3v18" stroke="#2ee6f5" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M3 12h18" stroke="#ff5fa2" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-semibold">Earthquake Visualizer</h1>
          <p className="text-sm text-white/60">Recent quakes (last 24 hours). Bright map style for analysis.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          className="glass px-4 py-2 rounded-lg hover:scale-105 transition-transform"
        >
          Refresh
        </button>
        <div className="text-sm text-white/60">Casey — Geography Student</div>
      </div>
    </header>
  )
}
