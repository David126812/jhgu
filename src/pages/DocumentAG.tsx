import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Sparkles, ChevronDown, ChevronUp, ChevronRight, ChevronLeft, X, HelpCircle, TrendingUp, TrendingDown, Info, Euro, Building2, Wrench, Shield, Droplets, Zap, Trash2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";

// ── AG Document pages ──
const agPages = [
  {
    title: "Page 1 — Convocation",
    content: `PROCÈS-VERBAL D'ASSEMBLÉE GÉNÉRALE ORDINAIRE

Résidence Les Jardins du Parc
12 rue des Lilas, 75015 Paris

Date : 26 février 2026, 18h30
Lieu : Salle polyvalente, RDC Bâtiment A

Syndic : Cabinet Durand & Associés
Président de séance : Mme Marie Laurent
Secrétaire : M. Bernard Garcia

Copropriétaires présents : 42 / 68 (61,8%)
Tantièmes représentés : 6 847 / 10 000 (68,5%)

Le quorum étant atteint, l'Assemblée Générale peut valablement délibérer.

Ordre du jour :
1. Approbation des comptes de l'exercice 2025
2. Vote du budget prévisionnel 2026
3. Travaux de ravalement de façade
4. Renouvellement du contrat ascenseur
5. Remplacement du prestataire nettoyage
6. Questions diverses`,
  },
  {
    title: "Page 2 — Résolutions 1 à 3",
    content: `RÉSOLUTION N°1 — Approbation des comptes 2025
Vote : majorité simple (art. 24)
Pour : 5 847 tantièmes (85,4%)
Contre : 500 tantièmes (7,3%)
Abstention : 500 tantièmes (7,3%)
→ ADOPTÉE

Les comptes de l'exercice clos au 31/12/2025 sont approuvés. Le solde du compte charges courantes fait apparaître un excédent de 3 247,00 € qui sera reporté sur l'exercice 2026.

RÉSOLUTION N°2 — Budget prévisionnel 2026
Vote : majorité simple (art. 24)
Pour : 6 100 tantièmes (89,1%)
Contre : 747 tantièmes (10,9%)
→ ADOPTÉE

Le budget prévisionnel pour l'exercice 2026 est fixé à 187 500,00 € répartis selon les tantièmes généraux.

RÉSOLUTION N°3 — Travaux de ravalement
Vote : majorité absolue (art. 25)
Pour : 5 200 tantièmes (75,9%)
Contre : 1 647 tantièmes (24,1%)
→ ADOPTÉE

L'entreprise Bâti France est retenue pour un montant de 48 500,00 € TTC. Appel de fonds exceptionnel en 3 échéances.`,
  },
  {
    title: "Page 3 — Résolutions 4 à 6",
    content: `RÉSOLUTION N°4 — Contrat ascenseur
Vote : majorité simple (art. 24)
Pour : 6 500 tantièmes (94,9%)
Contre : 347 tantièmes (5,1%)
→ ADOPTÉE

Le contrat de maintenance OTIS est renouvelé pour 3 ans au tarif de 4 800,00 €/an. Clause de pénalité ajoutée en cas de non-intervention sous 4h pour pannes bloquantes.

RÉSOLUTION N°5 — Changement prestataire nettoyage
Vote : majorité simple (art. 24)
Pour : 5 900 tantièmes (86,2%)
Contre : 947 tantièmes (13,8%)
→ ADOPTÉE

Le contrat avec Clean & Net est résilié. La société ProNet est retenue pour un montant de 1 200,00 €/mois à compter du 1er avril 2026.

RÉSOLUTION N°6 — Création d'un fonds travaux
Vote : majorité absolue (art. 25)
Pour : 4 800 tantièmes (70,1%)
Contre : 2 047 tantièmes (29,9%)
→ ADOPTÉE

Un fonds travaux est créé conformément à la loi ALUR. Cotisation annuelle fixée à 5% du budget prévisionnel, soit 9 375,00 €/an.`,
  },
  {
    title: "Page 4 — Budget détaillé",
    content: `BUDGET PRÉVISIONNEL 2026 — DÉTAIL

CHARGES COURANTES                    Total : 142 200,00 €
─────────────────────────────────────
Nettoyage parties communes          14 400,00 €
Électricité parties communes         8 700,00 €
Eau froide / chaude                 12 500,00 €
Chauffage collectif                 38 000,00 €
Entretien espaces verts              6 200,00 €
Assurance immeuble                  11 400,00 €
Honoraires syndic                   18 000,00 €
Contrat ascenseur                    4 800,00 €
Entretien divers                     8 200,00 €
Frais postaux & bancaires           2 500,00 €
Provision impayés                    5 000,00 €
Divers & imprévus                   12 500,00 €

CHARGES EXCEPTIONNELLES              Total : 45 300,00 €
─────────────────────────────────────
Ravalement façade (1/3)             16 167,00 €
Fonds travaux (loi ALUR)            9 375,00 €
Remplacement interphone             8 500,00 €
Réfection éclairage parking         5 258,00 €
Mise aux normes sécurité incendie   6 000,00 €

TOTAL BUDGET 2026                  187 500,00 €`,
  },
  {
    title: "Page 5 — Clôture",
    content: `QUESTIONS DIVERSES

M. Garcia signale des nuisances sonores répétées au 3ème étage du Bâtiment B. Le syndic prend note et adressera un courrier de rappel au règlement de copropriété.

Mme Petit demande l'installation de bornes de recharge électrique au parking. Le sujet sera inscrit à l'ordre du jour de la prochaine AG avec étude de faisabilité.

M. Dupont informe que le local vélo est régulièrement laissé ouvert. Un système de badge sera étudié.

PROCHAINE ASSEMBLÉE GÉNÉRALE
Date prévisionnelle : février 2027

L'ordre du jour étant épuisé, la séance est levée à 21h15.

Fait à Paris, le 26 février 2026.

Le Président de séance          Le Secrétaire
Mme Marie Laurent              M. Bernard Garcia

Le Syndic
Cabinet Durand & Associés`,
  },
];

