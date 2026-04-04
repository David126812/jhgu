import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowUp, ArrowLeft } from "lucide-react";
import { useStore } from "@/data/store";
import { statusLabels } from "@/data/mockData";
import BottomNav from "@/components/BottomNav";

interface Message {
  role: "user" | "assistant";
  content?: string;
  chips?: string[];
  actions?: { label: string; route?: string }[];
}

const examplePrompts = [
  "On en est où avec l'ascenseur ?",
  "Quels dossiers sont bloqués ?",
  "Résume-moi les dossiers critiques",
  "Qui est responsable du ravalement ?",
];

// Keyword-based response matching
function generateResponse(query: string, dossiers: ReturnType<typeof useStore>["dossiers"]): Message {
  const q = query.toLowerCase();

  // Search for matching dossiers by keyword
  const matchingDossiers = dossiers.filter((d) =>
    d.name.toLowerCase().includes(q.split(" ").find((w) => w.length > 3) || "") ||
    q.includes(d.name.toLowerCase().split(" ")[0])
  );

  // Specific queries
  if (q.includes("bloqué") || q.includes("bloque")) {
    const blocked = dossiers.filter((d) => d.status === "bloque");
    if (blocked.length === 0) return { role: "assistant", content: "Aucun dossier n'est actuellement bloqué.", chips: ["Quels dossiers sont en cours ?", "Dossiers critiques"] };
    return {
      role: "assistant",
      content: `${blocked.length} dossier(s) bloqué(s) :\n\n${blocked.map((d) => `• **${d.name}**\n  Raison : ${d.blocageReason || "Non précisée"}\n  Référent : ${d.responsible || "Non assigné"}`).join("\n\n")}`,
      actions: blocked.map((d) => ({ label: `Ouvrir : ${d.name}`, route: `/dossiers/${d.id}` })),
      chips: ["Comment débloquer ?", "Relancer le syndic"],
    };
  }

  if (q.includes("critique") || q.includes("urgence") || q.includes("urgent")) {
    const critical = dossiers.filter((d) => d.urgency === "critique" && d.status !== "termine");
    if (critical.length === 0) return { role: "assistant", content: "Aucun dossier critique en cours.", chips: ["Dossiers en cours", "Dossiers bloqués"] };
    return {
      role: "assistant",
      content: `${critical.length} dossier(s) critique(s) :\n\n${critical.map((d) => `• **${d.name}** — ${statusLabels[d.status]}\n  Prochaine étape : ${d.nextStep}\n  Référent : ${d.responsible || "Non assigné"}`).join("\n\n")}`,
      actions: critical.map((d) => ({ label: `Ouvrir : ${d.name}`, route: `/dossiers/${d.id}` })),
      chips: ["Détails sur le premier", "Relancer le syndic"],
    };
  }

  if (q.includes("résume") || q.includes("resume") || q.includes("résumé") || q.includes("tableau")) {
    const active = dossiers.filter((d) => d.status !== "termine");
    return {
      role: "assistant",
      content: `Vous avez **${active.length} dossier(s) actif(s)** :\n\n${active.map((d) => `• **${d.name}** — ${statusLabels[d.status]} (${d.urgency})\n  → ${d.nextStep}`).join("\n\n")}`,
      actions: [{ label: "Voir tous les dossiers", route: "/dossiers" }],
      chips: ["Dossiers bloqués", "Dossiers critiques", "Qui suit quoi ?"],
    };
  }

  if (q.includes("responsable") || q.includes("qui suit") || q.includes("assigné") || q.includes("référent")) {
    const active = dossiers.filter((d) => d.status !== "termine");
    const byPerson: Record<string, string[]> = {};
    active.forEach((d) => {
      const key = d.responsible || "Non assigné";
      if (!byPerson[key]) byPerson[key] = [];
      byPerson[key].push(d.name);
    });
    return {
      role: "assistant",
      content: `Répartition des dossiers actifs :\n\n${Object.entries(byPerson).map(([person, names]) => `**${person}** (${names.length})\n${names.map((n) => `  • ${n}`).join("\n")}`).join("\n\n")}`,
      chips: ["Dossiers non assignés", "Voir les dossiers"],
      actions: [{ label: "Voir tous les dossiers", route: "/dossiers" }],
    };
  }

  if (q.includes("non assigné") || q.includes("pas assigné") || q.includes("nouveau")) {
    const unassigned = dossiers.filter((d) => !d.responsible && d.status !== "termine");
    if (unassigned.length === 0) return { role: "assistant", content: "Tous les dossiers actifs sont assignés.", chips: ["Résumé des dossiers", "Dossiers bloqués"] };
    return {
      role: "assistant",
      content: `${unassigned.length} dossier(s) non assigné(s) :\n\n${unassigned.map((d) => `• **${d.name}** — ${d.urgency}\n  → ${d.nextStep}`).join("\n\n")}`,
      actions: unassigned.map((d) => ({ label: `Assigner : ${d.name}`, route: `/dossiers/${d.id}` })),
    };
  }

  // Match ascenseur
  if (q.includes("ascenseur")) {
    const ascenseur = dossiers.filter((d) => d.name.toLowerCase().includes("ascenseur"));
    if (ascenseur.length > 0) {
      return {
        role: "assistant",
        content: `J'ai trouvé ${ascenseur.length} dossier(s) concernant l'ascenseur :\n\n${ascenseur.map((d) => `• **${d.name}** — ${statusLabels[d.status]}\n  ${d.blocageReason || d.nextStep}\n  Référent : ${d.responsible || "Non assigné"}`).join("\n\n")}`,
        actions: ascenseur.map((d) => ({ label: `Ouvrir : ${d.name}`, route: `/dossiers/${d.id}` })),
        chips: ["Pourquoi est-il bloqué ?", "Relancer le syndic", "Historique des pannes"],
      };
    }
  }

  // Match ravalement / façade
  if (q.includes("ravalement") || q.includes("façade") || q.includes("facade")) {
    const dossier = dossiers.find((d) => d.name.toLowerCase().includes("ravalement"));
    if (dossier) {
      return {
        role: "assistant",
        content: `**${dossier.name}** — ${statusLabels[dossier.status]}\n\nRéférent : ${dossier.responsible}\nProchaine étape : ${dossier.nextStep}\n\n${dossier.prestataires?.map((p) => `• ${p.name} — ${p.montant || "En attente"}`).join("\n") || ""}`,
        actions: [{ label: "Ouvrir le dossier", route: `/dossiers/${dossier.id}` }],
        chips: ["Comparer les devis", "Quand est l'AG ?"],
      };
    }
  }

  // Match nettoyage
  if (q.includes("nettoyage") || q.includes("propre")) {
    const dossier = dossiers.find((d) => d.name.toLowerCase().includes("nettoyage"));
    if (dossier) {
      return {
        role: "assistant",
        content: `**${dossier.name}** — ${statusLabels[dossier.status]}\n\nRéférent : ${dossier.responsible}\nDernière action : ${dossier.lastAction}\nProchaine étape : ${dossier.nextStep}`,
        actions: [{ label: "Ouvrir le dossier", route: `/dossiers/${dossier.id}` }],
        chips: ["Historique du dossier", "Contacter le prestataire"],
      };
    }
  }

  // Generic dossier match
  if (matchingDossiers.length > 0) {
    const d = matchingDossiers[0];
    return {
      role: "assistant",
      content: `**${d.name}** — ${statusLabels[d.status]}\n\nRéférent : ${d.responsible || "Non assigné"}\nDernière action : ${d.lastAction}\nProchaine étape : ${d.nextStep}${d.blocageReason ? `\n\nRaison blocage : ${d.blocageReason}` : ""}`,
      actions: [{ label: "Ouvrir le dossier", route: `/dossiers/${d.id}` }],
      chips: ["Plus de détails", "Mettre à jour le statut"],
    };
  }

  // Default fallback
  return {
    role: "assistant",
    content: "Je n'ai pas trouvé de dossier correspondant à votre recherche. Voici ce que je peux faire :",
    chips: ["Résumé des dossiers", "Dossiers bloqués", "Dossiers critiques", "Qui suit quoi ?"],
    actions: [{ label: "Voir tous les dossiers", route: "/dossiers" }],
  };
}

