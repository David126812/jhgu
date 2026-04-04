import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, MapPin, AlertTriangle, Send, Sparkles } from "lucide-react";
import { csMembers } from "@/data/mockData";
import type { UrgencyLevel } from "@/data/mockData";

const urgencyOptions: { value: UrgencyLevel; label: string; emoji: string; help: string }[] = [
  { value: "normal", label: "Normal", emoji: "🟢", help: "Gêne limitée, pas de risque" },
  { value: "urgent", label: "Urgent", emoji: "🟠", help: "Impact fort, intervention souhaitée sous 72h" },
  { value: "critique", label: "Critique", emoji: "🔴", help: "Sécurité / dégât, intervention immédiate" },
];

const locationOptions = [
  "Parking", "Hall d'entrée", "Ascenseur", "Escalier", "Façade",
  "Toiture", "Parties communes", "Cave / Sous-sol", "Jardin / Extérieur", "Autre",
];

const SignalerIncident = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<UrgencyLevel>("normal");
  const [location, setLocation] = useState("");
  const [assignee, setAssignee] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [aiAssess, setAiAssess] = useState(false);

  const canSubmit = title.trim().length > 0 && location.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  const handleAiAssess = () => {
    setAiAssess(true);
    // Mock: AI suggests urgency after a moment
    setTimeout(() => {
      setUrgency("urgent");
      setAiAssess(false);
    }, 800);
  };

  if (submitted) {
    return (
      <div className="bg-card px-5 pb-6 pt-5 flex flex-col items-center justify-center min-h-[600px]">
        <div className="w-16 h-16 rounded-full bg-[hsl(145_63%_36%/0.1)] flex items-center justify-center mb-4">
          <Send className="h-7 w-7 text-[hsl(145_63%_36%)]" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-1">Incident signalé !</h2>
        <p className="text-[13px] text-muted-foreground text-center">Votre signalement a été transmis au syndic et au conseil syndical.</p>
      </div>
    );
  }

  return (
    <div className="bg-card px-5 pb-6 pt-5">
      {/* Header */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-1 text-[13px] text-muted-foreground font-medium mb-3 hover:text-foreground transition"
      >
        <ArrowLeft className="h-5 w-5" />
        Retour
      </button>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-lg bg-[hsl(4_74%_57%/0.1)] flex items-center justify-center">
          <AlertTriangle className="h-[18px] w-[18px] text-[hsl(4_74%_48%)]" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Signaler un incident</h1>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1.5 block">
            Titre de l'incident *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : Fuite d'eau au 3ème étage"
            className="w-full rounded-[10px] border border-border bg-secondary px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            maxLength={100}
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1.5 block">
            <MapPin className="h-3 w-3 inline mr-1" />
            Localisation *
          </label>
          <div className="flex flex-wrap gap-1.5">
            {locationOptions.map((loc) => (
              <button
                key={loc}
                onClick={() => setLocation(loc)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition ${
                  location === loc
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-foreground border-border hover:border-primary/30"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>


        {/* Description */}
        <div>
          <label className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1.5 block">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez l'incident en détail…"
            rows={3}
            className="w-full rounded-[10px] border border-border bg-secondary px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            maxLength={500}
          />
        </div>

        {/* Assignee */}
        <div>
          <label className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1.5 block">
            Assigner à un membre du CS
          </label>
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="w-full rounded-[10px] border border-border bg-secondary px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none"
          >
            <option value="">— Non assigné —</option>
            {csMembers.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Photo placeholder */}
        <button className="w-full py-3 rounded-[10px] border-2 border-dashed border-border text-muted-foreground flex items-center justify-center gap-2 hover:border-primary/30 transition">
          <Camera className="h-4 w-4" />
          <span className="text-[12px] font-medium">Ajouter des photos</span>
        </button>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-3.5 rounded-[12px] btn-gradient text-primary-foreground text-[15px] font-semibold flex items-center justify-center gap-2 transition disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
          Envoyer le signalement
        </button>
      </div>
    </div>
  );
};

export default SignalerIncident;
