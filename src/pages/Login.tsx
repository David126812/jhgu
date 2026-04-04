import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<{ email?: string; code?: string }>({});
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const validate = () => {
    const errs: typeof errors = {};
    if (!email.trim()) errs.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Email invalide";
    if (!code.trim()) errs.code = "Le code copropriété est requis";
    else if (code.trim().length < 4) errs.code = "Code trop court";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) navigate("/dashboard");
  };

  const handleOAuth = (provider: string) => {
    setOauthLoading(provider);
    setTimeout(() => {
      setOauthLoading(null);
      navigate("/dashboard");
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 bg-card" style={{ minHeight: "calc(812px - 54px)" }}>
      {/* Logo */}
      <div className="w-14 h-14 rounded-2xl btn-gradient flex items-center justify-center mb-5">
        <span className="text-primary-foreground text-[22px] font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
          CS
        </span>
      </div>

      <h1 className="text-[22px] font-bold text-foreground text-center mb-2 leading-tight">
        Connexion à votre copropriété
      </h1>
      <p className="text-sm text-muted-foreground text-center mb-10">
        Accédez aux dossiers et au suivi de votre copropriété
      </p>

      {/* OAuth */}
      <div className="w-full max-w-sm space-y-2.5 mb-6">
        <button
          onClick={() => handleOAuth("google")}
          disabled={!!oauthLoading}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-[10px] border border-border bg-card text-sm font-medium text-foreground hover:bg-accent transition active:scale-[0.98] disabled:opacity-60"
        >
          {oauthLoading === "google" ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          Continuer avec Google
        </button>
        <button
          onClick={() => handleOAuth("apple")}
          disabled={!!oauthLoading}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-[10px] border border-border bg-card text-sm font-medium text-foreground hover:bg-accent transition active:scale-[0.98] disabled:opacity-60"
        >
          {oauthLoading === "apple" ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
          )}
          Continuer avec Apple
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 w-full max-w-sm mb-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground font-medium">Connexion par code copropriété</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Email</label>
          <input
            type="email"
            placeholder="jean.dupont@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: undefined })); }}
            className={`w-full py-3 px-3.5 rounded-[10px] border bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition ${errors.email ? "border-destructive" : "border-border focus:border-primary"}`}
          />
          {errors.email && <p className="text-[11px] text-destructive mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Code copropriété</label>
          <input
            type="text"
            placeholder="Ex : COPRO-2024-BXL"
            value={code}
            onChange={(e) => { setCode(e.target.value); if (errors.code) setErrors((p) => ({ ...p, code: undefined })); }}
            className={`w-full py-3 px-3.5 rounded-[10px] border bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition ${errors.code ? "border-destructive" : "border-border focus:border-primary"}`}
          />
          {errors.code ? (
            <p className="text-[11px] text-destructive mt-1">{errors.code}</p>
          ) : (
            <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
              Ce code vous rattache à votre espace conseil syndical
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-3.5 rounded-[10px] btn-gradient text-primary-foreground text-[15px] font-semibold border-none cursor-pointer transition"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Login;
