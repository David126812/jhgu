import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, TrendingUp, Bell, FileText, UserCog, Send } from "lucide-react";
import { useStore } from "@/data/store";
import StatusBadge from "@/components/StatusBadge";
import BottomNav from "@/components/BottomNav";

interface ActivityItem {
  label: string;
  sub: string;
  date: string;
  dossierId: string;
  type: "update" | "timeline" | "push";
}

const Activity = () => {
  const navigate = useNavigate();
  const { dossiers, publishedUpdates } = useStore();

  // Build full activity feed from all sources
  const activities: ActivityItem[] = [
    ...publishedUpdates.map((u) => {
      const d = dossiers.find((dd) => dd.id === u.dossierId);
      return {
        label: d?.name || "Dossier",
        sub: `${u.status} — ${u.nextStep}`,
        date: u.publishedAt || u.date,
        dossierId: u.dossierId,
        type: u.pushSent ? "push" as const : "update" as const,
      };
    }),
    ...dossiers.flatMap((d) =>
      d.timeline.filter((t) => t.done).map((t) => ({
        label: d.name,
        sub: t.label,
        date: t.date,
        dossierId: d.id,
        type: "timeline" as const,
      }))
    ),
  ].sort((a, b) => {
    // Simple reverse sort — most recent first
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  });

  const iconForType = (type: ActivityItem["type"]) => {
    if (type === "push") return Bell;
    if (type === "update") return Send;
    return FileText;
  };

  const colorForType = (type: ActivityItem["type"]) => {
    if (type === "push") return "bg-[hsl(145_63%_42%/0.1)] text-[hsl(145_63%_36%)]";
    if (type === "update") return "bg-primary/10 text-primary";
    return "bg-secondary text-muted-foreground";
  };

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

        <div className="flex items-center gap-2 mb-5">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-lg font-bold text-foreground">Activité récente</h1>
        </div>

        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <Clock className="h-7 w-7 text-muted-foreground/30" />
            </div>
            <p className="text-[13px] text-muted-foreground">Aucune activité pour le moment</p>
          </div>
        ) : (
          <div className="space-y-1">
            {activities.map((item, i) => {
              const Icon = iconForType(item.type);
              const color = colorForType(item.type);
              return (
                <button
                  key={i}
                  onClick={() => navigate(`/dossiers/${item.dossierId}`)}
                  className="w-full flex items-center gap-3 py-3 px-2 -mx-1 text-left hover:bg-accent rounded-xl transition"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground truncate">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{item.sub}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0">{item.date}</span>
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

export default Activity;
