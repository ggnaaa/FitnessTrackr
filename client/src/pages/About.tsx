import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Award, 
  ChevronRight, 
  Clock, 
  Users, 
  Smile,
  Mail,
  MessageSquare,
  HelpCircle
} from "lucide-react";

export default function About() {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
          Your Personal
          <span className="block text-primary">Fitness Companion</span>
        </h1>
        <p className="text-xl text-gray-500 mb-8">
          FitTrack helps you achieve your health and fitness goals through personalized nutrition and workout plans based on your unique body metrics.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-6">Get Started</Button>
          <Button size="lg" variant="outline" className="text-lg px-6">Learn More</Button>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-2">10,000+</h3>
              <p className="text-gray-500">Active Users</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-2">95%</h3>
              <p className="text-gray-500">Success Rate</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smile className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-2">50K+</h3>
              <p className="text-gray-500">Goals Achieved</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Features Section */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Why Choose FitTrack?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Our comprehensive platform is designed to support your fitness journey from start to finish.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <CardTitle>Personalized Plans</CardTitle>
              <CardDescription>
                Custom workout and nutrition plans based on your body metrics, goals, and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Tailored exercise routines</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Customized meal plans</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Adaptive goals based on progress</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <CardTitle>Comprehensive Tracking</CardTitle>
              <CardDescription>
                Track your progress, health metrics, and fitness achievements in one place.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Weight and body metrics</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Nutritional intake</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Workout performance</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <CardTitle>Educational Resources</CardTitle>
              <CardDescription>
                Access to a wealth of fitness and nutrition knowledge to keep you informed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Expert articles and tips</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Video demonstrations</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Nutritional guides</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">How FitTrack Works</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Our simple 4-step process helps you achieve your fitness goals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center relative">
            <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
              1
            </div>
            <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gray-200 z-0 -ml-3"></div>
            <h3 className="font-bold mb-2">Create Account</h3>
            <p className="text-gray-500">Sign up and fill in your basic information and fitness goals.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm text-center relative">
            <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
              2
            </div>
            <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gray-200 z-0 -ml-3"></div>
            <h3 className="font-bold mb-2">Track Your Metrics</h3>
            <p className="text-gray-500">Input your health data and track your progress regularly.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm text-center relative">
            <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
              3
            </div>
            <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gray-200 z-0 -ml-3"></div>
            <h3 className="font-bold mb-2">Get Recommendations</h3>
            <p className="text-gray-500">Receive personalized workout and diet plans based on your data.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4">
              4
            </div>
            <h3 className="font-bold mb-2">Achieve Your Goals</h3>
            <p className="text-gray-500">Follow your plan, track your progress, and reach your fitness targets.</p>
          </div>
        </div>
      </div>
      
      {/* Team Section */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Our team of fitness experts, nutritionists, and developers work together to provide the best experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg">Sarah Johnson</h3>
              <p className="text-gray-500 mb-4">Founder & CEO</p>
              <p className="text-sm text-gray-600">
                Former professional athlete with a passion for helping others achieve their fitness goals.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" />
                <AvatarFallback>MM</AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg">Michael Martinez</h3>
              <p className="text-gray-500 mb-4">Head of Nutrition</p>
              <p className="text-sm text-gray-600">
                Registered dietitian with over 10 years of experience in sports nutrition and weight management.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" />
                <AvatarFallback>JT</AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg">James Thompson</h3>
              <p className="text-gray-500 mb-4">Fitness Director</p>
              <p className="text-sm text-gray-600">
                Certified personal trainer specializing in strength training and functional fitness.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="https://images.unsplash.com/photo-1554727242-741c14fa561c?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" />
                <AvatarFallback>EC</AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg">Emily Chen</h3>
              <p className="text-gray-500 mb-4">Lead Developer</p>
              <p className="text-sm text-gray-600">
                Software engineer focused on creating intuitive and user-friendly fitness applications.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Don't just take our word for it - here's what people are saying about FitTrack
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">Jessica Davis</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "FitTrack has completely transformed my approach to fitness. The personalized recommendations helped me lose 20 pounds in 3 months!"
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" />
                  <AvatarFallback>RB</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">Robert Brown</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As someone who was always intimidated by fitness apps, I found FitTrack incredibly user-friendly. The progress tracking keeps me motivated daily."
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarImage src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" />
                  <AvatarFallback>AW</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">Alicia Wong</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The nutrition advice has been a game-changer for me. I've learned so much about proper eating habits while achieving my weight goals."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Find answers to common questions about FitTrack
          </p>
        </div>
        
        <Tabs defaultValue="general" className="max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start">
                  <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>What is FitTrack?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  FitTrack is a comprehensive fitness platform that provides personalized workout and nutrition recommendations based on your unique body metrics, goals, and preferences. It helps you track your progress and make data-driven decisions about your health.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start">
                  <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Do I need any special equipment?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  No special equipment is required to use FitTrack. Our workouts can be adapted to your available equipment and environment. For the most accurate tracking, a scale for weight measurements is recommended.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start">
                  <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Is FitTrack suitable for beginners?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Absolutely! FitTrack is designed for users of all fitness levels. Our personalized recommendations take into account your current fitness level and adjust accordingly. We provide detailed instructions and demonstrations for all exercises.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="features" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start">
                  <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>How are the workout plans created?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our workout plans are created based on your fitness goals, current fitness level, available equipment, and any limitations or preferences you have. We use algorithms developed by fitness professionals to ensure balanced and effective routines.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start">
                  <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>How accurate are the calorie calculations?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our calorie calculations use industry-standard formulas based on your body metrics, activity level, and goals. While no calculation is 100% precise, our estimates provide a solid foundation for nutrition planning. The app will also adjust based on your progress.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start">
                  <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Can I track my progress over time?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes! FitTrack provides comprehensive progress tracking through charts and statistics. You can monitor changes in weight, body composition, workout performance, and nutrition over time, helping you stay motivated and make adjustments as needed.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start">
                  <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>How do I create an account?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Creating an account is simple. Click the "Sign Up" button, enter your email address and create a password. You'll then be guided through a short questionnaire about your fitness goals and preferences to help personalize your experience.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start">
                  <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Is my personal data secure?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Absolutely. We take data security very seriously. All personal information is encrypted and stored securely. We never share your data with third parties without your explicit consent. You can review our privacy policy for more details.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start">
                  <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Can I delete my account?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, you can delete your account at any time from the account settings page. This will permanently remove all your personal information and data from our servers. We provide an option to download your data before deletion if you'd like to keep a copy.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Contact Section */}
      <div className="mb-16">
        <div className="bg-primary text-white rounded-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-2/3 p-8">
              <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
              <p className="mb-6 text-primary-foreground/90">
                Have questions or feedback? We'd love to hear from you. Contact our team for support.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">Email Us</h3>
                    <p className="text-primary-foreground/90">support@fittrack.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MessageSquare className="h-6 w-6 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">Live Chat</h3>
                    <p className="text-primary-foreground/90">Available Mon-Fri, 9am-5pm</p>
                  </div>
                </div>
              </div>
              
              <Button variant="secondary">Contact Support</Button>
            </div>
            <div className="hidden md:block md:w-1/3 bg-[url('https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center" />
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-4">Start Your Fitness Journey Today</h2>
        <p className="text-gray-500 mb-8">
          Join thousands of users who have already transformed their health and fitness with FitTrack
        </p>
        <Button size="lg" className="text-lg px-8">Get Started Now</Button>
      </div>
    </div>
  );
}
