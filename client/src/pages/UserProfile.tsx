import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, HealthMetric, insertUserSchema, insertHealthMetricSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Calculator } from "@/lib/fitness";
import {
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  User as UserIcon, 
  Edit, 
  Save, 
  Bell, 
  Lock, 
  Settings, 
  Weight, 
  Ruler, 
  Flame, 
  Calendar,
  Activity,
  Clock,
  HeartPulse, 
  Mail
} from "lucide-react";

// Extended schema with additional validation
const profileFormSchema = insertUserSchema.extend({
  height: z.number().min(100, "Height must be at least 100cm").max(250, "Height must be less than 250cm"),
  age: z.number().min(10, "Age must be at least 10").max(120, "Age must be less than 120"),
  gender: z.enum(["male", "female", "other"]),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very active"]),
  goal: z.enum(["weight loss", "maintenance", "muscle gain"])
});

// Health metrics form schema
const healthMetricsFormSchema = insertHealthMetricSchema.extend({
  date: z.date()
});

export default function UserProfile() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [healthMetricDialog, setHealthMetricDialog] = useState(false);
  
  // For demo purposes using a static user ID
  const userId = 1;
  
  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery<User>({ 
    queryKey: [`/api/users/${userId}`],
  });
  
  // Fetch latest health metric
  const { data: latestMetric, isLoading: isLoadingMetric } = useQuery<HealthMetric>({ 
    queryKey: [`/api/health-metrics/latest/${userId}`],
  });
  
  // Fetch all health metrics
  const { data: metrics, isLoading: isLoadingMetrics } = useQuery<HealthMetric[]>({
    queryKey: ['/api/health-metrics/user', userId],
  });
  
  // Profile update form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.username || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      password: "", // We don't show the current password
      height: user?.height || 170,
      age: user?.age || 30,
      gender: user?.gender as any || "male",
      activityLevel: user?.activityLevel as any || "moderate",
      goal: user?.goal as any || "maintenance"
    }
  });
  
  // Update form values when user data is loaded
  React.useEffect(() => {
    if (user) {
      profileForm.reset({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName || "",
        email: user.email,
        password: "", // Don't populate password
        height: user.height || 170,
        age: user.age || 30,
        gender: user.gender as any || "male",
        activityLevel: user.activityLevel as any || "moderate",
        goal: user.goal as any || "maintenance"
      });
    }
  }, [user, profileForm]);
  
  // Health metrics form
  const healthMetricsForm = useForm<z.infer<typeof healthMetricsFormSchema>>({
    resolver: zodResolver(healthMetricsFormSchema),
    defaultValues: {
      userId: userId,
      date: new Date(),
      weight: latestMetric?.weight || 75,
      bmi: latestMetric?.bmi || 0,
      bodyFat: latestMetric?.bodyFat || 0,
      waterIntake: latestMetric?.waterIntake || 0,
      caloriesConsumed: latestMetric?.caloriesConsumed || 0,
      caloriesBurned: latestMetric?.caloriesBurned || 0,
      steps: latestMetric?.steps || 0,
      notes: ""
    }
  });
  
  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof profileFormSchema>) => {
      const response = await apiRequest("PATCH", `/api/users/${userId}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update profile: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  // Mutation for adding health metrics
  const addHealthMetricMutation = useMutation({
    mutationFn: async (data: z.infer<typeof healthMetricsFormSchema>) => {
      // Calculate BMI if not provided
      if (!data.bmi && data.weight && data.height) {
        const calculator = new Calculator();
        data.bmi = calculator.calculateBMI(data.weight, data.height / 100);
      }
      
      const response = await apiRequest("POST", "/api/health-metrics", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Health metrics recorded",
        description: "Your health metrics have been recorded successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/health-metrics/user', userId] });
      queryClient.invalidateQueries({ queryKey: [`/api/health-metrics/latest/${userId}`] });
      setHealthMetricDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to record health metrics: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Calculate BMI when weight or height changes
  React.useEffect(() => {
    const subscription = healthMetricsForm.watch((value, { name }) => {
      if ((name === "weight" || name === "height") && value.weight && value.height) {
        const calculator = new Calculator();
        const height = parseFloat(String(value.height)) / 100; // Convert to meters
        const weight = parseFloat(String(value.weight));
        const bmi = calculator.calculateBMI(weight, height);
        healthMetricsForm.setValue("bmi", bmi);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [healthMetricsForm]);
  
  // Handle profile form submission
  const onSubmitProfile = (data: z.infer<typeof profileFormSchema>) => {
    updateProfileMutation.mutate(data);
  };
  
  // Handle health metrics form submission
  const onSubmitHealthMetrics = (data: z.infer<typeof healthMetricsFormSchema>) => {
    addHealthMetricMutation.mutate(data);
  };
  
  // Derive user initials for avatar
  const userInitials = user ? `${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ''}` : '';
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-gray-500 mt-1">Manage your account settings and health data</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={healthMetricDialog} onOpenChange={setHealthMetricDialog}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-white">
                <Weight className="h-5 w-5 mr-2" />
                Add Health Check-in
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Health Check-in</DialogTitle>
                <DialogDescription>
                  Record your current health metrics to track your progress
                </DialogDescription>
              </DialogHeader>
              
              <Form {...healthMetricsForm}>
                <form onSubmit={healthMetricsForm.handleSubmit(onSubmitHealthMetrics)} className="space-y-4">
                  <FormField
                    control={healthMetricsForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={healthMetricsForm.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={healthMetricsForm.control}
                      name="bodyFat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Body Fat (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={healthMetricsForm.control}
                      name="waterIntake"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Water Intake (L)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={healthMetricsForm.control}
                      name="steps"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Steps</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={healthMetricsForm.control}
                      name="caloriesConsumed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Calories Consumed</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={healthMetricsForm.control}
                      name="caloriesBurned"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Calories Burned</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={healthMetricsForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Any additional notes about your health check-in</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={addHealthMetricMutation.isPending}
                    >
                      {addHealthMetricMutation.isPending ? "Saving..." : "Save Metrics"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
                </Avatar>
                
                {isLoadingUser ? (
                  <>
                    <Skeleton className="h-6 w-32 mb-1" />
                    <Skeleton className="h-4 w-24 mb-4" />
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold mb-1">{user?.firstName} {user?.lastName}</h2>
                    <p className="text-gray-500 mb-4">{user?.email}</p>
                  </>
                )}
                
                <div className="w-full space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("profile")}
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("health")}
                  >
                    <HeartPulse className="mr-2 h-4 w-4" />
                    Health Data
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("goals")}
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Goals & Progress
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Stats Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingMetric ? (
                <>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </>
              ) : latestMetric ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center">
                      <Weight className="h-4 w-4 mr-2" />
                      Weight
                    </span>
                    <span className="font-medium">{latestMetric.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center">
                      <Activity className="h-4 w-4 mr-2" />
                      BMI
                    </span>
                    <span className="font-medium">{latestMetric.bmi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center">
                      <Flame className="h-4 w-4 mr-2" />
                      Daily Calories
                    </span>
                    <span className="font-medium">{latestMetric.caloriesConsumed || 0}</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No health data recorded yet</p>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setHealthMetricDialog(true)}
                  >
                    Add Health Check-in
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Manage your personal details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Basic Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={profileForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Leave blank to keep current password" {...field} />
                              </FormControl>
                              <FormDescription>Leave blank if you don't want to change your password</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Health Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="age"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    onChange={(e) => field.onChange(parseInt(e.target.value))} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="height"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Height (cm)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="activityLevel"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Activity Level</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select activity level" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                                    <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                                    <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                                    <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                                    <SelectItem value="very active">Very Active (2x per day)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>This helps calculate your caloric needs</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="goal"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Fitness Goal</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select goal" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="weight loss">Weight Loss</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                    <SelectItem value="muscle gain">Muscle Gain</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>This helps personalize your diet and workout plans</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full md:w-auto" 
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? (
                          <>Updating...</>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="health">
              <Card>
                <CardHeader>
                  <CardTitle>Health Data History</CardTitle>
                  <CardDescription>
                    View and manage your recorded health metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingMetrics ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : metrics && metrics.length > 0 ? (
                    <div className="space-y-6">
                      <div className="rounded-md border">
                        <div className="grid grid-cols-7 p-4 text-sm font-medium border-b">
                          <div>Date</div>
                          <div>Weight</div>
                          <div>BMI</div>
                          <div>Body Fat</div>
                          <div>Water</div>
                          <div>Cal In</div>
                          <div>Cal Out</div>
                        </div>
                        {metrics.map((metric, index) => (
                          <div key={index} className="grid grid-cols-7 p-4 text-sm border-b last:border-0">
                            <div className="font-medium">
                              {new Date(metric.date).toLocaleDateString()}
                            </div>
                            <div>{metric.weight} kg</div>
                            <div>{metric.bmi}</div>
                            <div>{metric.bodyFat ? `${metric.bodyFat}%` : '-'}</div>
                            <div>{metric.waterIntake ? `${metric.waterIntake}L` : '-'}</div>
                            <div>{metric.caloriesConsumed || '-'}</div>
                            <div>{metric.caloriesBurned || '-'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No Health Records</h3>
                      <p className="text-gray-500 mb-4">Start tracking your health metrics to see your progress over time.</p>
                      <Button onClick={() => setHealthMetricDialog(true)}>
                        Add Health Check-in
                      </Button>
                    </div>
                  )}
                </CardContent>
                {metrics && metrics.length > 0 && (
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      Export Data
                    </Button>
                    <Button variant="default" size="sm" onClick={() => setHealthMetricDialog(true)}>
                      Add New Entry
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="goals">
              <Card>
                <CardHeader>
                  <CardTitle>Goals & Progress</CardTitle>
                  <CardDescription>
                    Track your progress towards your fitness goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-medium text-lg mb-4">Current Goals</h3>
                      
                      {isLoadingUser ? (
                        <div className="space-y-4">
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-8 w-full" />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="bg-primary/10 p-2 rounded-full mr-4">
                                <Target className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">Primary Goal</h4>
                                <p className="text-gray-500">
                                  {user?.goal === "weight loss" ? "Weight Loss" : 
                                   user?.goal === "muscle gain" ? "Muscle Gain" : "Maintenance"}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {user?.goal}
                            </Badge>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="bg-primary/10 p-2 rounded-full mr-4">
                                <Activity className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">Activity Level</h4>
                                <p className="text-gray-500">
                                  {user?.activityLevel === "sedentary" ? "Little or no exercise" :
                                   user?.activityLevel === "light" ? "Light exercise 1-3 days/week" :
                                   user?.activityLevel === "moderate" ? "Moderate exercise 3-5 days/week" :
                                   user?.activityLevel === "active" ? "Hard exercise 6-7 days/week" :
                                   "Very hard exercise & physical job"}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {user?.activityLevel?.replace(" ", "-")}
                            </Badge>
                          </div>
                          
                          <Button variant="outline" onClick={() => setActiveTab("profile")}>
                            <Edit className="h-4 w-4 mr-2" />
                            Adjust Goals
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-medium text-lg mb-4">Daily Targets</h3>
                      
                      {isLoadingUser || isLoadingMetric ? (
                        <div className="space-y-4">
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-8 w-full" />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="bg-primary/10 p-2 rounded-full mr-4">
                                <Flame className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">Daily Calories</h4>
                                <p className="text-gray-500">
                                  Target calorie intake based on your goals
                                </p>
                              </div>
                            </div>
                            <Badge>
                              {latestMetric?.caloriesConsumed || 2000} kcal
                            </Badge>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="bg-primary/10 p-2 rounded-full mr-4">
                                <Weight className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">Target Weight</h4>
                                <p className="text-gray-500">
                                  {user?.goal === "weight loss" ? "Reduce current weight" : 
                                   user?.goal === "muscle gain" ? "Increase lean muscle mass" : 
                                   "Maintain current weight"}
                                </p>
                              </div>
                            </div>
                            <Badge>
                              {user?.goal === "weight loss" ? 
                                `${(latestMetric?.weight || 75) - 5} kg` : 
                               user?.goal === "muscle gain" ? 
                                `${(latestMetric?.weight || 75) + 3} kg` : 
                                `${latestMetric?.weight || 75} kg`}
                            </Badge>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="bg-primary/10 p-2 rounded-full mr-4">
                                <Clock className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">Workout Schedule</h4>
                                <p className="text-gray-500">
                                  Recommended workout frequency
                                </p>
                              </div>
                            </div>
                            <Badge>
                              {user?.activityLevel === "sedentary" ? "2 days/week" :
                               user?.activityLevel === "light" ? "3 days/week" :
                               user?.activityLevel === "moderate" ? "4 days/week" :
                               user?.activityLevel === "active" ? "5 days/week" :
                               "6 days/week"}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and notification settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-lg mb-4">Notification Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Bell className="h-4 w-4" />
                            <span>Daily Reminders</span>
                          </div>
                          <Switch defaultChecked id="daily-reminders" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>Email Notifications</span>
                          </div>
                          <Switch id="email-notifications" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Activity className="h-4 w-4" />
                            <span>Weekly Progress Summary</span>
                          </div>
                          <Switch defaultChecked id="progress-summary" />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium text-lg mb-4">Account Security</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Lock className="h-4 w-4" />
                            <span>Two-Factor Authentication</span>
                          </div>
                          <Button variant="outline" size="sm">Enable</Button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Settings className="h-4 w-4" />
                            <span>Change Password</span>
                          </div>
                          <Button variant="outline" size="sm">Update</Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium text-lg mb-4">Data Management</h3>
                      <div className="space-y-4">
                        <Button variant="outline">Export All Data</Button>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