// ── AI Summary ──
const aiSummary = `**6 résolutions votées, toutes adoptées.**

**Ce qu'il faut retenir :**
• Comptes 2025 approuvés — excédent de 3 247 € reporté
• Budget 2026 voté : **187 500 €** (+4,2% vs 2025)
• **Ravalement façade** confié à Bâti France pour 48 500 € — appel de fonds en 3 fois
• Contrat ascenseur OTIS renouvelé 3 ans avec clause de pénalité
• **Clean & Net remplacé** par ProNet à partir du 1er avril
• Fonds travaux ALUR créé : 9 375 €/an

**Impact sur vos charges :**
Charges courantes → +3,8% par rapport à 2025
Charges exceptionnelles → 45 300 € (ravalement + fonds travaux)
Estimation lot moyen (500 tantièmes) → ~156 €/mois charges courantes + ~38 €/mois exceptionnel`;

// ── Charges with explanations (Payfit-style) ──
interface ChargeItem {
  label: string;
  amount: string;
  icon: React.ElementType;
  color: string;
  definition: string;
  impact: string;
  trend?: "up" | "down" | "stable";
  trendLabel?: string;
}

const charges: ChargeItem[] = [
  {
    label: "Chauffage collectif",
    amount: "38 000 €",
    icon: Zap,
    color: "text-[hsl(28_87%_44%)] bg-[hsl(28_87%_52%/0.1)]",
    definition: "Le chauffage collectif couvre le coût du gaz ou de l'énergie utilisée pour chauffer l'ensemble de la résidence. Ce montant est réparti entre tous les copropriétaires selon leurs tantièmes.",
    impact: "C'est le poste le plus important de vos charges (26,7% du budget). Pour un lot de 500 tantièmes, cela représente environ 158 €/mois de novembre à mars.",
    trend: "up",
    trendLabel: "+8,5% vs 2025",
  },
  {
    label: "Honoraires syndic",
    amount: "18 000 €",
    icon: Building2,
    color: "text-primary bg-primary/10",
    definition: "Les honoraires du syndic rémunèrent la gestion courante de la copropriété : tenue des comptes, convocation des AG, suivi des prestataires, gestion des sinistres, etc.",
    impact: "Ce montant est fixe et ne dépend pas de votre taille de lot. Il représente 12,7% du budget. Le contrat actuel avec Cabinet Durand court jusqu'en 2027.",
    trend: "stable",
    trendLabel: "Stable",
  },
  {
    label: "Nettoyage parties communes",
    amount: "14 400 €",
    icon: Droplets,
    color: "text-[hsl(145_63%_36%)] bg-[hsl(145_63%_42%/0.1)]",
    definition: "Ce poste couvre l'entretien régulier des halls, escaliers, couloirs et locaux communs. Suite au vote en AG, le prestataire change : ProNet remplace Clean & Net à partir d'avril 2026.",
    impact: "Le nouveau contrat est à 1 200 €/mois au lieu de 1 100 € (+9%). La qualité de service devrait s'améliorer suite aux réclamations répétées.",
    trend: "up",
    trendLabel: "+9% (nouveau prestataire)",
  },
  {
    label: "Eau froide / chaude",
    amount: "12 500 €",
    icon: Droplets,
    color: "text-[hsl(200_80%_40%)] bg-[hsl(200_80%_50%/0.1)]",
    definition: "Ce poste regroupe la consommation d'eau froide et d'eau chaude sanitaire des parties communes (arrosage, nettoyage) et parfois des parties privatives si le comptage est collectif.",
    impact: "Montant stable par rapport à 2025. Pour un lot de 500 tantièmes, cela représente environ 52 €/mois.",
    trend: "stable",
    trendLabel: "Stable",
  },
  {
    label: "Assurance immeuble",
    amount: "11 400 €",
    icon: Shield,
    color: "text-[hsl(260_60%_50%)] bg-[hsl(260_60%_55%/0.1)]",
    definition: "L'assurance multirisque immeuble couvre les dommages aux parties communes (incendie, dégât des eaux, catastrophe naturelle, responsabilité civile). Elle est obligatoire.",
    impact: "Ce poste a baissé de 5% grâce à une renégociation du contrat. Bonne nouvelle : la franchise dégât des eaux passe de 1 500 € à 800 €.",
    trend: "down",
    trendLabel: "-5% (renégocié)",
  },
  {
    label: "Entretien espaces verts",
    amount: "6 200 €",
    icon: Trash2,
    color: "text-[hsl(145_63%_36%)] bg-[hsl(145_63%_42%/0.1)]",
    definition: "Entretien des jardins, pelouses, haies et plantations de la résidence. Comprend la tonte, la taille, le désherbage et le remplacement des plantes.",
    impact: "Montant stable. L'entretien est effectué toutes les 2 semaines d'avril à octobre, et une fois par mois le reste de l'année.",
    trend: "stable",
    trendLabel: "Stable",
  },
  {
    label: "Ravalement façade (1/3)",
    amount: "16 167 €",
    icon: Wrench,
    color: "text-destructive bg-destructive/10",
    definition: "Appel de fonds exceptionnel pour financer le ravalement de la façade, voté en AG. Le montant total de 48 500 € est réparti en 3 appels trimestriels.",
    impact: "Charge exceptionnelle. Pour un lot de 500 tantièmes : environ 808 € par appel, soit 2 425 € au total sur 9 mois. Premier appel en mars 2026.",
    trend: "up",
    trendLabel: "Nouveau",
  },
  {
    label: "Fonds travaux (ALUR)",
    amount: "9 375 €",
    icon: Euro,
    color: "text-[hsl(28_87%_44%)] bg-[hsl(28_87%_52%/0.1)]",
    definition: "Le fonds travaux est une réserve obligatoire (loi ALUR) que chaque copropriété doit constituer pour anticiper les gros travaux futurs. Il est fixé à 5% minimum du budget prévisionnel.",
    impact: "Nouveau poste voté cette année. Pour un lot de 500 tantièmes : environ 39 €/mois. Cet argent est mis de côté et ne sera utilisé que pour des travaux importants votés en AG.",
    trend: "up",
    trendLabel: "Nouveau",
  },
];

