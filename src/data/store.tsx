import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { dossiers as initialDossiers, syndicContact } from "./mockData";
import type { Dossier, DossierStatus, UrgencyLevel } from "./mockData";

// ── Channel types ──
export interface ChannelMessage {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  message: string;
  linkedDossierId?: string;
  linkedDossierName?: string;
}

export interface Channel {
  id: string;
  label: string;
  messages: ChannelMessage[];
}

export interface DirectMessage {
  id: string;
  name: string;
  initials: string;
  messages: { author: string; text: string; timestamp: string }[];
}

// ── Published update ──
export interface PublishedUpdate {
  dossierId: string;
  date: string;
  status: string;
  nextStep: string;
  comment?: string;
  pushSent: boolean;
  publishedBy?: string;
  publishedAt?: string;
}

// ── Note types ──
export interface NoteReply {
  author: string;
  role: string;
  timestamp: string;
  message: string;
}

export interface Note {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  message: string;
  type: "internal" | "external";
  replies?: NoteReply[];
}

// ── User profile ──
export interface UserProfile {
  name: string;
  email: string;
  role: string;
  residence: string;
  phone: string;
  notificationsEnabled: boolean;
  pushEnabled: boolean;
  emailNotifications: boolean;
}

// ── Store state ──
interface StoreState {
  dossiers: Dossier[];
  publishedUpdates: PublishedUpdate[];
  channels: Channel[];
  directMessages: DirectMessage[];
  notes: Record<string, Note[]>;
  userProfile: UserProfile;
}

// ── Store actions ──
interface StoreActions {
  // Dossiers
  addDossier: (dossier: Omit<Dossier, "id">) => string;
  updateDossier: (id: string, updates: Partial<Dossier>) => void;
  updateDossierStatus: (id: string, status: DossierStatus, nextStep?: string, comment?: string) => void;
  assignDossier: (id: string, responsible: string) => void;
  addTimelineEvent: (dossierId: string, label: string) => void;
  deleteDossier: (id: string) => void;
  getDossier: (id: string) => Dossier | undefined;

  // Updates
  addPublishedUpdate: (update: PublishedUpdate) => void;
  getPublishedUpdates: (dossierId: string) => PublishedUpdate[];

  // Notes
  getNotes: (dossierId: string) => Note[];
  addNote: (dossierId: string, note: Note) => void;
  addNoteReply: (dossierId: string, noteId: string, reply: NoteReply) => void;

  // Channels
  addChannelMessage: (channelId: string, message: Omit<ChannelMessage, "id">) => void;
  addDirectMessage: (dmId: string, message: { author: string; text: string }) => void;

  // Profile
  updateProfile: (updates: Partial<UserProfile>) => void;
}

type Store = StoreState & StoreActions;

const StoreContext = createContext<Store | null>(null);

const STORAGE_KEY = "copro-pilot-store";

const defaultProfile: UserProfile = {
  name: "Marie Laurent",
  email: "m.laurent@email.com",
  role: "Présidente du Conseil Syndical",
  residence: "Résidence Les Jardins du Parc",
  phone: "+33 6 12 34 56 78",
  notificationsEnabled: true,
  pushEnabled: true,
  emailNotifications: false,
};

