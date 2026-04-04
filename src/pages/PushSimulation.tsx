import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import iosWallpaper from "@/assets/ios-wallpaper.jpg";

const appGrid = [
  { name: "Messages", bg: "linear-gradient(180deg, #65D26A 0%, #34C759 100%)", icon: "💬" },
  { name: "Calendrier", bg: "#fff", icon: "📅" },
  { name: "Photos", bg: "linear-gradient(135deg, #FF6F61 0%, #FF9A76 50%, #FFD180 100%)", icon: "🌸" },
  { name: "Caméra", bg: "linear-gradient(180deg, #636366 0%, #48484A 100%)", icon: "📷" },
  { name: "Météo", bg: "linear-gradient(180deg, #5AC8FA 0%, #34AADC 100%)", icon: "🌤️" },
  { name: "Horloge", bg: "#1C1C1E", icon: "🕐" },
  { name: "Plans", bg: "linear-gradient(135deg, #4CD964 0%, #34C759 50%, #5AC8FA 100%)", icon: "🗺️" },
  { name: "News", bg: "linear-gradient(135deg, #FF3B30 0%, #FF6B6B 100%)", icon: "📰" },
  { name: "Bourse", bg: "#1C1C1E", icon: "📈" },
  { name: "Notes", bg: "linear-gradient(180deg, #FFEB3B 0%, #FFC107 100%)", icon: "📝" },
  { name: "Rappels", bg: "#fff", icon: "📋" },
  { name: "Wallet", bg: "#1C1C1E", icon: "💳" },
  { name: "Réglages", bg: "linear-gradient(180deg, #8E8E93 0%, #636366 100%)", icon: "⚙️" },
  { name: "Santé", bg: "#fff", icon: "❤️" },
  { name: "Musique", bg: "linear-gradient(135deg, #FC3C44 0%, #FF2D55 100%)", icon: "🎵" },
  { name: "App Store", bg: "linear-gradient(180deg, #5AC8FA 0%, #007AFF 100%)", icon: "🅰️" },
];

const dockApps = [
  { name: "Téléphone", bg: "linear-gradient(180deg, #65D26A 0%, #34C759 100%)", icon: "📞" },
  { name: "Safari", bg: "linear-gradient(180deg, #5AC8FA 0%, #007AFF 100%)", icon: "🧭" },
  { name: "Mail", bg: "linear-gradient(180deg, #5AC8FA 0%, #007AFF 100%)", icon: "✉️" },
  { name: "Musique", bg: "linear-gradient(135deg, #FC3C44 0%, #FF2D55 100%)", icon: "🎵" },
];

const PushSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    notificationTitle: string;
    notificationBody: string;
    dossierId: string;
  } | null;

  const [showNotif, setShowNotif] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);

  const now = new Date();
  const timeStr = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    const t1 = setTimeout(() => {
      setShowNotif(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setNotifVisible(true));
      });
    }, 1000);
    return () => clearTimeout(t1);
  }, []);

  const handleNotifTap = () => {
    navigate(state?.dossierId ? `/dossiers/${state.dossierId}` : "/dashboard");
  };

  const handleContinue = () => {
    navigate(state?.dossierId ? `/dossiers/${state.dossierId}` : "/dashboard");
  };

  return (
    <div
      className="relative overflow-hidden flex flex-col"
      style={{ minHeight: "calc(812px - 54px)" }}
    >
      {/* Wallpaper */}
      <img
        src={iosWallpaper}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ minHeight: "calc(812px - 54px)" }}
      />

      {/* Status bar */}
      <div className="relative z-10 flex items-center justify-between px-7 pt-1 pb-2">
        <span className="text-white text-[15px] font-semibold" style={{ fontFamily: "-apple-system, 'SF Pro Display', sans-serif" }}>
          {timeStr}
        </span>
        <div className="flex items-center gap-[5px]">
          {/* Cell signal */}
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
            <rect x="0" y="9" width="3" height="3" rx="0.5" fill="white"/>
            <rect x="4.5" y="6" width="3" height="6" rx="0.5" fill="white"/>
            <rect x="9" y="3" width="3" height="9" rx="0.5" fill="white"/>
            <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="white"/>
          </svg>
          {/* WiFi */}
          <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
            <path d="M8 3C10.2 3 12.1 3.9 13.5 5.3L15 3.8C13.2 2 10.7 1 8 1C5.3 1 2.8 2 1 3.8L2.5 5.3C3.9 3.9 5.8 3 8 3Z"/>
            <path d="M8 6C9.5 6 10.8 6.6 11.8 7.5L13.3 6C11.9 4.7 10 4 8 4C6 4 4.1 4.7 2.7 6L4.2 7.5C5.2 6.6 6.5 6 8 6Z"/>
            <circle cx="8" cy="10.5" r="1.5"/>
          </svg>
          {/* Battery */}
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="white" strokeOpacity="0.35"/>
            <rect x="23" y="3.5" width="1.5" height="5" rx="0.75" fill="white" fillOpacity="0.4"/>
            <rect x="2" y="2" width="15" height="8" rx="1.5" fill="#34C759"/>
          </svg>
        </div>
      </div>

      {/* Push notification banner */}
      {showNotif && (
        <div
          className="absolute left-2.5 right-2.5 z-50 cursor-pointer"
          style={{
            top: notifVisible ? 6 : -140,
            transition: "top 0.7s cubic-bezier(0.32, 0.72, 0, 1)",
          }}
          onClick={handleNotifTap}
        >
          <div
            className="rounded-[22px] p-3 px-3.5 flex items-start gap-3"
            style={{
              background: "rgba(30, 30, 30, 0.75)",
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <div
              className="w-[38px] h-[38px] rounded-[9px] flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #007AFF, #5856D6)" }}
            >
              <span className="text-white text-[13px] font-bold" style={{ fontFamily: "-apple-system, sans-serif" }}>CP</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-[11px] font-semibold text-white/60 uppercase tracking-wide" style={{ fontFamily: "-apple-system, sans-serif" }}>
                  COPROPILOT
                </p>
                <p className="text-[11px] text-white/40" style={{ fontFamily: "-apple-system, sans-serif" }}>
                  maintenant
                </p>
              </div>
              <p className="text-[14px] font-semibold text-white leading-snug mb-0.5" style={{ fontFamily: "-apple-system, 'SF Pro Display', sans-serif" }}>
                {state?.notificationTitle || "Mise à jour dossier"}
              </p>
              <p className="text-[13px] text-white/75 leading-snug line-clamp-2" style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}>
                {state?.notificationBody || "Le statut du dossier a été mis à jour."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* App grid */}
      <div className="relative z-10 flex-1 px-5 pt-5">
        <div className="grid grid-cols-4 gap-x-4 gap-y-5 justify-items-center">
          {appGrid.map((app, i) => (
            <div key={i} className="flex flex-col items-center gap-[5px]" style={{ width: 64 }}>
              <div
                className="w-[60px] h-[60px] rounded-[14px] flex items-center justify-center"
                style={{
                  background: app.bg,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                <span className="text-[28px] leading-none">{app.icon}</span>
              </div>
              <span
                className="text-[11px] text-white font-medium text-center leading-tight"
                style={{
                  fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
                  textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                }}
              >
                {app.name}
              </span>
            </div>
          ))}
        </div>

        {/* Page dots */}
        <div className="flex items-center justify-center gap-[6px] mt-5 mb-3">
          <div className="w-[6px] h-[6px] rounded-full bg-white" />
          <div className="w-[6px] h-[6px] rounded-full bg-white/30" />
          <div className="w-[6px] h-[6px] rounded-full bg-white/30" />
        </div>
      </div>

      {/* Dock */}
      <div className="relative z-10 px-3 pb-3">
        <div
          className="rounded-[26px] px-4 py-2.5 flex items-center justify-around"
          style={{
            background: "rgba(30, 30, 30, 0.45)",
            backdropFilter: "blur(40px) saturate(150%)",
            WebkitBackdropFilter: "blur(40px) saturate(150%)",
          }}
        >
          {dockApps.map((app, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className="w-[56px] h-[56px] rounded-[13px] flex items-center justify-center"
                style={{
                  background: app.bg,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                <span className="text-[26px] leading-none">{app.icon}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue overlay */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center z-20">
        <button
          onClick={handleContinue}
          className="px-5 py-2 rounded-full text-white text-[13px] font-semibold active:scale-95 transition"
          style={{
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          }}
        >
          Continuer vers le dossier →
        </button>
      </div>

      {/* Home indicator */}
      <div className="relative z-10 flex justify-center pb-1.5">
        <div className="w-[134px] h-[5px] rounded-full bg-white/40" />
      </div>
    </div>
  );
};

export default PushSimulation;
