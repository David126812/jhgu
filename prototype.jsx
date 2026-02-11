import { useState } from "react";

const SCREENS = {
  LOGIN: "login",
  DASHBOARD: "dashboard",
  DOSSIERS: "dossiers",
  DETAIL: "detail",
  UPDATE: "update",
  CONFIRM: "confirm",
};

const STATUS = {
  EN_COURS: { label: "En cours", color: "#E67E22", bg: "#FEF3E2" },
  BLOQUE: { label: "Bloqué", color: "#E74C3C", bg: "#FDEDEC" },
  TERMINE: { label: "Terminé", color: "#27AE60", bg: "#E8F8EF" },
};

const DOSSIERS = [
  {
    id: 1,
    nom: "Fuite parking bâtiment B",
    statut: STATUS.EN_COURS,
    responsable: "M. Dupont (Syndic)",
    derniereMaj: "8 fév. 2026",
    dateCreation: "15 jan. 2026",
    prochaineEtape: "Réception devis plombier",
    derniereAction: "Demande de devis envoyée",
    timeline: [
      { label: "Signalement copropriétaire", date: "15 jan.", done: true },
      { label: "Demande syndic transmise", date: "18 jan.", done: true },
      { label: "Devis reçu (Plomberie Martin)", date: "25 jan.", done: true },
      { label: "Validation conseil syndical", date: "3 fév.", done: true },
      { label: "Intervention prévue", date: "14 fév.", done: false },
    ],
    documents: [
      { nom: "Devis_Plomberie_Martin.pdf", type: "pdf" },
      { nom: "Photos_fuite_parking.jpg", type: "img" },
      { nom: "Email_syndic_18jan.eml", type: "mail" },
    ],
  },
  {
    id: 2,
    nom: "Ascenseur cabine bloquée",
    statut: STATUS.BLOQUE,
    responsable: "Mme. Laurent (CS)",
    derniereMaj: "6 fév. 2026",
    dateCreation: "2 fév. 2026",
    prochaineEtape: "Attente pièce détachée",
    derniereAction: "Diagnostic technicien effectué",
    timeline: [
      { label: "Signalement gardien", date: "2 fév.", done: true },
      { label: "Appel SAV ascensoriste", date: "2 fév.", done: true },
      { label: "Diagnostic technicien", date: "4 fév.", done: true },
      { label: "Commande pièce détachée", date: "6 fév.", done: false },
      { label: "Réparation", date: "—", done: false },
    ],
    documents: [
      { nom: "Rapport_diagnostic.pdf", type: "pdf" },
      { nom: "Contrat_maintenance.pdf", type: "pdf" },
    ],
  },
  {
    id: 3,
    nom: "Ravalement façade",
    statut: STATUS.EN_COURS,
    responsable: "M. Bernard (CS)",
    derniereMaj: "4 fév. 2026",
    dateCreation: "10 déc. 2025",
    prochaineEtape: "Vote AG — 3 devis à comparer",
    derniereAction: "3ème devis reçu",
    timeline: [
      { label: "Étude préalable", date: "10 déc.", done: true },
      { label: "Demande de devis (x3)", date: "20 déc.", done: true },
      { label: "Réception devis", date: "4 fév.", done: true },
      { label: "Présentation AG", date: "26 fév.", done: false },
      { label: "Début travaux", date: "—", done: false },
    ],
    documents: [
      { nom: "Devis_Entreprise_A.pdf", type: "pdf" },
      { nom: "Devis_Entreprise_B.pdf", type: "pdf" },
      { nom: "Devis_Entreprise_C.pdf", type: "pdf" },
      { nom: "Photos_facade.jpg", type: "img" },
    ],
  },
  {
    id: 4,
    nom: "Éclairage hall défectueux",
    statut: STATUS.TERMINE,
    responsable: "M. Dupont (Syndic)",
    derniereMaj: "1 fév. 2026",
    dateCreation: "20 jan. 2026",
    prochaineEtape: "—",
    derniereAction: "Intervention terminée",
    timeline: [
      { label: "Signalement copropriétaire", date: "20 jan.", done: true },
      { label: "Demande syndic", date: "21 jan.", done: true },
      { label: "Intervention électricien", date: "28 jan.", done: true },
      { label: "Clôture dossier", date: "1 fév.", done: true },
    ],
    documents: [
      { nom: "Facture_electricien.pdf", type: "pdf" },
    ],
  },
  {
    id: 5,
    nom: "Nettoyage insatisfaisant",
    statut: STATUS.EN_COURS,
    responsable: "Mme. Petit (CS)",
    derniereMaj: "7 fév. 2026",
    dateCreation: "25 jan. 2026",
    prochaineEtape: "Rendez-vous prestataire",
    derniereAction: "Courrier de mise en demeure envoyé",
    timeline: [
      { label: "Plaintes copropriétaires (x5)", date: "25 jan.", done: true },
      { label: "Constat photos", date: "27 jan.", done: true },
      { label: "Courrier prestataire", date: "3 fév.", done: true },
      { label: "Rendez-vous de recadrage", date: "12 fév.", done: false },
    ],
    documents: [
      { nom: "Photos_parties_communes.jpg", type: "img" },
      { nom: "Courrier_mise_en_demeure.pdf", type: "pdf" },
      { nom: "Contrat_nettoyage.pdf", type: "pdf" },
    ],
  },
];

