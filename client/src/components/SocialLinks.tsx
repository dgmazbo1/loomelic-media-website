/**
 * SocialLinks — shared component for all five Loomelic social platforms.
 * Supports two visual variants:
 *   "dark"  — white icons on dark backgrounds (hero, footer)
 *   "light" — dark icons on light backgrounds (contact info section)
 */

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/loomelicmedia/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100088267080806",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px]">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@loomelicmedia",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px]">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@loomelicmedia/featured",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px]">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
      </svg>
    ),
  },
  {
    label: "Threads",
    href: "https://www.threads.com/@loomelicmedia",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px]">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.473 12.01v-.017c.027-3.579.877-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.594 12c.022 3.086.713 5.496 2.051 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 9.258c.98-1.454 2.568-2.292 4.481-2.292h.044c3.088.017 4.979 1.976 5.156 5.388.068.015.135.032.2.05 1.256.339 2.256 1.01 2.896 1.94.985 1.413 1.092 3.387.293 5.309-1.224 2.964-3.948 4.385-8.618 4.347z" />
      </svg>
    ),
  },
];

type SocialLinksProps = {
  variant?: "dark" | "light";
  size?: "sm" | "md";
};

export default function SocialLinks({ variant = "dark", size = "md" }: SocialLinksProps) {
  const dim = size === "sm" ? "w-8 h-8" : "w-9 h-9";

  const baseClass =
    variant === "dark"
      ? `${dim} flex items-center justify-center rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/40 transition-all`
      : `${dim} flex items-center justify-center rounded-full border border-[oklch(0_0_0/0.15)] text-[oklch(0.35_0_0)] hover:bg-[oklch(0.07_0_0)] hover:text-white hover:border-[oklch(0.07_0_0)] transition-all`;

  return (
    <div className="flex items-center gap-2.5">
      {SOCIALS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Loomelic Media on ${s.label}`}
          className={baseClass}
        >
          {s.icon}
        </a>
      ))}
    </div>
  );
}
