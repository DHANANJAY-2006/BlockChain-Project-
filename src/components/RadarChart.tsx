'use client';
interface RadarChartProps {
  scores: { label: string; value: number }[];
  size?: number;
  color?: string;
}
export default function RadarChart({ scores, size = 220, color = '#3b82f6' }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.35;
  const n = scores.length;
  const startAngle = -Math.PI / 2;
  const angleStep = (2 * Math.PI) / n;
  const getPoint = (idx: number, r: number) => ({
    x: center + r * Math.cos(startAngle + idx * angleStep),
    y: center + r * Math.sin(startAngle + idx * angleStep),
  });
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const dataPath = scores
    .map((s, i) => {
      const p = getPoint(i, (Math.min(s.value, 100) / 100) * radius);
      return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    })
    .join(' ') + ' Z';
  const hexFromColor = (c: string) => c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {gridLevels.map((level, li) => {
        const pts = Array.from({ length: n }, (_, i) => getPoint(i, level * radius));
        const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ') + ' Z';
        return <path key={li} d={path} fill="none" stroke="rgba(100,116,139,0.2)" strokeWidth="1" />;
      })}
      {scores.map((_, i) => {
        const end = getPoint(i, radius);
        return <line key={i} x1={center} y1={center} x2={end.x} y2={end.y} stroke="rgba(100,116,139,0.2)" strokeWidth="1" />;
      })}
      <path d={dataPath} fill={`${color}20`} stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {scores.map((s, i) => {
        const p = getPoint(i, (Math.min(s.value, 100) / 100) * radius);
        return (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color} stroke="#0f172a" strokeWidth="1.5" />
        );
      })}
      {scores.map((s, i) => {
        const lp = getPoint(i, radius + 22);
        const score = Math.min(s.value, 100).toFixed(0);
        const textColor = s.value > 70 ? '#10b981' : s.value > 45 ? '#f59e0b' : '#f87171';
        return (
          <g key={i}>
            <text x={lp.x} y={lp.y - 5} textAnchor="middle" dominantBaseline="middle"
              fill="#94a3b8" fontSize="7.5" fontFamily="JetBrains Mono, monospace">
              {s.label.length > 7 ? s.label.slice(0, 7) : s.label}
            </text>
            <text x={lp.x} y={lp.y + 7} textAnchor="middle" dominantBaseline="middle"
              fill={textColor} fontSize="8" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              {score}%
            </text>
          </g>
        );
      })}
      <circle cx={center} cy={center} r="2" fill={color} opacity="0.5" />
    </svg>
  );
}
