import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

// Service pages
import {
  AutomotiveMarketingPage,
  EventCoveragePage,
  SocialMediaContentPage,
  PhotographyPage,
  BrandStrategyPage,
} from "./pages/ServicePages";

// Project detail pages
import {
  LexusHendersonPage,
  LexusLasVegasPage,
  RaidersPage,
  CentennialSubaruPage,
  WondrNationPage,
} from "./pages/ProjectPages";

function Router() {
  return (
    <Switch>
      {/* Home */}
      <Route path="/" component={Home} />

      {/* Service pages */}
      <Route path="/services/automotive-marketing" component={AutomotiveMarketingPage} />
      <Route path="/services/event-coverage" component={EventCoveragePage} />
      <Route path="/services/social-media-content" component={SocialMediaContentPage} />
      <Route path="/services/photography" component={PhotographyPage} />
      <Route path="/services/brand-strategy" component={BrandStrategyPage} />

      {/* Project detail pages */}
      <Route path="/projects/lexus-of-henderson" component={LexusHendersonPage} />
      <Route path="/projects/lexus-of-las-vegas" component={LexusLasVegasPage} />
      <Route path="/projects/las-vegas-raiders-tour" component={RaidersPage} />
      <Route path="/projects/centennial-subaru" component={CentennialSubaruPage} />
      <Route path="/projects/wondr-nation-g2e" component={WondrNationPage} />

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
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
