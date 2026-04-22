/**
 * Engraved ornamental divider between sections — two tapered lines meeting
 * a central diamond motif. Inspired by old-world book typography.
 */
export function SectionFlourish({ light = false }: { light?: boolean }) {
  const color = light ? '#e6d9b8' : '#1a3d2e';
  return (
    <div
      aria-hidden
      className="flex items-center justify-center py-12 md:py-16 select-none"
    >
      <svg
        width="220"
        height="22"
        viewBox="0 0 220 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="6" cy="11" r="1.1" fill={color} fillOpacity="0.35" />
        <line
          x1="14"
          y1="11"
          x2="88"
          y2="11"
          stroke={color}
          strokeOpacity="0.3"
          strokeWidth="0.6"
        />
        <path
          d="M92 11 Q 96 7 100 11 Q 104 15 108 11"
          stroke={color}
          strokeOpacity="0.45"
          strokeWidth="0.7"
          fill="none"
        />
        <path
          d="M110 3 L118 11 L110 19 L102 11 Z"
          fill={color}
          fillOpacity="0.55"
        />
        <path
          d="M112 11 Q 116 7 120 11 Q 124 15 128 11"
          stroke={color}
          strokeOpacity="0.45"
          strokeWidth="0.7"
          fill="none"
        />
        <line
          x1="132"
          y1="11"
          x2="206"
          y2="11"
          stroke={color}
          strokeOpacity="0.3"
          strokeWidth="0.6"
        />
        <circle cx="214" cy="11" r="1.1" fill={color} fillOpacity="0.35" />
      </svg>
    </div>
  );
}
