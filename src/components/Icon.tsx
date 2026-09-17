// Gold line icons (stroke uses currentColor).

const paths = {
  compass: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 4.5l1.8 5.7 5.7 1.8-5.7 1.8L12 19.5l-1.8-5.7L4.5 12l5.7-1.8z" />
    </>
  ),
  rosette: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M12 6.3l.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2L9.1 8.4l2-.3z" />
      <path d="M8.6 13.8L7 21l5-2.6 5 2.6-1.6-7.2" />
    </>
  ),
  cycle: (
    <>
      <path d="M19.5 13a7.5 7.5 0 0 1-13 3.8" />
      <path d="M4.5 11a7.5 7.5 0 0 1 13-3.8" />
      <path d="M18 3.5v4h-4" />
      <path d="M6 20.5v-4h4" />
    </>
  ),
  rings: (
    <>
      <circle cx="9" cy="9.5" r="5" />
      <circle cx="15" cy="9.5" r="5" />
      <circle cx="12" cy="14.5" r="5" />
    </>
  ),
  key: (
    <>
      <circle cx="16.5" cy="7.5" r="4" />
      <path d="M13.6 10.4L4 20l1.8 1.8 1.6-1.6 1.5 1.5 1.6-1.6-1.5-1.5 1.4-1.4" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" />
      <path d="M12 12l7.5-7.5M16.5 4.5h3v3" />
    </>
  ),
  crown: <path d="M3 8l4.5 4.5L12 5l4.5 7.5L21 8l-2 11H5z" />,
  people: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="9" r="2.6" />
      <path d="M15.7 14.3A5 5 0 0 1 21.5 19" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </>
  ),
  sparkle: <path d="M12 2.5v19M2.5 12h19M5.8 5.8l12.4 12.4M18.2 5.8L5.8 18.2" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M7.5 14h.01M12 14h.01M16.5 14h.01M7.5 17.5h.01M12 17.5h.01M16.5 17.5h.01" strokeWidth="2.2" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.5L2.5 20.5h19z" />
      <path d="M12 10v5M12 17.8h.01" />
    </>
  ),
  gift: (
    <>
      <rect x="3.5" y="9" width="17" height="12" rx="1" />
      <path d="M3.5 13h17M12 9v12" />
      <path d="M12 9c-2-4-5.5-4-5.5-1.8S10 9 12 9zM12 9c2-4 5.5-4 5.5-1.8S14 9 12 9z" />
    </>
  ),
  document: (
    <>
      <path d="M14 3H6v18h12V7z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </>
  ),
  userPlus: (
    <>
      <circle cx="10" cy="8" r="4" />
      <path d="M3 21c0-3.9 3.1-7 7-7 1.3 0 2.6.4 3.6 1" />
      <path d="M18 15v6M15 18h6" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5l5 5" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="4.5" width="14" height="16.5" rx="2" />
      <path d="M9 4.5V3h6v1.5M9 13l2 2 4-4" />
    </>
  ),
  mail: (
    <>
      <rect x="2.4" y="4.8" width="19.2" height="14.4" rx="2.2" />
      <path d="m3.2 6.2 8.8 6.6 8.8-6.6" />
    </>
  ),
  screen: (
    <>
      <rect x="2.4" y="4" width="19.2" height="13" rx="2.2" />
      <path d="M8.4 21h7.2M12 17v4" />
      <path
        d="m12 7.6 1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3Z"
        fill="currentColor"
        stroke="none"
      />
    </>
  ),
  clock: (
    <>
      <path d="M3.2 12a8.8 8.8 0 1 0 2.6-6.2" />
      <path d="M3 4.6v4h4" />
      <path d="M12 7.6V12l3 1.8" />
    </>
  ),
  microphone: (
    <>
      <rect x="8.6" y="1.9" width="6.8" height="12" rx="3.4" fill="currentColor" stroke="none" />
      <path d="M4.8 11.2a7.2 7.2 0 0 0 14.4 0" />
      <path d="M12 18.4V22" />
      <path d="M8.3 22h7.4" />
    </>
  ),
  stage: (
    <>
      <path d="M2.4 3.4h19.2v3.1H2.4z" fill="currentColor" stroke="none" />
      <path d="M4.4 6.5h15.2v9.9H4.4z" />
      <path d="M4.4 6.5c1.4 1.5 2.6 1.5 4 0 1.4 1.5 2.6 1.5 3.8 0 1.4 1.5 2.6 1.5 3.9 0 1.2 1.5 2.4 1.5 3.5 0" />
      <path d="M6.1 16.4v4.2M17.9 16.4v4.2" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M16.9 7.1h.01" strokeWidth="2.2" />
    </>
  ),
  hash: <path d="M9.5 3.5L7.5 20.5M16.5 3.5l-2 17M4 9h17M3 15h17" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
    </>
  ),
  arrowRight: <path d="M4 12h15M14 6.5l5.5 5.5-5.5 5.5" />,
  apple: (
    <path
      fill="currentColor"
      stroke="none"
      d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.9-.9-3.1-.8C6.8 7.4 5.3 8.3 4.5 9.8c-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.5 3 2.4 1.2 0 1.6-.8 3.1-.8s1.8.8 3.1.8 2.1-1.2 2.9-2.4c.9-1.3 1.3-2.6 1.3-2.7 0 0-2.7-1-2.7-4.1zM14.1 5.6c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.7-1.3z"
    />
  ),
};

export type IconName = keyof typeof paths;

export function Icon({ name, size = 24, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
