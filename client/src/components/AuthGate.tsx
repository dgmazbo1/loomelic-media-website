/**
 * AuthGate — wraps pages that require authentication.
 * Redirects to the Manus OAuth login page if the user is not authenticated.
 * Shows a loading skeleton while the auth state is being resolved.
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #1a1744 0%, #2d2660 45%, #1e1b4b 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
          <p
            className="text-sm"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.05em",
            }}
          >
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #1a1744 0%, #2d2660 45%, #1e1b4b 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.3)",
            }}
          >
            <Lock className="h-8 w-8 text-indigo-400" />
          </div>
          <div>
            <h1
              className="text-xl font-bold mb-2"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.04em",
              }}
            >
              Authentication Required
            </h1>
            <p
              className="text-sm"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.6,
              }}
            >
              This section is restricted to authorized team members. Please sign in to access the Dealer Growth Command System.
            </p>
          </div>
          <Button
            onClick={() => {
              window.location.href = getLoginUrl(window.location.pathname);
            }}
            className="gap-2"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "1px solid rgba(99,102,241,0.4)",
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            Sign In
          </Button>
          <a
            href="/"
            className="text-xs hover:underline"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Back to main site
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
