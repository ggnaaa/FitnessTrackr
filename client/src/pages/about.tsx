import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6">About FitTrack</h2>

      <div className="mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                <h3 className="text-2xl font-bold text-primary mb-3">Your Personal Fitness Companion</h3>
                <p className="text-gray-600 mb-4">
                  FitTrack is a comprehensive fitness platform designed to help you achieve your health and wellness goals. 
                  We combine personalized tracking, expert recommendations, and educational content to support your unique 
                  fitness journey.
                </p>
                <p className="text-gray-600">
                  Whether you're just starting out or looking to take your fitness to the next level, FitTrack provides 
                  the tools and guidance you need to succeed.
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="w-full max-w-md bg-indigo-50 p-6 rounded-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">15k+</p>
                      <p className="text-sm text-gray-600">Active Users</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">500+</p>
                      <p className="text-sm text-gray-600">Workout Plans</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">1000+</p>
                      <p className="text-sm text-gray-600">Diet Plans</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">24/7</p>
                      <p className="text-sm text-gray-600">Support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <span className="material-icons text-primary text-3xl mb-3">track_changes</span>
            <CardTitle>Track Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Monitor your health metrics like weight, BMI, and activity levels. Set goals and track your progress over time 
              with intuitive visualizations and insights.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <span className="material-icons text-primary text-3xl mb-3">restaurant_menu</span>
            <CardTitle>Personalized Nutrition</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Get diet plans tailored to your body composition, goals, and preferences. Our system adapts to your progress 
              and provides meal suggestions to keep you on track.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <span className="material-icons text-primary text-3xl mb-3">fitness_center</span>
            <CardTitle>Effective Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Access workout routines designed by fitness professionals. From beginner to advanced, our exercise programs 
              are optimized for your fitness level and goals.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg">
            <p className="text-lg text-center italic">
              "To empower individuals to take control of their health through accessible, 
              personalized fitness and nutrition guidance, making a healthy lifestyle achievable for everyone."
            </p>
          </div>
          <div className="mt-6">
            <p className="text-gray-600 mb-4">
              At FitTrack, we believe that fitness is not one-size-fits-all. Each person has unique needs, challenges, 
              and goals. That's why we've built a platform that adapts to you, not the other way around.
            </p>
            <p className="text-gray-600">
              Our team of fitness experts, nutritionists, and developers work together to continuously improve our 
              recommendations and features, ensuring you have the most effective tools to succeed in your health journey.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Meet the Team</CardTitle>
          <CardDescription>The people behind FitTrack</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center">
                <span className="material-icons text-gray-400 text-3xl">person</span>
              </div>
              <h3 className="font-medium">Jamie Wright</h3>
              <p className="text-sm text-gray-500">Founder & CEO</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center">
                <span className="material-icons text-gray-400 text-3xl">person</span>
              </div>
              <h3 className="font-medium">Mark Davis</h3>
              <p className="text-sm text-gray-500">Head of Fitness</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center">
                <span className="material-icons text-gray-400 text-3xl">person</span>
              </div>
              <h3 className="font-medium">Emily Chen</h3>
              <p className="text-sm text-gray-500">Lead Nutritionist</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center">
                <span className="material-icons text-gray-400 text-3xl">person</span>
              </div>
              <h3 className="font-medium">James Wilson</h3>
              <p className="text-sm text-gray-500">CTO</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>We'd love to hear from you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Get in Touch</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="material-icons text-primary mr-2">email</span>
                  <span>support@fittrack.example.com</span>
                </div>
                <div className="flex items-center">
                  <span className="material-icons text-primary mr-2">phone</span>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <span className="material-icons text-primary mr-2">location_on</span>
                  <span>123 Fitness Ave, Health City, CA 90210</span>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3">Follow Us</h3>
                <div className="flex space-x-4">
                  <Button variant="outline" size="icon">
                    <span className="material-icons">facebook</span>
                  </Button>
                  <Button variant="outline" size="icon">
                    <span className="material-icons">alternate_email</span>
                  </Button>
                  <Button variant="outline" size="icon">
                    <span className="material-icons">photo_camera</span>
                  </Button>
                  <Button variant="outline" size="icon">
                    <span className="material-icons">smart_display</span>
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Send us a Message</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Name" 
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder="Email" 
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <input 
                    type="text" 
                    placeholder="Subject" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <textarea 
                    placeholder="Your message" 
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  ></textarea>
                </div>
                <div>
                  <Button className="w-full">Send Message</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
