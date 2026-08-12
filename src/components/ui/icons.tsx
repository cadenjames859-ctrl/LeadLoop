import type { SVGProps } from "react";

function Icon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    />
  );
}

export const IconUsers = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19" />
    <circle cx="9" cy="8" r="3.25" />
    <path d="M18.5 19v-1.5a3.5 3.5 0 0 0-2.2-3.25" />
    <path d="M14.5 5.1a3.25 3.25 0 0 1 0 6.3" />
  </Icon>
);

export const IconUserPlus = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <circle cx="9.5" cy="8" r="3.25" />
    <path d="M3.5 19v-1.5A3.5 3.5 0 0 1 7 14h5a3.5 3.5 0 0 1 3.5 3.5V19" />
    <path d="M18.5 8v6M21.5 11h-6" />
  </Icon>
);

export const IconClock = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.25" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
);

export const IconCheckCircle = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.25" />
    <path d="M8.5 12.3l2.4 2.4 4.6-5.1" />
  </Icon>
);

export const IconXCircle = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.25" />
    <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" />
  </Icon>
);

export const IconDollar = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M12 3.5v17" />
    <path d="M16.5 7.25c0-1.52-1.79-2.75-4-2.75s-4 1.1-4 2.75 1.79 2.5 4 2.75c2.21.25 4 1.1 4 2.75s-1.79 2.75-4 2.75-4-1.23-4-2.75" />
  </Icon>
);

export const IconChevronDown = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M6 9l6 6 6-6" />
  </Icon>
);

export const IconSearch = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M20 20l-4.85-4.85" />
  </Icon>
);

export const IconPlus = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const IconTrash = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M4 7h16" />
    <path d="M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7" />
    <path d="M6.5 7l.7 12a2 2 0 0 0 2 1.9h5.6a2 2 0 0 0 2-1.9l.7-12" />
    <path d="M10.2 11v6M13.8 11v6" />
  </Icon>
);

export const IconEdit = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M4 20l.9-3.9L15.6 5.4a1.7 1.7 0 0 1 2.4 0l1.6 1.6a1.7 1.7 0 0 1 0 2.4L8.9 20.1 4 20z" />
    <path d="M14 7l3 3" />
  </Icon>
);

export const IconSparkles = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M11.5 4l1.1 3.2L15.8 8.3l-3.2 1.1-1.1 3.2-1.1-3.2-3.2-1.1 3.2-1.1z" />
    <path d="M18 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
    <path d="M5 15l.6 1.6L7.2 17.2l-1.6.6L5 19.4l-.6-1.6-1.6-.6 1.6-.6z" />
  </Icon>
);

export const IconLogOut = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M9 20H5.5A1.5 1.5 0 0 1 4 18.5v-13A1.5 1.5 0 0 1 5.5 4H9" />
    <path d="M16 16l4-4-4-4" />
    <path d="M20 12H9" />
  </Icon>
);

export const IconMenu = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Icon>
);

export const IconX = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M5 5l14 14M19 5L5 19" />
  </Icon>
);

export const IconPhone = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M5.3 4h2.9l1.4 4.2-2 1.6a12 12 0 0 0 6.6 6.6l1.6-2 4.2 1.4v2.9a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.8 5.6 1.5 1.5 0 0 1 5.3 4z" />
  </Icon>
);

export const IconMail = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="1.8" />
    <path d="M4.5 7l7.5 6 7.5-6" />
  </Icon>
);

export const IconArrowRight = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M4 12h16M13 5l7 7-7 7" />
  </Icon>
);

export const IconCalendar = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="1.8" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </Icon>
);

export const IconLayoutDashboard = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <rect x="3.5" y="3.5" width="7.2" height="8.5" rx="1.5" />
    <rect x="13.3" y="3.5" width="7.2" height="5" rx="1.5" />
    <rect x="13.3" y="11.5" width="7.2" height="9" rx="1.5" />
    <rect x="3.5" y="15" width="7.2" height="5.5" rx="1.5" />
  </Icon>
);

export const IconSettings = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2.06 2.06 0 1 1-2.92 2.92l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V19.6a2.06 2.06 0 1 1-4.13 0v-.09a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2.06 2.06 0 1 1-2.92-2.92l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H4.4a2.06 2.06 0 1 1 0-4.13h.09a1.7 1.7 0 0 0 1.55-1.1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2.06 2.06 0 1 1 2.92-2.92l.06.06a1.7 1.7 0 0 0 1.87.34H10.5a1.7 1.7 0 0 0 1-1.55V4.4a2.06 2.06 0 1 1 4.13 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2.06 2.06 0 1 1 2.92 2.92l-.06.06a1.7 1.7 0 0 0-.34 1.87v.11a1.7 1.7 0 0 0 1.55 1h.09a2.06 2.06 0 1 1 0 4.13h-.09a1.7 1.7 0 0 0-1.55 1z" />
  </Icon>
);

export const IconCopy = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <rect x="8.5" y="8.5" width="11.5" height="11.5" rx="1.8" />
    <path d="M15.5 8.5V6.3A1.8 1.8 0 0 0 13.7 4.5H5.8A1.8 1.8 0 0 0 4 6.3v7.9a1.8 1.8 0 0 0 1.8 1.8h2.2" />
  </Icon>
);

export const IconLoop = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M4.5 12a7.5 7.5 0 0 1 12.6-5.5" />
    <path d="M13.5 4l3.8 2.2-1.2 4.2" />
    <path d="M19.5 12a7.5 7.5 0 0 1-12.6 5.5" />
    <path d="M10.5 20l-3.8-2.2 1.2-4.2" />
  </Icon>
);
