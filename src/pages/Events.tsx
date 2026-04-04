import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, ChevronRight, MapPin, Clock } from "lucide-react";
import { useStore } from "@/data/store";
import BottomNav from "@/components/BottomNav";

interface Event {
  label: string;
  date: string;
  location?: string;
  dossierId?: string;
}

const Events = () => {
  const navigate = useNavigate();
  const { dossiers } = useStore();

  // Static upcoming events (like the original) + dynamic from dossiers
  const staticEvents: Event[] = [
    { label: "Intervention plombier (Bât. B)", date: "14 fév.", location: "Parking niveau -1" },
    { label: "Visite technique ascenseur", date: "20 fév.", location: "Bâtiment C" },
    { label: "AG annuelle", date: "26 fév.", location: "Salle des fêtes" },
    { label: "Rendez-vous de recadrage nettoyage", date: "12 fév.", location: "Bureau du syndic", dossierId: "5" },
  ];

  // Dynamic next steps from active dossiers
  const dossierEvents: Event[] = dossiers
    .filter((d) => d.status !== "termine" && d.nextStep && d.nextStep !== "—")
    .map((d) => ({
      label: d.nextStep,
      date: d.lastUpdate,
      dossierId: d.id,
    }));

  const allEvents = [...staticEvents, ...dossierEvents];

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
          <Calendar className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">Prochains événements</h1>
        </div>

        {/* Static events */}
        <div className="mb-6">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Événements planifiés</p>
          <div className="space-y-2">
            {staticEvents.map((ev, i) => (
              <button
                key={i}
                onClick={() => ev.dossierId ? navigate(`/dossiers/${ev.dossierId}`) : null}
                className="w-full rounded-[12px] border border-border bg-card p-3.5 text-left hover:border-primary/20 transition active:scale-[0.98]"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[11px] font-bold text-primary leading-none">{ev.date.split(" ")[0]}</span>
                    <span className="text-[8px] font-semibold text-primary/60 uppercase">{ev.date.split(" ")[1]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground">{ev.label}</p>
                    {ev.location && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[11px] text-muted-foreground">{ev.location}</span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/30 flex-shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Next steps from dossiers */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Prochaines étapes dossiers</p>
          <div className="space-y-2">
            {dossierEvents.length === 0 ? (
              <p className="text-[12px] text-muted-foreground italic py-3 text-center">Aucune étape en attente</p>
            ) : (
              dossierEvents.map((ev, i) => {
                const dossier = dossiers.find((d) => d.id === ev.dossierId);
                return (
                  <button
                    key={i}
                    onClick={() => ev.dossierId && navigate(`/dossiers/${ev.dossierId}`)}
                    className="w-full rounded-[12px] border border-border bg-card p-3.5 text-left hover:border-primary/20 transition active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-10 rounded-full bg-primary/30 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-foreground truncate">{ev.label}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[11px] text-muted-foreground">{dossier?.name || ""} — {ev.date}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/30 flex-shrink-0" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Events;
