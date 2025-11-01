


// import React, { useEffect, useRef, useState } from "react";
// import { MapContainer, TileLayer, CircleMarker, Popup, useMap, SVGOverlay } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// /* FlyTo helper when a feature is selected */
// function MapCenter({ feature }) {
//   const map = useMap();
//   useEffect(() => {
//     if (!feature) return;
//     const coords = feature.geometry.coordinates;
//     map.flyTo([coords[1], coords[0]], 5, { duration: 1.2 });
//   }, [feature, map]);
//   return null;
// }

// function magToRadius(mag) {
//   if (mag <= 1) return 6;
//   if (mag <= 3) return 10;
//   if (mag <= 5) return 16;
//   return 26;
// }
// function magToColor(mag) {
//   if (mag >= 6) return "#ff375f";
//   if (mag >= 5) return "#ff7aa2";
//   if (mag >= 4) return "#ff9bb7";
//   if (mag >= 3) return "#2ee6f5";
//   return "#8be9ff";
// }

// /* Canvas overlay component for moving particles along polyline */
// function ParticleOverlay({ polyPointsLatLng, mapRef }) {
//   const canvasRef = useRef();
//   const animRef = useRef();
//   const particlesRef = useRef([]);

//   useEffect(() => {
//     if (!mapRef.current) return;
//     const map = mapRef.current;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     function resize() {
//       const rect = map.getContainer().getBoundingClientRect();
//       canvas.width = rect.width;
//       canvas.height = rect.height;
//       canvas.style.width = rect.width + "px";
//       canvas.style.height = rect.height + "px";
//       canvas.style.position = "absolute";
//       canvas.style.left = 0;
//       canvas.style.top = 0;
//       canvas.style.pointerEvents = "none";
//     }
//     resize();

//     window.addEventListener("resize", resize);

//     // convert latlngs to container points
//     function toPoints() {
//       return polyPointsLatLng.map(p => map.latLngToContainerPoint([p.lat, p.lng]));
//     }

//     // init particles along the path
//     function initParticles() {
//       const pts = toPoints();
//       const pathSegments = [];
//       for (let i = 0; i < pts.length - 1; i++) {
//         pathSegments.push([pts[i], pts[i + 1]]);
//       }
//       particlesRef.current = [];
//       for (let s = 0; s < pathSegments.length; s++) {
//         const seg = pathSegments[s];
//         // create 6 particles per seg
//         for (let i = 0; i < 6; i++) {
//           particlesRef.current.push({
//             segIndex: s,
//             t: Math.random(), // position along segment 0..1
//             speed: 0.002 + Math.random() * 0.004,
//             radius: 2 + Math.random() * 2,
//             color: i % 2 === 0 ? "rgba(46,230,245,0.95)" : "rgba(255,95,162,0.9)"
//           });
//         }
//       }
//     }
//     initParticles();

//     function draw() {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       const pts = toPoints();
//       // re-create path segments in case of map move/zoom
//       const pathSegments = [];
//       for (let i = 0; i < pts.length - 1; i++) {
//         pathSegments.push([pts[i], pts[i + 1]]);
//       }

//       particlesRef.current.forEach(p => {
//         const seg = pathSegments[p.segIndex];
//         if (!seg) return;
//         // linear interp on segment
//         p.t += p.speed;
//         if (p.t > 1) p.t = 0;
//         const x = seg[0].x + (seg[1].x - seg[0].x) * p.t;
//         const y = seg[0].y + (seg[1].y - seg[0].y) * p.t;

//         ctx.beginPath();
//         ctx.fillStyle = p.color;
//         ctx.globalCompositeOperation = "lighter";
//         ctx.arc(x, y, p.radius, 0, Math.PI * 2);
//         ctx.fill();
//       });

//       animRef.current = requestAnimationFrame(draw);
//     }
//     animRef.current = requestAnimationFrame(draw);

//     // when map moves, reinit points for correct coordinates
//     function onMove() {
//       initParticles();
//       resize();
//     }
//     map.on("move", onMove);
//     map.on("zoom", onMove);

//     return () => {
//       cancelAnimationFrame(animRef.current);
//       window.removeEventListener("resize", resize);
//       map.off("move", onMove);
//       map.off("zoom", onMove);
//     };
//   }, [polyPointsLatLng, mapRef]);

//   return <canvas ref={canvasRef} style={{ pointerEvents: "none", zIndex: 10 }} />;
// }

