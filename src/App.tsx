import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PhoneFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center py-5 px-4"
    style={{ background: "linear-gradient(145deg, #0F172A 0%, #1E293B 50%, #334155 100%)" }}
  >
    <div>
      <div className="text-center mb-8">
        <h2 className="text-sm font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Outfit', sans-serif" }}>
          Prototype • Conseil Syndical
        </h2>
      </div>
      <div className="relative w-[375px] h-[812px] rounded-[44px] overflow-hidden bg-card"
        style={{ boxShadow: "0 0 0 10px #1a1a1a, 0 0 0 12px #333, 0 20px 80px rgba(0,0,0,0.35)" }}
      >
        {/* Dynamic Island */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[126px] h-[36px] bg-[#000] rounded-b-[24px] rounded-t-none z-50" style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }} />
        {/* Screen */}
        <div className="h-full overflow-y-auto pt-[54px] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>
      </div>
      <div className="text-center mt-5">
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          Cliquez pour naviguer entre les écrans
        </p>
      </div>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
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
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PhoneFrame>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
