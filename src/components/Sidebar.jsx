


import React from 'react'
import { format } from 'date-fns'

function MagBadge({ mag }) {
  const bg = mag >= 6 ? 'bg-[#ff375f]' : mag >= 5 ? 'bg-[#ff7aa2]' : 'bg-[#2ee6f5]'
  return (
    <div className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg ${bg} text-black font-semibold`}>
      <div className="text-xs">M</div>
      <div className="text-lg">{mag.toFixed(1)}</div>
    </div>
  )
}

export default function Sidebar({ quakes = [], onSelect, minMag, setMinMag }) {
  const sorted = [...quakes].sort((a, b) => (b.properties.mag || 0) - (a.properties.mag || 0))
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Overview</h2>
        <p className="text-xs text-muted">USGS last 24h feed</p>
      </div>

      <div className="mb-3">
        <label className="text-xs text-white/60">Min magnitude</label>
        <input
          type="range"
          min="0"
          max="8"
          step="0.1"
          value={minMag}
          onChange={(e) => setMinMag(Number(e.target.value))}
          className="w-full mt-2 accent-neon-cyan"
        />
      </div>

      <div className="flex-1 overflow-auto sidebar-scroll space-y-3 pr-2">
        <h3 className="text-sm font-medium mb-2">Strongest events</h3>
        {sorted.slice(0, 12).map((f) => {
          const id = f.id
          const mag = f.properties?.mag ?? 0
          const place = f.properties?.place ?? 'Unknown'
          const time = new Date(f.properties?.time)
          return (
            <button
              key={id}
              onClick={() => onSelect(f)}
              className="w-full text-left glass p-3 rounded-md flex items-center gap-3 hover:scale-[1.01] transition"
            >
              <MagBadge mag={mag} />
              <div className="flex-1">
                <div className="text-sm font-medium">{place}</div>
                <div className="text-xs text-white/60">{format(time, 'PPpp')}</div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-4 text-xs text-white/50">
        Data: USGS • Visualizer
      </div>
    </div>
  )
}
