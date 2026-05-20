"use client";

import { useEffect, useRef } from "react";

interface RadarData {
  technical: number;
  tactical: number;
  physical: number;
  discipline: number;
}

interface RadarChartProps {
  data: RadarData;
  size?: number;
}

const LABELS = ["Técnico", "Tático", "Físico", "Disciplina"];
const KEYS: (keyof RadarData)[] = ["technical", "tactical", "physical", "discipline"];
const MAX_VALUE = 5;
const NUM_AXES = 4;

function getPolygonPoints(values: number[], cx: number, cy: number, radius: number) {
  return values.map((v, i) => {
    const angle = (Math.PI * 2 * i) / NUM_AXES - Math.PI / 2;
    const r = (v / MAX_VALUE) * radius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });
}

function getAxisPoints(cx: number, cy: number, radius: number) {
  return Array.from({ length: NUM_AXES }, (_, i) => {
    const angle = (Math.PI * 2 * i) / NUM_AXES - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });
}

export function RadarChart({ data, size = 220 }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.35;
  const labelRadius = size * 0.47;

  const values = KEYS.map((k) => data[k]);
  const dataPoints = getPolygonPoints(values, cx, cy, radius);
  const axisPoints = getAxisPoints(cx, cy, radius);
  const labelPoints = getAxisPoints(cx, cy, labelRadius);

  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Grid levels
  const gridLevels = [1, 2, 3, 4, 5];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="Radar chart de atributos do jogador">
      {/* Grid rings */}
      {gridLevels.map((level) => {
        const pts = getPolygonPoints(
          Array(NUM_AXES).fill(level),
          cx,
          cy,
          radius
        );
        const polygon = pts.map((p) => `${p.x},${p.y}`).join(" ");
        return (
          <polygon
            key={level}
            points={polygon}
            fill="none"
            stroke={level === 5 ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.06)"}
            strokeWidth={level === 5 ? 1.5 : 1}
          />
        );
      })}

      {/* Axis lines */}
      {axisPoints.map((pt, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={pt.x}
          y2={pt.y}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
        />
      ))}

      {/* Data polygon fill */}
      <polygon
        points={dataPolygon}
        fill="rgba(16,185,129,0.18)"
        stroke="#10b981"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Data points */}
      {dataPoints.map((pt, i) => (
        <circle
          key={i}
          cx={pt.x}
          cy={pt.y}
          r={4}
          fill="#10b981"
          stroke="#030708"
          strokeWidth={1.5}
        />
      ))}

      {/* Labels */}
      {labelPoints.map((pt, i) => (
        <text
          key={i}
          x={pt.x}
          y={pt.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={10}
          fontWeight={700}
          fill="#8fa39b"
          fontFamily="inherit"
        >
          {LABELS[i]}
        </text>
      ))}

      {/* Center values */}
      {dataPoints.map((pt, i) => (
        <text
          key={`val-${i}`}
          x={(pt.x + cx) / 2}
          y={(pt.y + cy) / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={9}
          fontWeight={800}
          fill="#34d399"
          fontFamily="inherit"
        >
          {values[i]}
        </text>
      ))}
    </svg>
  );
}
