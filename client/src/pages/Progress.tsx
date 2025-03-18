import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  HealthMetric, 
  User 
} from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import WeightChart from "@/components/charts/WeightChart";
import WorkoutConsistencyChart from "@/components/charts/WorkoutConsistencyChart";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, parseISO, subDays } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Weight,
  TrendingUp,
  TrendingDown,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Target,
  Calendar,
  ArrowUpRight
} from "lucide-react";

export default function Progress() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // For demo purposes using a static user ID
  const userId = 1;
  
  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery<User>({ 
    queryKey: [`/api/users/${userId}`],
  });
  
  // Fetch health metrics
  const { data: metrics, isLoading: isLoadingMetrics } = useQuery<HealthMetric[]>({
    queryKey: ['/api/health-metrics/user', userId],
  });
  
  // Latest metric
  const latestMetric = metrics?.length ? metrics[metrics.length - 1] : null;
  
  // Example data for body composition chart
  const bodyCompositionData = [
    { name: 'Fat', value: latestMetric?.bodyFat ? parseFloat(String(latestMetric.bodyFat)) : 20 },
    { name: 'Muscle', value: latestMetric?.bodyFat ? 100 - parseFloat(String(latestMetric.bodyFat)) : 80 },
  ];
  
  const COLORS = ['#FF8042', '#4F46E5'];
  
  // Calculate statistics if metrics are available
  const calculateStats = () => {
    if (!metrics || metrics.length < 2) return null;
    
    const sortedMetrics = [...metrics].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const firstMetric = sortedMetrics[0];
    const lastMetric = sortedMetrics[sortedMetrics.length - 1];
    
    return {
      initialWeight: firstMetric.weight,
      currentWeight: lastMetric.weight,
      weightChange: lastMetric.weight && firstMetric.weight 
        ? (lastMetric.weight - firstMetric.weight).toFixed(1)
        : null,
      initialBMI: firstMetric.bmi,
      currentBMI: lastMetric.bmi,
      bmiChange: lastMetric.bmi && firstMetric.bmi 
        ? (lastMetric.bmi - firstMetric.bmi).toFixed(1)
        : null,
      weightTrend: lastMetric.weight && firstMetric.weight
        ? lastMetric.weight < firstMetric.weight ? "decrease" : "increase"
        : null,
    };
  };
  
  const stats = calculateStats();
  
  // For the step count chart
  const generateStepData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const formattedDate = format(date, 'EEE');
      
      // Find if there's a metric for this day
      const metric = metrics?.find(m => {
        const metricDate = new Date(m.date);
        return metricDate.getDate() === date.getDate() && 
               metricDate.getMonth() === date.getMonth() &&
               metricDate.getFullYear() === date.getFullYear();
      });
      
      data.push({
        day: formattedDate,
        steps: metric?.steps || 0,
        goal: 10000, // Example goal
      });
    }
    
    return data;
  };
  
  const stepData = generateStepData();
  
  // Calculate calories trend
  const generateCalorieData = () => {
    if (!metrics) return [];
    
    const sortedMetrics = [...metrics]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Get last 7 days
    
    return sortedMetrics.map(metric => ({
      date: format(new Date(metric.date), 'MMM dd'),
      consumed: metric.caloriesConsumed || 0,
      burned: metric.caloriesBurned || 0,
      net: (metric.caloriesConsumed || 0) - (metric.caloriesBurned || 0)
    }));
  };
  
  const calorieData = generateCalorieData();
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Progress Tracking</h1>
        <Button>Export Data</Button>
      </div>
      
      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="weight">Weight & Body</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-gray-500">Current Weight</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingMetrics ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold mr-2">{latestMetric?.weight || '-'}</span>
                    <span className="text-gray-500">kg</span>
                    
                    {stats?.weightChange && (
                      <div className={`ml-auto flex items-center text-sm ${stats.weightTrend === 'decrease' ? 'text-green-500' : 'text-red-500'}`}>
                        {stats.weightTrend === 'decrease' ? (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        )}
                        <span>{Math.abs(parseFloat(stats.weightChange))} kg</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-gray-500">Current BMI</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingMetrics ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold mr-2">{latestMetric?.bmi || '-'}</span>
                    
                    {stats?.bmiChange && (
                      <div className={`ml-auto flex items-center text-sm ${parseFloat(stats.bmiChange) < 0 ? 'text-green-500' : 'text-amber-500'}`}>
                        {parseFloat(stats.bmiChange) < 0 ? (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        )}
                        <span>{Math.abs(parseFloat(stats.bmiChange))}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-gray-500">Body Fat</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingMetrics ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold mr-2">{latestMetric?.bodyFat || '-'}</span>
                    <span className="text-gray-500">%</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Weight History</CardTitle>
                <CardDescription>Track your weight changes over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <WeightChart userId={userId} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Workout Consistency</CardTitle>
                <CardDescription>Your workout frequency this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <WorkoutConsistencyChart userId={userId} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Steps</CardTitle>
                <CardDescription>Track your daily step count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  {isLoadingMetrics ? (
                    <Skeleton className="h-full w-full rounded-lg" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stepData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => [`${value} steps`, 'Steps']}
                          labelFormatter={(label) => `Day: ${label}`}
                        />
                        <Legend />
                        <Bar 
                          dataKey="steps" 
                          fill="hsl(var(--primary))" 
                          name="Steps"
                          radius={[4, 4, 0, 0]}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="goal" 
                          stroke="#FF8042" 
                          name="Goal"
                          strokeWidth={2}
                          dot={false}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Calories</CardTitle>
                <CardDescription>Calories consumed vs. burned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  {isLoadingMetrics ? (
                    <Skeleton className="h-full w-full rounded-lg" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={calorieData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="consumed" 
                          stroke="#FF8042" 
                          name="Calories Consumed"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="burned" 
                          stroke="hsl(var(--primary))" 
                          name="Calories Burned"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="weight" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weight Trend</CardTitle>
                  <CardDescription>Your weight progression over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <WeightChart userId={userId} />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Body Measurements</CardTitle>
                  <CardDescription>Track changes in your body measurements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <LineChartIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Measurement Data</h3>
                    <p className="text-gray-500 mb-4">Start tracking your body measurements to see progress over time.</p>
                    <Button>Add Measurements</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Body Composition</CardTitle>
                  <CardDescription>Fat vs. Muscle percentage</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingMetrics ? (
                    <Skeleton className="h-64 w-full rounded-lg" />
                  ) : (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={bodyCompositionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {bodyCompositionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Weight Goal</CardTitle>
                  <CardDescription>Track progress towards your goal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Current</div>
                      <div className="text-xl font-bold">{latestMetric?.weight || '-'} kg</div>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-gray-400 mx-4" />
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Goal</div>
                      <div className="text-xl font-bold">70 kg</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div 
                      className="bg-primary h-4 rounded-full" 
                      style={{ width: latestMetric?.weight ? `${Math.min(100, (latestMetric.weight / 70) * 100)}%` : '0%' }}
                    ></div>
                  </div>
                  
                  <div className="text-sm text-gray-500 text-center">
                    {latestMetric?.weight ? `${Math.abs(latestMetric.weight - 70).toFixed(1)} kg to go` : 'Set a goal to track progress'}
                  </div>
                  
                  <div className="mt-6">
                    <Button className="w-full">Update Weight Goal</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>BMI Category</CardTitle>
                  <CardDescription>Based on your latest measurements</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingMetrics ? (
                    <Skeleton className="h-24 w-full rounded-lg" />
                  ) : (
                    <div className="text-center">
                      <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full mb-3">
                        {latestMetric?.bmi ? 
                          (latestMetric.bmi < 18.5 ? 'Underweight' : 
                          latestMetric.bmi < 25 ? 'Healthy Weight' : 
                          latestMetric.bmi < 30 ? 'Overweight' : 'Obese') : 
                          'No data'
                        }
                      </div>
                      <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden mb-4">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500"
                          style={{ 
                            clipPath: latestMetric?.bmi ? 
                              `polygon(0 0, ${Math.min(100, (latestMetric.bmi / 40) * 100)}% 0, ${Math.min(100, (latestMetric.bmi / 40) * 100)}% 100%, 0 100%)` : 
                              'polygon(0 0, 0% 0, 0% 100%, 0 100%)' 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Underweight</span>
                        <span>Healthy</span>
                        <span>Overweight</span>
                        <span>Obese</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Summary</CardTitle>
                  <CardDescription>Overview of your physical activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500">Daily Step Count</span>
                        <Target className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold mr-2">{latestMetric?.steps || 0}</span>
                        <span className="text-gray-500">steps</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${Math.min(100, ((latestMetric?.steps || 0) / 10000) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-gray-500">
                        <span>0</span>
                        <span>Target: 10,000 steps</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500">Calories Burned</span>
                        <Flame className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold mr-2">{latestMetric?.caloriesBurned || 0}</span>
                        <span className="text-gray-500">kcal</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${Math.min(100, ((latestMetric?.caloriesBurned || 0) / 500) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-gray-500">
                        <span>0</span>
                        <span>Target: 500 kcal</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stepData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="steps" 
                          fill="hsl(var(--primary))" 
                          name="Steps"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>Recent physical activities</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingMetrics ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-16 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : metrics && metrics.length > 0 ? (
                    <div className="space-y-4">
                      {metrics.slice(-3).map((metric, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="bg-primary/10 p-2 rounded-lg mr-3">
                              <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">{format(new Date(metric.date), 'MMMM d, yyyy')}</h4>
                              <div className="text-sm text-gray-500">{metric.steps || 0} steps</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{metric.caloriesBurned || 0} kcal</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No Activity Recorded</h3>
                      <p className="text-gray-500 mb-4">Start tracking your daily activities.</p>
                      <Button>Log Activity</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Goals</CardTitle>
                  <CardDescription>Track your activity targets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Step Goal</span>
                      <span className="text-sm text-gray-500">50,000 / 70,000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '71%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Active Days</span>
                      <span className="text-sm text-gray-500">4 / 5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Calories Burned</span>
                      <span className="text-sm text-gray-500">2,500 / 3,500</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '71%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Activity Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex">
                      <span className="bg-primary/10 text-primary p-2 rounded mr-3 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <div>
                        <h4 className="font-medium">Take Regular Breaks</h4>
                        <p className="text-sm text-gray-600">Stand up and walk around for 5-10 minutes every hour.</p>
                      </div>
                    </li>
                    <li className="flex">
                      <span className="bg-primary/10 text-primary p-2 rounded mr-3 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <div>
                        <h4 className="font-medium">Park Further Away</h4>
                        <p className="text-sm text-gray-600">Park your car farther from entrances to add more steps to your day.</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