const defaultChannels: Channel[] = [
  {
    id: "ascenseur",
    label: "#ascenseur",
    messages: [
      { id: "c1", author: "Mme. Laurent", role: "Conseil Syndical", timestamp: "6 fév. 14:32", message: "Le syndic n'a pas répondu, je relance demain matin.", linkedDossierId: "2", linkedDossierName: "Ascenseur cabine bloquée" },
      { id: "c2", author: "M. Bernard", role: "Conseil Syndical", timestamp: "6 fév. 15:10", message: "J'ai retrouvé le rapport OTIS, je le joins au dossier.", linkedDossierId: "2", linkedDossierName: "Ascenseur cabine bloquée" },
    ],
  },
  { id: "electricite", label: "#electricité", messages: [
    { id: "c3", author: "Marc Petit", role: "Résident", timestamp: "10 fév. 08:45", message: "Le disjoncteur du hall a encore sauté ce matin." },
  ] },
  { id: "parking", label: "#parking", messages: [
    { id: "c4", author: "M. Dupont", role: "Syndic", timestamp: "8 fév. 10:00", message: "Le prestataire Plomberie Martin confirme l'intervention du 14 fév.", linkedDossierId: "1", linkedDossierName: "Fuite parking bâtiment B" },
    { id: "c5", author: "Sophie Martin", role: "Résidente", timestamp: "8 fév. 11:20", message: "La fuite a été localisée au niveau -1, côté escalier B." },
  ] },
  { id: "toiture", label: "#toiture", messages: [
    { id: "c6", author: "Jean Martin", role: "Résident", timestamp: "5 mars 14:00", message: "RAS après la dernière inspection de la toiture." },
  ] },
  { id: "espaces-verts", label: "#espaces-verts", messages: [
    { id: "c7", author: "Sandro Salibur", role: "Résident", timestamp: "3 mars 09:30", message: "Nouveau devis reçu pour le contrat d'entretien des espaces verts." },
  ] },
];

const defaultDMs: DirectMessage[] = [
  {
    id: "sandro",
    name: "Sandro Salibur",
    initials: "SS",
    messages: [
      { author: "Sandro Salibur", text: "Tu as pu relancer le syndic pour l'ascenseur ?", timestamp: "Hier 18:30" },
      { author: "Marie Laurent", text: "Oui, j'ai envoyé un mail ce matin. Pas de réponse encore.", timestamp: "Hier 19:00" },
      { author: "Sandro Salibur", text: "OK je relance demain", timestamp: "Hier 19:15" },
    ],
  },
  {
    id: "jean",
    name: "Jean Martin",
    initials: "JM",
    messages: [
      { author: "Jean Martin", text: "Les photos de la toiture sont prêtes, je te les envoie ?", timestamp: "7 mars 10:00" },
      { author: "Marie Laurent", text: "Oui vas-y, je les ajoute au dossier", timestamp: "7 mars 10:05" },
      { author: "Jean Martin", text: "Merci pour le suivi", timestamp: "7 mars 10:10" },
    ],
  },
];

