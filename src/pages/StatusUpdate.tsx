import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Sparkles, Bell, X } from "lucide-react";
import { statusLabels, statusOptions } from "@/data/mockData";
import { useStore } from "@/data/store";
import type { DossierStatus } from "@/data/mockData";

const aiSuggestions: Record<string, { status: string; nextStep: string; comment: string }> = {
  "1": { status: "en_cours", nextStep: "Validation du devis Plomberie Martin (4 200 €)", comment: "Le plombier confirme l'intervention pour le 14 février. Accès parking requis. Devis de 4 200 € à valider par le conseil." },
  "2": { status: "bloque", nextStep: "Relancer OTIS pour statut livraison pièce", comment: "Pièce détachée commandée en Allemagne, délai estimé 3 semaines. Aucune alternative disponible sur le marché français. Prochaine relance prévue le 20 fév." },
  "3": { status: "en_cours", nextStep: "Présentation comparatif à l'AG du 26 fév.", comment: "3 devis reçus : BTP Rénov (45 000 €), Façade Pro (52 000 €), Bâti France (48 500 €). Comparatif à préparer pour vote en AG." },
  "5": { status: "en_cours", nextStep: "Rendez-vous de recadrage le 12 fév.", comment: "Courrier de mise en demeure envoyé le 3 février. Le prestataire Clean & Net n'a pas encore répondu. Rendez-vous de recadrage prévu." },
  "6": { status: "en_cours", nextStep: "Planifier inspection toiture", comment: "Infiltration signalée le 11 février. Un expert toiture doit être sollicité pour diagnostic." },
  "8": { status: "en_cours", nextStep: "Mise en demeure syndic + contact assurance", comment: "4ème panne de l'ascenseur bâtiment C. Syndic relancé 3 fois sans réponse. Mise en demeure recommandée + contact assurance copropriété." },
};

const StatusUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const store = useStore();
  const dossier = store.dossiers.find((d) => d.id === id);

  const suggestion = id ? aiSuggestions[id] : undefined;

  const [aiPrefill, setAiPrefill] = useState(false);
  const [status, setStatus] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [comment, setComment] = useState("");
  const [share, setShare] = useState(true);
  const [notifyAll, setNotifyAll] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (!dossier) return null;

  const resolvedStatus = status || dossier.status;
  const resolvedStatusLabel = statusLabels[resolvedStatus as DossierStatus] || statusLabels[dossier.status];
  const resolvedNextStep = nextStep || dossier.nextStep;

  const handleToggleAi = () => {
    const next = !aiPrefill;
    setAiPrefill(next);
    if (next && suggestion) {
      setStatus(suggestion.status);
      setNextStep(suggestion.nextStep);
      setComment(suggestion.comment);
    }
  };

  const handlePublish = (withPush: boolean) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

    // Persist status change to store
    if (status) {
      store.updateDossierStatus(dossier.id, status as DossierStatus, resolvedNextStep, comment || undefined);
    } else if (nextStep) {
      store.updateDossier(dossier.id, { nextStep: resolvedNextStep, lastAction: comment || dossier.lastAction });
    }

    // Record published update
    store.addPublishedUpdate({
      dossierId: dossier.id,
      date: dateStr,
      status: resolvedStatusLabel,
      nextStep: resolvedNextStep,
      comment: comment || undefined,
      pushSent: withPush,
    });

    navigate(`/dossiers/${id}/confirmation`, {
      state: {
        dossierName: dossier.name,
        newStatus: resolvedStatusLabel,
        nextStep: resolvedNextStep,
        aiGenerated: aiPrefill,
        pushSent: withPush,
      },
    });
  };

  const handleSubmit = () => {
    if (notifyAll) {
      setShowModal(true);
    } else {
      handlePublish(false);
    }
  };

  return (
    <div className="bg-card px-5 pb-6 pt-5">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/dossiers/${id}`)}
          className="flex items-center gap-1 text-[13px] text-muted-foreground font-medium mb-3 hover:text-foreground transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Retour au dossier
        </button>
        <h1 className="text-xl font-bold text-foreground">Mettre à jour le statut</h1>
        <p className="text-[13px] text-muted-foreground mt-1">{dossier.name}</p>
      </div>

      {/* AI prefill toggle */}
      {suggestion && (
        <div className="flex items-center justify-between bg-primary/5 rounded-[14px] border border-primary/15 p-4 mb-5">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-[18px] w-[18px] text-primary" />
            <div>
              <p className="text-[13px] font-semibold text-foreground">Pré-remplir avec l'assistant</p>
              <p className="text-[11px] text-muted-foreground">Statut, commentaire et prochaine étape suggérés</p>
            </div>
          </div>
          <button
            onClick={handleToggleAi}
            className="relative w-11 h-6 rounded-full transition-colors"
            style={{ background: aiPrefill ? "hsl(221 83% 53%)" : "hsl(215 20% 79%)" }}
          >
            <div
              className="absolute top-0.5 w-5 h-5 rounded-full bg-card shadow-sm transition-[left] duration-200"
              style={{ left: aiPrefill ? 22 : 2 }}
            />
          </button>
        </div>
      )}

      {/* Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Nouveau statut</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full py-3 px-3.5 rounded-[10px] border border-border bg-secondary text-sm text-foreground outline-none appearance-auto"
            style={{ fontFamily: "inherit" }}
          >
            <option value="">Conserver le statut actuel ({statusLabels[dossier.status]})</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{statusLabels[s]}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Prochaine étape</label>
          <input
            type="text"
            placeholder={dossier.nextStep || "Ex : Attente validation devis"}
            value={nextStep}
            onChange={(e) => setNextStep(e.target.value)}
            className="w-full py-3 px-3.5 rounded-[10px] border border-border bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Commentaire</label>
          <textarea
            placeholder="Ajoutez un commentaire…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full py-3 px-3.5 rounded-[10px] border border-border bg-secondary text-sm text-foreground outline-none resize-y focus:ring-2 focus:ring-primary/20 transition"
            style={{ fontFamily: "inherit" }}
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between bg-secondary rounded-[12px] border border-border p-4">
          <div>
            <p className="text-[13px] font-semibold text-foreground mb-0.5">Partager aux membres du conseil</p>
            <p className="text-[11px] text-muted-foreground">Une notification sera envoyée aux membres</p>
          </div>
          <button
            onClick={() => setShare(!share)}
            className="relative w-11 h-6 rounded-full transition-colors"
            style={{ background: share ? "hsl(221 83% 53%)" : "hsl(215 20% 79%)" }}
          >
            <div
              className="absolute top-0.5 w-5 h-5 rounded-full bg-card shadow-sm transition-[left] duration-200"
              style={{ left: share ? 22 : 2 }}
            />
          </button>
        </div>

        <div className="flex items-center justify-between bg-secondary rounded-[12px] border border-border p-4">
          <div className="flex items-start gap-2.5">
            <Bell className="h-[16px] w-[16px] text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[13px] font-semibold text-foreground mb-0.5">Notifier tous les copropriétaires (push)</p>
              <p className="text-[11px] text-muted-foreground leading-snug">Envoie une notification push à tous les résidents et propriétaires.</p>
            </div>
          </div>
          <button
            onClick={() => setNotifyAll(!notifyAll)}
            className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ml-3"
            style={{ background: notifyAll ? "hsl(221 83% 53%)" : "hsl(215 20% 79%)" }}
          >
            <div
              className="absolute top-0.5 w-5 h-5 rounded-full bg-card shadow-sm transition-[left] duration-200"
              style={{ left: notifyAll ? 22 : 2 }}
            />
          </button>
        </div>
      </div>

      {/* CTAs */}
      <button
        onClick={handleSubmit}
        className="w-full py-3.5 rounded-[12px] btn-gradient text-primary-foreground text-[15px] font-semibold flex items-center justify-center gap-2 transition mb-2.5"
      >
        <Send className="h-[18px] w-[18px]" />
        Publier la mise à jour
      </button>
      <button
        onClick={() => navigate(`/dossiers/${id}`)}
        className="w-full py-3.5 rounded-[12px] bg-transparent text-muted-foreground text-sm font-medium border border-border hover:bg-accent transition active:scale-[0.98]"
      >
        Annuler
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="bg-card rounded-[16px] border border-border shadow-xl w-full max-w-sm p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-[17px] font-bold text-foreground">Envoyer la notification ?</h2>
            </div>

            <p className="text-[12px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">Aperçu du message</p>
            <div className="bg-secondary rounded-[10px] border border-border p-3.5 mb-5">
              <p className="text-[13px] text-foreground leading-relaxed">
                {dossier.name} : statut mis à jour → <span className="font-semibold">{resolvedStatusLabel}</span>. Prochaine étape : {resolvedNextStep}.
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => { setShowModal(false); handlePublish(true); }}
                className="w-full py-3 rounded-[12px] btn-gradient text-primary-foreground text-[14px] font-semibold flex items-center justify-center gap-2 transition"
              >
                <Bell className="h-4 w-4" />
                Envoyer et publier
              </button>
              <button
                onClick={() => { setShowModal(false); handlePublish(false); }}
                className="w-full py-3 rounded-[12px] bg-secondary text-foreground text-[14px] font-medium border border-border hover:bg-accent transition"
              >
                Publier sans notifier
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 text-muted-foreground text-[13px] font-medium hover:text-foreground transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusUpdate;
