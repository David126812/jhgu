import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderOpen, Mic, Settings } from "lucide-react";
import { useStore } from "@/data/store";

const navItems = [
  { label: "Accueil", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Dossiers", icon: FolderOpen, path: "/dossiers" },
  { label: "Assistant", icon: Mic, path: "/voice-agent" },
  { label: "Réglages", icon: Settings, path: "/settings" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dossiers } = useStore();

  const criticalCount = dossiers.filter((d) => (d.status === "bloque" || d.urgency === "critique") && d.status !== "termine").length;

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border/60 px-2 pb-2 pt-1.5 z-40">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === "/dossiers" && location.pathname.startsWith("/dossiers"));
          const showBadge = item.path === "/dossiers" && criticalCount > 0;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center gap-0.5 py-1.5 px-4 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground/60 hover:text-foreground"
              }`}
            >
              {isActive && (
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-primary" />
              )}
              <div className="relative">
                <item.icon className={`h-[22px] w-[22px] transition-transform duration-200 ${isActive ? "scale-105" : ""}`} strokeWidth={isActive ? 2.5 : 1.8} />
                {showBadge && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center px-1">
                    {criticalCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] transition-all duration-200 ${isActive ? "font-bold" : "font-medium"}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
