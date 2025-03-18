import { useQuery } from "@tanstack/react-query";
import { Workout } from "@shared/schema";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from "recharts";
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface WorkoutConsistencyChartProps {
  userId: number;
}

export default function WorkoutConsistencyChart({ userId }: WorkoutConsistencyChartProps) {
  const { data: workouts, isLoading } = useQuery<Workout[]>({
    queryKey: ['/api/workouts/user', userId],
  });
  
  if (isLoading) {
    return <ChartSkeleton />;
  }
  
  if (!workouts || workouts.length === 0) {
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <p className="text-gray-400">No workout consistency data available</p>
        </div>
      </div>
    );
  }
  
  // Get the current week's start and end dates
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday as the first day
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  
  // Generate days of the week
  const daysOfWeek = eachDayOfInterval({
    start: weekStart,
    end: weekEnd
  });
  
  // Prepare chart data
  const chartData = daysOfWeek.map(day => {
    // Find if there's a workout on this day
    const workout = workouts.find(w => w.date && isSameDay(parseISO(w.date), day));
    
    return {
      day: format(day, 'EEE'),
      fullDate: day,
      completed: workout ? 1 : 0,
      duration: workout?.duration || 0,
      name: workout?.name || null
    };
  });
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="text-sm font-semibold">
            {format(data.fullDate, 'EEEE, MMMM d')}
          </p>
          {data.completed ? (
            <>
              <p className="text-sm text-green-500">
                {data.name}
              </p>
              <p className="text-sm text-gray-600">
                {data.duration} min
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              No workout
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
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis 
            dataKey="day" 
            tickMargin={10} 
            stroke="#9ca3af"
            tickLine={false}
          />
          <YAxis 
            tickCount={1} 
            domain={[0, 1]}
            axisLine={false}
            tickLine={false}
            tick={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="completed" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={40}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.completed ? "hsl(var(--primary))" : "#e5e7eb"} 
              />
            ))}
          </Bar>
        </BarChart>
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
