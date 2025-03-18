import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ArticleCard from "@/components/education/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Search, Filter } from "lucide-react";

export default function Education() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [articleDialog, setArticleDialog] = useState<{ open: boolean, article: Article | null }>({
    open: false,
    article: null
  });
  
  // Fetch articles
  const { data: articles, isLoading } = useQuery<Article[]>({ 
    queryKey: ['/api/articles'],
  });
  
  // Filter articles based on category and search query
  const filteredArticles = articles?.filter(article => {
    const matchesCategory = activeTab === "all" || article.category.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  // Function to handle article read more click
  const handleReadArticle = (articleId: number) => {
    if (articles) {
      const article = articles.find(a => a.id === articleId);
      if (article) {
        setArticleDialog({
          open: true,
          article
        });
      }
    }
  };
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Learn & Improve</h1>
          <p className="text-gray-500 mt-1">Educational resources to help you reach your fitness goals</p>
        </div>
        <div className="w-full md:w-auto flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-5 mb-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="workout">Workout</TabsTrigger>
          <TabsTrigger value="tips">Tips</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-96 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredArticles && filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  onReadMore={handleReadArticle} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">No articles found</h2>
              {searchQuery ? (
                <p className="text-gray-500 max-w-md mx-auto">
                  We couldn't find any articles matching "{searchQuery}". Try different keywords or browse all articles.
                </p>
              ) : (
                <p className="text-gray-500 max-w-md mx-auto">
                  There are no articles in this category yet. Check back soon for new content!
                </p>
              )}
              {searchQuery && (
                <Button 
                  className="mt-4" 
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Article Reading Dialog */}
      <Dialog 
        open={articleDialog.open} 
        onOpenChange={(open) => setArticleDialog(prev => ({ ...prev, open }))}
      >
        <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
          {articleDialog.article && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {articleDialog.article.title}
                </DialogTitle>
                <DialogDescription className="text-sm">
                  {articleDialog.article.category} • {articleDialog.article.readTime} min read
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <div 
                  className="w-full h-56 bg-cover bg-center mb-4 rounded-lg"
                  style={{ 
                    backgroundImage: `url(${articleDialog.article.imageUrl || 
                      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=800&q=80'})` 
                  }}
                />
                <div className="prose prose-sm max-w-none">
                  {articleDialog.article.content.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Featured Section */}
      <div className="mt-16">
        <h2 className="text-xl font-bold mb-6">Featured Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-primary/5 border-none hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Nutrition Basics</CardTitle>
              <CardDescription>Understanding the fundamentals of nutrition</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Macronutrients 101</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Portion Control</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Meal Timing</span>
                </li>
              </ul>
              <Button variant="link" className="text-primary p-0 mt-4">
                Explore Nutrition
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary/5 border-none hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Effective Workouts</CardTitle>
              <CardDescription>Get the most out of your training sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Strength Training Principles</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Cardio vs. HIIT</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Recovery Techniques</span>
                </li>
              </ul>
              <Button variant="link" className="text-secondary p-0 mt-4">
                Explore Workouts
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-accent/5 border-none hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Mental Wellness</CardTitle>
              <CardDescription>Strategies for mind-body balance</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Stress Management</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Sleep Optimization</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Mindfulness Techniques</span>
                </li>
              </ul>
              <Button variant="link" className="text-accent p-0 mt-4">
                Explore Mental Wellness
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Subscription Card */}
      <Card className="mt-16 bg-primary text-white">
        <div className="md:flex items-center">
          <div className="md:w-2/3 p-8">
            <CardTitle className="text-2xl mb-2">Stay Updated with Fitness Tips</CardTitle>
            <CardDescription className="text-primary-foreground/90 mb-6">
              Get weekly articles and tips directly to your inbox to help you achieve your fitness goals.
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white"
              />
              <Button variant="secondary" className="shrink-0">
                Subscribe
              </Button>
            </div>
          </div>
          <div className="hidden md:block md:w-1/3 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center h-72 rounded-r-xl" />
        </div>
      </Card>
    </div>
  );
}
