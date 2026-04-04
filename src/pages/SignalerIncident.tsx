import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, MapPin, AlertTriangle, Send, X } from "lucide-react";
import { csMembers, syndicContact } from "@/data/mockData";
import { useStore } from "@/data/store";

const locationOptions = [
  "Parking", "Hall d'entrée", "Ascenseur", "Escalier", "Façade",
  "Toiture", "Parties communes", "Cave / Sous-sol", "Jardin / Extérieur", "Autre",
];

const SignalerIncident = () => {
  const navigate = useNavigate();
  const store = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [assignee, setAssignee] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [newDossierId, setNewDossierId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ title?: string; location?: string }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!title.trim()) errs.title = "Le titre est requis";
    if (!location) errs.location = "Sélectionnez une localisation";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
    const shortDate = now.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

    const id = store.addDossier({
      name: title.trim(),
      status: "en_cours",
      urgency: "normal",
      responsible: assignee,
      lastUpdate: dateStr,
      createdAt: dateStr,
      nextStep: assignee ? "Prise en charge par le référent" : "À assigner à un membre du CS",
      lastAction: "Signalement reçu",
      timeline: [
        { date: shortDate, label: "Signalement copropriétaire", done: true },
      ],
      documents: photos.length > 0
        ? [{ name: `Photos_incident_${shortDate}.jpg`, type: "Photos" }]
        : [],
      prestataires: [],
      syndicContact,
    });

    setNewDossierId(id);
    setSubmitted(true);
  };

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setPhotos((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  if (submitted) {
    return (
      <div className="bg-card px-5 pb-6 pt-5 flex flex-col items-center justify-center min-h-[600px]">
        <div className="w-16 h-16 rounded-full bg-[hsl(145_63%_36%/0.1)] flex items-center justify-center mb-4">
          <Send className="h-7 w-7 text-[hsl(145_63%_36%)]" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-1">Incident signalé !</h2>
        <p className="text-[13px] text-muted-foreground text-center mb-6">
          Votre signalement a été enregistré et transmis au conseil syndical.
        </p>
        <div className="flex gap-2.5 w-full max-w-[280px]">
          {newDossierId && (
            <button
              onClick={() => navigate(`/dossiers/${newDossierId}`)}
              className="flex-1 py-3 rounded-[12px] btn-gradient text-primary-foreground text-[13px] font-semibold transition"
            >
              Voir le dossier
            </button>
          )}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 py-3 rounded-[12px] bg-secondary border border-border text-foreground text-[13px] font-semibold transition hover:bg-accent"
          >
            Accueil
          </button>
        </div>
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
            onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors((p) => ({ ...p, title: undefined })); }}
            placeholder="Ex : Fuite d'eau au 3ème étage"
            className={`w-full rounded-[10px] border bg-secondary px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.title ? "border-destructive" : "border-border"}`}
            maxLength={100}
          />
          {errors.title && <p className="text-[11px] text-destructive mt-1">{errors.title}</p>}
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
                onClick={() => { setLocation(loc); if (errors.location) setErrors((p) => ({ ...p, location: undefined })); }}
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
          {errors.location && <p className="text-[11px] text-destructive mt-1">{errors.location}</p>}
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
          <p className="text-[10px] text-muted-foreground mt-1 text-right">{description.length}/500</p>
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

        {/* Photo upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={handlePhotoUpload}
          className="w-full py-3 rounded-[10px] border-2 border-dashed border-border text-muted-foreground flex items-center justify-center gap-2 hover:border-primary/30 transition"
        >
          <Camera className="h-4 w-4" />
          <span className="text-[12px] font-medium">Ajouter des photos</span>
        </button>

        {/* Photo previews */}
        {photos.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {photos.map((photo, i) => (
              <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removePhoto(i)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
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
