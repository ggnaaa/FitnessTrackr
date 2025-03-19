import { cn } from "@/lib/utils";

interface ProgressCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  bgColor?: string;
  fgColor?: string;
  children?: React.ReactNode;
}

export function ProgressCircle({
  percentage,
  size = 96,
  strokeWidth = 4,
  className,
  bgColor = "#E5E7EB",
  fgColor = "currentColor",
  children,
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Ensure percentage is a valid number to prevent NaN errors
  const safePercentage = isNaN(percentage) ? 0 : percentage;
  const offset = circumference - (safePercentage / 100) * circumference;

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg
        className="progress-circle"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
      >
        <circle
          className="circle-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          className="circle-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={fgColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={isNaN(offset) ? 0 : offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        {children}
      </div>
    </div>
  );
}
