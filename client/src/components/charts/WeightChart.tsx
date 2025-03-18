import { useQuery } from "@tanstack/react-query";
import { HealthMetric } from "@shared/schema";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface WeightChartProps {
  userId: number;
}

export default function WeightChart({ userId }: WeightChartProps) {
  const { data: metrics, isLoading } = useQuery<HealthMetric[]>({
    queryKey: ['/api/health-metrics/user', userId],
  });
  
  if (isLoading) {
    return <ChartSkeleton />;
  }
  
  if (!metrics || metrics.length === 0) {
    return (
      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-10 w-10 text-gray-300 mb-2 mx-auto" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
            />
          </svg>
          <p className="text-gray-400">No weight history data available</p>
        </div>
      </div>
    );
  }
  
  // Format the data for the chart
  const chartData = metrics
    .filter(metric => metric.weight) // Only include entries with weight
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date
    .map(metric => ({
      date: metric.date,
      weight: metric.weight,
      bmi: metric.bmi,
    }));
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="text-sm font-semibold">
            {format(parseISO(label), 'MMM d, yyyy')}
          </p>
          <p className="text-sm text-primary">
            Weight: {payload[0].value} kg
          </p>
          {payload[1]?.value && (
            <p className="text-sm text-secondary">
              BMI: {payload[1].value}
            </p>
          )}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(parseISO(date), 'MMM d')}
            tickMargin={10}
            stroke="#9ca3af"
            tickLine={false}
          />
          <YAxis 
            yAxisId="left"
            domain={['dataMin - 2', 'dataMax + 2']} 
            tickMargin={10} 
            stroke="#9ca3af"
            tickLine={false}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            domain={[15, 40]} 
            tickMargin={10} 
            stroke="#9ca3af"
            tickLine={false}
            hide={!chartData.some(data => data.bmi)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="weight" 
            name="Weight (kg)"
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
          {chartData.some(data => data.bmi) && (
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="bmi" 
              name="BMI"
              stroke="hsl(var(--secondary))" 
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
      <Skeleton className="h-full w-full rounded-lg" />
    </div>
  );
}