// Icons as inline SVGs
const Icons = {
  Google: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),
  Microsoft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
      <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
      <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
      <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
    </svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  Calendar: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
  ),
  File: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7z"/><path d="M14 2v4a2 2 0 002 2h4"/></svg>
  ),
  Folder: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 20a2 2 0 002-2V8a2 2 0 00-2-2h-7.9a2 2 0 01-1.69-.9L9.6 3.9A2 2 0 007.93 3H4a2 2 0 00-2 2v13a2 2 0 002 2z"/></svg>
  ),
  Alert: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>
  ),
  ArrowLeft: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
  ),
  Check: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
  ),
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
  ),
  Filter: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
  ),
  Send: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>
  ),
  Home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
  ),
  Pdf: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round"><path d="M15 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7z"/><path d="M14 2v4a2 2 0 002 2h4"/></svg>
  ),
  Image: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3498DB" strokeWidth="2" strokeLinecap="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 00-2.828 0L6 21"/></svg>
  ),
  Mail: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E44AD" strokeWidth="2" strokeLinecap="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>
  ),
};

const StatusBadge = ({ statut, size = "sm" }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: size === "lg" ? "6px 14px" : "3px 10px",
    borderRadius: 20,
    background: statut.bg,
    color: statut.color,
    fontSize: size === "lg" ? 13 : 11,
    fontWeight: 600,
    letterSpacing: "0.02em",
  }}>
    <span style={{
      width: size === "lg" ? 8 : 6, height: size === "lg" ? 8 : 6,
      borderRadius: "50%", background: statut.color,
    }}/>
    {statut.label}
  </span>
);

// ─── SCREENS ─────────────────────────────────────────

function LoginScreen({ onNavigate }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", padding: "0 24px", justifyContent: "center" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #1B3A5C, #2563EB)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", boxShadow: "0 4px 20px rgba(37,99,235,0.3)",
        }}>
          <span style={{ color: "#fff", fontSize: 22, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>CS</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 8, lineHeight: 1.3 }}>
          Connexion à votre copropriété
        </h1>
        <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.5 }}>
          Accédez aux dossiers et au suivi de votre copropriété
        </p>
      </div>

      <button onClick={() => onNavigate(SCREENS.DASHBOARD)} style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        width: "100%", padding: "13px 0", borderRadius: 10,
        border: "1px solid #E2E8F0", background: "#fff", cursor: "pointer",
        fontSize: 14, fontWeight: 500, color: "#1E293B", marginBottom: 10,
        transition: "all 0.15s",
      }}>
        <Icons.Google /> Continuer avec Google
      </button>
      <button onClick={() => onNavigate(SCREENS.DASHBOARD)} style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        width: "100%", padding: "13px 0", borderRadius: 10,
        border: "1px solid #E2E8F0", background: "#fff", cursor: "pointer",
        fontSize: 14, fontWeight: 500, color: "#1E293B", marginBottom: 24,
        transition: "all 0.15s",
      }}>
        <Icons.Microsoft /> Continuer avec Microsoft
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, height: 1, background: "#E2E8F0" }}/>
        <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>Connexion par code copropriété</span>
        <div style={{ flex: 1, height: 1, background: "#E2E8F0" }}/>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Email</label>
        <input type="email" placeholder="jean.dupont@email.com" style={{
          width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #E2E8F0",
          fontSize: 14, color: "#1E293B", outline: "none", background: "#F8FAFC",
          boxSizing: "border-box",
        }}/>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Code copropriété</label>
        <input type="text" placeholder="Ex : COPRO-2024-BXL" style={{
          width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #E2E8F0",
          fontSize: 14, color: "#1E293B", outline: "none", background: "#F8FAFC",
          boxSizing: "border-box",
        }}/>
        <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 6, lineHeight: 1.4 }}>
          Ce code vous rattache à votre espace conseil syndical
        </p>
      </div>

      <button onClick={() => onNavigate(SCREENS.DASHBOARD)} style={{
        width: "100%", padding: "14px 0", borderRadius: 10,
        background: "linear-gradient(135deg, #1B3A5C, #2563EB)", color: "#fff",
        fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer",
        boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
        transition: "all 0.15s",
      }}>
        Se connecter
      </button>
    </div>
  );
}