// /* EarthquakeMap main */
// export default function EarthquakeMap({ features = [], selected, onSelect }) {
//   const mapRef = useRef();
//   const defaultCenter = [2, 120]; // emphasize indonesia/pacific region (mock vibe)

//   // strongest points for neon polyline & particle path
//   const strongest = [...features].sort((a, b) => (b.properties?.mag || 0) - (a.properties?.mag || 0)).slice(0, 6);
//   const polyPointsLatLng = strongest.map(f => ({ lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] }));

//   return (
//     <div className="h-[86vh] rounded-xl overflow-hidden relative">
//       <MapContainer
//         center={defaultCenter}
//         zoom={3}
//         scrollWheelZoom={true}
//         style={{ height: "100%", borderRadius: 12 }}
//         whenCreated={(map) => (mapRef.current = map)}
//       >
//         <TileLayer
//           attribution='&copy; CartoDB &copy; OpenStreetMap contributors'
//           url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
//           opacity={0.96}
//         />

//         {features.map((f) => {
//           const id = f.id;
//           const mag = f.properties?.mag ?? 0;
//           const coords = f.geometry?.coordinates ?? [0, 0];
//           const latlng = [coords[1], coords[0]];

//           return (
//             <React.Fragment key={id}>
//               {/* outer glow circle */}
//               <CircleMarker
//                 center={latlng}
//                 radius={magToRadius(mag) * 1.9}
//                 pathOptions={{
//                   color: magToColor(mag),
//                   fillColor: magToColor(mag),
//                   fillOpacity: 0.14,
//                   weight: 0
//                 }}
//                 className="marker-glow"
//                 interactive={false}
//               />
//               {/* main marker */}
//               <CircleMarker
//                 center={latlng}
//                 radius={magToRadius(mag)}
//                 pathOptions={{
//                   color: "#0b0d10",
//                   fillColor: magToColor(mag),
//                   fillOpacity: 1,
//                   weight: 2
//                 }}
//                 eventHandlers={{
//                   click: () => onSelect(f)
//                 }}
//               >
//                 <Popup closeButton={false}>
//                   <div style={{ minWidth: 220 }}>
//                     <div style={{ fontWeight: 700 }}>{f.properties?.place}</div>
//                     <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
//                       Magnitude: <strong>{mag}</strong>
//                     </div>
//                     <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>
//                       {new Date(f.properties?.time).toLocaleString()}
//                     </div>
//                     <div style={{ marginTop: 8 }}>
//                       <a style={{ color: "#2EE6F5", textDecoration: "underline" }} href={f.properties?.url} target="_blank" rel="noreferrer">
//                         More details
//                       </a>
//                     </div>
//                   </div>
//                 </Popup>
//               </CircleMarker>
//             </React.Fragment>
//           );
//         })}

//         {selected && <MapCenter feature={selected} />}

//         {/* P olyline using SVGOverlay for neon stroke */}
//         {polyPointsLatLng.length >= 2 && (
//           <SVGOverlay
//             attributes={{ style: "pointer-events:none; mix-blend-mode:screen;" }}
//             bounds={[
//               [-60, -180],
//               [85, 180],
//             ]}
//           >
//             <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="none">
//               <defs>
//                 <linearGradient id="polyGrad" x1="0" x2="1">
//                   <stop offset="0%" stopColor="#2EE6F5"/>
//                   <stop offset="100%" stopColor="#FF5FA2"/>
//                 </linearGradient>
//               </defs>
//               {/* For simplicity draw a polyline using projected normalized points */
//                 /* We approximate by mapping lon/lat to 0..800/300 using simple linear transform for visual effect. */}
//               {(() => {
//                 // simple function to map lat/lon into svg coordinates inlined via JS below
//                 // Build points string:
//                 const lats = polyPointsLatLng.map(p => p.lat);
//                 const lngs = polyPointsLatLng.map(p => p.lng);
//                 const minLat = Math.min(...lats), maxLat = Math.max(...lats);
//                 const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
//                 const pointsStr = polyPointsLatLng.map(p => {
//                   const x = 40 + ((p.lng - minLng) / Math.max(0.0001, (maxLng - minLng))) * (720);
//                   const y = 20 + ((maxLat - p.lat) / Math.max(0.0001, (maxLat - minLat))) * (260);
//                   return `${x.toFixed(1)},${y.toFixed(1)}`;
//                 }).join(" ");
//                 return <polyline className="animated-line" points={pointsStr} stroke="url(#polyGrad)" strokeWidth="3" fill="none"/>;
//               })()}
//             </svg>
//           </SVGOverlay>
//         )}
//       </MapContainer>

