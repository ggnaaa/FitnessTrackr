import { cn } from "@/lib/utils";
import { 
  ArrowDown, 
  ArrowUp, 
  ArrowRight,
  CheckCircle,
  ExclamationCircle
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon: React.ReactNode;
  changeValue?: string;
  changeType?: "increase" | "decrease" | "neutral" | "warning";
  changeLabel?: string;
  bgColorClass?: string;
  iconColorClass?: string;
}

export default function MetricCard({
  title,
  value,
  unit,
  icon,
  changeValue,
  changeType = "neutral",
  changeLabel,
  bgColorClass = "bg-primary/10",
  iconColorClass = "text-primary"
}: MetricCardProps) {
  // Determine the color and icon for the change indicator
  const getChangeDisplay = () => {
    if (!changeValue) return null;
    
    let changeIcon;
    let colorClass;
    
    switch (changeType) {
      case "increase":
        changeIcon = <ArrowUp className="mr-1 h-3 w-3" />;
        colorClass = "text-green-500";
        break;
      case "decrease":
        changeIcon = <ArrowDown className="mr-1 h-3 w-3" />;
        colorClass = "text-green-500";
        break;
      case "warning":
        changeIcon = <ExclamationCircle className="mr-1 h-3 w-3" />;
        colorClass = "text-red-500";
        break;
      case "neutral":
        changeIcon = <ArrowRight className="mr-1 h-3 w-3" />;
        colorClass = "text-amber-500";
        break;
      default:
        changeIcon = <CheckCircle className="mr-1 h-3 w-3" />;
        colorClass = "text-green-500";
    }
    
    return (
      <span className={cn("text-sm flex items-center", colorClass)}>
        {changeIcon}
        {changeValue}
      </span>
    );
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="flex items-end mt-1">
            <span className="text-2xl font-bold">{value}</span>
            {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
          </div>
        </div>
        <div className={cn("p-2 rounded-lg", bgColorClass)}>
          <div className={iconColorClass}>{icon}</div>
        </div>
      </div>
      {(changeValue || changeLabel) && (
        <div className="mt-2 flex items-center">
          {getChangeDisplay()}
          {changeLabel && <span className="text-xs text-gray-500 ml-2">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
}
