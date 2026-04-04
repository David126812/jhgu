import { DossierStatus, statusLabels } from "@/data/mockData";

interface StatusBadgeProps {
  status: DossierStatus;
  size?: "sm" | "lg";
}

const StatusBadge = ({ status, size = "sm" }: StatusBadgeProps) => {
  const sizeClass = size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3.5 py-1.5 text-[13px]";
  const colorClass =
    status === "en_cours"
      ? "status-warning-soft"
      : status === "bloque"
      ? "status-danger-soft"
      : "status-active-soft";

  const dotColor =
    status === "en_cours"
      ? "bg-[hsl(28_87%_52%)]"
      : status === "bloque"
      ? "bg-[hsl(4_74%_57%)]"
      : "bg-[hsl(145_63%_42%)]";

  const dotSize = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-md tracking-wide ${sizeClass} ${colorClass}`}>
      <span className={`${dotSize} rounded-full ${dotColor}`} />
      {statusLabels[status]}
    </span>
  );
};

export default StatusBadge;
