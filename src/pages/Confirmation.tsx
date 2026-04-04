import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Clock, User, FileText, ArrowRight, Bell, BellOff } from "lucide-react";

const Confirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    dossierName: string;
    newStatus: string;
    nextStep: string;
    aiGenerated?: boolean;
    pushSent?: boolean;
  } | null;

  const now = new Date();
  const dateStr = now.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const timeStr = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="bg-card flex flex-col items-center justify-center px-6" style={{ minHeight: "calc(812px - 54px)" }}>
      <div className="w-full max-w-sm text-center">
        {/* Check icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[hsl(145_63%_42%/0.1)] flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(145 63% 42%)" strokeWidth="2" strokeLinecap="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <path d="M22 4L12 14.01l-3-3"/>
            </svg>
          </div>
        </div>

        <h1 className="text-[22px] font-bold text-foreground mb-2">Mise à jour partagée</h1>
        <p className="text-sm text-muted-foreground mb-7 leading-relaxed">
          Votre mise à jour a été envoyée aux membres du conseil syndical
        </p>

        {/* Recap */}
        {state && (
          <div className="bg-secondary rounded-[14px] border border-border p-[18px] text-left space-y-3.5 mb-5">
            <div>
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Dossier</p>
              <p className="text-sm font-semibold text-foreground">{state.dossierName}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Nouveau statut</p>
              <p className="text-sm font-semibold text-foreground">{state.newStatus}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Prochaine étape</p>
              <p className="text-sm font-medium text-foreground">{state.nextStep}</p>
            </div>
          </div>
        )}

        {/* Push notification status */}
        {state && (
          <div className={`rounded-[14px] border p-[18px] text-left mb-5 flex items-start gap-3 ${
            state.pushSent 
              ? "bg-[hsl(145_63%_42%/0.06)] border-[hsl(145_63%_42%/0.2)]" 
              : "bg-secondary border-border"
          }`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
              state.pushSent ? "bg-[hsl(145_63%_42%/0.12)]" : "bg-muted"
            }`}>
              {state.pushSent 
                ? <Bell className="h-[18px] w-[18px] text-[hsl(145_63%_42%)]" />
                : <BellOff className="h-[18px] w-[18px] text-muted-foreground" />
              }
            </div>
            <div>
              <p className="text-[13px] font-semibold text-foreground mb-0.5">
                {state.pushSent ? "Notification push envoyée" : "Notification push non envoyée"}
              </p>
              <p className="text-[12px] text-muted-foreground leading-snug">
                {state.pushSent 
                  ? "Tous les copropriétaires (résidents et propriétaires) ont été notifiés." 
                  : "Seuls les membres du conseil syndical ont été informés."}
              </p>
            </div>
          </div>
        )}

        {/* Generated trace */}
        <div className="bg-secondary rounded-[14px] border border-border p-[18px] text-left space-y-3 mb-7">
          <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Trace générée</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-[12px] text-foreground">{dateStr} à {timeStr}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-[12px] text-foreground">Initié par le conseil syndical</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-[12px] text-foreground">
                {state?.aiGenerated ? "Pré-rempli par l'assistant IA" : "Rédigé manuellement"}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate(`/dossiers/${id}`)}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-primary mt-1"
          >
            Voir l'historique complet
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* CTAs */}
        <button
          onClick={() => navigate(`/dossiers/${id}`)}
          className="w-full py-3.5 rounded-[12px] btn-gradient text-primary-foreground text-[15px] font-semibold transition mb-2.5"
        >
          Voir le dossier
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full py-3.5 rounded-[12px] bg-transparent text-muted-foreground text-sm font-medium border border-border hover:bg-accent transition active:scale-[0.98]"
        >
          Retour tableau de bord
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
