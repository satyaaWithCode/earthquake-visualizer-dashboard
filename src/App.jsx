

import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import EarthquakeMap from './components/EarthquakeMap'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import LoadingSpinner from './components/LoadingSpinner'
import GaugeCard from './components/GaugeCard'

export default function App() {
  const [quakes, setQuakes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [minMag, setMinMag] = useState(0)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
      const res = await axios.get(url)
      const features = res.data.features || []
      setQuakes(features)
    } catch (e) {
      setError('Failed to load earthquake data. Check network or USGS API.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, 1000 * 60 * 5)
    return () => clearInterval(id)
  }, [fetchData])

  const filtered = quakes.filter(q => (q.properties?.mag ?? 0) >= minMag)

  // derive gauge values
  const avgMag = filtered.length ? (filtered.reduce((s, f) => s + (f.properties?.mag || 0), 0) / filtered.length) : 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header onRefresh={fetchData} />
      <div className="flex-1 px-6 py-5">
        {loading ? (
          <div className="h-[86vh] flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="h-[86vh] flex items-center justify-center text-red-400">{error}</div>
        ) : (
          <div className="h-[86vh] flex gap-6">
            <aside className="w-72 glass p-4 rounded-xl shadow-neon overflow-hidden">
              <Sidebar
                quakes={filtered}
                onSelect={(f) => setSelected(f)}
                minMag={minMag}
                setMinMag={setMinMag}
              />
            </aside>

            <main className="flex-1 relative">
              <EarthquakeMap
                features={filtered}
                selected={selected}
                onSelect={setSelected}
              />

              {/* bottom-right gauge card */}
              <div className="absolute right-8 bottom-8">
                <GaugeCard avgMag={avgMag} total={filtered.length} />
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  )
}
