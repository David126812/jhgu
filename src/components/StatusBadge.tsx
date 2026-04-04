import { DossierStatus, statusLabels } from "@/data/mockData";

interface StatusBadgeProps {
  status: DossierStatus;
  size?: "sm" | "lg";
}

const StatusBadge = ({ status, size = "sm" }: StatusBadgeProps) => {
  const sizeClass = size === "sm" ? "px-2.5 py-[3px] text-[11px]" : "px-3.5 py-1.5 text-[13px]";

  const styles: Record<DossierStatus, { bg: string; text: string; dot: string; border: string }> = {
    en_cours: {
      bg: "bg-[hsl(28_87%_52%/0.08)]",
      text: "text-[hsl(28_87%_38%)]",
      dot: "bg-[hsl(28_87%_52%)]",
      border: "border-[hsl(28_87%_52%/0.15)]",
    },
    bloque: {
      bg: "bg-[hsl(4_74%_57%/0.08)]",
      text: "text-[hsl(4_74%_42%)]",
      dot: "bg-[hsl(4_74%_57%)]",
      border: "border-[hsl(4_74%_57%/0.15)]",
    },
    termine: {
      bg: "bg-[hsl(145_63%_42%/0.08)]",
      text: "text-[hsl(145_63%_32%)]",
      dot: "bg-[hsl(145_63%_42%)]",
      border: "border-[hsl(145_63%_42%/0.15)]",
    },
  };

  const s = styles[status];
  const dotSize = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full tracking-wide border ${sizeClass} ${s.bg} ${s.text} ${s.border}`}>
      <span className={`${dotSize} rounded-full ${s.dot} ${status === "bloque" ? "animate-pulse" : ""}`} />
      {statusLabels[status]}
    </span>
  );
};

export default StatusBadge;
