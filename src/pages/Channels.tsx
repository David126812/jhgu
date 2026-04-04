import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Hash, ArrowRight, MessageSquare, Link2, Send } from "lucide-react";
import BottomNav from "@/components/BottomNav";

interface ChannelMessage {
  author: string;
  role: string;
  timestamp: string;
  message: string;
  linkedDossierId?: string;
  linkedDossierName?: string;
}

interface Channel {
  id: string;
  label: string;
  count: number;
  preview: string;
  date: string;
  messages: ChannelMessage[];
}

const channelsData: Channel[] = [
  {
    id: "ascenseur",
    label: "#ascenseur",
    count: 2,
    preview: "Nelly : Toujours pas de nouvelles pour la r...",
    date: "09:14",
    messages: [
      { author: "Mme. Laurent", role: "Conseil Syndical", timestamp: "6 fév. 14:32", message: "Le syndic n'a pas répondu, je relance demain matin.", linkedDossierId: "2", linkedDossierName: "Ascenseur cabine bloquée" },
      { author: "M. Bernard", role: "Conseil Syndical", timestamp: "6 fév. 15:10", message: "J'ai retrouvé le rapport OTIS, je le joins au dossier.", linkedDossierId: "2", linkedDossierName: "Ascenseur cabine bloquée" },
    ],
  },
  {
    id: "electricite",
    label: "#electricité",
    count: 0,
    preview: "Marc : Le disjoncteur du hall a encore sauté",
    date: "Hier",
    messages: [],
  },
  {
    id: "parking",
    label: "#parking",
    count: 0,
    preview: "Sophie : La fuite a été localisée au nivea...",
    date: "8 mars",
    messages: [
      { author: "M. Dupont", role: "Syndic", timestamp: "8 fév. 10:00", message: "Le prestataire Plomberie Martin confirme l'intervention du 14 fév.", linkedDossierId: "1", linkedDossierName: "Fuite parking bâtiment B" },
    ],
  },
  {
    id: "toiture",
    label: "#toiture",
    count: 0,
    preview: "Jean : RAS après la dernière inspection",
    date: "5 mars",
    messages: [],
  },
  {
    id: "espaces-verts",
    label: "#espaces-verts",
    count: 0,
    preview: "Sandro : Nouveau devis reçu pour le con...",
    date: "3 mars",
    messages: [],
  },
];

interface DirectMessage {
  id: string;
  name: string;
  initials: string;
  lastMessage: string;
  date: string;
}

const directMessages: DirectMessage[] = [
  { id: "sandro", name: "Sandro Salibur", initials: "SS", lastMessage: "OK je relance demain", date: "Hier" },
  { id: "jean", name: "Jean Martin", initials: "JM", lastMessage: "Merci pour le suivi", date: "7 mars" },
];

const Channels = () => {
  const navigate = useNavigate();
  const [openChannel, setOpenChannel] = useState<string | null>(null);

  const activeChannel = channelsData.find((c) => c.id === openChannel);

  if (activeChannel) {
    return (
      <div className="bg-card flex flex-col" style={{ minHeight: "calc(812px - 54px)" }}>
        <div className="flex-1 px-5 pb-4 pt-5">
          <button
            onClick={() => setOpenChannel(null)}
            className="flex items-center gap-1 text-[13px] text-muted-foreground font-medium mb-3 hover:text-foreground transition"
          >
            <ArrowLeft className="h-5 w-5" />
            Retour aux canaux
          </button>
          <div className="flex items-center gap-2 mb-4">
            <Hash className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">{activeChannel.label}</h1>
          </div>

          {activeChannel.messages.length === 0 ? (
            <p className="text-[13px] text-muted-foreground text-center py-8 italic">Aucun message dans ce canal.</p>
          ) : (
            <div className="space-y-3">
              {activeChannel.messages.map((msg, i) => (
                <div key={i} className="rounded-[10px] bg-secondary border border-border p-3">
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
        <BottomNav />
      </div>
    );
  }

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
          {channelsData.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setOpenChannel(ch.id)}
              className="w-full flex items-center justify-between rounded-[12px] bg-secondary border border-border p-4 hover:border-primary/30 transition active:scale-[0.98]"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[14px] font-bold text-foreground">{ch.label}</span>
                  {ch.count > 0 && (
                    <span className="min-w-[20px] h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center px-1.5">
                      {ch.count}
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-muted-foreground truncate">{ch.preview}</p>
              </div>
              <div className="flex items-center gap-1.5 ml-3 flex-shrink-0">
                <span className="text-[11px] text-muted-foreground">{ch.date}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>

        {/* Messages directs */}
        <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Messages directs</h2>
        <div className="space-y-2">
          {directMessages.map((dm) => (
            <button
              key={dm.id}
              className="w-full flex items-center gap-3 rounded-[12px] bg-secondary border border-border p-4 hover:border-primary/30 transition active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <span className="text-[12px] font-bold text-muted-foreground">{dm.initials}</span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <span className="text-[14px] font-bold text-foreground block">{dm.name}</span>
                <p className="text-[12px] text-muted-foreground truncate">{dm.lastMessage}</p>
              </div>
              <span className="text-[11px] text-muted-foreground flex-shrink-0">{dm.date}</span>
            </button>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Channels;
