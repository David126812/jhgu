import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, MessageCircle, Sparkles, ArrowUp, ArrowLeft, Send } from "lucide-react";
import BottomNav from "@/components/BottomNav";

interface Message {
  role: "user" | "assistant";
  content?: string;
  chips?: string[];
  actions?: { label: string; route?: string }[];
}

const examplePrompts = [
  "C'est encore en panne, dis-moi quoi faire",
  "On en est où avec l'ascenseur ?",
  "J'ai reçu ce devis, qu'en penses-tu ?",
];

const mockAssistantResponse: Message = {
  role: "assistant",
  content:
    "J'ai retrouvé un dossier concernant l'ascenseur du bâtiment C. Le dossier est actuellement bloqué.",
  chips: [
    "Pourquoi est-il bloqué ?",
    "Qui suit le dossier ?",
    "Quelle a été la dernière action effectuée ?",
  ],
  actions: [
    { label: "Ouvrir le dossier", route: "/dossiers/2" },
  ],
};

const Assistant = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages([
      { role: "user", content: msg },
      mockAssistantResponse,
    ]);
    setInput("");
  };

  const handleChipClick = (chip: string) => {
    handleSend(chip);
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
              Posez une question ou envoyez une photo pour commencer
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
                  {/* Assistant icon + response */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="bg-secondary border border-border rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
                      <p className="text-[14px] text-foreground leading-relaxed">{msg.content}</p>
                    </div>
                  </div>

                  {/* Chips */}
                  {msg.chips && (
                    <div className="flex flex-wrap gap-2 pl-10">
                      {msg.chips.map((chip, ci) => (
                        <button
                          key={ci}
                          onClick={() => handleChipClick(chip)}
                          className="px-3.5 py-2 rounded-full text-[13px] font-medium border border-border bg-card text-foreground hover:border-foreground/30 transition active:scale-[0.97]"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  {msg.actions && (
                    <div className="flex flex-wrap gap-2 pl-10">
                      {msg.actions.map((action, ai) => (
                        <button
                          key={ai}
                          onClick={() => action.route && navigate(action.route)}
                          className="px-3.5 py-2 rounded-full text-[13px] font-medium border border-border bg-card text-foreground hover:border-foreground/30 transition active:scale-[0.97]"
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
            placeholder="Décrivez le problème…"
            className="flex-1 py-2.5 px-4 rounded-full bg-secondary border border-border text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition"
          />
          <button
            onClick={() => handleSend()}
            className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center flex-shrink-0 transition active:scale-95"
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
