import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, User, Clock, Bell, Sparkles, AlertTriangle, ArrowRight, Mic } from "lucide-react";
import { dossiers, DossierStatus, Dossier } from "@/data/mockData";
import StatusBadge from "@/components/StatusBadge";
import BottomNav from "@/components/BottomNav";

const parseDate = (dateStr: string): Date | null => {
  const months: Record<string, number> = {
    "jan.": 0, "fév.": 1, "mars": 2, "avr.": 3, "mai": 4, "juin": 5,
    "juil.": 6, "août": 7, "sept.": 8, "oct.": 9, "nov.": 10, "déc.": 11,
  };
  const parts = dateStr.match(/(\d+)\s+(\S+)\s+(\d{4})/);
  if (!parts) return null;
  const month = months[parts[2].toLowerCase()];
  if (month === undefined) return null;
  return new Date(parseInt(parts[3]), month, parseInt(parts[1]));
};

const needsReminder = (dossier: Dossier): { show: boolean; days: number; label: string } => {
  if (dossier.status === "termine") return { show: false, days: 0, label: "" };
  const created = parseDate(dossier.createdAt);
  if (!created) return { show: false, days: 0, label: "" };
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 60) return { show: false, days: diffDays, label: "" };
  const months = Math.floor(diffDays / 30);
  return {
    show: true,
    days: diffDays,
    label: months >= 2 ? `Ouvert depuis ${months} mois` : `Ouvert depuis ${diffDays}j`,
  };
};

type FilterValue = DossierStatus | "all" | "rappels" | "nouveau";

const statusFilters: { label: string; value: FilterValue }[] = [
  { label: "Tous", value: "all" },
  { label: "Rappels", value: "rappels" },
  { label: "Nouveau", value: "nouveau" },
  { label: "En cours", value: "en_cours" },
  { label: "Bloqué", value: "bloque" },
  { label: "Terminé", value: "termine" },
];

// AI priorities mock data
const aiPriorities = [
  { dossierId: "2", reason: "Bloqué depuis 2 mois, relance nécessaire", action: "Relancer OTIS + syndic" },
  { dossierId: "3", reason: "3 devis reçus, vote AG imminent", action: "Préparer comparatif pour AG" },
  { dossierId: "7", reason: "Non assigné, urgence critique", action: "Assigner un responsable" },
  { dossierId: "1", reason: "Devis manquant, 2 relances sans réponse", action: "Solliciter nouveau prestataire" },
  { dossierId: "5", reason: "Prochaine action non assignée", action: "Confirmer RDV recadrage" },
];

