import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import AllProjectsPage from "./pages/AllProjectsPage";
import AllServicesPage from "./pages/AllServicesPage";
import ContactPage from "./pages/ContactPage";
import PortfolioPage from "./pages/PortfolioPage";
import { DealerServicesPage, EventCoverageSubpage, HeadshotsSubpage, WebsiteBuildingPage } from "./pages/ServiceSubpages";

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

// Project detail pages
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
  return (
    <>
      <ScrollToTop />
      <Switch>
        {/* Home */}
        <Route path="/" component={Home} />

        {/* About / Our Story */}
        <Route path="/about" component={AboutPage} />

        {/* All projects listing */}
        <Route path="/projects" component={AllProjectsPage} />

        {/* All services listing */}
        <Route path="/services" component={AllServicesPage} />

        {/* Contact & Portfolio */}
        <Route path="/contact" component={ContactPage} />
        <Route path="/portfolio" component={PortfolioPage} />
        {/* Service subpages */}
        <Route path="/services/dealer" component={DealerServicesPage} />
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

        {/* Project detail pages */}
        <Route path="/projects/lexus-of-henderson" component={LexusHendersonPage} />
        <Route path="/projects/lexus-of-las-vegas" component={LexusLasVegasPage} />
        <Route path="/projects/las-vegas-raiders-tour" component={RaidersPage} />
        <Route path="/projects/centennial-subaru" component={CentennialSubaruPage} />
        <Route path="/projects/wondr-nation-g2e" component={WondrNationPage} />
        <Route path="/projects/bob-marley-hope-road" component={BobMarleyPage} />
        <Route path="/projects/sports-illustrated-sportsperson-2026" component={SportsIllustratedPage} />

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
