import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, User, Clock, Bell, Sparkles, AlertTriangle, ArrowRight, Mic, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { useStore } from "@/data/store";
import type { DossierStatus, UrgencyLevel, Dossier } from "@/data/mockData";
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
type SortValue = "recent" | "urgency" | "name" | "oldest";
type UrgencyFilter = UrgencyLevel | "all";

const statusFilters: { label: string; value: FilterValue }[] = [
  { label: "Tous", value: "all" },
  { label: "Rappels", value: "rappels" },
  { label: "Nouveau", value: "nouveau" },
  { label: "En cours", value: "en_cours" },
  { label: "Bloqué", value: "bloque" },
  { label: "Terminé", value: "termine" },
];

const urgencyOrder: Record<UrgencyLevel, number> = { critique: 0, urgent: 1, normal: 2 };

const DossiersList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { dossiers } = useStore();
  const initialFilter = (searchParams.get("filter") as FilterValue) || "all";
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>(initialFilter);
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>("all");
  const [sortBy, setSortBy] = useState<SortValue>("recent");
  const [viewMode, setViewMode] = useState<"classic" | "ai">("classic");
  const [showAdvanced, setShowAdvanced] = useState<"filter" | "sort" | false>(false);

  // Only show reminder for the single most overdue dossier
  const dossiersWithReminders = dossiers
    .map((d) => ({ dossier: d, reminder: needsReminder(d) }))
    .filter((r) => r.reminder.show)
    .sort((a, b) => b.reminder.days - a.reminder.days);
  const topReminderId = dossiersWithReminders[0]?.dossier.id || null;
  const reminderCount = topReminderId ? 1 : 0;

  const filtered = useMemo(() => {
    let result = dossiers.filter((d) => {
      const matchSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.responsible.toLowerCase().includes(search.toLowerCase()) ||
        d.nextStep.toLowerCase().includes(search.toLowerCase()) ||
        d.lastAction.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === "all" ? true :
        filter === "rappels" ? d.id === topReminderId :
        filter === "nouveau" ? !d.responsible :
        d.status === filter;
      const matchUrgency = urgencyFilter === "all" || d.urgency === urgencyFilter;
      return matchSearch && matchFilter && matchUrgency;
    });

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === "urgency") return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "oldest") {
        const da = parseDate(a.createdAt);
        const db = parseDate(b.createdAt);
        if (da && db) return da.getTime() - db.getTime();
        return 0;
      }
      // recent (default)
      const da = parseDate(a.lastUpdate);
      const db = parseDate(b.lastUpdate);
      if (da && db) return db.getTime() - da.getTime();
      return 0;
    });

    return result;
  }, [dossiers, search, filter, urgencyFilter, sortBy]);

  // AI priorities — dynamically computed
  const aiPriorities = useMemo(() => {
    return dossiers
      .filter((d) => d.status !== "termine")
      .map((d) => {
        let score = 0;
        let reason = "";
        let action = "";

        if (d.status === "bloque") { score += 30; reason = "Dossier bloqué"; action = "Débloquer la situation"; }
        if (d.urgency === "critique") { score += 25; reason = reason ? reason + ", urgence critique" : "Urgence critique"; }
        if (d.urgency === "urgent") { score += 15; }
        if (!d.responsible) { score += 20; reason = reason ? reason + ", non assigné" : "Non assigné"; action = "Assigner un responsable"; }
        if (needsReminder(d).show) { score += 10; reason = reason ? reason + `, ${needsReminder(d).label.toLowerCase()}` : needsReminder(d).label; }

        if (!action) action = d.nextStep || "Vérifier le statut";
        if (!reason) reason = `Prochaine étape: ${d.nextStep}`;

        return { dossierId: d.id, score, reason, action };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [dossiers]);

  return (
    <div className="bg-card flex flex-col" style={{ minHeight: "calc(812px - 54px)" }}>
      <div className="flex-1 px-5 pb-4 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-[22px] font-bold text-foreground">Dossiers</h1>
            <p className="text-[11px] text-muted-foreground">{dossiers.length} dossiers</p>
          </div>
          <button
            onClick={() => setViewMode(viewMode === "classic" ? "ai" : "classic")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition active:scale-[0.97] ${
              viewMode === "ai"
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-secondary text-muted-foreground border border-border hover:border-primary/20"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {viewMode === "ai" ? "Priorités IA" : "IA"}
          </button>
        </div>

        {/* Search + voice CTA */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex items-center gap-2.5 bg-secondary rounded-[12px] border border-border py-2.5 px-3.5 flex-1">
            <Search className="h-[18px] w-[18px] text-muted-foreground flex-shrink-0" />
            <input
              placeholder="Rechercher dossier, référent, action…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-none bg-transparent outline-none flex-1 text-[13px] text-foreground placeholder:text-muted-foreground"
            />
            {search && (
              <button onClick={() => setSearch("")} className="p-0.5">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
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
            {/* Filter & Sort buttons */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => { setShowAdvanced(showAdvanced === "filter" ? false : "filter"); }}
                className={`flex items-center gap-1.5 px-3 py-[6px] rounded-full text-[11px] font-semibold transition active:scale-[0.97] ${
                  showAdvanced === "filter" || filter !== "all" || urgencyFilter !== "all"
                    ? "bg-foreground text-card"
                    : "bg-card text-muted-foreground border border-border hover:bg-accent"
                }`}
              >
                <SlidersHorizontal className="h-3 w-3" />
                Filtrer
                {(filter !== "all" || urgencyFilter !== "all") && showAdvanced !== "filter" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
              <button
                onClick={() => { setShowAdvanced(showAdvanced === "sort" ? false : "sort"); }}
                className={`flex items-center gap-1.5 px-3 py-[6px] rounded-full text-[11px] font-semibold transition active:scale-[0.97] ${
                  showAdvanced === "sort" || sortBy !== "recent"
                    ? "bg-foreground text-card"
                    : "bg-card text-muted-foreground border border-border hover:bg-accent"
                }`}
              >
                <ArrowUpDown className="h-3 w-3" />
                Trier
                {sortBy !== "recent" && showAdvanced !== "sort" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
              {(filter !== "all" || urgencyFilter !== "all" || sortBy !== "recent") && (
                <button
                  onClick={() => { setFilter("all"); setUrgencyFilter("all"); setSortBy("recent"); setShowAdvanced(false); }}
                  className="text-[11px] text-muted-foreground hover:text-foreground transition ml-auto"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter tags — statut + urgence */}
            {showAdvanced === "filter" && (
              <div className="mb-4 p-3 rounded-[12px] bg-secondary/50 border border-border space-y-2.5">
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Statut</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {statusFilters.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        className={`px-2.5 py-[5px] rounded-full text-[11px] font-semibold transition active:scale-[0.98] ${
                          filter === f.value
                            ? "bg-foreground text-card"
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
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Urgence</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {([{ v: "all" as UrgencyFilter, l: "Toutes" }, { v: "critique" as UrgencyFilter, l: "Critique", dot: "bg-destructive" }, { v: "urgent" as UrgencyFilter, l: "Urgent", dot: "bg-[hsl(28_87%_52%)]" }, { v: "normal" as UrgencyFilter, l: "Normal", dot: "bg-primary/40" }]).map((f) => (
                      <button
                        key={f.v}
                        onClick={() => setUrgencyFilter(f.v)}
                        className={`px-2.5 py-[5px] rounded-full text-[11px] font-semibold transition active:scale-[0.98] flex items-center gap-1.5 ${
                          urgencyFilter === f.v
                            ? "bg-foreground text-card"
                            : "bg-card text-muted-foreground border border-border hover:bg-accent"
                        }`}
                      >
                        {f.dot && <span className={`w-1.5 h-1.5 rounded-full ${urgencyFilter === f.v ? "bg-card" : f.dot}`} />}
                        {f.l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sort tags */}
            {showAdvanced === "sort" && (
              <div className="mb-4 p-3 rounded-[12px] bg-secondary/50 border border-border">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Trier par</p>
                <div className="flex gap-1.5 flex-wrap">
                  {([{ v: "recent" as SortValue, l: "Plus récent" }, { v: "urgency" as SortValue, l: "Urgence" }, { v: "name" as SortValue, l: "Nom A-Z" }, { v: "oldest" as SortValue, l: "Plus ancien" }]).map((s) => (
                    <button
                      key={s.v}
                      onClick={() => setSortBy(s.v)}
                      className={`px-2.5 py-[5px] rounded-full text-[11px] font-semibold transition ${
                        sortBy === s.v
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-muted-foreground border border-border hover:bg-accent"
                      }`}
                    >
                      {s.l}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* List */}
            <div className="space-y-2.5">
              {filtered.map((dossier) => {
                const urgencyColor = dossier.urgency === "critique" ? "bg-destructive" : dossier.urgency === "urgent" ? "bg-[hsl(28_87%_52%)]" : "bg-primary/30";
                return (
                <button
                  key={dossier.id}
                  onClick={() => navigate(`/dossiers/${dossier.id}`)}
                  className={`w-full rounded-[14px] border text-left transition active:scale-[0.98] overflow-hidden ${
                    !dossier.responsible && dossier.urgency === "critique"
                      ? "bg-destructive/[0.03] border-destructive/20 hover:border-destructive/40"
                      : "bg-card border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex">
                    {/* Urgency color bar */}
                    <div className={`w-1 flex-shrink-0 ${urgencyColor}`} />
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
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
                        return reminder.show && dossier.id === topReminderId ? (
                          <div className="flex items-center gap-1.5 mb-2 px-2.5 py-1.5 rounded-lg bg-[hsl(28_87%_52%/0.06)] border border-[hsl(28_87%_52%/0.15)]">
                            <Bell className="h-3.5 w-3.5 text-[hsl(28_87%_44%)] flex-shrink-0" />
                            <span className="text-[11px] font-semibold text-[hsl(28_87%_44%)]">{reminder.label}</span>
                          </div>
                        ) : null;
                      })()}
                      {dossier.nextStep && dossier.nextStep !== "—" && (
                        <p className="text-[11px] text-muted-foreground mb-2 line-clamp-1">{dossier.nextStep}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-[11px] text-muted-foreground">{dossier.responsible || "Non assigné"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground/60" />
                          <span className="text-[10px] text-muted-foreground/60">{dossier.lastUpdate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
                );
              })}

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
