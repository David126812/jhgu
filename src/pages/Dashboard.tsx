import { useNavigate } from "react-router-dom";
import { Calendar, FolderOpen, ArrowRight, Siren, Mic, MessageSquare, Clock, AlertTriangle, TrendingUp, Ban, ChevronRight, FileText } from "lucide-react";
import { useStore } from "@/data/store";
import { statusLabels } from "@/data/mockData";
import StatusBadge from "@/components/StatusBadge";
import BottomNav from "@/components/BottomNav";

const Dashboard = () => {
  const navigate = useNavigate();
  const { dossiers, publishedUpdates, userProfile } = useStore();

  const activeDossiers = dossiers.filter((d) => d.status !== "termine");
  const blockedDossiers = dossiers.filter((d) => d.status === "bloque");
  const critiqueDossiers = dossiers.filter((d) => d.urgency === "critique" && d.status !== "termine");
  const termineDossiers = dossiers.filter((d) => d.status === "termine");

  // Static upcoming events (like the original)
  const upcomingEvents = [
    { label: "Intervention plombier (Bât. B)", date: "14 fév." },
    { label: "Visite technique ascenseur", date: "20 fév." },
    { label: "AG annuelle", date: "26 fév." },
  ];

  // Dynamic updates
  const recentUpdates = [
    ...publishedUpdates.slice(-3).reverse().map((u) => {
      const d = dossiers.find((dd) => dd.id === u.dossierId);
      return { label: d?.name || "", sub: u.nextStep, date: u.publishedAt || u.date, dossierId: u.dossierId };
    }),
    ...dossiers
      .flatMap((d) =>
        d.timeline.filter((t) => t.done).slice(-1)
          .map((t) => ({ label: d.name, sub: t.label, date: t.date, dossierId: d.id }))
      )
      .slice(0, 3),
  ].slice(0, 4);

  const firstName = userProfile.name.split(" ")[0];

  return (
    <div className="bg-card flex flex-col" style={{ minHeight: "calc(812px - 54px)" }}>
      <div className="flex-1 px-5 pb-4 pt-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[12px] text-muted-foreground mb-0.5">Résidence Les Jardins du Parc</p>
            <h1 className="text-[26px] font-bold text-foreground">Bonjour {firstName}</h1>
          </div>
          <div className="w-10 h-10 rounded-full btn-gradient flex items-center justify-center" onClick={() => navigate("/settings")}>
            <span className="text-primary-foreground text-[13px] font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {userProfile.name.split(" ").map((n) => n[0]).join("")}
            </span>
          </div>
        </div>

        {/* Voice Agent card */}
        <button
          onClick={() => navigate("/voice-agent")}
          className="w-full rounded-[16px] border border-primary/20 bg-gradient-to-r from-primary/[0.06] to-primary/[0.02] p-4 mb-5 text-left hover:border-primary/40 transition active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl btn-gradient flex items-center justify-center flex-shrink-0">
              <Mic className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-[14px] font-bold text-foreground">Parler à l'assistant</h2>
              <p className="text-[11px] text-muted-foreground">Décrivez un problème, je gère le reste</p>
            </div>
            <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
          </div>
        </button>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <button
            onClick={() => navigate("/dossiers?filter=en_cours")}
            className="rounded-[12px] bg-primary/5 border border-primary/10 p-3 text-center hover:border-primary/30 transition active:scale-[0.97]"
          >
            <p className="text-[20px] font-bold text-primary">{activeDossiers.length}</p>
            <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">En cours</p>
          </button>
          <button
            onClick={() => navigate("/dossiers?filter=bloque")}
            className="rounded-[12px] bg-[hsl(28_87%_52%/0.06)] border border-[hsl(28_87%_52%/0.12)] p-3 text-center hover:border-[hsl(28_87%_52%/0.3)] transition active:scale-[0.97]"
          >
            <p className="text-[20px] font-bold text-[hsl(28_87%_40%)]">{blockedDossiers.length}</p>
            <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">Bloqués</p>
          </button>
          <button
            onClick={() => navigate("/dossiers?filter=termine")}
            className="rounded-[12px] bg-[hsl(145_63%_42%/0.05)] border border-[hsl(145_63%_42%/0.1)] p-3 text-center hover:border-[hsl(145_63%_42%/0.3)] transition active:scale-[0.97]"
          >
            <p className="text-[20px] font-bold text-[hsl(145_63%_36%)]">{termineDossiers.length}</p>
            <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">Résolus</p>
          </button>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <button
            onClick={() => navigate("/signaler-incident")}
            className="flex items-center gap-3 py-3.5 px-4 rounded-[14px] bg-card border border-border shadow-sm hover:border-destructive/30 transition active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <Siren className="h-[18px] w-[18px] text-destructive" />
            </div>
            <span className="text-[12px] font-semibold text-foreground leading-tight">Signaler un incident</span>
          </button>
          <button
            onClick={() => navigate("/channels")}
            className="flex items-center gap-3 py-3.5 px-4 rounded-[14px] bg-card border border-border shadow-sm hover:border-primary/30 transition active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="h-[18px] w-[18px] text-primary" />
            </div>
            <span className="text-[12px] font-semibold text-foreground leading-tight">Messages</span>
          </button>
        </div>

        {/* Document AG */}
        <button
          onClick={() => navigate("/document-ag")}
          className="w-full flex items-center gap-3 py-3 px-4 rounded-[14px] bg-card border border-border shadow-sm hover:border-primary/30 transition active:scale-[0.98] mb-5"
        >
          <div className="w-9 h-9 rounded-lg bg-[hsl(260_60%_55%/0.1)] flex items-center justify-center flex-shrink-0">
            <FileText className="h-[18px] w-[18px] text-[hsl(260_60%_50%)]" />
          </div>
          <div className="flex-1">
            <p className="text-[12px] font-semibold text-foreground">PV Assemblée Générale</p>
            <p className="text-[10px] text-muted-foreground">26 fév. 2026 — 6 résolutions votées</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
        </button>

        {/* Alertes */}
        {critiqueDossiers.length > 0 && (
          <section className="rounded-[14px] border border-[hsl(28_87%_52%/0.2)] bg-[hsl(28_87%_52%/0.04)] p-4 mb-3.5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[hsl(28_87%_52%/0.1)] flex items-center justify-center">
                <AlertTriangle className="h-3.5 w-3.5 text-[hsl(28_87%_44%)]" />
              </div>
              <h2 className="text-[13px] font-bold text-foreground">À traiter</h2>
            </div>
            {critiqueDossiers.map((d) => (
              <button
                key={d.id}
                onClick={() => navigate(`/dossiers/${d.id}`)}
                className="w-full flex items-center justify-between py-2.5 text-left hover:bg-[hsl(28_87%_52%/0.05)] rounded-xl px-2 -mx-1 transition"
              >
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-[13px] font-semibold text-foreground truncate">{d.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{d.nextStep}</p>
                </div>
                <StatusBadge status={d.status} />
              </button>
            ))}
          </section>
        )}

        {/* Prochains événements */}
        <section className="bg-card rounded-[14px] border border-border p-4 shadow-sm mb-3.5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-[16px] w-[16px] text-primary" />
              <h2 className="text-[13px] font-bold text-foreground">Prochains événements</h2>
            </div>
            <button onClick={() => navigate("/events")} className="text-[11px] font-semibold text-primary">
              Tout voir
            </button>
          </div>
          <div className="space-y-1">
            {upcomingEvents.map((ev, i) => (
              <button
                key={i}
                onClick={() => navigate("/events")}
                className={`w-full flex items-center justify-between py-2.5 px-2 -mx-1 text-left hover:bg-accent rounded-xl transition ${i > 0 ? "border-t border-border" : ""}`}
              >
                <span className="text-[12px] font-medium text-foreground">{ev.label}</span>
                <span className="text-[11px] text-muted-foreground font-medium whitespace-nowrap ml-3">{ev.date}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Activité récente */}
        <section className="bg-card rounded-[14px] border border-border p-4 shadow-sm mb-3.5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-[16px] w-[16px] text-muted-foreground" />
              <h2 className="text-[13px] font-bold text-foreground">Activité récente</h2>
            </div>
            <button onClick={() => navigate("/activity")} className="text-[11px] font-semibold text-primary">
              Tout voir
            </button>
          </div>
          {recentUpdates.length === 0 ? (
            <p className="text-[12px] text-muted-foreground italic py-3 text-center">Aucune activité récente</p>
          ) : (
            <div className="space-y-1">
              {recentUpdates.map((u, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/dossiers/${u.dossierId}`)}
                  className="w-full flex items-center gap-3 py-2.5 px-2 -mx-1 text-left hover:bg-accent rounded-xl transition"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-foreground truncate">{u.label}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{u.sub}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0">{u.date}</span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