//       {/* Particle canvas overlay (only when poly exists) */}
//       {polyPointsLatLng.length >= 2 && <ParticleOverlay polyPointsLatLng={polyPointsLatLng} mapRef={mapRef}/>}

//       {/* Floating small metrics card top-left inside map */}
//       <div style={{ position: "absolute", left: 18, top: 18 }} className="floating-card glass">
//         <div className="text-xs hint">Current View</div>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 6 }}>
//           <div style={{ fontSize: 20, fontWeight: 700 }} className="neon-cyan">{features.length}</div>
//           <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>events (24h)</div>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, SVGOverlay } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/* FlyTo helper when a feature is selected */
function MapCenter({ feature }) {
  const map = useMap();
  useEffect(() => {
    if (!feature) return;
    const coords = feature.geometry.coordinates;
    map.flyTo([coords[1], coords[0]], 5, { duration: 1.2 });
  }, [feature, map]);
  return null;
}

function magToRadius(mag) {
  if (mag <= 1) return 6;
  if (mag <= 3) return 10;
  if (mag <= 5) return 16;
  return 26;
}
function magToColor(mag) {
  if (mag >= 6) return "#ff375f";
  if (mag >= 5) return "#ff7aa2";
  if (mag >= 4) return "#ff9bb7";
  if (mag >= 3) return "#2ee6f5";
  return "#8be9ff";
}

/* A small particle overlay (keeps particles for path animation) */
function ParticleOverlay({ polyPointsLatLng, mapRef }) {
  const canvasRef = useRef();
  const animRef = useRef();
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resize() {
      const rect = map.getContainer().getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      canvas.style.position = "absolute";
      canvas.style.left = 0;
      canvas.style.top = 0;
      canvas.style.pointerEvents = "none";
    }
    resize();
    window.addEventListener("resize", resize);

    // convert latlngs to container points
    function toPoints() {
      return polyPointsLatLng.map(p => map.latLngToContainerPoint([p.lat, p.lng]));
    }

    function initParticles() {
      const pts = toPoints();
      const pathSegments = [];
      for (let i = 0; i < pts.length - 1; i++) pathSegments.push([pts[i], pts[i + 1]]);
      particlesRef.current = [];
      const maxPerSeg = (polyPointsLatLng.length > 300) ? 2 : 6;
      for (let s = 0; s < pathSegments.length; s++) {
        for (let i = 0; i < maxPerSeg; i++) {
          particlesRef.current.push({
            segIndex: s,
            t: Math.random(),
            speed: 0.002 + Math.random() * 0.004,
            radius: 1.6 + Math.random() * 2.2,
            color: i % 2 === 0 ? "rgba(46,230,245,0.95)" : "rgba(255,95,162,0.9)"
          });
        }
      }
    }
    initParticles();

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pts = toPoints();
      const pathSegments = [];
      for (let i = 0; i < pts.length - 1; i++) pathSegments.push([pts[i], pts[i + 1]]);

      particlesRef.current.forEach(p => {
        const seg = pathSegments[p.segIndex];
        if (!seg) return;
        p.t += p.speed;
        if (p.t > 1) p.t = 0;
        const x = seg[0].x + (seg[1].x - seg[0].x) * p.t;
        const y = seg[0].y + (seg[1].y - seg[0].y) * p.t;
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalCompositeOperation = "lighter";
        ctx.arc(x, y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    }
    animRef.current = requestAnimationFrame(draw);

    function onMove() {
      initParticles();
      resize();
    }
    map.on("move", onMove);
    map.on("zoom", onMove);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      map.off("move", onMove);
      map.off("zoom", onMove);
    };
  }, [polyPointsLatLng, mapRef]);

  return <canvas ref={canvasRef} style={{ pointerEvents: "none", zIndex: 10 }} />;
}

