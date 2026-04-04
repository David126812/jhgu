import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MessageSquare, AtSign, User, Bell, Shield, HelpCircle, LogOut, ChevronRight, Save, Trash2 } from "lucide-react";
import { useStore, resetStore } from "@/data/store";
import { syndicContact } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";

type SettingsView = "main" | "profile" | "notifications" | "privacy" | "help";

const Settings = () => {
  const navigate = useNavigate();
  const store = useStore();
  const [view, setView] = useState<SettingsView>("main");

  // Profile form state
  const [name, setName] = useState(store.userProfile.name);
  const [email, setEmail] = useState(store.userProfile.email);
  const [phone, setPhone] = useState(store.userProfile.phone);

  const syndicActions = [
    { label: "Appeler le syndic", icon: Phone, action: () => { window.location.href = `tel:${syndicContact.phone}`; } },
    { label: "SMS au syndic", icon: MessageSquare, action: () => { window.location.href = `sms:${syndicContact.phone}`; } },
    { label: "Email au syndic", icon: AtSign, action: () => { window.location.href = `mailto:${syndicContact.email}`; } },
  ];

  const handleSaveProfile = () => {
    store.updateProfile({ name, email, phone });
    toast({ title: "Profil mis à jour" });
    setView("main");
  };

  // ── Profile view ──
  if (view === "profile") {
    return (
      <div className="bg-card flex flex-col" style={{ minHeight: "calc(812px - 54px)" }}>
        <div className="flex-1 px-5 pb-4 pt-5">
          <button onClick={() => setView("main")} className="flex items-center gap-1 text-[13px] text-muted-foreground font-medium mb-3 hover:text-foreground transition">
            <ArrowLeft className="h-5 w-5" /> Retour
          </button>
          <h1 className="text-lg font-bold text-foreground mb-5">Mon profil</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-[20px] font-bold text-primary">{store.userProfile.name.split(" ").map(n => n[0]).join("")}</span>
            </div>
            <div>
              <p className="text-[15px] font-bold text-foreground">{store.userProfile.name}</p>
              <p className="text-[12px] text-muted-foreground">{store.userProfile.role}</p>
              <p className="text-[11px] text-primary font-medium">{store.userProfile.residence}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1.5 block">Nom complet</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-[10px] border border-border bg-secondary px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-[10px] border border-border bg-secondary px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1.5 block">Téléphone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-[10px] border border-border bg-secondary px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1.5 block">Rôle</label>
              <p className="text-[13px] text-muted-foreground px-3.5 py-2.5">{store.userProfile.role}</p>
            </div>
          </div>

          <button onClick={handleSaveProfile} className="w-full py-3 rounded-[12px] btn-gradient text-primary-foreground text-[14px] font-semibold flex items-center justify-center gap-2 mt-6 transition">
            <Save className="h-4 w-4" /> Enregistrer
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── Notifications view ──
  if (view === "notifications") {
    return (
      <div className="bg-card flex flex-col" style={{ minHeight: "calc(812px - 54px)" }}>
        <div className="flex-1 px-5 pb-4 pt-5">
          <button onClick={() => setView("main")} className="flex items-center gap-1 text-[13px] text-muted-foreground font-medium mb-3 hover:text-foreground transition">
            <ArrowLeft className="h-5 w-5" /> Retour
          </button>
          <h1 className="text-lg font-bold text-foreground mb-5">Notifications</h1>

          <div className="space-y-3">
            {([
              { key: "notificationsEnabled" as const, label: "Notifications in-app", desc: "Recevoir les notifications dans l'application" },
              { key: "pushEnabled" as const, label: "Notifications push", desc: "Recevoir des notifications push sur votre appareil" },
              { key: "emailNotifications" as const, label: "Notifications email", desc: "Recevoir un résumé par email" },
            ]).map((item) => (
              <div key={item.key} className="flex items-center justify-between bg-secondary rounded-[12px] border border-border p-4">
                <div>
                  <p className="text-[13px] font-semibold text-foreground mb-0.5">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                </div>
                <button
                  onClick={() => store.updateProfile({ [item.key]: !store.userProfile[item.key] })}
                  className="relative w-11 h-6 rounded-full transition-colors"
                  style={{ background: store.userProfile[item.key] ? "hsl(221 83% 53%)" : "hsl(215 20% 79%)" }}
                >
                  <div className="absolute top-0.5 w-5 h-5 rounded-full bg-card shadow-sm transition-[left] duration-200" style={{ left: store.userProfile[item.key] ? 22 : 2 }} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── Privacy view ──
  if (view === "privacy") {
    return (
      <div className="bg-card flex flex-col" style={{ minHeight: "calc(812px - 54px)" }}>
        <div className="flex-1 px-5 pb-4 pt-5">
          <button onClick={() => setView("main")} className="flex items-center gap-1 text-[13px] text-muted-foreground font-medium mb-3 hover:text-foreground transition">
            <ArrowLeft className="h-5 w-5" /> Retour
          </button>
          <h1 className="text-lg font-bold text-foreground mb-5">Confidentialité</h1>

          <div className="space-y-4">
            <section className="bg-secondary rounded-[12px] border border-border p-4">
              <h2 className="text-[13px] font-semibold text-foreground mb-2">Données personnelles</h2>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Vos données sont stockées localement sur votre appareil. Aucune donnée n'est envoyée à des serveurs tiers dans cette version prototype.
              </p>
            </section>

            <section className="bg-secondary rounded-[12px] border border-border p-4">
              <h2 className="text-[13px] font-semibold text-foreground mb-2">Visibilité des notes</h2>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Les notes internes sont visibles uniquement par les membres du Conseil Syndical. Les notes externes sont partagées avec le syndic.
              </p>
            </section>

            <section className="bg-secondary rounded-[12px] border border-border p-4">
              <h2 className="text-[13px] font-semibold text-foreground mb-2">Suppression des données</h2>
              <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">
                Vous pouvez supprimer toutes les données locales à tout moment.
              </p>
              <button
                onClick={() => {
                  if (confirm("Êtes-vous sûr ? Toutes les données locales seront supprimées.")) {
                    resetStore();
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-destructive/10 border border-destructive/20 text-destructive text-[12px] font-semibold hover:bg-destructive/20 transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Supprimer toutes les données
              </button>
            </section>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── Help view ──
  if (view === "help") {
    return (
      <div className="bg-card flex flex-col" style={{ minHeight: "calc(812px - 54px)" }}>
        <div className="flex-1 px-5 pb-4 pt-5">
          <button onClick={() => setView("main")} className="flex items-center gap-1 text-[13px] text-muted-foreground font-medium mb-3 hover:text-foreground transition">
            <ArrowLeft className="h-5 w-5" /> Retour
          </button>
          <h1 className="text-lg font-bold text-foreground mb-5">Aide & support</h1>

          <div className="space-y-3">
            {([
              { q: "Comment signaler un incident ?", a: "Depuis le tableau de bord, appuyez sur \"Signaler incident\" ou utilisez l'assistant vocal." },
              { q: "Comment mettre à jour un dossier ?", a: "Ouvrez le dossier puis appuyez sur \"Mettre à jour\". L'assistant IA peut pré-remplir les informations." },
              { q: "Qui voit mes notes internes ?", a: "Les notes internes sont visibles uniquement par les membres du Conseil Syndical. Les notes externes sont partagées avec le syndic." },
              { q: "Comment notifier les copropriétaires ?", a: "Depuis un dossier, appuyez sur \"Notifier tous les copropriétaires\" pour envoyer une notification push." },
              { q: "Comment exporter un dossier ?", a: "Dans le menu (⋯) d'un dossier, vous pouvez partager la fiche, l'exporter en fichier ou l'envoyer par email." },
            ]).map((faq, i) => (
              <details key={i} className="bg-secondary rounded-[12px] border border-border overflow-hidden group">
                <summary className="px-4 py-3 text-[13px] font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-4 pb-3">
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-6 bg-secondary rounded-[12px] border border-border p-4">
            <p className="text-[13px] font-semibold text-foreground mb-1">Besoin d'aide supplémentaire ?</p>
            <p className="text-[12px] text-muted-foreground mb-3">Contactez-nous par email pour toute question.</p>
            <button
              onClick={() => { window.location.href = "mailto:support@copro-pilot.fr?subject=Demande%20d'aide"; }}
              className="px-4 py-2.5 rounded-[10px] btn-gradient text-primary-foreground text-[12px] font-semibold transition"
            >
              Contacter le support
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── Main settings view ──
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

        <h1 className="text-lg font-bold text-foreground mb-5">Réglages</h1>

        {/* User card */}
        <div className="flex items-center gap-3 mb-6 p-4 rounded-[14px] bg-secondary border border-border">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-[16px] font-bold text-primary">{store.userProfile.name.split(" ").map(n => n[0]).join("")}</span>
          </div>
          <div>
            <p className="text-[14px] font-bold text-foreground">{store.userProfile.name}</p>
            <p className="text-[11px] text-muted-foreground">{store.userProfile.role}</p>
          </div>
        </div>

        {/* Syndic contact section */}
        <div className="mb-6">
          <h2 className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Contacter le syndic</h2>
          <p className="text-[11px] text-muted-foreground mb-3">{syndicContact.name} — {syndicContact.phone}</p>
          <div className="space-y-2">
            {syndicActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={action.action}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-[12px] bg-secondary border border-border hover:border-primary/30 transition active:scale-[0.98]"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-[13px] font-semibold text-foreground">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* General settings */}
        <div>
          <h2 className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Général</h2>
          <div className="space-y-2">
            {([
              { label: "Mon profil", icon: User, view: "profile" as SettingsView },
              { label: "Notifications", icon: Bell, view: "notifications" as SettingsView },
              { label: "Confidentialité", icon: Shield, view: "privacy" as SettingsView },
              { label: "Aide & support", icon: HelpCircle, view: "help" as SettingsView },
            ]).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => setView(item.view)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-[12px] bg-secondary border border-border hover:border-primary/30 transition active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-[13px] font-semibold text-foreground">{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => navigate("/login")}
          className="w-full flex items-center gap-3 px-4 py-3 mt-6 rounded-[12px] bg-destructive/10 border border-destructive/20 hover:border-destructive/40 transition active:scale-[0.98]"
        >
          <LogOut className="h-5 w-5 text-destructive" />
          <span className="text-[13px] font-semibold text-destructive">Se déconnecter</span>
        </button>
      </div>
      <BottomNav />
    </div>
  );
};

export default Settings;
