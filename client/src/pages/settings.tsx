import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectTrigger, 
  SelectContent, 
  SelectItem, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  
  // User profile states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  // Notification preferences states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [mealReminders, setMealReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [isUpdatingNotifications, setIsUpdatingNotifications] = useState(false);
  
  // Units preferences states
  const [weightUnit, setWeightUnit] = useState("kg");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [isUpdatingUnits, setIsUpdatingUnits] = useState(false);

  // Fetch user data
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/users/1'],
    onSuccess: (data) => {
      setName(data.name || "");
      setEmail(data.email || "");
      setAvatar(data.avatar || "");
    }
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    
    // Simulated profile update
    setTimeout(() => {
      setIsUpdatingProfile(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    }, 1000);
  };

  const handleUpdateNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingNotifications(true);
    
    // Simulated notification settings update
    setTimeout(() => {
      setIsUpdatingNotifications(false);
      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been saved.",
      });
    }, 1000);
  };

  const handleUpdateUnits = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingUnits(true);
    
    // Simulated units settings update
    setTimeout(() => {
      setIsUpdatingUnits(false);
      toast({
        title: "Units preferences updated",
        description: "Your measurement units have been updated.",
      });
    }, 1000);
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="units">Units</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>User Profile</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="py-6 text-center">
                      <span className="material-icons animate-spin text-gray-400">refresh</span>
                      <p className="text-sm text-gray-500 mt-2">Loading profile...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="avatar">Avatar URL</Label>
                        <Input 
                          id="avatar" 
                          value={avatar} 
                          onChange={(e) => setAvatar(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          disabled={isUpdatingProfile}
                        >
                          {isUpdatingProfile ? (
                            <>
                              <span className="material-icons animate-spin mr-2">refresh</span>
                              Saving...
                            </>
                          ) : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Preview</CardTitle>
                  <CardDescription>How others see you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 mb-4">
                      <img
                        src={avatar || "https://via.placeholder.com/100"}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-medium">{name || "Your Name"}</h3>
                    <p className="text-sm text-gray-500 mt-1">{email || "email@example.com"}</p>
                    
                    <div className="mt-4 w-full bg-gray-100 rounded-lg p-3">
                      <h4 className="text-sm font-medium">Member Since</h4>
                      <p className="text-sm text-gray-500">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Today"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateNotifications} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive email updates about your account</p>
                    </div>
                    <Switch 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Workout Reminders</h3>
                      <p className="text-sm text-gray-500">Get notified about scheduled workouts</p>
                    </div>
                    <Switch 
                      checked={workoutReminders} 
                      onCheckedChange={setWorkoutReminders} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Meal Reminders</h3>
                      <p className="text-sm text-gray-500">Get notified about meal times</p>
                    </div>
                    <Switch 
                      checked={mealReminders} 
                      onCheckedChange={setMealReminders} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Weekly Progress Reports</h3>
                      <p className="text-sm text-gray-500">Receive a summary of your weekly progress</p>
                    </div>
                    <Switch 
                      checked={weeklyReports} 
                      onCheckedChange={setWeeklyReports} 
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isUpdatingNotifications}
                  >
                    {isUpdatingNotifications ? (
                      <>
                        <span className="material-icons animate-spin mr-2">refresh</span>
                        Saving...
                      </>
                    ) : "Save Preferences"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="units">
          <Card>
            <CardHeader>
              <CardTitle>Measurement Units</CardTitle>
              <CardDescription>Set your preferred measurement units</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateUnits} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="weightUnit">Weight Unit</Label>
                    <Select 
                      value={weightUnit} 
                      onValueChange={setWeightUnit}
                    >
                      <SelectTrigger id="weightUnit">
                        <SelectValue placeholder="Select weight unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="lb">Pounds (lb)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="heightUnit">Height Unit</Label>
                    <Select 
                      value={heightUnit} 
                      onValueChange={setHeightUnit}
                    >
                      <SelectTrigger id="heightUnit">
                        <SelectValue placeholder="Select height unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">Centimeters (cm)</SelectItem>
                        <SelectItem value="ft">Feet and Inches (ft/in)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isUpdatingUnits}
                  >
                    {isUpdatingUnits ? (
                      <>
                        <span className="material-icons animate-spin mr-2">refresh</span>
                        Saving...
                      </>
                    ) : "Save Units"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
              <CardDescription>Manage your account security and data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Change Password</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input 
                        id="currentPassword" 
                        type="password" 
                        placeholder="Enter your current password"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword" 
                        type="password" 
                        placeholder="Enter a new password"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        placeholder="Confirm your new password"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>
                        Change Password
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-3">Privacy Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Data Analytics Consent</h4>
                        <p className="text-sm text-gray-500">Allow us to use your data for service improvements</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Marketing Communications</h4>
                        <p className="text-sm text-gray-500">Receive updates about new features and offers</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="font-medium text-red-600 mb-3">Danger Zone</h3>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-medium text-red-700">Delete Account</h4>
                    <p className="text-sm text-red-600 mt-1 mb-3">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="destructive">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
