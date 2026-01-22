import { useEffect, useState } from "react";
import { computeSourceFromReadings } from "../../utils/trilateration";
import { getNoiseData } from "../../services/DecibelsService";
import { getLoudnessColor, getPercentageColor } from "../../utils/color";

const LENGTH = 10;
const SCALE = 20;
const WIDTH = 900;
const HEIGHT = 750;

export default function NoiseMapBackend() {
    const [readings, setReadings] = useState([]);
    const [source, setSource] = useState(null);


  useEffect(() => {
        async function fetchData() {
            const data = await getNoiseData();
            
            setReadings(data);
            const position = computeSourceFromReadings(data);
            setSource(position);
        }
        fetchData();
    }, []);

  const detectors = [
    { id: 1, x: 0, y: 0 },
    { id: 2, x: LENGTH, y: 0 },
    { id: 3, x: LENGTH / 2, y: (LENGTH / 2) * Math.sqrt(2) },
  ];

    const triangleWidthPx = LENGTH * SCALE;
    const triangleHeightPx = (LENGTH / 2) * Math.sqrt(2) * SCALE;
    
    const toSvgX = (x) => (WIDTH / 2) - (triangleWidthPx / 2) + (x * SCALE);
    const toSvgY = (y) => (HEIGHT / 2) + (triangleHeightPx / 2) - (y * SCALE);

  return (
      <div style={{ padding: "20px", color: "white"}}>
        <h2>Device Readings</h2>
              <table border="1" cellPadding="6">
                <thead>
                    <tr>
                    <th>Device ID (newest post)</th>
                    <th>Decibels</th>
                    <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    {readings.slice(0,3).map((r) => (
                    <tr key={r.dev_id}>
                        <td>{r.dev_id}</td>
                        <td style={{ backgroundColor: getLoudnessColor(r.decibels), color: "#fff" }}>
                        {r.decibels}
                        </td>
                        <td style={{ backgroundColor: getPercentageColor(r.percentage), color: "#fff" }}>
                        {r.percentage}%
                        </td>
                    </tr>
                    ))}
                </tbody>
          </table>
          
      <h2>Noise triangulation</h2>
      <svg
        width={WIDTH}
        height={HEIGHT}
        style={{ background: "#161616", borderRadius: 8, marginTop: 20 }}
      >
        {/* 🔺 trójkąt */}
        {detectors.map((d, i) => {
          const n = detectors[(i + 1) % 3];
          return (
            <line
              key={i}
              x1={toSvgX(d.x)}
              y1={toSvgY(d.y)}
              x2={toSvgX(n.x)}
              y2={toSvgY(n.y)}
              stroke="#444"
              strokeWidth="2"
            />
          );
        })}

        {/* 📡 detektory + okręgi */}
        {detectors.map((d, i) => {
            // const r = readings[i];
            const r = readings.find(reading => reading.dev_id === d.id);
            const radius = r ? (100 - r.decibels) * 0.15 * SCALE : 0;
            const circleColor = r?.dev_id === 1 ? "#00FFFF" : r?.dev_id === 2 ? "#FF00FF" : "#FFFF00";

            return (
                <g key={d.id}>
                    <circle
                        cx={toSvgX(d.x)}
                        cy={toSvgY(d.y)}
                        r={radius}
                        fill={circleColor}
                        fillOpacity="0.1"
                        stroke={circleColor}
                        strokeWidth="1"
                        strokeDasharray="4 4"
                    />
                    <circle
                        cx={toSvgX(d.x)}
                        cy={toSvgY(d.y)}
                        r={6}
                        fill={circleColor}
                    />
                    <text
                        x={toSvgX(d.x) + 8}
                        y={toSvgY(d.y) - 8}
                        fill={circleColor}
                        fontSize="12"
                        fontWeight="bold"
              ></text>
                <text
                x={toSvgX(d.x) + 8}
                y={toSvgY(d.y) - 8}
                fill={circleColor}
                fontSize="12"
                fontWeight="bold"
            >
                D{d.id}: [{d.x.toFixed(1)}, {d.y.toFixed(1)}]
            </text>
            </g>
          );
        })
    }

        {/* 🔴 source */}
        {source && (
          <g>
            <circle
              cx={toSvgX(source.x)}
              cy={toSvgY(source.y)}
              r={6}
              fill="#ef4444"
            />
            <text
              x={toSvgX(source.x) + 8}
              y={toSvgY(source.y)}
              fill="#ef4444"
              fontSize="12"
            >
              Source: [{source.x.toFixed(2)}, {source.y.toFixed(2)}]
            </text>
          </g>
        )}
          </svg>
          
          <div style={{ 
  marginTop: "20px", 
  padding: "15px", 
  backgroundColor: "#f9f9f9", 
  borderRadius: "10px",
  border: "1px solid #eee",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "fit-content",
  boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
}}>
  <h4 style={{ margin: "0 0 5px 0", color: "#2d3436" }}>Map Legend:</h4>
  
  <div style={{ display: "flex", gap: "25px", flexWrap: "wrap" }}>
    
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#44e3ff", border: "1px solid #3bc0d9" }} />
      <span style={{ color: "#333", fontSize: "0.9rem" }}>D1 Sensor</span>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#cd44ff", border: "1px solid #ac38d6" }} />
      <span style={{ color: "#333", fontSize: "0.9rem" }}>D2 Sensor</span>
                  </div>
                  
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#f3f31e", border: "1px solid #d4d41a" }} />
      <span style={{ color: "#333", fontSize: "0.9rem" }}>D3 Sensor</span>
    </div>


    {/* Źródło Hałasu */}
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ 
        width: 14, height: 14, borderRadius: "50%", backgroundColor: "#ef4444", 
        border: "2px solid white", boxShadow: "0 0 0 1px #ef4444" 
      }} />
      <span style={{ color: "#ef4444", fontWeight: "bold", fontSize: "0.9rem" }}>Drone</span>
    </div>
  </div>

  {/* <div style={{ borderTop: "1px solid #eee", paddingTop: "8px", marginTop: "5px" }}>
    <p style={{ margin: 0, fontSize: "0.8rem", color: "#777", fontStyle: "italic" }}>
      
    </p>
  </div> */}
          </div>
          

      {source && (
        <p style={{ color: "white", paddingLeft: "20px" }}>
          Estimated position: x={source.x.toFixed(2)} m, y={source.y.toFixed(2)} m
        </p>
      )}
    </div>
  );
}
