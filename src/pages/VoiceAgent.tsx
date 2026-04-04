import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Camera, ChevronRight, FolderOpen, UserCog, FileText, Send, Phone, Mail, MessageSquare, LayoutDashboard, Search, Bell, CheckCircle2, ArrowRight, X, Eye, PenLine, Share2 } from "lucide-react";
import { useStore } from "@/data/store";
import { syndicContact } from "@/data/mockData";
import BottomNav from "@/components/BottomNav";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Types
interface ChipQuestion {
  id: string;
  label: string;
  options: string[];
}

interface AgentTurn {
  role: "user" | "agent";
  text?: string;
  isVoice?: boolean;
  hasPhoto?: boolean;
  question?: ChipQuestion;
  actions?: { icon: React.ElementType; label: string; description?: string; id: string }[];
  recap?: string;
}

// Conversation tree — conditional logic based on selections
type ConversationNode = {
  agentText: string;
  question?: ChipQuestion;
  next?: Record<string, ConversationNode>;
  recap?: boolean;
  actions?: boolean;
};

const conversationTree: ConversationNode = {
  agentText: "J'ai retrouvé un dossier concernant l'ascenseur du bâtiment C. Le dossier est actuellement bloqué.",
  question: {
    id: "action",
    label: "Que souhaitez-vous savoir ?",
    options: ["Pourquoi est-il bloqué ?", "Qui suit le dossier ?", "Quelle a été la dernière action effectuée ?", "Ouvrir le dossier"],
  },
  next: {
    "Pourquoi est-il bloqué ?": {
      agentText: "L'ascenseur est en panne en raison d'une carte mère hors service. L'ascensoriste a envoyé son devis mais le syndic n'a pas encore répondu.",
      next: { default: { agentText: "", recap: true } },
    },
    "Qui suit le dossier ?": {
      agentText: "Le dossier est assigné à Sandro Salibur.",
      next: { default: { agentText: "", recap: true } },
    },
    "Quelle a été la dernière action effectuée ?": {
      agentText: "Dernière action enregistrée : devis envoyé par l'ascensoriste.",
      next: { default: { agentText: "", recap: true } },
    },
    "Ouvrir le dossier": {
      agentText: "Je vous redirige vers le dossier.",
      next: { default: { agentText: "", recap: true } },
    },
    default: {
      agentText: "",
      recap: true,
    },
  },
};

// Modal types
type ModalType = "open_existing" | "create" | "contact" | "update" | null;

