import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MessageSquare, AtSign, User, Bell, Shield, HelpCircle, LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { syndicContact } from "@/data/mockData";

const Settings = () => {
  const navigate = useNavigate();

  const syndicActions = [
    { label: "Appeler le syndic", icon: Phone, action: () => { window.location.href = `tel:${syndicContact.phone}`; } },
    { label: "SMS au syndic", icon: MessageSquare, action: () => { window.location.href = `sms:${syndicContact.phone}`; } },
    { label: "Email au syndic", icon: AtSign, action: () => { window.location.href = `mailto:${syndicContact.email}`; } },
  ];

  const generalItems = [
    { label: "Mon profil", icon: User },
    { label: "Notifications", icon: Bell },
    { label: "Confidentialité", icon: Shield },
    { label: "Aide & support", icon: HelpCircle },
  ];

  return (
    <div className="bg-card flex flex-col" style={{ minHeight: "calc(812px - 54px)" }}>
      <div className="flex-1 px-5 pb-4 pt-5">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1 text-[13px] text-muted-foreground font-medium mb-3 hover:text-foreground transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Retour
        </button>

        <h1 className="text-lg font-bold text-foreground mb-5">Réglages</h1>

        {/* Syndic contact section */}
        <div className="mb-6">
          <h2 className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Contacter le syndic</h2>
          <p className="text-[11px] text-muted-foreground mb-3">{syndicContact.name} — {syndicContact.phone}</p>
          <div className="space-y-2">
            {syndicActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={action.action}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-[12px] bg-secondary border border-border hover:border-primary/30 transition active:scale-[0.98]"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-[13px] font-semibold text-foreground">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* General settings */}
        <div>
          <h2 className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Général</h2>
          <div className="space-y-2">
            {generalItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-[12px] bg-secondary border border-border hover:border-primary/30 transition active:scale-[0.98]"
                >
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-[13px] font-semibold text-foreground">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => navigate("/login")}
          className="w-full flex items-center gap-3 px-4 py-3 mt-6 rounded-[12px] bg-destructive/10 border border-destructive/20 hover:border-destructive/40 transition active:scale-[0.98]"
        >
          <LogOut className="h-5 w-5 text-destructive" />
          <span className="text-[13px] font-semibold text-destructive">Se déconnecter</span>
        </button>
      </div>
      <BottomNav />
    </div>
  );
};

export default Settings;