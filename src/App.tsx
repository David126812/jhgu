import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StoreProvider } from "./data/store";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DossiersList from "./pages/DossiersList";
import DossierDetail from "./pages/DossierDetail";
import StatusUpdate from "./pages/StatusUpdate";
import Confirmation from "./pages/Confirmation";
import SignalerIncident from "./pages/SignalerIncident";
import Assistant from "./pages/Assistant";
import VoiceAgent from "./pages/VoiceAgent";
import Channels from "./pages/Channels";
import Settings from "./pages/Settings";
import PushSimulation from "./pages/PushSimulation";
import Activity from "./pages/Activity";
import Events from "./pages/Events";
import DocumentAG from "./pages/DocumentAG";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;
    const isNarrow = window.innerWidth <= 500;
    setIsMobile(isStandalone || isNarrow);

    const onChange = () => setIsMobile(
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true ||
      window.innerWidth <= 500
    );
    window.addEventListener("resize", onChange);
    return () => window.removeEventListener("resize", onChange);
  }, []);
  return isMobile;
};

const PhoneFrame = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  // Sur un vrai téléphone ou en PWA → plein écran, pas de faux cadre
  if (isMobile) {
    return <div className="min-h-screen bg-card">{children}</div>;
  }

  // Sur desktop → garder la maquette avec le cadre iPhone
  return (
    <div className="min-h-screen flex items-center justify-center py-5 px-4"
      style={{ background: "linear-gradient(145deg, #0a0f1a 0%, #141b2d 50%, #1e293b 100%)" }}
    >
      <div>
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(210 45% 23%), hsl(221 83% 53%))" }}>
              <span className="text-white text-[8px] font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>CS</span>
            </div>
            <span className="text-[12px] font-semibold tracking-wide" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Outfit', sans-serif" }}>
              CoPro Pilot
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.06)" }}>
              Prototype
            </span>
          </div>
        </div>
        <div className="relative w-[375px] h-[812px] rounded-[44px] overflow-hidden bg-card"
          style={{ boxShadow: "0 0 0 10px #111318, 0 0 0 12px #2a2d35, 0 25px 100px rgba(0,0,0,0.5), 0 0 40px rgba(37,99,235,0.08)" }}
        >
          {/* Dynamic Island */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[126px] h-[36px] bg-[#000] z-50" style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }} />
          {/* Screen */}
          <div className="h-full overflow-y-auto pt-[54px] [&::-webkit-scrollbar]:hidden">
            {children}
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            Résidence Les Jardins du Parc
          </p>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <StoreProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/jhgu">
        <PhoneFrame>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dossiers" element={<DossiersList />} />
            <Route path="/dossiers/:id" element={<DossierDetail />} />
            <Route path="/dossiers/:id/update" element={<StatusUpdate />} />
            <Route path="/dossiers/:id/confirmation" element={<Confirmation />} />
            <Route path="/push-simulation" element={<PushSimulation />} />
            <Route path="/signaler-incident" element={<SignalerIncident />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/voice-agent" element={<VoiceAgent />} />
            <Route path="/channels" element={<Channels />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/events" element={<Events />} />
            <Route path="/document-ag" element={<DocumentAG />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PhoneFrame>
      </BrowserRouter>
    </TooltipProvider>
    </StoreProvider>
  </QueryClientProvider>
);

export default App;