/* EarthquakeMap main */
export default function EarthquakeMap({ features = [], selected, onSelect }) {
  const mapRef = useRef();
  const defaultCenter = [2, 120]; // center near Indonesia for dashboard vibe

  // strongest points for neon polyline & particle path
  const strongest = [...features].sort((a, b) => (b.properties?.mag || 0) - (a.properties?.mag || 0)).slice(0, 6);
  const polyPointsLatLng = strongest.map(f => ({ lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] }));

  return (
    <div className="h-[86vh] rounded-xl overflow-hidden relative">
      <MapContainer
        center={defaultCenter}
        zoom={3}
        scrollWheelZoom={true}
        style={{ height: "100%", borderRadius: 12 }}
        whenCreated={(map) => (mapRef.current = map)}
      >
        {/* Base tiles (Carto dark) */}
        <TileLayer
          attribution='&copy; CartoDB, &copy; OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          opacity={1}
        />

        {/* Navy-blue gradient overlay to tint the tiles into a deep neon-blue look */}
        <SVGOverlay
          bounds={[
            [-90, -180],
            [90, 180],
          ]}
        >
          <svg width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#021326" />
                <stop offset="50%" stopColor="#071b3d" />
                <stop offset="100%" stopColor="#041221" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#blueGrad)" opacity="0.24" />
          </svg>
        </SVGOverlay>

        {features.map((f) => {
          const id = f.id;
          const mag = f.properties?.mag ?? 0;
          const coords = f.geometry?.coordinates ?? [0, 0];
          const latlng = [coords[1], coords[0]];

          return (
            <React.Fragment key={id}>
              {/* outer glow circle */}
              <CircleMarker
                center={latlng}
                radius={magToRadius(mag) * 1.9}
                pathOptions={{
                  color: magToColor(mag),
                  fillColor: magToColor(mag),
                  fillOpacity: 0.14,
                  weight: 0
                }}
                className="marker-glow"
                interactive={false}
              />
              {/* main marker */}
              <CircleMarker
                center={latlng}
                radius={magToRadius(mag)}
                pathOptions={{
                  color: "#0b0d10",
                  fillColor: magToColor(mag),
                  fillOpacity: 1,
                  weight: 2
                }}
                eventHandlers={{
                  click: () => onSelect(f)
                }}
              >
                <Popup closeButton={false}>
                  <div style={{ minWidth: 220 }}>
                    <div style={{ fontWeight: 700 }}>{f.properties?.place}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
                      Magnitude: <strong>{mag}</strong>
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>
                      {new Date(f.properties?.time).toLocaleString()}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <a style={{ color: "#2EE6F5", textDecoration: "underline" }} href={f.properties?.url} target="_blank" rel="noreferrer">
                        More details
                      </a>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}

        {selected && <MapCenter feature={selected} />}

        {/* Neon polyline overlay (approximate projection for visual effect) */}
        {polyPointsLatLng.length >= 2 && (
          <SVGOverlay
            attributes={{ style: "pointer-events:none; mix-blend-mode:screen;" }}
            bounds={[
              [-60, -180],
              [85, 180],
            ]}
          >
            <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="polyGrad" x1="0" x2="1">
                  <stop offset="0%" stopColor="#2EE6F5"/>
                  <stop offset="100%" stopColor="#FF5FA2"/>
                </linearGradient>
              </defs>
              {(() => {
                const lats = polyPointsLatLng.map(p => p.lat);
                const lngs = polyPointsLatLng.map(p => p.lng);
                const minLat = Math.min(...lats), maxLat = Math.max(...lats);
                const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
                const pointsStr = polyPointsLatLng.map(p => {
                  const x = 40 + ((p.lng - minLng) / Math.max(0.0001, (maxLng - minLng))) * (720);
                  const y = 20 + ((maxLat - p.lat) / Math.max(0.0001, (maxLat - minLat))) * (260);
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                }).join(" ");
                return <polyline className="animated-line" points={pointsStr} stroke="url(#polyGrad)" strokeWidth="4" fill="none"/>;
              })()}
            </svg>
          </SVGOverlay>
        )}
      </MapContainer>

      {/* Particle canvas overlay (only when poly exists) */}
      {polyPointsLatLng.length >= 2 && <ParticleOverlay polyPointsLatLng={polyPointsLatLng} mapRef={mapRef}/>}

      {/* Floating small metrics card top-left inside map */}
      <div style={{ position: "absolute", left: 18, top: 18 }} className="floating-card glass">
        <div className="text-xs hint">Current View</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 6 }}>
          <div style={{ fontSize: 20, fontWeight: 700 }} className="neon-cyan">{features.length}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>events (24h)</div>
        </div>
      </div>
    </div>
  );
}
