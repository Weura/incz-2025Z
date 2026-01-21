import { useEffect, useState } from "react";
import { computeSourceFromReadings } from "../../utils/trilateration";

const LENGTH = 10;
const SCALE = 40;
const PADDING = 80;
const WIDTH = 600;
const HEIGHT = 500;

export default function NoiseMapSvg() {
  const [readings, setReadings] = useState([
    { dev_id: 1, decibels: 30, percentage: 90 },
    { dev_id: 2, decibels: 60, percentage: 90 },
    { dev_id: 3, decibels: 80, percentage: 90 },
  ]);

  const [source, setSource] = useState(null);

  useEffect(() => {
    setSource(computeSourceFromReadings(readings));
  }, [readings]);

  const detectors = [
    { id: 1, x: 0, y: 0 },
    { id: 2, x: LENGTH, y: 0 },
    { id: 3, x: LENGTH / 2, y: (LENGTH / 2) * Math.sqrt(2) },
  ];

  const toSvgX = (x) => x * SCALE + PADDING;
  const toSvgY = (y) => HEIGHT - PADDING - y * SCALE;

  const updateDb = (id, value) => {
    setReadings(r =>
      r.map(d =>
        d.dev_id === id ? { ...d, decibels: Number(value) } : d
      )
    );
  };

  return (
    <div>
      <h2>Noise triangulation – DEBUG MODE</h2>

      {/* 🎚️ SUWAKI */}
      {readings.map(r => (
        <div key={r.dev_id}>
          Device {r.dev_id}: {r.decibels} dB
          <input
            type="range"
            min="10"
            max="90"
            value={r.decibels}
            onChange={e => updateDb(r.dev_id, e.target.value)}
            style={{ width: 200, marginLeft: 10 }}
          />
        </div>
      ))}

      <svg
        width={WIDTH}
        height={HEIGHT}
        style={{ background: "#111", borderRadius: 8, marginTop: 20 }}
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
          const r = readings[i];
          const radius = (100 - r.decibels) * 0.15 * SCALE;

          return (
            <g key={d.id}>
              <circle
                cx={toSvgX(d.x)}
                cy={toSvgY(d.y)}
                r={radius}
                fill="none"
                stroke="#333"
                strokeDasharray="4 4"
              />
              <circle
                cx={toSvgX(d.x)}
                cy={toSvgY(d.y)}
                r={6}
                fill="#4ade80"
              />
              <text
                x={toSvgX(d.x) + 8}
                y={toSvgY(d.y) - 8}
                fill="white"
                fontSize="12"
              >
                D{d.id}
              </text>
            </g>
          );
        })}

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
              Source
            </text>
          </g>
        )}
      </svg>

      {source && (
        <p>
          Source: x={source.x.toFixed(2)} m, y={source.y.toFixed(2)} m
        </p>
      )}
    </div>
  );
}