const Assistant = () => {
  const navigate = useNavigate();
  const store = useStore();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    const userMsg: Message = { role: "user", content: msg };
    const response = generateResponse(msg, store.dossiers);
    setMessages((prev) => [...prev, userMsg, response]);
    setInput("");
  };

  return (
    <div className="bg-card flex flex-col" style={{ height: "calc(812px - 54px)" }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
        </div>
        <h1 className="text-base font-bold text-foreground">Assistant IA</h1>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 pb-3 [&::-webkit-scrollbar]:hidden">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <p className="text-[13px] text-muted-foreground text-center max-w-[240px]">
              Posez une question sur vos dossiers de copropriété
            </p>
            <div className="w-full space-y-2 mt-2">
              {examplePrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-secondary border border-border text-[13px] font-medium text-foreground hover:border-primary/30 transition active:scale-[0.98]"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            {messages.map((msg, i) => {
              if (msg.role === "user") {
                return (
                  <div key={i} className="flex justify-end">
                    <div className="bg-foreground text-background rounded-2xl rounded-br-md px-4 py-3 max-w-[85%]">
                      <p className="text-[14px] leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                );
              }
              return (
                <div key={i} className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="bg-secondary border border-border rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
                      <p className="text-[14px] text-foreground leading-relaxed whitespace-pre-line">
                        {msg.content?.split("**").map((part, pi) =>
                          pi % 2 === 1 ? <strong key={pi}>{part}</strong> : part
                        )}
                      </p>
                    </div>
                  </div>

                  {msg.chips && (
                    <div className="flex flex-wrap gap-2 pl-10">
                      {msg.chips.map((chip, ci) => (
                        <button
                          key={ci}
                          onClick={() => handleSend(chip)}
                          className="px-3.5 py-2 rounded-full text-[13px] font-medium border border-border bg-card text-foreground hover:border-foreground/30 transition active:scale-[0.97]"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}

                  {msg.actions && (
                    <div className="flex flex-wrap gap-2 pl-10">
                      {msg.actions.map((action, ai) => (
                        <button
                          key={ai}
                          onClick={() => action.route && navigate(action.route)}
                          className="px-3.5 py-2 rounded-full text-[13px] font-semibold border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition active:scale-[0.97]"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="px-4 pb-2 pt-2 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Posez une question…"
            className="flex-1 py-2.5 px-4 rounded-full bg-secondary border border-border text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center flex-shrink-0 transition active:scale-95 disabled:opacity-40"
          >
            <ArrowUp className="h-4 w-4 text-background" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Assistant;
