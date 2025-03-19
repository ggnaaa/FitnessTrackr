import { formatChangeNumber } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  change?: number;
  changeText?: string;
  changeDirection?: "up" | "down";
  status?: "success" | "danger" | "normal";
}

export function StatCard({
  title,
  value,
  icon,
  change,
  changeText = "from last month",
  changeDirection = "down",
  status = "success",
}: StatCardProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="material-icons text-primary text-lg mr-2">{icon}</span>
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        </div>
      </div>
      <div className="mt-1">
        <p className="text-2xl font-bold">{value}</p>
      </div>
      {(change !== undefined || changeText) && (
        <div className="mt-auto pt-2 flex items-center text-xs">
          {change !== undefined && (
            <span className={`flex items-center ${status === "success" ? "text-green-600" : status === "danger" ? "text-red-600" : "text-gray-600"}`}>
              <span className="material-icons text-xs">
                {changeDirection === "down" ? "arrow_drop_down" : "arrow_drop_up"}
              </span>
              {formatChangeNumber(change)}
            </span>
          )}
          {changeText && <span className="ml-1 text-gray-500">{changeText}</span>}
        </div>
      )}
    </div>
  );
}
