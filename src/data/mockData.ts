export type DossierStatus = "en_cours" | "bloque" | "termine";

export type UrgencyLevel = "normal" | "urgent" | "critique";

export type DevisStatus = "recu" | "en_attente" | "relance" | "pas_de_reponse";

export interface Prestataire {
  name: string;
  devisStatus: DevisStatus;
  relanceDate?: string;
  montant?: string;
}

export interface SyndicHistoryEntry {
  syndicName: string;
  period: string;
}

export interface TimelineEvent {
  date: string;
  label: string;
  done: boolean;
}

export interface Dossier {
  id: string;
  name: string;
  status: DossierStatus;
  urgency: UrgencyLevel;
  responsible: string;
  lastUpdate: string;
  createdAt: string;
  nextStep: string;
  lastAction: string;
  timeline: TimelineEvent[];
  documents: { name: string; type: string }[];
  prestataires?: Prestataire[];
  syndicHistory?: SyndicHistoryEntry[];
  blocageReason?: string;
  syndicContact?: {
    name: string;
    phone: string;
    email: string;
  };
  createdViaAgent?: boolean;
}

export const statusLabels: Record<DossierStatus, string> = {
  en_cours: "En cours",
  bloque: "Bloqué",
  termine: "Terminé",
};

export const urgencyLabels: Record<UrgencyLevel, string> = {
  normal: "Normal",
  urgent: "Urgent",
  critique: "Critique",
};

export const devisStatusLabels: Record<DevisStatus, string> = {
  recu: "Devis reçu",
  en_attente: "En attente",
  relance: "Relance envoyée",
  pas_de_reponse: "Pas de réponse",
};

export const statusOptions: DossierStatus[] = ["en_cours", "bloque", "termine"];

export const csMembers = [
  "M. Dupont (Syndic)",
  "Mme. Laurent (CS)",
  "M. Bernard (CS)",
  "Mme. Petit (CS)",
  "M. Garcia (CS)",
];

export const syndicContact = {
  name: "Cabinet Durand & Associés",
  phone: "+33 1 42 86 55 00",
  email: "contact@durand-syndic.fr",
};