const DocumentAG = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [activeTab, setActiveTab] = useState<"document" | "charges">("document");
  const [expandedCharge, setExpandedCharge] = useState<number | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const handleShowSummary = () => {
    if (showSummary) { setShowSummary(false); return; }
    setSummaryLoading(true);
    setTimeout(() => {
      setSummaryLoading(false);
      setShowSummary(true);
    }, 1500);
  };

  return (
    <div className="bg-card flex flex-col" style={{ minHeight: "calc(812px - 54px)" }}>
      <div className="flex-1 px-5 pb-4 pt-5">
        {/* Header */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1 text-[13px] text-muted-foreground font-medium mb-3 hover:text-foreground transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Retour
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-[18px] w-[18px] text-primary" />
          </div>
          <div>
            <h1 className="text-[17px] font-bold text-foreground">PV Assemblée Générale</h1>
            <p className="text-[11px] text-muted-foreground">26 février 2026 — 5 pages</p>
          </div>
        </div>

        {/* AI Summary button */}
        <button
          onClick={handleShowSummary}
          className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-[12px] border mb-4 transition active:scale-[0.98] text-left ${
            showSummary
              ? "border-primary/30 bg-primary/[0.06]"
              : "border-primary/15 bg-primary/[0.03] hover:border-primary/30"
          }`}
        >
          <Sparkles className={`h-[18px] w-[18px] text-primary flex-shrink-0 ${summaryLoading ? "animate-spin" : ""}`} />
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-foreground">{summaryLoading ? "Analyse en cours…" : showSummary ? "Masquer le résumé" : "Résumer ce document"}</p>
            <p className="text-[11px] text-muted-foreground">{summaryLoading ? "Lecture des 5 pages" : "L'IA synthétise les points clés et l'impact"}</p>
          </div>
        </button>

        {/* AI Summary panel */}
        {showSummary && (
          <div className="rounded-[14px] border-2 border-primary/30 bg-primary/[0.04] p-4 mb-4 shadow-[0_0_16px_hsl(var(--primary)/0.08)]">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-[11px] font-semibold text-primary uppercase tracking-wider">Résumé IA</p>
            </div>
            <div className="text-[13px] text-foreground leading-relaxed whitespace-pre-line">
              {aiSummary.split("**").map((part, i) =>
                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
              )}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Généré par CoPro Pilot IA
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-secondary rounded-[10px] border border-border mb-4">
          <button
            onClick={() => setActiveTab("document")}
            className={`flex-1 py-2 rounded-[8px] text-[12px] font-semibold transition flex items-center justify-center gap-1.5 ${
              activeTab === "document"
                ? "bg-foreground/10 text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Document
          </button>
          <button
            onClick={() => setActiveTab("charges")}
            className={`flex-1 py-2 rounded-[8px] text-[12px] font-semibold transition flex items-center justify-center gap-1.5 ${
              activeTab === "charges"
                ? "bg-foreground/10 text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Euro className="h-3.5 w-3.5" />
            Charges & coûts
          </button>
        </div>

        {activeTab === "document" ? (
          <>
            {/* Document viewer */}
            <div className="rounded-[12px] border border-border bg-white p-4 mb-3 min-h-[320px]">
              <p className="text-[10px] font-semibold text-muted-foreground mb-3">{agPages[currentPage].title}</p>
              <pre className="text-[10px] text-[#1a1a1a] leading-[1.6] whitespace-pre-wrap font-[inherit]">
                {agPages[currentPage].content}
              </pre>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-muted-foreground hover:text-foreground transition disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </button>
              <div className="flex items-center gap-1.5">
                {agPages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-2 h-2 rounded-full transition ${i === currentPage ? "bg-primary scale-125" : "bg-border"}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(agPages.length - 1, p + 1))}
                disabled={currentPage === agPages.length - 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-muted-foreground hover:text-foreground transition disabled:opacity-30"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          /* ── Charges tab (Payfit-style) ── */
          <>
            {/* Total */}
            <div className="rounded-[14px] bg-secondary border border-border p-4 mb-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Budget total 2026</p>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[hsl(28_87%_44%)]">
                  <TrendingUp className="h-3 w-3" />
                  +4,2% vs 2025
                </div>
              </div>
              <p className="text-[24px] font-bold text-foreground">187 500 €</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Estimation lot moyen (500/10000e) : <span className="font-semibold text-foreground">~194 €/mois</span>
              </p>
            </div>

            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HelpCircle className="h-3 w-3" />
              Tapez sur une ligne pour comprendre
            </p>

            {/* Charge items */}
            <div className="space-y-2">
              {charges.map((charge, i) => {
                const isExpanded = expandedCharge === i;
                const Icon = charge.icon;
                return (
                  <div key={i} className={`rounded-[12px] border transition ${isExpanded ? "border-primary/30 bg-primary/[0.02]" : "border-border bg-card"}`}>
                    <button
                      onClick={() => setExpandedCharge(isExpanded ? null : i)}
                      className="w-full flex items-center gap-3 p-3.5 text-left"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${charge.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-foreground">{charge.label}</p>
                        {charge.trend && (
                          <div className="flex items-center gap-1 mt-0.5">
                            {charge.trend === "up" && <TrendingUp className="h-3 w-3 text-[hsl(28_87%_44%)]" />}
                            {charge.trend === "down" && <TrendingDown className="h-3 w-3 text-[hsl(145_63%_36%)]" />}
                            {charge.trend === "stable" && <span className="text-[10px] text-muted-foreground">—</span>}
                            <span className={`text-[10px] font-medium ${
                              charge.trend === "up" ? "text-[hsl(28_87%_44%)]" : charge.trend === "down" ? "text-[hsl(145_63%_36%)]" : "text-muted-foreground"
                            }`}>{charge.trendLabel}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-[14px] font-bold text-foreground flex-shrink-0">{charge.amount}</p>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>

                    {/* Expanded explanation (Payfit-style) */}
                    {isExpanded && (
                      <div className="px-3.5 pb-4 border-t border-border/50 pt-3 space-y-3">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Info className="h-3.5 w-3.5 text-primary" />
                            <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Définition</p>
                          </div>
                          <p className="text-[12px] text-foreground leading-relaxed">{charge.definition}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Euro className="h-3.5 w-3.5 text-[hsl(28_87%_44%)]" />
                            <p className="text-[11px] font-bold text-[hsl(28_87%_44%)] uppercase tracking-wider">Impact sur vos charges</p>
                          </div>
                          <p className="text-[12px] text-foreground leading-relaxed">{charge.impact}</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 pt-1">
                          <Sparkles className="h-3 w-3" /> Généré par CoPro Pilot IA
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default DocumentAG;
