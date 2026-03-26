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
import UseCases from "./pages/UseCases";
import UseCasesLayoutA from "./pages/UseCasesLayoutA";
import UseCasesLayoutB from "./pages/UseCasesLayoutB";
import CaseStudies from "./pages/CaseStudies";
import ProcessPage from "./pages/ProcessPage";
import DealerServicesPage from "./pages/DealerServicesPage";

// Project detail pages
import DealerPortal from "./pages/DealerPortal";
import VendorPortal from "./pages/VendorPortal";
import DealerAdmin from "./pages/DealerAdmin";
import VendorAdmin from "./pages/VendorAdmin";
import AdminCRM from "./pages/AdminCRM";
import PortfolioAdmin from "./pages/PortfolioAdmin";
import FeaturedWorkAdmin from "./pages/FeaturedWorkAdmin";
import GraphicsAdmin from "./pages/GraphicsAdmin";
import AdminCRMModule from "./pages/AdminCRMModule";
import CRMDashboard from "./pages/CRMDashboard";
import VendorSign from "./pages/VendorSign";
import AdminCreateContract from "./pages/AdminCreateContract";

// Dealer Growth CRM pages
import CrmOverview from "./pages/crm/CrmOverview";
import DealershipDetail from "./pages/crm/DealershipDetail";
import NewDealerWizard from "./pages/crm/NewDealerWizard";
import PitchMode from "./pages/crm/PitchMode";
import Pipeline from "./pages/crm/Pipeline";
import CrmSettings from "./pages/crm/CrmSettings";
import ProposalMicrosite from "./pages/crm/ProposalMicrosite";
import AuthGate from "./components/AuthGate";

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
        {/* Dealer Growth CRM (authenticated — requires login) */}
        <Route path="/growth">{() => <AuthGate><CrmOverview /></AuthGate>}</Route>
        <Route path="/growth/dealership/:id">{(params) => <AuthGate><DealershipDetail /></AuthGate>}</Route>
        <Route path="/growth/new-dealer">{() => <AuthGate><NewDealerWizard /></AuthGate>}</Route>
        <Route path="/growth/pitch">{() => <AuthGate><PitchMode /></AuthGate>}</Route>
        <Route path="/growth/pitch/:id">{(params) => <AuthGate><PitchMode /></AuthGate>}</Route>
        <Route path="/growth/pipeline">{() => <AuthGate><Pipeline /></AuthGate>}</Route>
        <Route path="/growth/settings">{() => <AuthGate><CrmSettings /></AuthGate>}</Route>
        {/* Proposal microsite is public-facing (clients view proposals) */}
        <Route path="/growth/p/:slug" component={ProposalMicrosite} />

        {/* Admin panel */}
        <Route path="/admin" component={AdminPage} />
        <Route path="/admin/portfolio" component={PortfolioAdmin} />
        <Route path="/admin/featured-work" component={FeaturedWorkAdmin} />
        <Route path="/admin/graphics" component={GraphicsAdmin} />
        <Route path="/admin/crm" component={AdminCRM} />
        <Route path="/admin/crm/dealer" component={AdminCRMModule} />

        {/* CRM Dashboard */}
        <Route path="/crm" component={CRMDashboard} />

        {/* Portals */}
        <Route path="/dealer" component={DealerPortal} />
        <Route path="/dealer/admin" component={DealerAdmin} />
        <Route path="/dealer/admin/dealers" component={DealerAdmin} />
        <Route path="/dealer/admin/tasks" component={DealerAdmin} />
        <Route path="/dealer/admin/incidents" component={DealerAdmin} />
        <Route path="/dealer/admin/reminders" component={DealerAdmin} />
        <Route path="/dealer/admin/analytics" component={DealerAdmin} />
        <Route path="/dealer/admin/settings" component={DealerAdmin} />
        <Route path="/vendor" component={VendorPortal} />
        <Route path="/vendor/admin" component={VendorAdmin} />
        <Route path="/vendor/admin/vendors" component={VendorAdmin} />
        <Route path="/vendor/admin/contracts" component={VendorAdmin} />
        <Route path="/vendor/admin/jobs" component={VendorAdmin} />
        <Route path="/vendor/admin/tasks" component={VendorAdmin} />
        <Route path="/vendor/admin/incidents" component={VendorAdmin} />
        <Route path="/vendor/admin/analytics" component={VendorAdmin} />
        <Route path="/vendor/admin/settings" component={VendorAdmin} />
        <Route path="/vendor/sign/:token" component={VendorSign} />
        <Route path="/admin/contracts/new" component={AdminCreateContract} />

        {/* Home */}
        <Route path="/" component={Home} />

        {/* Solutions pages (Events, Websites) */}
        <Route path="/solutions" component={SolutionsPage} />
        <Route path="/solutions/events" component={SolutionsPage} />
        <Route path="/solutions/websites" component={SolutionsPage} />

        {/* Dealer Services pages (moved from Solutions) */}
        <Route path="/services/dealer-services" component={DealerServicesPage} />
        <Route path="/services/dealer-services/dealerships" component={DealerServicesPage} />
        <Route path="/services/dealer-services/dealer-groups" component={DealerServicesPage} />
        <Route path="/services/dealer-services/headshots" component={DealerServicesPage} />
        <Route path="/services/dealer-services/crm-video" component={DealerServicesPage} />
        <Route path="/services/dealer-services/inventory-photography" component={DealerServicesPage} />
        <Route path="/services/dealer-services/short-form-reels" component={DealerServicesPage} />
        <Route path="/services/dealer-services/walkaround-videos" component={DealerServicesPage} />

        {/* Legacy redirects for old /solutions/* dealer routes */}
        <Route path="/solutions/dealerships">{() => { const [,n] = useLocation(); useEffect(() => { n("/services/dealer-services/dealerships"); }, []); return null; }}</Route>
        <Route path="/solutions/dealer-groups">{() => { const [,n] = useLocation(); useEffect(() => { n("/services/dealer-services/dealer-groups"); }, []); return null; }}</Route>
        <Route path="/solutions/headshots">{() => { const [,n] = useLocation(); useEffect(() => { n("/services/dealer-services/headshots"); }, []); return null; }}</Route>
        <Route path="/solutions/crm-video">{() => { const [,n] = useLocation(); useEffect(() => { n("/services/dealer-services/crm-video"); }, []); return null; }}</Route>
        <Route path="/solutions/brands">{() => { const [,n] = useLocation(); useEffect(() => { n("/services/dealer-services/dealerships"); }, []); return null; }}</Route>
        <Route path="/solutions/dealers">{() => { const [,n] = useLocation(); useEffect(() => { n("/services/dealer-services/dealerships"); }, []); return null; }}</Route>
        <Route path="/case-studies" component={CaseStudies} />
        <Route path="/use-cases" component={UseCases} />
        <Route path="/use-cases-a" component={UseCasesLayoutA} />
        <Route path="/use-cases-b" component={UseCasesLayoutB} />
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
