import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Image, Mail, Sparkles, Share2, Paperclip, UserCog, ChevronDown, FileIcon, MessageCircle, Ellipsis, Link, Download, Bell, Send, X, Copy, Check, Trash2 } from "lucide-react";
import { csMembers, statusLabels } from "@/data/mockData";
import { useStore } from "@/data/store";
import InternalNotes from "@/components/InternalNotes";
import StatusBadge from "@/components/StatusBadge";
import BottomNav from "@/components/BottomNav";
import { toast } from "@/hooks/use-toast";

const aiSummaries: Record<string, string> = {
  "1": "Fuite identifiée au parking B, 1 devis reçu sur 3 sollicités. 2 prestataires n'ont pas répondu malgré relance.",
  "2": "Le dossier est bloqué. La panne de l'ascenseur est causée par une carte mère défectueuse. Le devis de l'ascensoriste a été envoyé, mais la réparation n'a pas encore démarré.",
  "3": "3 devis reçus pour le ravalement, prêt pour vote AG. Aucun blocage identifié.",
  "5": "Nettoyage insatisfaisant, courrier de mise en demeure envoyé. Attente de réponse du prestataire.",
  "6": "Infiltration toiture signalée, pas encore assigné. Action requise.",
  "8": "La pièce de remplacement a été commandée auprès du fournisseur et devrait arriver le 23 mars. L'intervention du technicien sera planifiée dès réception.",
};

const nextStepsMap: Record<string, string> = {
  "1": "Solliciter un prestataire alternatif ou valider le devis reçu.",
  "2": "Relancer le syndic pour obtenir la validation du devis, ou contacter un ascensoriste alternatif.",
  "3": "Préparer le comparatif des 3 devis pour la prochaine AG.",
  "5": "Confirmer le rendez-vous de recadrage du 12 fév.",
  "6": "Assigner un responsable et planifier une inspection.",
  "8": "Confirmer la date d'intervention avec le technicien dès réception de la pièce.",
};

const docDescriptions: Record<string, string> = {
  "Rapport_diagnostic.pdf": "Rapport de diagnostic du technicien ascensoriste",
  "Contrat_maintenance.pdf": "Contrat de maintenance ascenseur en vigueur",
  "Photos_panne_batC.jpg": "Photos des pannes ascenseur bâtiment C",
  "Historique_pannes_batC.pdf": "Historique complet des pannes depuis décembre 2025",
  "Email_syndic_relance.eml": "Email de relance envoyé au syndic",
  "Devis_Entreprise_A.pdf": "Devis BTP Rénov — 45 000 €",
  "Devis_Entreprise_B.pdf": "Devis Façade Pro — 52 000 €",
  "Devis_Entreprise_C.pdf": "Devis Bâti France — 48 500 €",
  "Photos_facade.jpg": "Photos de l'état actuel de la façade",
  "Photos_parties_communes.jpg": "Photos des parties communes — nettoyage insuffisant",
  "Courrier_mise_en_demeure.pdf": "Courrier de mise en demeure au prestataire",
  "Contrat_nettoyage.pdf": "Contrat de nettoyage en vigueur",
  "Facture_electricien.pdf": "Facture intervention électricien — 320 €",
};

const DossierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const store = useStore();
  const dossier = store.dossiers.find((d) => d.id === id);
  const [assignee, setAssignee] = useState(dossier?.responsible || "");
  const [showAssignee, setShowAssignee] = useState(false);
  const [docsExpanded, setDocsExpanded] = useState(false);
  const [timelineExpanded, setTimelineExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPushModal, setShowPushModal] = useState(false);
  const [pushMessage, setPushMessage] = useState("");
  const [pushSent, setPushSent] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Sync assignee with store changes
  useEffect(() => {
    if (dossier) setAssignee(dossier.responsible);
  }, [dossier?.responsible]);

  if (!dossier) {
    return (
      <div className="bg-card flex items-center justify-center p-10">
        <p className="text-muted-foreground">Dossier introuvable</p>
      </div>
    );
  }

  const aiSummary = aiSummaries[dossier.id];
  const nextStep = nextStepsMap[dossier.id] || dossier.nextStep;
  const notes = store.getNotes(dossier.id);
  const fullTimeline = [...dossier.timeline];

  // ── Actions ──
  const handleShare = async () => {
    setMenuOpen(false);
    const shareData = {
      title: dossier.name,
      text: `${dossier.name}\nStatut: ${statusLabels[dossier.status]}\nProchaine étape: ${nextStep}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      setLinkCopied(true);
      toast({ title: "Lien copié", description: "Les informations du dossier ont été copiées dans le presse-papier." });
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleExportPDF = () => {
    setMenuOpen(false);
    // Generate a simple text export and trigger download
    const content = `
DOSSIER: ${dossier.name}
Statut: ${statusLabels[dossier.status]}
Urgence: ${dossier.urgency}
Référent: ${dossier.responsible || "Non assigné"}
Créé le: ${dossier.createdAt}
Dernière mise à jour: ${dossier.lastUpdate}

PROCHAINE ÉTAPE:
${nextStep}

${aiSummary ? `RÉSUMÉ IA:\n${aiSummary}\n` : ""}
CHRONOLOGIE:
${dossier.timeline.map((t) => `  ${t.done ? "✓" : "○"} ${t.date} — ${t.label}`).join("\n")}

DOCUMENTS:
${dossier.documents.map((d) => `  • ${d.name} (${d.type})`).join("\n") || "  Aucun document"}

---
Exporté depuis CoPro Pilot le ${new Date().toLocaleDateString("fr-FR")}
    `.trim();

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dossier-${dossier.id}-${dossier.name.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Export généré", description: "Le fichier a été téléchargé." });
  };

  const handleEmailExport = () => {
    setMenuOpen(false);
    const subject = encodeURIComponent(`[CoPro Pilot] ${dossier.name}`);
    const body = encodeURIComponent(
      `Bonjour,\n\nVoici le statut du dossier "${dossier.name}" :\n\n` +
      `Statut : ${statusLabels[dossier.status]}\n` +
      `Prochaine étape : ${nextStep}\n` +
      `Référent : ${dossier.responsible || "Non assigné"}\n\n` +
      (aiSummary ? `Résumé : ${aiSummary}\n\n` : "") +
      `Cordialement,\nConseil Syndical`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleAssign = (member: string) => {
    setAssignee(member);
    setShowAssignee(false);
    store.assignDossier(dossier.id, member);
    if (member) {
      store.addTimelineEvent(dossier.id, `Référent modifié → ${member}`);
      toast({ title: "Référent mis à jour", description: `${member} est maintenant référent du dossier.` });
    } else {
      toast({ title: "Référent retiré" });
    }
  };

  return (
    <div className="bg-card flex flex-col" style={{ minHeight: "calc(812px - 54px)" }}>
      <div className="flex-1 px-5 pb-4 pt-5">
        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate("/dossiers")}
              className="flex items-center gap-1 text-[13px] text-muted-foreground font-medium hover:text-foreground transition"
            >
              <ArrowLeft className="h-5 w-5" />
              Retour
            </button>
            <div className="flex items-center gap-2">
              {/* CTA Mise à jour statut */}
              <button
                onClick={() => navigate(`/dossiers/${dossier.id}/update`)}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:opacity-90 transition active:scale-95"
              >
                Mettre à jour
              </button>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="h-9 w-9 rounded-full bg-secondary border border-border flex items-center justify-center hover:border-primary/30 transition active:scale-95"
                >
                  <Ellipsis className="h-4 w-4 text-foreground" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-11 z-50 bg-card border border-border rounded-xl shadow-lg py-1.5 min-w-[200px]">
                    <button onClick={handleShare} className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-foreground hover:bg-accent transition">
                      {linkCopied ? <Check className="h-4 w-4 text-green-500" /> : <Link className="h-4 w-4 text-muted-foreground" />}
                      Partager la fiche
                    </button>
                    <button onClick={handleExportPDF} className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-foreground hover:bg-accent transition">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      Exporter en fichier
                    </button>
                    <button onClick={handleEmailExport} className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-foreground hover:bg-accent transition">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Envoyer par mail
                    </button>
                    <div className="mx-3 my-1 border-t border-border" />
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        if (confirm(`Supprimer le dossier "${dossier.name}" ? Cette action est irréversible.`)) {
                          store.deleteDossier(dossier.id);
                          navigate("/dossiers");
                        }
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-destructive hover:bg-destructive/10 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer le dossier
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <StatusBadge status={dossier.status} size="lg" />
            <p className="text-[12px] text-muted-foreground">Signalé le {dossier.createdAt}</p>
          </div>
          <h1 className="text-xl font-bold text-foreground leading-tight">{dossier.name}</h1>
        </div>

        {/* Résumé IA */}
        {aiSummary && (
          <section className="rounded-[14px] border-2 border-primary/30 bg-primary/[0.06] p-4 mb-4 shadow-[0_0_16px_hsl(var(--primary)/0.12)]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-[11px] font-semibold text-primary uppercase tracking-wider">Résumé IA</p>
            </div>
            <p className="text-[13px] text-foreground leading-relaxed">{aiSummary}</p>
          </section>
        )}

        {/* Prochaine étape */}
        <section className="rounded-[14px] border-2 border-border bg-card p-4 mb-4">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Prochaine étape</p>
          <p className="text-[14px] text-foreground leading-relaxed">{nextStep}</p>
        </section>

        <section className="rounded-[14px] border border-border bg-card p-4 mb-4">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Référent</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-medium text-foreground">{assignee || "Non assigné"}</p>
              <button
                className="text-[12px] text-primary font-medium hover:underline transition"
                onClick={() => setShowAssignee(!showAssignee)}
              >
                {showAssignee ? "Fermer" : "Modifier"}
              </button>
            </div>
            <button
              className="h-9 w-9 rounded-full bg-secondary border border-border flex items-center justify-center hover:border-primary/30 transition active:scale-95"
              onClick={() => navigate("/assistant")}
            >
              <MessageCircle className="h-4 w-4 text-foreground" />
            </button>
          </div>
          {showAssignee && (
            <div className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3">
              {csMembers.map((member) => (
                <button
                  key={member}
                  onClick={() => handleAssign(member)}
                  className={`text-left text-[13px] px-3 py-2 rounded-lg transition ${
                    assignee === member
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {member}
                </button>
              ))}
              <button
                onClick={() => handleAssign("")}
                className="text-left text-[13px] px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition"
              >
                Retirer le référent
              </button>
            </div>
          )}
        </section>

        {/* CTA Partager aux membres */}
        <button
          onClick={() => {
            const defaultMessages: Record<string, string> = {
              "8": "Le réparateur a été contacté, l'intervention est prévue. Utilisez les escaliers s'il vous plaît.",
              "2": "Le réparateur a été contacté, l'intervention est prévue. Utilisez les escaliers s'il vous plaît.",
            };
            setPushMessage(defaultMessages[dossier.id] || `${dossier.name} : mise à jour importante. Veuillez consulter l'application pour plus de détails.`);
            setShowPushModal(true);
          }}
          className="w-full py-3.5 rounded-[14px] btn-gradient text-primary-foreground text-[15px] font-semibold flex items-center justify-center gap-2.5 transition active:scale-[0.98] mb-4"
        >
          <Bell className="h-[18px] w-[18px]" />
          Notifier tous les copropriétaires
        </button>

        {pushSent && (
          <div className="rounded-[12px] bg-[hsl(145_63%_42%/0.08)] border border-[hsl(145_63%_42%/0.2)] p-3.5 mb-4 flex items-center gap-2.5">
            <Bell className="h-4 w-4 text-[hsl(145_63%_42%)]" />
            <p className="text-[13px] font-medium text-foreground">Notification push envoyée à tous les copropriétaires</p>
          </div>
        )}

        <section className="bg-card rounded-[14px] border border-border shadow-sm mb-4">
          <button
            onClick={() => setTimelineExpanded(!timelineExpanded)}
            className="w-full flex items-center justify-between p-[18px]"
          >
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">Chronologie</h3>
              <span className="px-1.5 py-0.5 rounded-full bg-secondary text-[10px] font-bold text-muted-foreground">{fullTimeline.length}</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${timelineExpanded ? "rotate-180" : ""}`} />
          </button>
          {timelineExpanded && (
            <div className="px-[18px] pb-[18px]">
              {fullTimeline.map((event, i) => (
                <div key={i} className="flex gap-3.5 relative" style={{ paddingBottom: i < fullTimeline.length - 1 ? 20 : 0 }}>
                  <div className="flex flex-col items-center w-5">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 z-10 ${event.done ? "bg-primary border-2 border-[hsl(217_91%_86%)]" : "bg-border border-2 border-border"}`} />
                    {i < fullTimeline.length - 1 && (
                      <div className={`w-0.5 flex-1 mt-1 ${event.done ? "bg-[hsl(217_91%_86%)]" : "bg-border"}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-[13px] leading-tight ${event.done ? "font-medium text-foreground" : "font-normal text-muted-foreground"}`}>{event.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Notes internes */}
        <InternalNotes dossierId={dossier.id} initialNotes={notes} />

        {/* Documents (collapsible) */}
        <section className="bg-card rounded-[14px] border border-border shadow-sm mb-3.5">
          <button
            onClick={() => setDocsExpanded(!docsExpanded)}
            className="w-full flex items-center justify-between p-[18px]"
          >
            <div className="flex items-center gap-2">
              <Paperclip className="h-[18px] w-[18px] text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Documents</h3>
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-secondary text-[10px] font-bold text-muted-foreground">{dossier.documents.length}</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${docsExpanded ? "rotate-180" : ""}`} />
          </button>
          {docsExpanded && (
            <div className="px-[18px] pb-[18px] space-y-2">
              {dossier.documents.length === 0 ? (
                <p className="text-[12px] text-muted-foreground italic py-2">Aucun document associé.</p>
              ) : (
                dossier.documents.map((doc, i) => {
                  const desc = docDescriptions[doc.name] || "";
                  return (
                    <div key={i} className="rounded-[10px] border border-border p-3 flex items-start gap-3">
                      <Paperclip className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[13px] font-semibold text-foreground">{doc.name}</p>
                        {desc && <p className="text-[12px] text-muted-foreground mt-0.5">{desc}</p>}
                        <span className="text-[10px] text-primary font-medium">{doc.type}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </section>
      </div>

      {/* Push notification modal */}
      {showPushModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="bg-card rounded-[16px] border border-border shadow-xl w-full max-w-sm p-6 relative">
            <button
              onClick={() => setShowPushModal(false)}
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
            <div className="mb-5">
              <textarea
                value={pushMessage}
                onChange={(e) => setPushMessage(e.target.value)}
                rows={3}
                className="w-full py-3 px-3.5 rounded-[10px] border border-border bg-secondary text-[13px] text-foreground outline-none resize-none focus:ring-2 focus:ring-primary/20 transition leading-relaxed"
                style={{ fontFamily: "inherit" }}
              />
              <p className="text-[11px] text-muted-foreground mt-1.5">Ce message sera envoyé en notification push à tous les résidents et propriétaires.</p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  store.addPublishedUpdate({
                    dossierId: dossier.id,
                    date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
                    status: statusLabels[dossier.status],
                    nextStep,
                    pushSent: true,
                  });
                  store.addTimelineEvent(dossier.id, "Notification push envoyée aux copropriétaires");
                  setShowPushModal(false);
                  setPushSent(true);
                  navigate("/push-simulation", {
                    state: {
                      notificationTitle: dossier.name,
                      notificationBody: pushMessage,
                      dossierId: dossier.id,
                    },
                  });
                }}
                className="w-full py-3 rounded-[12px] btn-gradient text-primary-foreground text-[14px] font-semibold flex items-center justify-center gap-2 transition"
              >
                <Send className="h-4 w-4" />
                Envoyer la notification
              </button>
              <button
                onClick={() => setShowPushModal(false)}
                className="w-full py-2.5 text-muted-foreground text-[13px] font-medium hover:text-foreground transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default DossierDetail;
