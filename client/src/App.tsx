import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";
import AllProjectsPage from "./pages/AllProjectsPage";
import AllServicesPage from "./pages/AllServicesPage";
import ContactPage from "./pages/ContactPage";
import PortfolioPage from "./pages/PortfolioPage";
import { EventCoverageSubpage, HeadshotsSubpage, WebsiteBuildingPage } from "./pages/ServiceSubpages";
import {
  DealerServicesOverview,
  DealerInventoryPhotographyPage,
  DealerShortFormReelsPage,
  DealerWalkaroundVideosPage,
  DealerEventsPage,
  DealerCRMIntroVideosPage,
} from "./pages/DealerServicePages";

// Service pages
import {
  AutomotiveMarketingPage,
  EventCoveragePage,
  SocialMediaContentPage,
  PhotographyPage,
  BrandStrategyPage,
  WebsiteRedesignPage,
  HeadshotsPage,
} from "./pages/ServicePages";

// Enterprise pages
import SolutionsPage from "./pages/SolutionsPage";
import CaseStudies from "./pages/CaseStudies";
import ProcessPage from "./pages/ProcessPage";

// Project detail pages
import DealerPortal from "./pages/DealerPortal";
import VendorPortal from "./pages/VendorPortal";
import DealerAdmin from "./pages/DealerAdmin";
import VendorAdmin from "./pages/VendorAdmin";
import AdminCRM from "./pages/AdminCRM";
import AdminCRMModule from "./pages/AdminCRMModule";
import CRMDashboard from "./pages/CRMDashboard";
import VendorSign from "./pages/VendorSign";
import AdminCreateContract from "./pages/AdminCreateContract";

import {
  LexusHendersonPage,
  LexusLasVegasPage,
  RaidersPage,
  CentennialSubaruPage,
  WondrNationPage,
  BobMarleyPage,
  SportsIllustratedPage,
} from "./pages/ProjectPages";

/** Scrolls to the top of the page on every route change — fixes the "scroll to bottom" bug */
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <>
      <ScrollToTop />
      <Switch>
        {/* Admin panel */}
        <Route path="/admin" component={AdminPage} />
        <Route path="/admin/crm" component={AdminCRM} />
        <Route path="/admin/crm/dealer" component={AdminCRMModule} />

        {/* CRM Dashboard */}
        <Route path="/crm" component={CRMDashboard} />

        {/* Portals */}
        <Route path="/dealer" component={DealerPortal} />
        <Route path="/dealer/admin" component={DealerAdmin} />
        <Route path="/vendor" component={VendorPortal} />
        <Route path="/vendor/admin" component={VendorAdmin} />
        <Route path="/vendor/sign/:token" component={VendorSign} />
        <Route path="/admin/contracts/new" component={AdminCreateContract} />

        {/* Home */}
        <Route path="/" component={Home} />

        {/* Enterprise pages */}
        <Route path="/solutions" component={SolutionsPage} />
        <Route path="/solutions/dealers" component={SolutionsPage} />
        <Route path="/solutions/dealer-groups" component={SolutionsPage} />
        <Route path="/solutions/events" component={SolutionsPage} />
        <Route path="/solutions/brands" component={SolutionsPage} />
        <Route path="/case-studies" component={CaseStudies} />
        <Route path="/process" component={ProcessPage} />

        {/* About / Our Story */}
        <Route path="/about" component={AboutPage} />

        {/* All projects listing */}
        <Route path="/projects" component={AllProjectsPage} />

        {/* All services listing */}
        <Route path="/services" component={AllServicesPage} />

        {/* Contact & Portfolio */}
        <Route path="/contact" component={ContactPage} />
        <Route path="/portfolio" component={PortfolioPage} />
        {/* Dealer service subpages */}
        <Route path="/services/dealer" component={DealerServicesOverview} />
        <Route path="/services/dealer/01-inventory-photography" component={DealerInventoryPhotographyPage} />
        <Route path="/services/dealer/02-short-form-reels" component={DealerShortFormReelsPage} />
        <Route path="/services/dealer/03-walkaround-videos" component={DealerWalkaroundVideosPage} />
        <Route path="/services/dealer/04-dealership-events" component={DealerEventsPage} />
        <Route path="/services/dealer/05-crm-intro-videos" component={DealerCRMIntroVideosPage} />
        <Route path="/services/events" component={EventCoverageSubpage} />
        <Route path="/services/headshots" component={HeadshotsSubpage} />
        <Route path="/services/websites" component={WebsiteBuildingPage} />
        {/* Legacy service pages */}
        <Route path="/services/automotive-marketing" component={AutomotiveMarketingPage} />
        <Route path="/services/event-coverage" component={EventCoveragePage} />
        <Route path="/services/social-media-content" component={SocialMediaContentPage} />
        <Route path="/services/photography" component={PhotographyPage} />
        <Route path="/services/brand-strategy" component={BrandStrategyPage} />
        <Route path="/services/website-redesign" component={WebsiteRedesignPage} />
        <Route path="/services/headshots" component={HeadshotsPage} />

        {/* Project detail pages — also serve as case study detail */}
        <Route path="/projects/lexus-of-henderson" component={LexusHendersonPage} />
        <Route path="/projects/lexus-of-las-vegas" component={LexusLasVegasPage} />
        <Route path="/projects/las-vegas-raiders-tour" component={RaidersPage} />
        <Route path="/projects/las-vegas-raiders-the-blast" component={RaidersPage} />
        <Route path="/projects/centennial-subaru" component={CentennialSubaruPage} />
        <Route path="/projects/wondr-nation-g2e" component={WondrNationPage} />
        <Route path="/projects/wondr-nation-g2e-2025" component={WondrNationPage} />
        <Route path="/projects/bob-marley-hope-road" component={BobMarleyPage} />
        <Route path="/projects/sports-illustrated-sportsperson-2026" component={SportsIllustratedPage} />
        <Route path="/projects/sports-illustrated-spoty-2026" component={SportsIllustratedPage} />
        <Route path="/projects/janel-and-nehiamia" component={() => {
          const [, navigate] = useLocation();
          useEffect(() => { navigate("/projects"); }, []);
          return null;
        }} />

        {/* 404 */}
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