const defaultNotes: Record<string, Note[]> = {
  "1": [
    { id: "n-1-1", author: "Mme. Laurent", role: "Conseil Syndical", timestamp: "5 fév. 11:00", message: "On a reçu 1 seul devis sur 3, il faut relancer les 2 autres.", type: "internal", replies: [] },
    { id: "n-1-2", author: "Cabinet Durand", role: "Syndic", timestamp: "6 fév. 09:30", message: "Nous avons relancé Aqua Services et Express Plomberie. Retour attendu sous 48h.", type: "external", replies: [
      { author: "Mme. Laurent", role: "Conseil Syndical", timestamp: "6 fév. 10:00", message: "Merci, tenez-nous informés." },
    ] },
    { id: "n-1-3", author: "M. Dupont", role: "Syndic", timestamp: "8 fév. 10:00", message: "Le prestataire Plomberie Martin confirme l'intervention du 14 fév.", type: "external", replies: [] },
  ],
  "2": [
    { id: "n1", author: "Mme. Laurent", role: "Conseil Syndical", timestamp: "6 fév. 14:32", message: "Le syndic n'a pas répondu, je relance demain matin.", type: "internal", replies: [] },
    { id: "n2", author: "M. Bernard", role: "Conseil Syndical", timestamp: "6 fév. 15:10", message: "J'ai retrouvé le rapport OTIS, je le joins au dossier.", type: "internal", replies: [
      { author: "Mme. Laurent", role: "Conseil Syndical", timestamp: "6 fév. 15:25", message: "Parfait, merci ! Je l'ajoute aux documents." },
    ] },
    { id: "n-2-3", author: "M. Garcia", role: "Conseil Syndical", timestamp: "2 fév. 11:00", message: "Ascenseur bloqué avec un résident dedans pendant 30 min.", type: "internal", replies: [] },
    { id: "n-2-ext1", author: "Cabinet Durand", role: "Syndic", timestamp: "3 fév. 14:00", message: "OTIS confirme que la pièce doit être commandée en Allemagne. Délai 3 semaines.", type: "external", replies: [
      { author: "Mme. Laurent", role: "Conseil Syndical", timestamp: "3 fév. 15:00", message: "C'est beaucoup trop long. Y a-t-il une alternative ?" },
      { author: "Cabinet Durand", role: "Syndic", timestamp: "3 fév. 16:30", message: "Malheureusement non, c'est la seule pièce compatible." },
    ] },
  ],
  "3": [
    { id: "n-3-1", author: "M. Bernard", role: "Conseil Syndical", timestamp: "4 fév. 16:45", message: "Les 3 devis sont reçus. On prépare le comparatif pour l'AG du 26 fév.", type: "internal", replies: [] },
    { id: "n-3-2", author: "Mme. Petit", role: "Conseil Syndical", timestamp: "5 fév. 09:20", message: "Je propose qu'on ajoute un critère sur les délais de réalisation dans le comparatif.", type: "internal", replies: [
      { author: "M. Bernard", role: "Conseil Syndical", timestamp: "5 fév. 10:00", message: "Bonne idée, je l'ajoute au tableau." },
    ] },
    { id: "n-3-ext1", author: "Cabinet Durand", role: "Syndic", timestamp: "28 jan. 10:00", message: "Le dernier devis (Bâti France) vient d'arriver, je vous le transfère.", type: "external", replies: [] },
  ],
  "5": [
    { id: "n-5-ext1", author: "Cabinet Durand", role: "Syndic", timestamp: "3 fév. 11:00", message: "Le courrier de mise en demeure a été envoyé à Clean & Net.", type: "external", replies: [
      { author: "Mme. Petit", role: "Conseil Syndical", timestamp: "3 fév. 12:00", message: "Bien noté. J'ai fixé un rdv de recadrage le 12 fév." },
    ] },
  ],
  "6": [],
  "8": [
    { id: "n-8-1", author: "Mme. Laurent", role: "Conseil Syndical", timestamp: "5 fév. 09:30", message: "J'ai envoyé le mail au syndic concernant la panne de l'ascenseur bât. C.", type: "internal", replies: [] },
    { id: "n-8-ext1", author: "Mme. Laurent", role: "Conseil Syndical", timestamp: "5 fév. 11:00", message: "Nous constatons 4 pannes en 3 mois. Quelles mesures comptez-vous prendre ?", type: "external", replies: [
      { author: "Cabinet Durand", role: "Syndic", timestamp: "7 fév. 09:00", message: "Nous avons contacté OTIS pour une expertise complète de l'installation." },
    ] },
  ],
};

function loadState(): StoreState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults in case new fields were added
      return {
        dossiers: parsed.dossiers || initialDossiers,
        publishedUpdates: parsed.publishedUpdates || [],
        channels: parsed.channels || defaultChannels,
        directMessages: parsed.directMessages || defaultDMs,
        notes: parsed.notes || defaultNotes,
        userProfile: { ...defaultProfile, ...parsed.userProfile },
      };
    }
  } catch (e) {
    console.warn("Failed to load store from localStorage:", e);
  }
  return {
    dossiers: initialDossiers,
    publishedUpdates: [],
    channels: defaultChannels,
    directMessages: defaultDMs,
    notes: defaultNotes,
    userProfile: defaultProfile,
  };
}

function saveState(state: StoreState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Failed to save store to localStorage:", e);
  }
}

