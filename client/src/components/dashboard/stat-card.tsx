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
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
        <span className="material-icons text-primary">{icon}</span>
      </div>
      {(change !== undefined || changeText) && (
        <div className="mt-2 flex items-center text-xs">
          {change !== undefined && (
            <span className={`text-${status} flex items-center`}>
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
