import { useState } from "react";
import { Send, Paperclip, MessageSquare, Hash, Reply, Lock, Building2, ChevronDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export interface Note {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  message: string;
  type: "internal" | "external";
  replies?: { author: string; role: string; timestamp: string; message: string }[];
}

export type InternalNote = Note;

const channels = [
  { id: "ascenseur", label: "#Ascenseur-group" },
  { id: "parking", label: "#Parking-group" },
  { id: "toiture", label: "#Toiture-group" },
  { id: "facade", label: "#Façade-group" },
  { id: "urgences", label: "#Urgences-group" },
];

type TabType = "internal" | "external";

interface DossierNotesProps {
  dossierId: string;
  initialNotes?: Note[];
}

const DossierNotes = ({ dossierId, initialNotes = [] }: DossierNotesProps) => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [activeTab, setActiveTab] = useState<TabType>("internal");
  const [newNote, setNewNote] = useState("");
  const [sendToChannel, setSendToChannel] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(channels[0].id);
  const [showConfirm, setShowConfirm] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [expanded, setExpanded] = useState(false);

  const channelLabel = channels.find((c) => c.id === selectedChannel)?.label || "";
  const filteredNotes = notes.filter((n) => n.type === activeTab);
  const internalCount = notes.filter((n) => n.type === "internal").length;
  const externalCount = notes.filter((n) => n.type === "external").length;

  const handleSendClick = () => {
    if (!newNote.trim()) return;
    setShowConfirm(true);
  };

  const handleConfirmSend = () => {
    const note: Note = {
      id: Date.now().toString(),
      author: "Mme. Laurent",
      role: "Conseil Syndical",
      timestamp: "À l'instant",
      message: newNote.trim(),
      type: activeTab,
    };
    setNotes((prev) => [...prev, note]);
    setNewNote("");
    setShowConfirm(false);

    if (activeTab === "internal") {
      toast({ title: "Note interne envoyée", description: "Visible uniquement par le Conseil Syndical." });
      if (sendToChannel) {
        setTimeout(() => {
          toast({ title: `Envoyé à ${channelLabel}`, description: `La note a aussi été partagée dans ${channelLabel}.` });
        }, 600);
      }
    } else {
      toast({ title: "Note envoyée au syndic", description: "Le syndic recevra cette note." });
    }
    setSendToChannel(false);
  };

  const handleReply = (noteId: string) => {
    if (!replyText.trim()) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId
          ? { ...n, replies: [...(n.replies || []), { author: "Mme. Laurent", role: "Conseil Syndical", timestamp: "À l'instant", message: replyText.trim() }] }
          : n
      )
    );
    setReplyText("");
    setReplyingTo(null);
    toast({ title: "Réponse ajoutée" });
  };

  return (
    <section className="bg-card rounded-[14px] border border-border shadow-sm mb-3.5">
      {/* Collapsed header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-[18px]"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="h-[18px] w-[18px] text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Notes du dossier</h3>
          <div className="flex items-center gap-1.5 ml-1">
            <span className="flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
              <Lock className="h-2.5 w-2.5" />{internalCount}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-medium text-[hsl(28_87%_44%)] bg-[hsl(28_87%_52%/0.1)] px-1.5 py-0.5 rounded-full">
              <Building2 className="h-2.5 w-2.5" />{externalCount}
            </span>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="px-[18px] pb-[18px]">
          {/* Tabs */}
          <div className="flex rounded-[10px] bg-secondary border border-border p-1 mb-3">
            {(["internal", "external"] as TabType[]).map((tab) => {
              const isInternal = tab === "internal";
              const isActive = activeTab === tab;
              const count = isInternal ? internalCount : externalCount;
              return (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setReplyingTo(null); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[8px] text-[12px] font-semibold transition ${
                    isActive
                      ? isInternal
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-[hsl(28_87%_52%/0.1)] text-[hsl(28_87%_44%)] border border-[hsl(28_87%_52%/0.2)]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isInternal ? <Lock className="h-3.5 w-3.5" /> : <Building2 className="h-3.5 w-3.5" />}
                  {isInternal ? "Interne" : "Syndic"}
                  {count > 0 && (
                    <span className={`min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1 ${
                      isActive
                        ? isInternal ? "bg-primary text-primary-foreground" : "bg-[hsl(28_87%_44%)] text-white"
                        : "bg-muted-foreground/20 text-muted-foreground"
                    }`}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Notes list */}
          <div className="space-y-2 mb-3 max-h-[280px] overflow-y-auto">
            {filteredNotes.length === 0 && (
              <p className="text-[12px] text-muted-foreground italic text-center py-3">
                {activeTab === "internal" ? "Aucune note interne." : "Aucun échange avec le syndic."}
              </p>
            )}
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`rounded-[10px] border p-2.5 ${
                  note.type === "external" ? "bg-[hsl(28_87%_52%/0.04)] border-[hsl(28_87%_52%/0.15)]" : "bg-secondary border-border"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-foreground">{note.author}</span>
                    {note.role && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                        note.role === "Syndic" ? "bg-[hsl(28_87%_52%/0.1)] text-[hsl(28_87%_44%)]" : "bg-primary/10 text-primary"
                      }`}>{note.role}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{note.timestamp}</span>
                </div>
                <p className="text-[12px] text-foreground leading-relaxed">{note.message}</p>

                {note.replies && note.replies.length > 0 && (
                  <div className={`mt-2 ml-2.5 pl-2.5 border-l-2 space-y-1.5 ${
                    note.type === "external" ? "border-[hsl(28_87%_52%/0.2)]" : "border-primary/20"
                  }`}>
                    {note.replies.map((reply, ri) => (
                      <div key={ri}>
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-[10px] font-semibold text-foreground">{reply.author}</span>
                          <span className="text-[9px] text-muted-foreground">{reply.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-foreground leading-relaxed">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {replyingTo === note.id ? (
                  <div className="mt-2 flex gap-1.5">
                    <input
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Répondre…"
                      className="flex-1 h-7 rounded-lg border border-input bg-background px-2 text-[11px] placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      onKeyDown={(e) => e.key === "Enter" && handleReply(note.id)}
                    />
                    <button onClick={() => handleReply(note.id)} className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                      <Send className="h-3 w-3 text-primary-foreground" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setReplyingTo(note.id)} className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition">
                    <Reply className="h-3 w-3" />
                    Répondre
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Composer */}
          <div className={`rounded-[10px] border p-2.5 ${
            activeTab === "external" ? "bg-[hsl(28_87%_52%/0.04)] border-[hsl(28_87%_52%/0.15)]" : "bg-secondary border-border"
          }`}>
            <div className="flex gap-1.5">
              <input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={activeTab === "internal" ? "Note interne…" : "Écrire au syndic…"}
                className="flex-1 h-8 rounded-lg border border-input bg-background px-2.5 text-[12px] placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                onKeyDown={(e) => e.key === "Enter" && handleSendClick()}
              />
              <button className="h-8 w-8 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-accent transition">
                <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <button
                onClick={handleSendClick}
                disabled={!newNote.trim()}
                className={`h-8 w-8 rounded-lg flex items-center justify-center transition disabled:opacity-50 ${
                  activeTab === "external" ? "bg-[hsl(28_87%_44%)] hover:bg-[hsl(28_87%_40%)]" : "bg-primary hover:bg-primary/90"
                }`}
              >
                <Send className="h-3.5 w-3.5 text-primary-foreground" />
              </button>
            </div>

            {activeTab === "internal" && (
              <div className="flex items-center gap-2 mt-2">
                <Checkbox id="send-channel" checked={sendToChannel} onCheckedChange={(v) => setSendToChannel(!!v)} />
                <label htmlFor="send-channel" className="text-[10px] text-muted-foreground font-medium cursor-pointer">Envoyer dans un canal</label>
                {sendToChannel && (
                  <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                    <SelectTrigger className="h-7 text-[11px] w-auto ml-1">
                      <Hash className="h-3 w-3 mr-1 text-muted-foreground" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {channels.map((ch) => (
                        <SelectItem key={ch.id} value={ch.id} className="text-[11px]">{ch.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-[320px] rounded-[16px]">
          <DialogHeader>
            <DialogTitle className="text-[15px]">
              {activeTab === "internal" ? "Envoyer cette note interne ?" : "Envoyer au syndic ?"}
            </DialogTitle>
            <DialogDescription className="text-[12px]">
              {activeTab === "internal"
                ? "Cette note sera visible uniquement par les membres du Conseil Syndical."
                : "Cette note sera envoyée au syndic et visible dans les échanges du dossier."}
            </DialogDescription>
          </DialogHeader>
          <div className={`rounded-[10px] border p-3 my-2 ${
            activeTab === "external" ? "bg-[hsl(28_87%_52%/0.04)] border-[hsl(28_87%_52%/0.15)]" : "bg-secondary border-border"
          }`}>
            <p className="text-[13px] text-foreground leading-relaxed">{newNote}</p>
          </div>
          <DialogFooter className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => setShowConfirm(false)} className="flex-1">Annuler</Button>
            <Button size="sm" onClick={handleConfirmSend} className={`flex-1 ${activeTab === "external" ? "bg-[hsl(28_87%_44%)] hover:bg-[hsl(28_87%_40%)]" : ""}`}>Envoyer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default DossierNotes;