import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/useMobile";
import {
  LayoutDashboard, PanelLeft, Zap,
  PlusCircle, Settings, GitBranch,
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useTopLoadingBar } from './TopLoadingBar';

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029344895/9EFzgS3ECWGZ4P5zcofN4C/loomelic_logo_main_e237c91b.png";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/growth" },
  { icon: Zap, label: "Rapid Pitch", path: "/growth/pitch" },
  { icon: PlusCircle, label: "Add Target", path: "/growth/new-dealer" },
  { icon: GitBranch, label: "Pipeline", path: "/growth/pipeline" },
  { icon: Settings, label: "Settings", path: "/growth/settings" },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 240;
const MIN_WIDTH = 200;
const MAX_WIDTH = 360;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  return (
    <SidebarProvider
      style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}
    >
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
};

function DashboardLayoutContent({ children, setSidebarWidth }: DashboardLayoutContentProps) {
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeMenuItem = menuItems.find(item => item.path === location);
  const isMobile = useIsMobile();
  const { start: startLoading } = useTopLoadingBar();

  useEffect(() => {
    if (isCollapsed) setIsResizing(false);
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar
          collapsible="icon"
          style={{
            background: "rgba(26,23,68,0.85)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRight: "1px solid rgba(255,255,255,0.08)",
          }}
          disableTransition={isResizing}
        >
          {/* Sidebar Header — logo */}
          <SidebarHeader
            className="h-20 justify-center px-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={toggleSidebar}
                className="h-8 w-8 flex items-center justify-center rounded-md transition-colors focus:outline-none shrink-0"
                style={{ color: "rgba(165,180,252,0.5)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                aria-label="Toggle navigation"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
              {!isCollapsed && (
                <img
                  src={LOGO_URL}
                  alt="Loomelic Media"
                  className="h-16 w-auto object-contain"
                  style={{ maxWidth: "170px", filter: "none" }}
                />
              )}
            </div>
          </SidebarHeader>

          {/* Nav items */}
          <SidebarContent className="gap-0 pt-3" style={{ background: "transparent" }}>
            <SidebarMenu className="px-2 gap-1">
              {menuItems.map(item => {
                const isActive =
                  location === item.path ||
                  (item.path !== "/" && location.startsWith(item.path));
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => { if (!isActive) startLoading(); setLocation(item.path); }}
                      tooltip={item.label}
                      style={isActive ? {
                        background: "rgba(99,102,241,0.18)",
                        border: "1px solid rgba(99,102,241,0.3)",
                        color: "#a5b4fc",
                        borderRadius: "10px",
                      } : {
                        background: "transparent",
                        border: "1px solid transparent",
                        color: "rgba(203,213,225,0.6)",
                        borderRadius: "10px",
                      }}
                      className="h-10 transition-all text-sm font-medium hover:!bg-white/8 hover:!text-white/80 hover:!border-white/10"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: isActive ? 600 : 500,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          fontSize: "0.7rem",
                        }}
                      >
                        {item.label}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          {/* Footer — branding only, no auth */}
          <SidebarFooter
            className="p-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center gap-2.5 px-2 py-2">
              <div
                className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #ec4899)",
                  color: "white",
                  fontFamily: "'Space Grotesk', sans-serif",
                  border: "1px solid rgba(99,102,241,0.25)",
                }}
              >
                LM
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-semibold truncate leading-none"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    Loomelic Media
                  </p>
                  <p
                    className="text-xs truncate mt-1"
                    style={{ fontFamily: "'Inter', sans-serif", color: "rgba(148,163,184,0.7)" }}
                  >
                    Dealer Growth Command System
                  </p>
                </div>
              )}
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Resize handle */}
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => { if (!isCollapsed) setIsResizing(true); }}
          style={{ zIndex: 50, background: "transparent" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.3)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        />
      </div>

      {/* Main content area with aurora gradient + orbs */}
      <SidebarInset
        style={{
          background: "linear-gradient(135deg, #1a1744 0%, #2d2660 45%, #1e1b4b 100%)",
          backgroundAttachment: "fixed",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Aurora orbs */}
        <div
          style={{
            position: "fixed",
            top: "-120px",
            right: "80px",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: "-80px",
            left: "220px",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "fixed",
            top: "40%",
            right: "5%",
            width: "250px",
            height: "250px",
            background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Top header bar */}
        {!isMobile ? (
          <header
            className="h-14 flex items-center justify-between px-6 sticky top-0 z-40"
            style={{
              background: "rgba(26,23,68,0.75)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 1px 12px rgba(0,0,0,0.2)",
            }}
          >
            <div className="flex items-center gap-3">
              <h1
                className="text-sm font-bold"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {activeMenuItem?.label ?? "Overview"}
              </h1>
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>·</span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.7rem",
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.02em",
                }}
              >
                Dealer Growth Command System
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  background: "rgba(99,102,241,0.18)",
                  border: "1px solid rgba(99,102,241,0.35)",
                  color: "#a5b4fc",
                }}
              >
                PRODUCTION
              </span>
            </div>
          </header>
        ) : (
          <div
            className="flex h-14 items-center justify-between px-3 sticky top-0 z-40"
            style={{
              background: "rgba(26,23,68,0.75)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 1px 12px rgba(0,0,0,0.2)",
            }}
          >
            <div className="flex items-center gap-2">
              <SidebarTrigger
                className="h-9 w-9 rounded-lg"
                style={{ color: "rgba(165,180,252,0.6)" }}
              />
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {activeMenuItem?.label ?? "Menu"}
              </span>
            </div>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "2px 8px",
                borderRadius: "20px",
                background: "rgba(99,102,241,0.18)",
                border: "1px solid rgba(99,102,241,0.35)",
                color: "#a5b4fc",
              }}
            >
              PRODUCTION
            </span>
          </div>
        )}

        <main className="flex-1 p-5 relative z-10">{children}</main>
      </SidebarInset>
    </>
  );
}
