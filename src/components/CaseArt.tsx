import { useId } from "react";
import type { Camera, Finish } from "@/lib/catalog";

type Props = {
  finish: Finish;
  camera?: Camera;
  /** Accessible description. Leave empty when the case is decorative. */
  label?: string;
  className?: string;
};

/**
 * A drawn iPhone case, used wherever there is no product photo yet.
 * The finish decides the surface (bands, weave, leather, clear, matte)
 * and the camera prop decides the cut-out for the chosen iPhone.
 */
export function CaseArt({ finish, camera = "plateau", label, className }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (name: string) => `${name}-${uid}`;
  const { base, tone, pattern } = finish;

  return (
    <svg
      viewBox="0 0 240 490"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <clipPath id={id("body")}>
          <rect x="10" y="10" width="220" height="470" rx="46" />
        </clipPath>
        <linearGradient id={id("sheen")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="0.42" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
        <radialGradient id={id("lens")} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#3b4a5c" />
          <stop offset="0.55" stopColor="#11151a" />
          <stop offset="1" stopColor="#050607" />
        </radialGradient>
        <pattern
          id={id("weave")}
          width="9"
          height="9"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <path d="M0 0h4.5v4.5H0zM4.5 4.5H9V9H4.5z" fill={tone} opacity="0.5" />
          <path d="M0 4.5h9M4.5 0v9" stroke="#000" strokeOpacity="0.35" strokeWidth="0.6" />
        </pattern>
        <filter id={id("grain")} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 -0.14" />
        </filter>
      </defs>

      {/* Side buttons, peeking out past the shell */}
      <g>
        <g fill={base}>
          <rect x="4" y="148" width="9" height="30" rx="3" />
          <rect x="4" y="196" width="9" height="52" rx="3" />
          <rect x="227" y="186" width="9" height="72" rx="3" />
        </g>
        <g fill="#000" opacity="0.28">
          <rect x="4" y="148" width="9" height="30" rx="3" />
          <rect x="4" y="196" width="9" height="52" rx="3" />
          <rect x="227" y="186" width="9" height="72" rx="3" />
        </g>
      </g>

      <g clipPath={`url(#${id("body")})`}>
        <rect x="10" y="10" width="220" height="470" fill={base} />

        {pattern === "banded" && (
          <g fill={tone}>
            {strata.map(([y, thickness, opacity]) => (
              <path key={y} opacity={opacity} d={band(y, thickness)} />
            ))}
          </g>
        )}

        {pattern === "weave" && (
          <rect x="10" y="10" width="220" height="470" fill={`url(#${id("weave")})`} />
        )}

        {pattern === "leather" && (
          <>
            <rect x="10" y="10" width="220" height="470" filter={`url(#${id("grain")})`} />
            <rect
              x="23"
              y="23"
              width="194"
              height="444"
              rx="34"
              fill="none"
              stroke={tone}
              strokeWidth="1.5"
              strokeDasharray="5 4.5"
              strokeLinecap="round"
              opacity="0.8"
            />
          </>
        )}

        {pattern === "clear" && (
          <>
            <circle cx="120" cy="272" r="56" fill="none" stroke={tone} strokeWidth="8" opacity="0.6" />
            <rect x="116" y="340" width="8" height="34" rx="4" fill={tone} opacity="0.6" />
            <rect
              x="14"
              y="14"
              width="212"
              height="462"
              rx="42"
              fill="none"
              stroke="#fff"
              strokeWidth="8"
              opacity="0.28"
            />
          </>
        )}

        {pattern !== "clear" && pattern !== "banded" && (
          <g opacity="0.4" stroke={tone} fill="none" strokeWidth="1.4">
            <rect x="111" y="412" width="18" height="24" rx="5" />
            <circle cx="120" cy="423" r="3.6" />
            <path d="M121.8 425.6l2.6 3" strokeLinecap="round" />
          </g>
        )}

        <rect x="10" y="10" width="220" height="470" fill={`url(#${id("sheen")})`} />
      </g>

      <rect
        x="10.75"
        y="10.75"
        width="218.5"
        height="468.5"
        rx="45.25"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.18"
        strokeWidth="1.5"
      />

      <CameraModule camera={camera} lensFill={`url(#${id("lens")})`} />
    </svg>
  );
}

/* ---------- Banded stone ---------- */

/** [top edge, thickness, opacity] of each band, top to bottom. */
const strata: [number, number, number][] = [
  [128, 3, 0.5],
  [140, 17, 0.92],
  [165, 2.5, 0.6],
  [218, 5, 0.75],
  [230, 2, 0.45],
  [266, 30, 0.92],
  [304, 3, 0.55],
  [314, 2, 0.4],
  [364, 8, 0.8],
  [380, 2.5, 0.5],
  [424, 21, 0.92],
  [453, 3, 0.5],
  [463, 2, 0.35],
];

/** One band: the same gentle wave every time, so the layers run parallel. */
function band(y: number, t: number): string {
  return (
    `M-10 ${y}C60 ${y - 34} 140 ${y + 46} 250 ${y + 4}v${t}` +
    `C140 ${y + 46 + t} 60 ${y - 34 + t} -10 ${y + t}Z`
  );
}

/* ---------- Camera cut-outs ---------- */

type Lens = [cx: number, cy: number, r: number];

const cameras: Record<
  Camera,
  { cut: { x: number; y: number; w: number; h: number; r: number }; lenses: Lens[]; dots: [number, number][] }
> = {
  // iPhone 17 Pro and 18 Pro: a raised plateau the full width of the phone
  plateau: {
    cut: { x: 24, y: 24, w: 192, h: 96, r: 32 },
    lenses: [
      [60, 52, 17],
      [60, 92, 17],
      [100, 72, 17],
    ],
    dots: [
      [188, 52],
      [188, 92],
    ],
  },
  // iPhone 16 Pro: a square island in the corner
  island: {
    cut: { x: 24, y: 24, w: 108, h: 108, r: 32 },
    lenses: [
      [57, 55, 17],
      [57, 101, 17],
      [101, 78, 17],
    ],
    dots: [[104, 46]],
  },
  // iPhone 16 and 17: two lenses in an upright pill
  pill: {
    cut: { x: 26, y: 26, w: 52, h: 104, r: 26 },
    lenses: [
      [52, 54, 17],
      [52, 102, 17],
    ],
    dots: [[98, 78]],
  },
  // iPhone Air: one lens in a bar across the top
  bar: {
    cut: { x: 24, y: 24, w: 192, h: 58, r: 29 },
    lenses: [[58, 53, 18]],
    dots: [[188, 53]],
  },
};

function CameraModule({ camera, lensFill }: { camera: Camera; lensFill: string }) {
  const { cut, lenses, dots } = cameras[camera];
  return (
    <g>
      <rect
        x={cut.x}
        y={cut.y}
        width={cut.w}
        height={cut.h}
        rx={cut.r}
        fill="#16181A"
        stroke="#000"
        strokeOpacity="0.45"
        strokeWidth="2.5"
      />
      <rect
        x={cut.x + 2.5}
        y={cut.y + 2.5}
        width={cut.w - 5}
        height={cut.h - 5}
        rx={cut.r - 2.5}
        fill="none"
        stroke="#fff"
        strokeOpacity="0.1"
      />
      {lenses.map(([cx, cy, r]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r={r} fill="#08090A" stroke="#4B5052" strokeWidth="2" />
          <circle cx={cx} cy={cy} r={r * 0.58} fill={lensFill} />
          <circle cx={cx - r * 0.26} cy={cy - r * 0.28} r={r * 0.13} fill="#fff" opacity="0.55" />
        </g>
      ))}
      {dots.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5.5" fill="#E9E4D4" opacity="0.85" />
      ))}
    </g>
  );
}
