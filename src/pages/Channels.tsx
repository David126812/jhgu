import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Hash, ArrowRight, MessageSquare, Link2, Send, ArrowUp } from "lucide-react";
import { useStore } from "@/data/store";
import BottomNav from "@/components/BottomNav";

type View = "list" | "channel" | "dm";

const Channels = () => {
  const navigate = useNavigate();
  const store = useStore();
  const [view, setView] = useState<View>("list");
  const [openId, setOpenId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const activeChannel = store.channels.find((c) => c.id === openId);
  const activeDM = store.directMessages.find((d) => d.id === openId);

  const handleSendChannelMessage = () => {
    if (!newMessage.trim() || !openId) return;
    store.addChannelMessage(openId, {
      author: store.userProfile.name,
      role: "Conseil Syndical",
      timestamp: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) + " " + new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      message: newMessage.trim(),
    });
    setNewMessage("");
  };

  const handleSendDM = () => {
    if (!newMessage.trim() || !openId) return;
    store.addDirectMessage(openId, {
      author: store.userProfile.name,
      text: newMessage.trim(),
    });
    setNewMessage("");
  };

  // ── Channel detail view ──
  if (view === "channel" && activeChannel) {
    return (
      <div className="bg-card flex flex-col" style={{ height: "calc(812px - 54px)" }}>
        <div className="flex-1 flex flex-col">
          <div className="px-5 pt-5 pb-3 border-b border-border">
            <button
              onClick={() => { setView("list"); setOpenId(null); setNewMessage(""); }}
              className="flex items-center gap-1 text-[13px] text-muted-foreground font-medium mb-2 hover:text-foreground transition"
            >
              <ArrowLeft className="h-5 w-5" />
              Retour aux canaux
            </button>
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold text-foreground">{activeChannel.label}</h1>
              <span className="text-[11px] text-muted-foreground ml-auto">{activeChannel.messages.length} messages</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-3 [&::-webkit-scrollbar]:hidden">
            {activeChannel.messages.length === 0 ? (
              <p className="text-[13px] text-muted-foreground text-center py-8 italic">Aucun message dans ce canal.</p>
            ) : (
              <div className="space-y-3">
                {activeChannel.messages.map((msg) => (
                  <div key={msg.id} className="rounded-[10px] bg-secondary border border-border p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] font-semibold text-foreground">{msg.author}</span>
                        {msg.role && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{msg.role}</span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                    </div>
                    <p className="text-[13px] text-foreground leading-relaxed">{msg.message}</p>
                    {msg.linkedDossierId && (
                      <button
                        onClick={() => navigate(`/dossiers/${msg.linkedDossierId}`)}
                        className="mt-2 flex items-center gap-1.5 text-[11px] text-primary font-semibold hover:underline"
                      >
                        <Link2 className="h-3 w-3" />
                        Voir le dossier : {msg.linkedDossierName}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message input */}
          <div className="px-4 pb-2 pt-2 border-t border-border bg-card">
            <div className="flex items-center gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChannelMessage()}
                placeholder="Écrire un message…"
                className="flex-1 py-2.5 px-4 rounded-full bg-secondary border border-border text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
              <button
                onClick={handleSendChannelMessage}
                disabled={!newMessage.trim()}
                className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0 transition active:scale-95 disabled:opacity-40"
              >
                <ArrowUp className="h-4 w-4 text-primary-foreground" />
              </button>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── DM detail view ──
  if (view === "dm" && activeDM) {
    return (
      <div className="bg-card flex flex-col" style={{ height: "calc(812px - 54px)" }}>
        <div className="flex-1 flex flex-col">
          <div className="px-5 pt-5 pb-3 border-b border-border">
            <button
              onClick={() => { setView("list"); setOpenId(null); setNewMessage(""); }}
              className="flex items-center gap-1 text-[13px] text-muted-foreground font-medium mb-2 hover:text-foreground transition"
            >
              <ArrowLeft className="h-5 w-5" />
              Retour
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-[11px] font-bold text-muted-foreground">{activeDM.initials}</span>
              </div>
              <h1 className="text-lg font-bold text-foreground">{activeDM.name}</h1>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-3 [&::-webkit-scrollbar]:hidden">
            <div className="space-y-3">
              {activeDM.messages.map((msg, i) => {
                const isMe = msg.author === store.userProfile.name;
                return (
                  <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      isMe
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary border border-border text-foreground rounded-bl-md"
                    }`}>
                      <p className="text-[13px] leading-relaxed">{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{msg.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Message input */}
          <div className="px-4 pb-2 pt-2 border-t border-border bg-card">
            <div className="flex items-center gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendDM()}
                placeholder="Écrire un message…"
                className="flex-1 py-2.5 px-4 rounded-full bg-secondary border border-border text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
              <button
                onClick={handleSendDM}
                disabled={!newMessage.trim()}
                className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0 transition active:scale-95 disabled:opacity-40"
              >
                <ArrowUp className="h-4 w-4 text-primary-foreground" />
              </button>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── List view ──
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
        <h1 className="text-lg font-bold text-foreground mb-5">Messages</h1>

        {/* Canaux */}
        <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Canaux</h2>
        <div className="space-y-2 mb-6">
          {store.channels.map((ch) => {
            const lastMsg = ch.messages[ch.messages.length - 1];
            return (
              <button
                key={ch.id}
                onClick={() => { setOpenId(ch.id); setView("channel"); }}
                className="w-full flex items-center justify-between rounded-[12px] bg-secondary border border-border p-4 hover:border-primary/30 transition active:scale-[0.98]"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[14px] font-bold text-foreground">{ch.label}</span>
                    <span className="min-w-[20px] h-5 rounded-full bg-muted text-muted-foreground text-[11px] font-bold flex items-center justify-center px-1.5">
                      {ch.messages.length}
                    </span>
                  </div>
                  <p className="text-[12px] text-muted-foreground truncate">
                    {lastMsg ? `${lastMsg.author} : ${lastMsg.message}` : "Aucun message"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 ml-3 flex-shrink-0">
                  <span className="text-[11px] text-muted-foreground">{lastMsg?.timestamp?.split(" ")[0] || ""}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Messages directs */}
        <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Messages directs</h2>
        <div className="space-y-2">
          {store.directMessages.map((dm) => {
            const lastMsg = dm.messages[dm.messages.length - 1];
            return (
              <button
                key={dm.id}
                onClick={() => { setOpenId(dm.id); setView("dm"); }}
                className="w-full flex items-center gap-3 rounded-[12px] bg-secondary border border-border p-4 hover:border-primary/30 transition active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-[12px] font-bold text-muted-foreground">{dm.initials}</span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <span className="text-[14px] font-bold text-foreground block">{dm.name}</span>
                  <p className="text-[12px] text-muted-foreground truncate">{lastMsg?.text || "Aucun message"}</p>
                </div>
                <span className="text-[11px] text-muted-foreground flex-shrink-0">{lastMsg?.timestamp?.split(" ")[0] || ""}</span>
              </button>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Channels;
