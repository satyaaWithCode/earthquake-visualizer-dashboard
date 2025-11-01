



import React, { useMemo } from "react";

export default function GaugeCard({ avgMag = 0, total = 0 }) {
  const display = avgMag ? avgMag.toFixed(2) : "0.00";
  const percent = Math.min(1, avgMag / 8);
  const dash = Math.round(percent * 300);

  const angle = useMemo(() => {
    return 180 * percent; // degrees
  }, [percent]);

  return (
    <div className="gauge-card relative">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs hint">Avg Magnitude</div>
          <div className="text-2xl font-semibold" style={{ color: "var(--neon-cyan)" }}>{display}</div>
        </div>
        <div className="text-right">
          <div className="text-xs hint">Total</div>
          <div className="text-lg font-semibold">{total}</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div style={{ width: 180, height: 90, position: "relative" }}>
          <svg viewBox="0 0 200 100" width="180" height="90">
            <path d="M10 90 A90 90 0 0 1 190 90" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="12" strokeLinecap="round"></path>

            <defs>
              <linearGradient id="g2">
                <stop offset="0%" stopColor="#2EE6F5"></stop>
                <stop offset="100%" stopColor="#FF5FA2"></stop>
              </linearGradient>
            </defs>

            <path
              d="M10 90 A90 90 0 0 1 190 90"
              fill="none"
              stroke="url(#g2)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${dash} 300`}
              style={{ transition: "stroke-dasharray .8s ease" }}
            />
          </svg>

          {/* needle */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 6,
              transform: `translateX(-50%) rotate(${angle}deg)`,
              transformOrigin: "center bottom",
              transition: "transform .9s cubic-bezier(.2,.9,.2,1)",
              width: 3,
              height: 46,
              background: "linear-gradient(180deg,#ff5fa2,#2ee6f5)",
              borderRadius: 4,
              boxShadow: "0 6px 20px rgba(46,230,245,0.08)"
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div className="text-xs hint">Interpretation</div>
          <div className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Avg magnitude of filtered events. Use slider to adjust range.</div>
        </div>
      </div>
    </div>
  );
}
