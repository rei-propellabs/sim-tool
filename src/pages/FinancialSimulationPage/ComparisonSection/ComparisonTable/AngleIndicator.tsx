import React from 'react';

type Props = {
  angle: number;
  radius?: number;
};

const AngleIndicator: React.FC<Props> = ({ angle, radius = 30 }) => {
  const clampedAngle = Math.min(90, Math.max(0, angle));
  const angleRad = (clampedAngle * Math.PI) / 180;

  // Center of the top bar
  const cx = radius;
  const cy = 0;

  // Endpoint of the arc line at given angle
  const x = cx + radius * Math.cos(angleRad);
  const y = cy + radius * Math.sin(angleRad);

  const arcPath = `
    M ${cx} ${cy}
    L ${cx + radius} ${cy}
    A ${radius} ${radius} 0 ${clampedAngle > 180 ? 1 : 0} 1 ${x} ${y}
    Z
  `;

  return (
    <svg
      width={radius * 2 + 1 }
      height={radius + 2 }
      viewBox={`0 -2 ${radius * 2 + 1 } ${radius + 2}`}
    >
     
      {/* Top horizontal bar */}
      <line
        x1={cx - radius}
        y1={cy}
        x2={cx + radius}
        y2={cy}
        stroke="#848F87"
        strokeWidth={1}
      />

      {/* Angle fill sector */}
      <path d={arcPath} fill="url(#angleGradient)" />

      {/* Angle edge line */}
      <line
        x1={cx}
        y1={cy}
        x2={x}
        y2={y}
        stroke="#E5F3EBDE"
        strokeWidth={1}
      />

      {/* Gradient */}
      <defs>
        <linearGradient id="angleGradient" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#68DDD2" stopOpacity={0.1} />
          <stop offset="100%" stopColor="#68DDD2" stopOpacity={0.4} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default AngleIndicator;