function DashboardScreen({ onNavigate }) {
  const events = [
    { label: "AG annuelle", date: "26 fév.", icon: "📋" },
    { label: "Intervention plombier (Bât. B)", date: "14 fév.", icon: "🔧" },
    { label: "Visite technique ascenseur", date: "20 fév.", icon: "🏗️" },
  ];
  const docs = [
    { label: "Devis ravalement — Entreprise A", date: "4 fév." },
    { label: "PV AG extraordinaire", date: "28 jan." },
    { label: "Facture électricien (hall)", date: "1 fév." },
  ];

  return (
    <div style={{ padding: "0 20px 100px" }}>
      <div style={{ paddingTop: 20, marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: "#64748B", marginBottom: 2 }}>Résidence Les Jardins du Parc</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A" }}>Tableau de bord</h1>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        <div onClick={() => onNavigate(SCREENS.DOSSIERS)} style={{
          background: "#fff", borderRadius: 14, padding: "16px 16px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)", cursor: "pointer",
          border: "1px solid #F1F5F9",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icons.Folder />
            </div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#0F172A" }}>12</div>
          <div style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>Dossiers actifs</div>
        </div>
        <div style={{
          background: "#fff", borderRadius: 14, padding: "16px 16px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid #F1F5F9",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FEF3E2", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icons.Alert />
            </div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#0F172A" }}>3</div>
          <div style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>Nouveaux signalements</div>
        </div>
      </div>

      {/* Prochains événements */}
      <div style={{
        background: "#fff", borderRadius: 14, padding: 18,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 14,
        border: "1px solid #F1F5F9",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Icons.Calendar />
          <span style={{ fontSize: 14, fontWeight: 650, color: "#0F172A" }}>Prochains évènements</span>
        </div>
        {events.map((e, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 0",
            borderTop: i > 0 ? "1px solid #F1F5F9" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>{e.icon}</span>
              <span style={{ fontSize: 13, color: "#1E293B", fontWeight: 500 }}>{e.label}</span>
            </div>
            <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>{e.date}</span>
          </div>
        ))}
      </div>

      {/* Documents récents */}
      <div style={{
        background: "#fff", borderRadius: 14, padding: 18,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 20,
        border: "1px solid #F1F5F9",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Icons.File />
          <span style={{ fontSize: 14, fontWeight: 650, color: "#0F172A" }}>Documents récents</span>
        </div>
        {docs.map((d, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 0",
            borderTop: i > 0 ? "1px solid #F1F5F9" : "none",
          }}>
            <span style={{ fontSize: 13, color: "#1E293B", fontWeight: 500 }}>{d.label}</span>
            <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>{d.date}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button onClick={() => onNavigate(SCREENS.DOSSIERS)} style={{
        width: "100%", padding: "14px 0", borderRadius: 12,
        background: "linear-gradient(135deg, #1B3A5C, #2563EB)", color: "#fff",
        fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer",
        boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        Voir tous les dossiers <Icons.ArrowRight />
      </button>
    </div>
  );
}

function DossiersScreen({ onNavigate, onSelectDossier }) {
  const [filter, setFilter] = useState("Tous");
  const filters = ["Tous", "En cours", "Bloqué", "Terminé"];

  const filtered = filter === "Tous"
    ? DOSSIERS
    : DOSSIERS.filter(d => d.statut.label === filter);

  return (
    <div style={{ padding: "0 20px 100px" }}>
      <div style={{ paddingTop: 20, marginBottom: 18 }}>
        <button onClick={() => onNavigate(SCREENS.DASHBOARD)} style={{
          display: "flex", alignItems: "center", gap: 4, background: "none", border: "none",
          color: "#64748B", fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 8, fontWeight: 500,
        }}>
          <Icons.ArrowLeft /> Tableau de bord
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A" }}>Dossiers</h1>
      </div>

      {/* Search bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: "#F8FAFC", borderRadius: 12, padding: "12px 14px",
        border: "1px solid #E2E8F0", marginBottom: 14,
      }}>
        <Icons.Search />
        <input placeholder="Rechercher un dossier, ex : fuite parking, ascenseur" style={{
          border: "none", background: "none", outline: "none", flex: 1,
          fontSize: 13, color: "#1E293B",
        }}/>
      </div>

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            border: filter === f ? "none" : "1px solid #E2E8F0",
            background: filter === f ? "#0F172A" : "#fff",
            color: filter === f ? "#fff" : "#64748B",
            cursor: "pointer", transition: "all 0.15s",
          }}>
            {f}
          </button>
        ))}
      </div>

      {/* Dossier cards */}
      {filtered.map(d => (
        <div key={d.id} onClick={() => { onSelectDossier(d); onNavigate(SCREENS.DETAIL); }}
          style={{
            background: "#fff", borderRadius: 14, padding: 16,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 10,
            border: "1px solid #F1F5F9", cursor: "pointer",
            transition: "all 0.15s",
          }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", flex: 1, lineHeight: 1.3 }}>{d.nom}</span>
            <StatusBadge statut={d.statut} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Icons.User />
              <span style={{ fontSize: 12, color: "#64748B" }}>{d.responsable}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Icons.Clock />
              <span style={{ fontSize: 11, color: "#94A3B8" }}>{d.derniereMaj}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DetailScreen({ dossier, onNavigate }) {
  if (!dossier) return null;

  const docIcon = (type) => {
    if (type === "pdf") return <Icons.Pdf />;
    if (type === "img") return <Icons.Image />;
    return <Icons.Mail />;
  };

  return (
    <div style={{ padding: "0 20px 100px" }}>
      <div style={{ paddingTop: 20, marginBottom: 18 }}>
        <button onClick={() => onNavigate(SCREENS.DOSSIERS)} style={{
          display: "flex", alignItems: "center", gap: 4, background: "none", border: "none",
          color: "#64748B", fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 12, fontWeight: 500,
        }}>
          <Icons.ArrowLeft /> Retour aux dossiers
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", flex: 1, marginRight: 10, lineHeight: 1.3 }}>{dossier.nom}</h1>
          <StatusBadge statut={dossier.statut} size="lg" />
        </div>
      </div>

      {/* Info cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
        {[
          { label: "Responsable", value: dossier.responsable },
          { label: "Prochaine étape", value: dossier.prochaineEtape },
          { label: "Dernière action", value: dossier.derniereAction },
          { label: "Date de création", value: dossier.dateCreation },
        ].map((item, i) => (
          <div key={i} style={{
            background: "#F8FAFC", borderRadius: 12, padding: "12px 14px",
            border: "1px solid #F1F5F9",
          }}>
            <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>{item.label}</div>
            <div style={{ fontSize: 13, color: "#1E293B", fontWeight: 500, lineHeight: 1.4 }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div style={{
        background: "#fff", borderRadius: 14, padding: 18,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 14,
        border: "1px solid #F1F5F9",
      }}>
        <div style={{ fontSize: 14, fontWeight: 650, color: "#0F172A", marginBottom: 16 }}>Historique</div>
        {dossier.timeline.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 14, position: "relative", paddingBottom: i < dossier.timeline.length - 1 ? 20 : 0 }}>
            {/* Vertical line */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20 }}>
              <div style={{
                width: 12, height: 12, borderRadius: "50%",
                background: step.done ? "#2563EB" : "#E2E8F0",
                border: step.done ? "2px solid #BFDBFE" : "2px solid #E2E8F0",
                flexShrink: 0, zIndex: 1,
              }}/>
              {i < dossier.timeline.length - 1 && (
                <div style={{ width: 2, flex: 1, background: step.done ? "#BFDBFE" : "#E2E8F0", marginTop: 4 }}/>
              )}
            </div>
            <div style={{ flex: 1, paddingTop: 0 }}>
              <div style={{ fontSize: 13, fontWeight: step.done ? 500 : 400, color: step.done ? "#1E293B" : "#94A3B8", lineHeight: 1.2 }}>{step.label}</div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{step.date}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Documents */}
      <div style={{
        background: "#fff", borderRadius: 14, padding: 18,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 20,
        border: "1px solid #F1F5F9",
      }}>
        <div style={{ fontSize: 14, fontWeight: 650, color: "#0F172A", marginBottom: 14 }}>Documents associés</div>
        {dossier.documents.map((doc, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 0",
            borderTop: i > 0 ? "1px solid #F1F5F9" : "none",
          }}>
            {docIcon(doc.type)}
            <span style={{ fontSize: 13, color: "#1E293B", fontWeight: 500 }}>{doc.nom}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button onClick={() => onNavigate(SCREENS.UPDATE)} style={{
        width: "100%", padding: "14px 0", borderRadius: 12,
        background: "linear-gradient(135deg, #1B3A5C, #2563EB)", color: "#fff",
        fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer",
        boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
        marginBottom: 10,
      }}>
        Modifier le statut
      </button>
    </div>
  );
}

function UpdateScreen({ dossier, onNavigate }) {
  const [shareToggle, setShareToggle] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");

  if (!dossier) return null;

  return (
    <div style={{ padding: "0 20px 100px" }}>
      <div style={{ paddingTop: 20, marginBottom: 24 }}>
        <button onClick={() => onNavigate(SCREENS.DETAIL)} style={{
          display: "flex", alignItems: "center", gap: 4, background: "none", border: "none",
          color: "#64748B", fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 12, fontWeight: 500,
        }}>
          <Icons.ArrowLeft /> Retour au dossier
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A" }}>Mettre à jour le statut</h1>
        <p style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>{dossier.nom}</p>
      </div>

      {/* Form */}
      <div style={{ marginBottom: 18 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Nouveau statut</label>
        <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} style={{
          width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #E2E8F0",
          fontSize: 14, color: "#1E293B", background: "#F8FAFC", appearance: "auto",
          boxSizing: "border-box",
        }}>
          <option value="">Sélectionner un statut</option>
          <option value="en_cours">En cours</option>
          <option value="bloque">Bloqué</option>
          <option value="termine">Terminé</option>
        </select>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Prochaine étape</label>
        <input type="text" placeholder="Ex : Attente validation devis" defaultValue="Intervention prévue le 14 fév." style={{
          width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #E2E8F0",
          fontSize: 14, color: "#1E293B", background: "#F8FAFC",
          boxSizing: "border-box",
        }}/>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Commentaire</label>
        <textarea placeholder="Ajoutez un commentaire…" rows={4} defaultValue="Le plombier confirme l'intervention pour le 14 février. Accès parking requis." style={{
          width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #E2E8F0",
          fontSize: 14, color: "#1E293B", background: "#F8FAFC", resize: "vertical",
          fontFamily: "inherit", boxSizing: "border-box",
        }}/>
      </div>

      {/* Toggle */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#F8FAFC", borderRadius: 12, padding: "14px 16px",
        border: "1px solid #F1F5F9", marginBottom: 8,
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", marginBottom: 2 }}>Partager aux membres du conseil</div>
          <div style={{ fontSize: 11, color: "#94A3B8" }}>Une notification sera envoyée aux membres</div>
        </div>
        <div onClick={() => setShareToggle(!shareToggle)} style={{
          width: 44, height: 24, borderRadius: 12,
          background: shareToggle ? "#2563EB" : "#CBD5E1",
          position: "relative", cursor: "pointer",
          transition: "background 0.2s",
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: "50%", background: "#fff",
            position: "absolute", top: 2,
            left: shareToggle ? 22 : 2,
            transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}/>
        </div>
      </div>

      <div style={{ height: 24 }} />

      <button onClick={() => onNavigate(SCREENS.CONFIRM)} style={{
        width: "100%", padding: "14px 0", borderRadius: 12,
        background: "linear-gradient(135deg, #1B3A5C, #2563EB)", color: "#fff",
        fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer",
        boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        marginBottom: 10,
      }}>
        <Icons.Send /> Publier la mise à jour
      </button>
      <button onClick={() => onNavigate(SCREENS.DETAIL)} style={{
        width: "100%", padding: "13px 0", borderRadius: 12,
        background: "none", color: "#64748B",
        fontSize: 14, fontWeight: 500, border: "1px solid #E2E8F0", cursor: "pointer",
      }}>
        Annuler
      </button>
    </div>
  );
}

function ConfirmScreen({ dossier, onNavigate }) {
  if (!dossier) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", padding: "0 24px", justifyContent: "center", alignItems: "center" }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: "#E8F8EF", display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 24,
      }}>
        <Icons.Check />
      </div>

      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 8, textAlign: "center" }}>
        Mise à jour partagée
      </h1>
      <p style={{ fontSize: 14, color: "#64748B", textAlign: "center", marginBottom: 28, lineHeight: 1.5 }}>
        Votre mise à jour a été envoyée aux membres du conseil syndical
      </p>

      {/* Recap card */}
      <div style={{
        background: "#F8FAFC", borderRadius: 14, padding: 18, width: "100%",
        border: "1px solid #F1F5F9", marginBottom: 28,
      }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Dossier</div>
          <div style={{ fontSize: 14, color: "#1E293B", fontWeight: 600 }}>{dossier.nom}</div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Nouveau statut</div>
          <StatusBadge statut={STATUS.EN_COURS} size="lg" />
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Prochaine étape</div>
          <div style={{ fontSize: 14, color: "#1E293B", fontWeight: 500 }}>Intervention prévue le 14 fév.</div>
        </div>
      </div>

      <button onClick={() => onNavigate(SCREENS.DETAIL)} style={{
        width: "100%", padding: "14px 0", borderRadius: 12,
        background: "linear-gradient(135deg, #1B3A5C, #2563EB)", color: "#fff",
        fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer",
        boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
        marginBottom: 10,
      }}>
        Voir le dossier
      </button>
      <button onClick={() => onNavigate(SCREENS.DASHBOARD)} style={{
        width: "100%", padding: "13px 0", borderRadius: 12,
        background: "none", color: "#64748B",
        fontSize: 14, fontWeight: 500, border: "1px solid #E2E8F0", cursor: "pointer",
      }}>
        Retour tableau de bord
      </button>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState(SCREENS.LOGIN);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [fadeClass, setFadeClass] = useState("in");

  const navigate = (target) => {
    setFadeClass("out");
    setAnimating(true);
    setTimeout(() => {
      setScreen(target);
      setFadeClass("in");
      setTimeout(() => setAnimating(false), 200);
    }, 150);
  };

  const renderScreen = () => {
    switch (screen) {
      case SCREENS.LOGIN: return <LoginScreen onNavigate={navigate} />;
      case SCREENS.DASHBOARD: return <DashboardScreen onNavigate={navigate} />;
      case SCREENS.DOSSIERS: return <DossiersScreen onNavigate={navigate} onSelectDossier={setSelectedDossier} />;
      case SCREENS.DETAIL: return <DetailScreen dossier={selectedDossier} onNavigate={navigate} />;
      case SCREENS.UPDATE: return <UpdateScreen dossier={selectedDossier} onNavigate={navigate} />;
      case SCREENS.CONFIRM: return <ConfirmScreen dossier={selectedDossier} onNavigate={navigate} />;
      default: return <LoginScreen onNavigate={navigate} />;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        
        .phone-frame {
          width: 375px;
          height: 812px;
          border-radius: 44px;
          overflow: hidden;
          background: #FFFFFF;
          box-shadow: 0 0 0 10px #1a1a1a, 0 0 0 12px #333, 0 20px 80px rgba(0,0,0,0.35);
          position: relative;
          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
        }
        
        .notch {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 160px;
          height: 34px;
          background: #1a1a1a;
          border-radius: 0 0 20px 20px;
          z-index: 100;
        }
        
        .screen-content {
          height: 100%;
          overflow-y: auto;
          padding-top: 54px;
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
        
        .screen-content.fade-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .screen-content.fade-out {
          opacity: 0;
          transform: translateY(6px);
        }
        
        .screen-content::-webkit-scrollbar { display: none; }
        
        input::placeholder, textarea::placeholder {
          color: #94A3B8;
        }
        
        button:active {
          transform: scale(0.98);
        }

        select {
          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
        }
      `}</style>
      
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #0F172A 0%, #1E293B 50%, #334155 100%)",
        padding: 20,
      }}>
        <div>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Prototype • Conseil Syndical
            </h2>
          </div>
          <div className="phone-frame">
            <div className="notch" />
            <div className={`screen-content fade-${fadeClass}`}>
              {renderScreen()}
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
              Cliquez pour naviguer entre les écrans
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
