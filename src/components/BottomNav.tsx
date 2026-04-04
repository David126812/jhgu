import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderOpen, Mic, Settings } from "lucide-react";

const navItems = [
  { label: "Tableau de bord", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Dossiers", icon: FolderOpen, path: "/dossiers" },
  { label: "Agent vocal", icon: Mic, path: "/voice-agent" },
  { label: "Réglages", icon: Settings, path: "/settings" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border px-2 pb-1 pt-1.5 z-40">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === "/dossiers" && location.pathname.startsWith("/dossiers"));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
