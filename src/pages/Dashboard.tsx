import { useNavigate } from "react-router-dom";
import { Calendar, FolderOpen, ArrowRight, Siren, Mic, MessageSquare, Clock } from "lucide-react";
import { dossiers, syndicContact } from "@/data/mockData";
import BottomNav from "@/components/BottomNav";

const Dashboard = () => {
  const navigate = useNavigate();

  const activeDossiers = dossiers.filter((d) => d.status !== "termine");
  

  const events = [
    { label: "Intervention plombier (Bât. B)", date: "14 fév." },
    { label: "Visite technique ascenseur", date: "20 fév." },
    { label: "AG annuelle", date: "26 fév." },
  ];

  const updates = [
    { label: "Devis ascensoriste transmis au syndic", date: "il y a 4 j" },
    { label: "Diagnostic ascenseur : carte mère HS", date: "il y a 6 j" },
    { label: "Bon de commande plomberie validé", date: "il y a 1 sem." },
    { label: "Signalement éclairage couloir Bât. B", date: "il y a 2 sem." },
  ];

  const quickActions = [
    {
      label: "Signaler incident",
      icon: Siren,
      color: "text-[hsl(4_74%_48%)]",
      bg: "bg-[hsl(4_74%_57%/0.1)]",
      onClick: () => navigate("/signaler-incident"),
    },
  ];

  return (
    <div className="bg-card flex flex-col" style={{ minHeight: "calc(812px - 54px)" }}>
      <div className="flex-1 px-5 pb-4 pt-5">
        {/* Header */}
        <div className="mb-5">
          <p className="text-[13px] text-muted-foreground mb-0.5">Résidence Les Jardins du Parc</p>
          <h1 className="text-[22px] font-bold text-foreground">Tableau de bord</h1>
        </div>

        {/* Voice Agent card */}
        <button
          onClick={() => navigate("/voice-agent")}
          className="w-full rounded-[14px] border border-primary/20 bg-primary/5 p-4 mb-5 text-left hover:border-primary/40 transition active:scale-[0.98]"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Mic className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-[14px] font-bold text-foreground mb-0.5">Parler à l'assistant IA</h2>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Décrivez le problème ou prenez une photo. J'ouvre ou crée le bon dossier.
              </p>
              <span className="inline-flex items-center gap-1.5 mt-2.5 text-[12px] font-semibold text-primary">
                Démarrer la conversation
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </button>

        {/* Quick actions + Stats row */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <button
            onClick={() => navigate("/signaler-incident")}
            className="flex flex-col items-center gap-1.5 py-4 rounded-[14px] bg-card border border-border shadow-sm hover:border-primary/30 transition active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-lg bg-[hsl(4_74%_57%/0.1)] flex items-center justify-center">
              <Siren className="h-[18px] w-[18px] text-[hsl(4_74%_48%)]" />
            </div>
            <span className="text-[11px] font-semibold text-foreground leading-tight text-center">Signaler incident</span>
          </button>

          <button
            onClick={() => navigate("/dossiers")}
            className="flex flex-col items-center gap-1.5 py-4 rounded-[14px] bg-card border border-border shadow-sm hover:border-primary/30 transition active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-lg bg-[hsl(217_91%_96%)] flex items-center justify-center">
              <FolderOpen className="h-[18px] w-[18px] text-primary" />
            </div>
            <span className="text-[11px] font-semibold text-foreground leading-tight text-center">Dossiers actifs</span>
          </button>

          <button
            onClick={() => navigate("/channels")}
            className="flex flex-col items-center gap-1.5 py-4 rounded-[14px] bg-card border border-border shadow-sm hover:border-primary/30 transition active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-[18px] w-[18px] text-primary" />
            </div>
            <span className="text-[11px] font-semibold text-foreground leading-tight text-center">Canaux</span>
          </button>
        </div>

        {/* Prochains événements */}
        <section className="bg-card rounded-[14px] border border-border p-[18px] shadow-sm mb-3.5">
          <div className="flex items-center gap-2 mb-3.5">
            <Calendar className="h-[18px] w-[18px] text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Prochains évènements</h2>
          </div>
           {events.map((ev, i) => (
            <div
              key={i}
              className={`flex items-center justify-between py-2.5 ${i > 0 ? "border-t border-border" : ""}`}
            >
              <span className="text-[13px] font-medium text-foreground">{ev.label}</span>
              <span className="text-xs text-muted-foreground font-medium">{ev.date}</span>
            </div>
          ))}
        </section>

        {/* Dernières mises à jour */}
        <section className="bg-card rounded-[14px] border border-border p-[18px] shadow-sm mb-3.5">
          <div className="flex items-center gap-2 mb-3.5">
            <Clock className="h-[18px] w-[18px] text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Dernières mises à jour</h2>
          </div>
          {updates.map((u, i) => (
            <div
              key={i}
              className={`flex items-center justify-between py-2.5 ${i > 0 ? "border-t border-border" : ""}`}
            >
              <span className="text-[13px] font-medium text-foreground">{u.label}</span>
              <span className="text-xs text-muted-foreground font-medium whitespace-nowrap ml-3">{u.date}</span>
            </div>
          ))}
        </section>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