const DossiersList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");
  const [viewMode, setViewMode] = useState<"classic" | "ai">("classic");

  const reminderCount = dossiers.filter((d) => needsReminder(d).show).length;

  const filtered = dossiers.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ? true :
      filter === "rappels" ? needsReminder(d).show :
      filter === "nouveau" ? !d.responsible :
      d.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="bg-card flex flex-col" style={{ minHeight: "calc(812px - 54px)" }}>
      <div className="flex-1 px-5 pb-4 pt-6">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-[22px] font-bold text-foreground">Dossiers</h1>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-secondary rounded-[10px] border border-border mb-5">
          <button
            onClick={() => setViewMode("classic")}
            className={`flex-1 py-2 rounded-[8px] text-[12px] font-semibold transition ${
              viewMode === "classic"
                ? "bg-foreground/10 text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Vue classique
          </button>
          <button
            onClick={() => setViewMode("ai")}
            className={`flex-1 py-2 rounded-[8px] text-[12px] font-semibold transition flex items-center justify-center gap-1.5 ${
              viewMode === "ai"
                ? "bg-foreground/10 text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Priorités IA
          </button>
        </div>

        {/* Search + voice CTA */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex items-center gap-2.5 bg-secondary rounded-[12px] border border-border py-2.5 px-3.5 flex-1">
            <Search className="h-[18px] w-[18px] text-muted-foreground flex-shrink-0" />
            <input
              placeholder="Rechercher un dossier…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-none bg-transparent outline-none flex-1 text-[13px] text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <button
            onClick={() => navigate("/voice-agent")}
            className="w-10 h-10 rounded-[12px] bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 hover:bg-primary/20 transition active:scale-95"
            title="Agent vocal"
          >
            <Mic className="h-5 w-5 text-primary" />
          </button>
        </div>

        {viewMode === "classic" ? (
          <>
            {/* Filters */}
            <div className="flex gap-1.5 mb-5 flex-wrap">
              {statusFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-3 py-[6px] rounded-full text-[11px] font-semibold transition active:scale-[0.98] ${
                    filter === f.value
                      ? "bg-foreground text-card border-transparent"
                      : "bg-card text-muted-foreground border border-border hover:bg-accent"
                  }`}
                >
                  {f.label}
                  {f.value === "rappels" && reminderCount > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-[hsl(28_87%_52%)] text-primary-foreground text-[10px] font-bold">
                      {reminderCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-3.5">
              {filtered.map((dossier) => (
                <button
                  key={dossier.id}
                  onClick={() => navigate(`/dossiers/${dossier.id}`)}
                  className={`w-full rounded-[14px] border p-4 text-left transition active:scale-[0.98] ${
                    !dossier.responsible && dossier.urgency === "critique"
                      ? "bg-destructive/5 border-destructive/20 hover:border-destructive/40"
                      : "bg-card border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-[13px] font-semibold text-foreground leading-snug flex-1">{dossier.name}</h3>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {dossier.createdViaAgent && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-primary/10 text-primary">
                          <Mic className="h-2.5 w-2.5" />
                          Agent
                        </span>
                      )}
                      {!dossier.responsible ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full tracking-wide bg-primary/10 text-primary">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Nouveau
                        </span>
                      ) : (
                        <StatusBadge status={dossier.status} />
                      )}
                    </div>
                  </div>
                  {(() => {
                    const reminder = needsReminder(dossier);
                    return reminder.show ? (
                      <div className="flex items-center gap-1.5 mb-3 px-2.5 py-1.5 rounded-lg bg-[hsl(28_87%_52%/0.06)] border border-[hsl(28_87%_52%/0.15)]">
                        <Bell className="h-3.5 w-3.5 text-[hsl(28_87%_44%)] flex-shrink-0" />
                        <span className="text-[11px] font-semibold text-[hsl(28_87%_44%)]">{reminder.label}</span>
                        <span className="text-[10px] text-[hsl(28_87%_44%/0.7)] ml-auto">Relancer syndic / assurance</span>
                      </div>
                    ) : null;
                  })()}
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">{dossier.responsible || "⚠️ Non assigné"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground/60" />
                      <span className="text-[10px] text-muted-foreground/60">{dossier.lastUpdate}</span>
                    </div>
                  </div>
                </button>
              ))}

              {filtered.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-10">Aucun dossier trouvé</p>
              )}
            </div>
          </>
        ) : (
          /* AI Priorities View */
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-[12px] font-semibold text-primary">À traiter maintenant</p>
            </div>
            {aiPriorities.map((priority, i) => {
              const dossier = dossiers.find((d) => d.id === priority.dossierId);
              if (!dossier) return null;
              return (
                <button
                  key={priority.dossierId}
                  onClick={() => navigate(`/dossiers/${priority.dossierId}`)}
                  className="w-full rounded-[14px] border border-primary/15 bg-primary/[0.03] p-4 text-left hover:border-primary/30 transition active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <h3 className="text-[13px] font-semibold text-foreground leading-snug">{dossier.name}</h3>
                    </div>
                    <StatusBadge status={dossier.status} />
                  </div>
                  <div className="ml-7 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="h-3 w-3 text-[hsl(28_87%_52%)] flex-shrink-0" />
                      <p className="text-[11px] text-[hsl(28_87%_44%)] font-medium">{priority.reason}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ArrowRight className="h-3 w-3 text-primary flex-shrink-0" />
                      <p className="text-[11px] text-primary font-semibold">{priority.action}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default DossiersList;
