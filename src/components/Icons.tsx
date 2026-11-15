import type { ServiceIcon } from "@/lib/site";

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export const SearchIcon = () => (
  <svg {...base}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);

export const BagIcon = () => (
  <svg {...base}>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </svg>
);

export const MenuIcon = () => (
  <svg {...base}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const UserIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="8.5" r="3.75" />
    <path d="M4.75 20a7.25 7.25 0 0 1 14.5 0" />
  </svg>
);

export const ChevronRightIcon = () => (
  <svg {...base}>
    <path d="m9.5 6 6 6-6 6" />
  </svg>
);

export const ChevronLeftIcon = () => (
  <svg {...base}>
    <path d="m14.5 6-6 6 6 6" />
  </svg>
);

export const ChevronDownIcon = () => (
  <svg {...base}>
    <path d="m6 9.5 6 6 6-6" />
  </svg>
);

export const PauseIcon = () => (
  <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true">
    <rect x="2" y="1.5" width="2" height="7" fill="currentColor" />
    <rect x="6" y="1.5" width="2" height="7" fill="currentColor" />
  </svg>
);

export const PlayIcon = () => (
  <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true">
    <path d="M2.5 1.5v7l6-3.5z" fill="currentColor" />
  </svg>
);

export const CloseIcon = () => (
  <svg {...base}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const CheckIcon = () => (
  <svg {...base} width={18} height={18}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

const service: Record<ServiceIcon, React.ReactNode> = {
  truck: (
    <>
      <path d="M3 6.5h11v10H3zM14 10h4l3 3.5v3h-7" />
      <circle cx="7.5" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3" />
      <path d="M4 7.5V17a2 2 0 0 0 2 2h14V8H6.5A2.5 2.5 0 0 1 4 7.5Z" />
      <path d="M16 13.5h1" />
    </>
  ),
  swap: (
    <>
      <path d="M4 8h14l-3-3M20 16H6l3 3" />
    </>
  ),
  chat: (
    <>
      <path d="M12 4a8 8 0 0 0-6.9 12L4 20l4.2-1A8 8 0 1 0 12 4Z" />
      <path d="M9 11.5h6M9 14h3.5" />
    </>
  ),
};

export const ServiceGlyph = ({ name }: { name: ServiceIcon }) => (
  <svg {...base} width={28} height={28}>
    {service[name]}
  </svg>
);
