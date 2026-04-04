/**
 * OwnerGate — wraps pages that require the owner's Manus account.
 * Only Denham's Manus account (OWNER_OPEN_ID) can access these routes.
 * Shows a loading skeleton while auth state resolves, then either renders
 * children or a 403-style access-denied screen.
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function OwnerGate({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();

  // Prevent search engines from indexing any admin route
  useEffect(() => {
    let el = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", "robots");
      document.head.appendChild(el);
    }
    el.setAttribute("content", "noindex, nofollow");
    return () => {
      // Restore to indexable when leaving admin routes
      if (el) el.setAttribute("content", "index, follow");
    };
  }, []);

  // Ask the server whether the current user is the owner.
  // This is a lightweight check — the server compares ctx.user.openId === ENV.ownerOpenId.
  const { data: ownerCheck, isLoading: checkLoading } = trpc.auth.isOwner.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const isLoading = loading || (isAuthenticated && checkLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.07_0_0)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-white/40" />
          <p className="text-sm text-white/40 font-['Barlow_Condensed'] tracking-widest uppercase">
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in — prompt to sign in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.07_0_0)]">
        <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
          <div className="h-16 w-16 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10">
            <ShieldAlert className="h-8 w-8 text-white/50" />
          </div>
          <div>
            <h1 className="text-xl font-bold mb-2 text-white/90 font-['Barlow_Condensed'] tracking-widest uppercase">
              Admin Access Required
            </h1>
            <p className="text-sm text-white/40 leading-relaxed">
              This section is restricted to the site owner. Please sign in with your Manus account to continue.
            </p>
          </div>
          <Button
            onClick={() => { window.location.href = getLoginUrl(window.location.pathname); }}
            className="gap-2 bg-white text-black hover:bg-white/90 font-['Barlow_Condensed'] tracking-widest uppercase text-xs font-bold"
          >
            Sign In
          </Button>
          <a href="/" className="text-xs text-white/30 hover:underline">
            Back to main site
          </a>
        </div>
      </div>
    );
  }

  // Logged in but not the owner — show access denied
  if (!ownerCheck?.isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.07_0_0)]">
        <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
          <div className="h-16 w-16 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10">
            <ShieldAlert className="h-8 w-8 text-red-400/70" />
          </div>
          <div>
            <h1 className="text-xl font-bold mb-2 text-white/90 font-['Barlow_Condensed'] tracking-widest uppercase">
              Access Denied
            </h1>
            <p className="text-sm text-white/40 leading-relaxed">
              This section is restricted to the site owner account only. Your current account does not have permission to access this area.
            </p>
          </div>
          <a href="/" className="text-xs text-white/30 hover:underline">
            Back to main site
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