function formatNow(): string {
  return new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function formatTimestamp(): string {
  const now = new Date();
  return `${now.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} ${now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addDossier = useCallback((dossier: Omit<Dossier, "id">): string => {
    const id = (Date.now() % 100000).toString();
    setState((prev) => ({
      ...prev,
      dossiers: [{ ...dossier, id } as Dossier, ...prev.dossiers],
      notes: { ...prev.notes, [id]: [] },
    }));
    return id;
  }, []);

  const updateDossier = useCallback((id: string, updates: Partial<Dossier>) => {
    setState((prev) => ({
      ...prev,
      dossiers: prev.dossiers.map((d) => (d.id === id ? { ...d, ...updates, lastUpdate: formatNow() } : d)),
    }));
  }, []);

  const updateDossierStatus = useCallback((id: string, status: DossierStatus, nextStep?: string, comment?: string) => {
    setState((prev) => ({
      ...prev,
      dossiers: prev.dossiers.map((d) => {
        if (d.id !== id) return d;
        const newTimeline = [...d.timeline, { date: formatNow(), label: comment || `Statut mis à jour : ${status}`, done: status === "termine" }];
        return {
          ...d,
          status,
          lastUpdate: formatNow(),
          lastAction: comment || `Statut → ${status}`,
          nextStep: nextStep || d.nextStep,
          timeline: newTimeline,
        };
      }),
    }));
  }, []);

  const assignDossier = useCallback((id: string, responsible: string) => {
    setState((prev) => ({
      ...prev,
      dossiers: prev.dossiers.map((d) => (d.id === id ? { ...d, responsible, lastUpdate: formatNow() } : d)),
    }));
  }, []);

  const addTimelineEvent = useCallback((dossierId: string, label: string) => {
    setState((prev) => ({
      ...prev,
      dossiers: prev.dossiers.map((d) => {
        if (d.id !== dossierId) return d;
        return {
          ...d,
          timeline: [...d.timeline, { date: formatNow(), label, done: true }],
          lastUpdate: formatNow(),
          lastAction: label,
        };
      }),
    }));
  }, []);

  const deleteDossier = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      dossiers: prev.dossiers.filter((d) => d.id !== id),
      notes: Object.fromEntries(Object.entries(prev.notes).filter(([k]) => k !== id)),
      publishedUpdates: prev.publishedUpdates.filter((u) => u.dossierId !== id),
    }));
  }, []);

  const getDossier = useCallback((id: string) => {
    return state.dossiers.find((d) => d.id === id);
  }, [state.dossiers]);

  const addPublishedUpdate = useCallback((update: PublishedUpdate) => {
    setState((prev) => ({
      ...prev,
      publishedUpdates: [...prev.publishedUpdates, { ...update, publishedAt: formatTimestamp() }],
    }));
  }, []);

  const getPublishedUpdates = useCallback((dossierId: string) => {
    return state.publishedUpdates.filter((u) => u.dossierId === dossierId);
  }, [state.publishedUpdates]);

  const getNotes = useCallback((dossierId: string) => {
    return state.notes[dossierId] || [];
  }, [state.notes]);

  const addNote = useCallback((dossierId: string, note: Note) => {
    setState((prev) => ({
      ...prev,
      notes: { ...prev.notes, [dossierId]: [...(prev.notes[dossierId] || []), note] },
    }));
  }, []);

  const addNoteReply = useCallback((dossierId: string, noteId: string, reply: NoteReply) => {
    setState((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        [dossierId]: (prev.notes[dossierId] || []).map((n) =>
          n.id === noteId ? { ...n, replies: [...(n.replies || []), reply] } : n
        ),
      },
    }));
  }, []);

  const addChannelMessage = useCallback((channelId: string, message: Omit<ChannelMessage, "id">) => {
    const id = `cm-${Date.now()}`;
    setState((prev) => ({
      ...prev,
      channels: prev.channels.map((ch) =>
        ch.id === channelId ? { ...ch, messages: [...ch.messages, { ...message, id }] } : ch
      ),
    }));
  }, []);

  const addDirectMessage = useCallback((dmId: string, message: { author: string; text: string }) => {
    setState((prev) => ({
      ...prev,
      directMessages: prev.directMessages.map((dm) =>
        dm.id === dmId ? { ...dm, messages: [...dm.messages, { ...message, timestamp: formatTimestamp() }] } : dm
      ),
    }));
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setState((prev) => ({ ...prev, userProfile: { ...prev.userProfile, ...updates } }));
  }, []);

  const store: Store = {
    ...state,
    addDossier,
    updateDossier,
    updateDossierStatus,
    assignDossier,
    addTimelineEvent,
    deleteDossier,
    getDossier,
    addPublishedUpdate,
    getPublishedUpdates,
    getNotes,
    addNote,
    addNoteReply,
    addChannelMessage,
    addDirectMessage,
    updateProfile,
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used within StoreProvider");
  return store;
}

// Reset store to defaults (useful for testing)
export function resetStore() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}