export const dossiers: Dossier[] = [
  {
    id: "6",
    name: "Infiltration toiture bâtiment A",
    status: "en_cours",
    urgency: "urgent",
    responsible: "",
    lastUpdate: "11 fév. 2026",
    createdAt: "11 fév. 2026",
    nextStep: "À assigner à un membre du CS",
    lastAction: "Signalement reçu",
    timeline: [
      { date: "11 fév.", label: "Signalement copropriétaire", done: true },
    ],
    documents: [],
    prestataires: [],
    syndicContact: syndicContact,
  },
  {
    id: "2",
    name: "Ascenseur cabine bloquée",
    status: "bloque",
    urgency: "critique",
    responsible: "Mme. Laurent (CS)",
    lastUpdate: "6 fév. 2026",
    createdAt: "2 fév. 2026",
    nextStep: "Attente pièce détachée",
    lastAction: "Diagnostic technicien effectué",
    blocageReason: "Pièce détachée indisponible chez le fournisseur (délai estimé 3 semaines). L'ascensoriste OTIS a confirmé que la pièce doit être commandée depuis l'usine en Allemagne. Aucune alternative compatible n'est disponible sur le marché français.",
    timeline: [
      { date: "2 fév.", label: "Signalement gardien", done: true },
      { date: "2 fév.", label: "Syndic contacté en urgence", done: true },
      { date: "2 fév.", label: "Appel SAV ascensoriste", done: true },
      { date: "4 fév.", label: "Diagnostic technicien", done: true },
      { date: "6 fév.", label: "Commande pièce détachée", done: false },
      { date: "—", label: "Réparation", done: false },
    ],
    documents: [
      { name: "Rapport_diagnostic.pdf", type: "Rapport" },
      { name: "Contrat_maintenance.pdf", type: "Contrat" },
    ],
    prestataires: [
      { name: "OTIS Ascenseurs", devisStatus: "recu", montant: "8 500 €" },
    ],
    syndicContact: syndicContact,
  },
  {
    id: "8",
    name: "Ascenseur bâtiment C",
    status: "en_cours",
    urgency: "critique",
    responsible: "Mme. Laurent (CS)",
    lastUpdate: "5 fév. 2026",
    createdAt: "10 déc. 2025",
    nextStep: "Relancer syndic + assurance",
    lastAction: "Dernière panne signalée le 5 fév.",
    createdViaAgent: true,
    blocageReason: "Pannes répétées depuis décembre 2025. Le syndic n'a pas donné suite aux 3 relances. Assurance non contactée.",
    timeline: [
      { date: "10 déc.", label: "1ère panne signalée", done: true },
      { date: "22 déc.", label: "Réparation temporaire effectuée", done: true },
      { date: "28 jan.", label: "3ème panne — ascenseur bloqué 4h", done: true },
      { date: "5 fév.", label: "Signalement via agent vocal", done: true },
      { date: "10 mars", label: "Notification push envoyée aux copropriétaires", done: true },
      { date: "—", label: "Relance syndic + assurance", done: false },
    ],
    documents: [
      { name: "Photos_panne_batC.jpg", type: "Photos" },
      { name: "Historique_pannes_batC.pdf", type: "Rapport" },
      { name: "Email_syndic_relance.eml", type: "Email" },
    ],
    prestataires: [
      { name: "OTIS Ascenseurs", devisStatus: "en_attente" },
      { name: "Schindler", devisStatus: "pas_de_reponse" },
    ],
    syndicHistory: [
      { syndicName: "Cabinet Durand & Associés", period: "2023 – présent" },
    ],
    syndicContact: syndicContact,
  },
  {
    id: "3",
    name: "Ravalement façade",
    status: "en_cours",
    urgency: "normal",
    responsible: "M. Bernard (CS)",
    lastUpdate: "4 fév. 2026",
    createdAt: "10 déc. 2025",
    nextStep: "Vote AG — 3 devis à comparer",
    lastAction: "3ème devis reçu",
    timeline: [
      { date: "10 déc.", label: "Étude préalable lancée", done: true },
      { date: "20 déc.", label: "3 entreprises sollicitées", done: true },
      { date: "15 jan.", label: "1er devis reçu (BTP Rénov)", done: true },
      { date: "28 jan.", label: "2ème devis reçu (Façade Pro)", done: true },
      { date: "4 fév.", label: "3ème devis reçu (Bâti France)", done: true },
      { date: "26 fév.", label: "Présentation AG", done: false },
      { date: "—", label: "Début travaux", done: false },
    ],
    documents: [
      { name: "Devis_Entreprise_A.pdf", type: "Devis" },
      { name: "Devis_Entreprise_B.pdf", type: "Devis" },
      { name: "Devis_Entreprise_C.pdf", type: "Devis" },
      { name: "Photos_facade.jpg", type: "Photos" },
    ],
    prestataires: [
      { name: "BTP Rénov", devisStatus: "recu", montant: "45 000 €" },
      { name: "Façade Pro", devisStatus: "recu", montant: "52 000 €" },
      { name: "Bâti France", devisStatus: "recu", montant: "48 500 €" },
    ],
    syndicHistory: [
      { syndicName: "Cabinet Ancien & Fils", period: "2018 – 2023" },
      { syndicName: "Cabinet Durand & Associés", period: "2023 – présent" },
    ],
    syndicContact: syndicContact,
  },
  {
    id: "4",
    name: "Éclairage hall défectueux",
    status: "termine",
    urgency: "normal",
    responsible: "M. Dupont (Syndic)",
    lastUpdate: "1 fév. 2026",
    createdAt: "20 jan. 2026",
    nextStep: "—",
    lastAction: "Intervention terminée",
    timeline: [
      { date: "20 jan.", label: "Signalement copropriétaire", done: true },
      { date: "21 jan.", label: "Syndic contacté", done: true },
      { date: "23 jan.", label: "2 entreprises sollicitées", done: true },
      { date: "25 jan.", label: "1 devis reçu", done: true },
      { date: "28 jan.", label: "Intervention électricien", done: true },
      { date: "1 fév.", label: "Clôture dossier", done: true },
    ],
    documents: [
      { name: "Facture_electricien.pdf", type: "Facture" },
    ],
    prestataires: [
      { name: "Elec Express", devisStatus: "recu", montant: "320 €" },
      { name: "Lumière & Co", devisStatus: "pas_de_reponse" },
    ],
    syndicContact: syndicContact,
  },
  {
    id: "5",
    name: "Nettoyage insatisfaisant",
    status: "en_cours",
    urgency: "normal",
    responsible: "Mme. Petit (CS)",
    lastUpdate: "7 fév. 2026",
    createdAt: "25 jan. 2026",
    nextStep: "Rendez-vous prestataire",
    lastAction: "Courrier de mise en demeure envoyé",
    timeline: [
      { date: "25 jan.", label: "Plaintes copropriétaires (x5)", done: true },
      { date: "27 jan.", label: "Constat photos par le CS", done: true },
      { date: "30 jan.", label: "Syndic contacté", done: true },
      { date: "3 fév.", label: "Courrier mise en demeure envoyé", done: true },
      { date: "12 fév.", label: "Rendez-vous de recadrage", done: false },
    ],
    documents: [
      { name: "Photos_parties_communes.jpg", type: "Photos" },
      { name: "Courrier_mise_en_demeure.pdf", type: "Courrier" },
      { name: "Contrat_nettoyage.pdf", type: "Contrat" },
    ],
    prestataires: [
      { name: "Clean & Net", devisStatus: "en_attente" },
    ],
    syndicHistory: [
      { syndicName: "Cabinet Durand & Associés", period: "2023 – présent" },
    ],
    syndicContact: syndicContact,
  },
];