const VoiceAgent = () => {
  const navigate = useNavigate();
  const store = useStore();
  const [turns, setTurns] = useState<AgentTurn[]>([]);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [usedActions, setUsedActions] = useState<string[]>([]);
  const [phase, setPhase] = useState<"idle" | "conversation" | "recap" | "actions">("idle");
  const [isRecording, setIsRecording] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [shareToggle, setShareToggle] = useState(true);
  const [contactChoice, setContactChoice] = useState<"call" | "sms" | "email" | null>(null);
  const [successScreen, setSuccessScreen] = useState<{ title: string; description: string; cta?: { label: string; action: () => void } } | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const [textInput, setTextInput] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [turns, phase]);

  const getRecapText = (sels: Record<string, string>) => {
    const building = sels["building"] || "—";
    const issue = sels["issue"] || "—";
    const severity = sels["severity"];
    const recurrence = sels["recurrence"];
    let text = `${building}, ${issue}`;
    if (severity && severity !== "—") text += `, ${severity.toLowerCase()}`;
    if (recurrence && recurrence !== "—") text += `, ${recurrence.toLowerCase()}`;
    return text + ".";
  };

  const startConversation = (voiceText: string, isVoice = false) => {
    setPhase("conversation");
    const userTurn: AgentTurn = { role: "user", text: voiceText, isVoice, hasPhoto };
    const agentTurn: AgentTurn = {
      role: "agent",
      text: conversationTree.agentText,
      question: conversationTree.question,
    };
    // Show user message first, then typing indicator, then agent response
    setTurns([userTurn]);
    setIsAgentTyping(true);
    setSelections({});
    setTimeout(() => {
      setIsAgentTyping(false);
      setTurns([userTurn, agentTurn]);
    }, 1200);
  };

  // Helper: add user turn immediately, show typing, then add agent turn
  const addWithTyping = (userTurn: AgentTurn, agentTurn: AgentTurn, cb?: () => void) => {
    setTurns((prev) => [...prev, userTurn]);
    setIsAgentTyping(true);
    const delay = Math.min(1800, Math.max(700, (agentTurn.text?.length || 0) * 6));
    setTimeout(() => {
      setIsAgentTyping(false);
      setTurns((prev) => [...prev, agentTurn]);
      cb?.();
    }, delay);
  };

  const handleChipSelect = (questionId: string, option: string) => {
    const newSelections = { ...selections, [questionId]: option };
    setSelections(newSelections);

    const userTurn: AgentTurn = { role: "user", text: option };

    // Navigate the tree based on questionId
    let node: ConversationNode = conversationTree;
    if (questionId === "action" && node.next && node.next[option]) {
      node = node.next[option];
    } else {
      const keys = ["building", "issue", "severity", "recurrence"];
      for (const key of keys) {
        const sel = newSelections[key];
        if (!sel || !node.next) break;
        node = node.next[sel] || node.next["default"] || node;
      }
    }

    if (questionId === "confirm") {
      if (option === "Confirmer") {
        const agentTurn: AgentTurn = {
          role: "agent",
          text: "J'ai trouvé un dossier déjà ouvert qui semble correspondre à votre problème :\n\n« Ascenseur bâtiment C — panne récurrente »\nOuvert depuis 3 mois, 4 signalements.",
          actions: [
            { icon: FolderOpen, label: "Consulter le dossier", description: "Voir le dossier existant", id: "go_dossier_8" },
            { icon: FileText, label: "Créer un nouveau dossier", description: "Avec les informations pré-remplies", id: "create" },
          ],
        };
        addWithTyping(userTurn, agentTurn, () => setPhase("actions"));
      } else {
        setPhase("idle");
        setTurns([]);
        setSelections({});
      }
    } else if (node.recap) {
      const recapText = getRecapText(newSelections);
      const agentTurn: AgentTurn = {
        role: "agent",
        text: `Récapitulatif : ${recapText}\n\nVous confirmez ?`,
        recap: recapText,
        question: { id: "confirm", label: "Confirmation", options: ["Confirmer", "Modifier"] },
      };
      addWithTyping(userTurn, agentTurn, () => setPhase("recap"));
    } else if (option === "Ouvrir le dossier") {
      const newUsed = [...usedActions, option];
      setUsedActions(newUsed);
      const agentTurn: AgentTurn = {
        role: "agent",
        text: node.agentText,
      };
      addWithTyping(userTurn, agentTurn, () => setTimeout(() => navigate("/dossiers/8"), 600));
    } else if (questionId === "action") {
      const newUsed = [...usedActions, option];
      setUsedActions(newUsed);
      const allOptions = conversationTree.question!.options;
      const remainingOptions = allOptions.filter((o) => !newUsed.includes(o));
      const agentTurn: AgentTurn = {
        role: "agent",
        text: node.agentText,
        question: remainingOptions.length > 0 ? {
          id: "action",
          label: "Autre question ?",
          options: remainingOptions,
        } : undefined,
      };
      addWithTyping(userTurn, agentTurn);
    } else {
      const agentTurn: AgentTurn = {
        role: "agent",
        text: node.agentText,
        question: node.question,
      };
      addWithTyping(userTurn, agentTurn);
    }
  };

  const handleActionSelect = (actionId: string) => {
    // Actions that open modals
    if (actionId === "open_existing") {
      setActiveModal("open_existing");
    } else if (actionId === "create") {
      setActiveModal("create");
    } else if (actionId === "contact") {
      setContactChoice(null);
      setActiveModal("contact");
    } else if (actionId === "update") {
      setShareToggle(true);
      setActiveModal("update");
    } else if (actionId === "similar") {
      // Inline in chat
      const userTurn: AgentTurn = { role: "user", text: "Voir les dossiers similaires" };
      const agentTurn: AgentTurn = {
        role: "agent",
        text: "📂 2 dossiers similaires trouvés :\n\n1. « Ascenseur cabine bloquée » — Bloqué depuis le 2 fév.\n   → Pièce en commande chez OTIS\n\n2. « Ascenseur bâtiment C — panne récurrente » — En cours depuis 3 mois\n   → 4 pannes, syndic non réactif\n\nLequel voulez-vous ouvrir ?",
        actions: [
          { icon: FolderOpen, label: "Ascenseur cabine bloquée", description: "Bloqué — pièce en commande", id: "go_dossier_2" },
          { icon: FolderOpen, label: "Ascenseur bât. C — récurrent", description: "En cours — 4 pannes signalées", id: "go_dossier_8" },
          { icon: ArrowRight, label: "Retour aux actions", description: "Choisir une autre action", id: "more_actions" },
        ],
      };
      setTurns((prev) => [...prev, userTurn, agentTurn]);
    } else if (actionId === "relance") {
      const userTurn: AgentTurn = { role: "user", text: "Relancer le prestataire" };
      const agentTurn: AgentTurn = {
        role: "agent",
        text: "✅ Relance envoyée à OTIS Ascenseurs.\n\nMessage : « Nous faisons suite à votre intervention du 22 déc. L'ascenseur du bâtiment C est de nouveau en panne (4ème occurrence). Merci de nous recontacter en urgence. »\n\n✅ Trace ajoutée à l'historique du dossier.",
        actions: [
          { icon: CheckCircle2, label: "Parfait, merci", description: "Terminer la conversation", id: "done" },
          { icon: ArrowRight, label: "Autre action", description: "Continuer avec d'autres actions", id: "more_actions" },
        ],
      };
      setTurns((prev) => [...prev, userTurn, agentTurn]);
    } else if (actionId === "go_dossier" || actionId === "go_dossier_8") {
      navigate("/dossiers/8", { state: { fromAgent: true } });
    } else if (actionId === "go_dossier_2") {
      navigate("/dossiers/2", { state: { fromAgent: true } });
    } else if (actionId === "go_home") {
      navigate("/dashboard");
    } else if (actionId === "done") {
      const userTurn: AgentTurn = { role: "user", text: "Terminé" };
      const agentTurn: AgentTurn = {
        role: "agent",
        text: "👋 Parfait ! Toutes les actions ont été enregistrées dans l'historique du dossier. N'hésitez pas à revenir si besoin.",
      };
      setTurns((prev) => [...prev, userTurn, agentTurn]);
      setPhase("conversation");
    } else if (actionId === "more_actions") {
      const isElevatorC = selections["building"] === "Bâtiment C" && selections["area"] === "Ascenseur";
      const userTurn: AgentTurn = { role: "user", text: "Autre action" };
      const agentTurn: AgentTurn = {
        role: "agent",
        text: "Que souhaitez-vous faire d'autre ?",
        actions: [
          ...(isElevatorC
            ? [{ icon: FolderOpen, label: "Ouvrir le dossier existant", description: "Ascenseur bâtiment C — panne récurrente", id: "open_existing" }]
            : []),
          { icon: FileText, label: "Créer un nouveau dossier", description: "Avec les informations pré-remplies", id: "create" },
          { icon: UserCog, label: "Contacter le syndic", description: "Cabinet Durand & Associés", id: "contact" },
          { icon: Bell, label: "Générer une mise à jour", description: "Et partager au conseil syndical", id: "update" },
        ],
      };
      setTurns((prev) => [...prev, userTurn, agentTurn]);
    }
  };

  // Modal confirm handlers
  const handleOpenExistingConfirm = () => {
    setActiveModal(null);
    const userTurn: AgentTurn = { role: "user", text: "Ouvrir le dossier existant" };
    const agentTurn: AgentTurn = {
      role: "agent",
      text: "✅ Dossier ouvert. Trace ajoutée : « Ouvert via agent vocal ».\n\nVoulez-vous voir le dossier ?",
      actions: [
        { icon: FolderOpen, label: "Voir le dossier", description: "Ascenseur bâtiment C", id: "go_dossier_8" },
        { icon: CheckCircle2, label: "Retour à l'accueil", description: "Terminer", id: "go_home" },
      ],
    };
    setTurns((prev) => [...prev, userTurn, agentTurn]);
  };

  const handleCreateConfirm = () => {
    setActiveModal(null);
    const building = selections["building"] || "";
    const area = selections["area"] || "";
    const issue = selections["issue"] || "";
    const now = new Date();
    const dateStr = now.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
    const shortDate = now.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    const newId = store.addDossier({
      name: `${area} ${building} — ${issue}`.trim() || "Nouveau dossier via agent",
      status: "en_cours",
      urgency: "normal",
      responsible: "",
      lastUpdate: dateStr,
      createdAt: dateStr,
      nextStep: "À assigner à un membre du CS",
      lastAction: "Signalement via agent vocal",
      createdViaAgent: true,
      timeline: [
        { date: shortDate, label: "Signalement via agent vocal", done: true },
        ...(hasPhoto ? [{ date: shortDate, label: "Photo jointe", done: true }] : []),
      ],
      documents: hasPhoto ? [{ name: `Photo_agent_${shortDate}.jpg`, type: "Photos" }] : [],
      prestataires: [],
      syndicContact,
    });
    setSuccessScreen({
      title: "Dossier créé",
      description: `« ${area} ${building} — ${issue} »\n\nStatut : Nouveau\n${hasPhoto ? "Photo jointe comme preuve\n" : ""}Récapitulatif enregistré`,
      cta: { label: "Voir le dossier", action: () => { setSuccessScreen(null); navigate(`/dossiers/${newId}`, { state: { fromAgent: true } }); } },
    });
  };

  const handleContactConfirm = () => {
    setActiveModal(null);
    const method = contactChoice === "call" ? "Appel" : contactChoice === "sms" ? "Message" : "Email";
    // Actually trigger contact
    if (contactChoice === "call") window.location.href = `tel:${syndicContact.phone}`;
    else if (contactChoice === "sms") window.location.href = `sms:${syndicContact.phone}`;
    else if (contactChoice === "email") window.location.href = `mailto:${syndicContact.email}?subject=${encodeURIComponent("[Copro] Signalement")}`;
    // Add timeline event to dossier 8 (ascenseur C)
    store.addTimelineEvent("8", `${method} envoyé au syndic via agent vocal`);
    setSuccessScreen({
      title: `${method} envoyé`,
      description: `${method} au syndic effectué.\nTrace ajoutée à l'historique du dossier.`,
      cta: { label: "Retour à l'agent", action: () => setSuccessScreen(null) },
    });
    const userTurn: AgentTurn = { role: "user", text: `Contacter le syndic — ${method}` };
    const agentTurn: AgentTurn = {
      role: "agent",
      text: `✅ ${method} envoyé au syndic. Trace ajoutée à l'historique.`,
      actions: [
        { icon: CheckCircle2, label: "Terminé", description: "Fin de la conversation", id: "done" },
        { icon: ArrowRight, label: "Autre action", description: "Continuer", id: "more_actions" },
      ],
    };
    setTurns((prev) => [...prev, userTurn, agentTurn]);
  };

  const handleUpdateConfirm = () => {
    setActiveModal(null);
    const shared = shareToggle ? "publiée et partagée au conseil" : "enregistrée (non partagée)";
    // Persist update to store
    store.addPublishedUpdate({
      dossierId: "8",
      date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
      status: "En cours",
      nextStep: "Relancer syndic + assurance",
      comment: "Mise à jour via agent vocal",
      pushSent: false,
    });
    store.addTimelineEvent("8", "Mise à jour publiée via agent vocal");
    setSuccessScreen({
      title: "Mise à jour publiée",
      description: `Mise à jour ${shared}.\nTrace ajoutée à l'historique du dossier.`,
      cta: { label: "Retour à l'agent", action: () => setSuccessScreen(null) },
    });
    const userTurn: AgentTurn = { role: "user", text: "Générer une mise à jour" };
    const agentTurn: AgentTurn = {
      role: "agent",
      text: `✅ Mise à jour ${shared}.\n\n• Notification envoyée aux membres du CS\n• Photo et récapitulatif ajoutés\n• Trace horodatée enregistrée`,
      actions: [
        { icon: FolderOpen, label: "Voir le dossier", description: "Consulter le dossier mis à jour", id: "go_dossier_8" },
        { icon: CheckCircle2, label: "Retour à l'accueil", description: "Terminer", id: "go_home" },
      ],
    };
    setTurns((prev) => [...prev, userTurn, agentTurn]);
  };

  const handleMicPress = () => {
    if (phase !== "idle") return;
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      startConversation("Le voisin du bâtiment C me demande pourquoi l'ascenseur n'est toujours pas réparé. Peux-tu m'indiquer le statut de ce dossier ?", true);
    }, 5000);
  };

  const handlePhotoPress = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = () => {
    setHasPhoto(true);
  };

  const recapText = getRecapText(selections);
  const building = selections["building"] || "";
  const area = selections["area"] || "";
  const issue = selections["issue"] || "";

  const prefilledMessage = `Bonjour,\n\nNous signalons un problème : ${area} ${building} — ${issue}.\n${hasPhoto ? "Photo jointe.\n" : ""}Merci d'intervenir rapidement.\n\n— Conseil Syndical`;

  const updatePreview = `${area} ${building} — ${issue}. Problème signalé le ${new Date().toLocaleDateString("fr-FR")} via agent vocal.${hasPhoto ? " Photo jointe." : ""} Intervention demandée.`;

  return (
    <div className="bg-card flex flex-col" style={{ height: "calc(812px - 54px)" }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center">
            <span className="text-primary-foreground text-[13px] font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>CS</span>
          </div>
          <div>
            <h1 className="text-[16px] font-bold text-foreground">Assistant Syndic</h1>
            <p className="text-[11px] text-muted-foreground">Votre gestionnaire de copropriété</p>
          </div>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      {/* Success screen overlay */}
      {successScreen && (
        <div className="absolute inset-0 z-50 bg-card flex flex-col items-center justify-center px-8 gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-[18px] font-bold text-foreground">{successScreen.title}</h2>
          <p className="text-[13px] text-muted-foreground text-center whitespace-pre-line">{successScreen.description}</p>
          {successScreen.cta && (
            <button
              onClick={successScreen.cta.action}
              className="mt-4 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition"
            >
              {successScreen.cta.label}
            </button>
          )}
        </div>
      )}

      {/* Chat area */}
      <div ref={chatRef} className="flex-1 overflow-y-auto px-5 pb-3 [&::-webkit-scrollbar]:hidden">
        {phase === "idle" ? (
          <div className="flex flex-col items-center justify-center h-full gap-5">
            <button
              onMouseDown={handleMicPress}
              onTouchStart={handleMicPress}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? "bg-primary scale-110 shadow-[0_0_40px_rgba(37,99,235,0.4)]"
                  : "bg-primary/10 border-2 border-primary/20 hover:bg-primary/20 active:scale-95"
              }`}
            >
              <Mic className={`h-10 w-10 ${isRecording ? "text-primary-foreground animate-pulse" : "text-primary"}`} />
            </button>
            <p className="text-[14px] font-semibold text-foreground">
              {isRecording ? "Je vous écoute…" : "Appuyez pour parler"}
            </p>
            <p className="text-[12px] text-muted-foreground text-center max-w-[260px]">
              Décrivez le problème ou prenez une photo. Je retrouve l'historique et vous guide.
            </p>

            <button
              onClick={handlePhotoPress}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition ${
                hasPhoto
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-secondary border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              <Camera className="h-4 w-4" />
              <span className="text-[12px] font-semibold">{hasPhoto ? "📷 Photo ajoutée" : "Ajouter une photo"}</span>
            </button>

          </div>
        ) : (
          <div className="space-y-3 pt-3">
            {turns.map((turn, i) => {
              if (turn.role === "user") {
                return (
                  <div key={i} className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5 max-w-[85%]">
                      <div className="flex items-center gap-2">
                        {turn.isVoice && <Mic className="h-3.5 w-3.5 opacity-70 flex-shrink-0" />}
                        <p className="text-[13px]">{turn.text}</p>
                      </div>
                      {turn.hasPhoto && (
                        <div className="mt-2 flex items-center gap-1.5 text-primary-foreground/70 text-[11px]">
                          <Camera className="h-3 w-3" /> Photo jointe
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              const isLast = i === turns.length - 1;
              return (
                <div key={i} className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                  {turn.text && (
                    <div className="flex items-start gap-2">
                      <div className="w-7 h-7 rounded-full btn-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-primary-foreground text-[9px] font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>CS</span>
                      </div>
                      <div className="bg-secondary border border-border rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
                        <p className="text-[13px] text-foreground leading-relaxed whitespace-pre-line">
                          {turn.text.split('\n').map((line, li) => {
                            const boldLabels = ["Équipement", "Problème", "Dernier intervenant", "Impact", "Syndic"];
                            const matchedLabel = boldLabels.find(l => line.startsWith(l + " :"));
                            if (matchedLabel) {
                              return <span key={li}>{li > 0 && '\n'}<strong>{matchedLabel}</strong>{line.slice(matchedLabel.length)}</span>;
                            }
                            return <span key={li}>{li > 0 && '\n'}{line}</span>;
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {isLast && turn.question && (
                    <div className="space-y-1.5 mt-2 ml-9">
                      {turn.question.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleChipSelect(turn.question!.id, opt)}
                          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-[12px] bg-card border border-border hover:border-primary/30 transition active:scale-[0.98] text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="h-4 w-4 text-primary" />
                          </div>
                          <p className="flex-1 text-[13px] font-semibold text-foreground">{opt}</p>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}

                  {isLast && turn.actions && (
                    <div className="space-y-1.5 mt-2 ml-9">
                      {turn.actions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={action.id}
                            onClick={() => handleActionSelect(action.id)}
                            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-[12px] bg-card border border-border hover:border-primary/30 transition active:scale-[0.98] text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-semibold text-foreground">{action.label}</p>
                              {action.description && (
                                <p className="text-[11px] text-muted-foreground truncate">{action.description}</p>
                              )}
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing indicator */}
            {isAgentTyping && (
              <div className="flex items-start gap-2 animate-in fade-in duration-200">
                <div className="w-7 h-7 rounded-full btn-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-foreground text-[9px] font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>CS</span>
                </div>
                <div className="bg-secondary border border-border rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input bar above nav */}
      <div className="px-4 pb-2 pt-2 border-t border-border bg-card">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (!textInput.trim()) return;
          if (phase === "idle") {
            startConversation(textInput.trim());
          } else {
            setTurns(prev => [...prev, { role: "user", text: textInput.trim() }]);
          }
          setTextInput("");
        }} className="flex items-center gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onFocus={() => {
                if (phase === "idle" && !textInput) {
                  setTextInput("Le voisin du bâtiment C me demande pourquoi l'ascenseur n'est toujours pas réparé. Peux-tu m'indiquer le statut de ce dossier ?");
                }
              }}
              placeholder="Écrire un message…"
              className="w-full px-4 py-2.5 rounded-full bg-secondary border border-border text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition"
            />
          </div>
          {textInput.trim() ? (
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 hover:opacity-90 transition"
            >
              <Send className="h-4 w-4 text-primary-foreground" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleMicPress}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition flex-shrink-0 ${
                isRecording
                  ? "bg-primary shadow-lg"
                  : "bg-primary/10 border border-primary/20 hover:bg-primary/20"
              }`}
            >
              <Mic className={`h-5 w-5 ${isRecording ? "text-primary-foreground animate-pulse" : "text-primary"}`} />
            </button>
          )}
        </form>
      </div>

      <BottomNav />

      {/* MODALS */}

      {/* Open existing case modal */}
      <Dialog open={activeModal === "open_existing"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[16px]">Ouvrir un dossier existant ?</DialogTitle>
            <DialogDescription className="text-[13px]">
              Le dossier « Ascenseur bâtiment C — panne récurrente » sera ouvert et une trace « Ouvert via agent vocal » sera ajoutée.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setActiveModal(null)}
              className="flex-1 py-2.5 rounded-xl border border-border text-[13px] font-semibold text-muted-foreground hover:bg-secondary transition"
            >
              Annuler
            </button>
            <button
              onClick={handleOpenExistingConfirm}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition"
            >
              Ouvrir
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create new case modal */}
      <Dialog open={activeModal === "create"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[16px]">Créer un nouveau dossier ?</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2 text-[13px]">
                <p className="text-muted-foreground">Récapitulatif :</p>
                <div className="bg-secondary rounded-xl p-3 space-y-1">
                  <p className="text-foreground font-medium">{area} {building} — {issue}</p>
                  <p className="text-muted-foreground text-[11px]">Statut : Nouveau</p>
                  {hasPhoto && <p className="text-muted-foreground text-[11px]">📷 Photo jointe</p>}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setActiveModal(null)}
              className="flex-1 py-2.5 rounded-xl border border-border text-[13px] font-semibold text-muted-foreground hover:bg-secondary transition"
            >
              Annuler
            </button>
            <button
              onClick={handleCreateConfirm}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition"
            >
              Créer
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact modal */}
      <Dialog open={activeModal === "contact"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[16px]">Contacter le syndic</DialogTitle>
            <DialogDescription className="text-[13px] text-muted-foreground">
              Cabinet Durand & Associés
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {[
              { id: "call" as const, icon: Phone, label: "Appeler", desc: "+33 1 42 86 55 00" },
              { id: "sms" as const, icon: MessageSquare, label: "Message", desc: "SMS pré-rédigé" },
              { id: "email" as const, icon: Mail, label: "Email", desc: "Email pré-rédigé avec photo" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setContactChoice(opt.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border transition text-left ${
                  contactChoice === opt.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <opt.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">{opt.label}</p>
                  <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
          {contactChoice && (
            <div className="bg-secondary rounded-xl p-3 mt-1">
              <p className="text-[11px] font-semibold text-muted-foreground mb-1">Aperçu du message :</p>
              <p className="text-[12px] text-foreground whitespace-pre-line">{prefilledMessage}</p>
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setActiveModal(null)}
              className="flex-1 py-2.5 rounded-xl border border-border text-[13px] font-semibold text-muted-foreground hover:bg-secondary transition"
            >
              Annuler
            </button>
            <button
              onClick={handleContactConfirm}
              disabled={!contactChoice}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition disabled:opacity-40"
            >
              Envoyer
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Generate update modal */}
      <Dialog open={activeModal === "update"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[16px]">Générer une mise à jour</DialogTitle>
          </DialogHeader>
          <div className="bg-secondary rounded-xl p-3">
            <p className="text-[11px] font-semibold text-muted-foreground mb-1">Aperçu :</p>
            <p className="text-[12px] text-foreground leading-relaxed">{updatePreview}</p>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[13px] font-medium text-foreground">Partager au conseil</span>
            <button
              onClick={() => setShareToggle(!shareToggle)}
              className={`w-11 h-6 rounded-full transition-colors ${shareToggle ? "bg-primary" : "bg-muted"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${shareToggle ? "translate-x-[22px]" : "translate-x-[2px]"}`} />
            </button>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setActiveModal(null)}
              className="flex-1 py-2.5 rounded-xl border border-border text-[13px] font-semibold text-muted-foreground hover:bg-secondary transition"
            >
              Annuler
            </button>
            <button
              onClick={handleUpdateConfirm}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition"
            >
              Publier
            </button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default VoiceAgent;
