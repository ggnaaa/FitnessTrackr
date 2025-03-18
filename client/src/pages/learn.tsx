import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/dashboard/article-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Learn() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [articleDialogOpen, setArticleDialogOpen] = useState(false);

  // Fetch articles
  const { data: articles, isLoading } = useQuery({
    queryKey: ['/api/articles', selectedCategory ? { category: selectedCategory } : undefined],
  });

  const handleReadArticle = (article: any) => {
    setSelectedArticle(article);
    setArticleDialogOpen(true);
  };

  // Categories for filtering
  const categories = [
    { id: undefined, label: "All" },
    { id: "Nutrition", label: "Nutrition" },
    { id: "Exercise", label: "Exercise" },
    { id: "Fitness", label: "Fitness" },
    { id: "Meal Prep", label: "Meal Prep" },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold">Learn</h2>
        <div className="mt-4 md:mt-0">
          <Tabs
            value={selectedCategory || "undefined"}
            onValueChange={(value) => setSelectedCategory(value === "undefined" ? undefined : value)}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-5">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id || "all"}
                  value={category.id?.toString() || "undefined"}
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <span className="material-icons animate-spin text-gray-400">refresh</span>
          <p className="text-sm text-gray-500 mt-2">Loading articles...</p>
        </div>
      ) : articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article: any) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              imageUrl={article.imageUrl}
              category={article.category}
              title={article.title}
              summary={article.summary}
              readTime={article.readTime}
              onReadClick={() => handleReadArticle(article)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-gray-200 rounded-lg">
          <span className="material-icons text-gray-400 mb-2">menu_book</span>
          <p className="text-gray-500">No articles found</p>
          {selectedCategory && (
            <p className="text-sm text-gray-400 mt-1">
              Try selecting a different category
            </p>
          )}
        </div>
      )}

      {/* Article learning sections */}
      <div className="mt-10 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Fitness Fundamentals</CardTitle>
            <CardDescription>Essential knowledge for your fitness journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 flex flex-col">
                <span className="material-icons text-primary text-2xl mb-2">timer</span>
                <h3 className="font-medium mb-1">Consistency is Key</h3>
                <p className="text-sm text-gray-600 flex-grow">Regular, consistent exercise is more effective than sporadic intense workouts.</p>
                <Button variant="link" className="p-0 h-auto mt-2 justify-start" onClick={() => alert("This would open an article about consistency")}>
                  Learn more
                </Button>
              </div>
              <div className="border rounded-lg p-4 flex flex-col">
                <span className="material-icons text-primary text-2xl mb-2">hotel</span>
                <h3 className="font-medium mb-1">Recovery Matters</h3>
                <p className="text-sm text-gray-600 flex-grow">Proper rest and recovery are essential components of any successful fitness program.</p>
                <Button variant="link" className="p-0 h-auto mt-2 justify-start" onClick={() => alert("This would open an article about recovery")}>
                  Learn more
                </Button>
              </div>
              <div className="border rounded-lg p-4 flex flex-col">
                <span className="material-icons text-primary text-2xl mb-2">nutrition</span>
                <h3 className="font-medium mb-1">Nutrition & Exercise</h3>
                <p className="text-sm text-gray-600 flex-grow">The synergy between proper nutrition and exercise amplifies your fitness results.</p>
                <Button variant="link" className="p-0 h-auto mt-2 justify-start" onClick={() => alert("This would open an article about nutrition and exercise")}>
                  Learn more
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fitness Myths Debunked</CardTitle>
            <CardDescription>Separating fact from fiction in the fitness world</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <span className="material-icons text-red-500 mr-3">cancel</span>
                  <div>
                    <h3 className="font-medium">Myth: Spot reduction works</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      You cannot reduce fat in specific areas by targeting exercises to those spots. Fat loss occurs throughout the body as determined by genetics and overall calorie deficit.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <span className="material-icons text-red-500 mr-3">cancel</span>
                  <div>
                    <h3 className="font-medium">Myth: More exercise is always better</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Overtraining can lead to injuries, hormonal imbalances, and decreased performance. Quality and recovery are as important as quantity.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <span className="material-icons text-red-500 mr-3">cancel</span>
                  <div>
                    <h3 className="font-medium">Myth: Carbs are bad for you</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Carbohydrates are a primary energy source, especially for high-intensity exercise. Quality and quantity matter more than eliminating them entirely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Video Resources</CardTitle>
            <CardDescription>Recommended instructional videos to enhance your fitness knowledge</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-200 h-40 flex items-center justify-center">
                  <span className="material-icons text-4xl">play_circle</span>
                </div>
                <div className="p-4">
                  <h3 className="font-medium">Proper Form Guide</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Learn the correct technique for common exercises to maximize results and prevent injuries.
                  </p>
                  <Button className="mt-3">Watch Now</Button>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-200 h-40 flex items-center justify-center">
                  <span className="material-icons text-4xl">play_circle</span>
                </div>
                <div className="p-4">
                  <h3 className="font-medium">Nutrition Essentials</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Understanding macronutrients, meal timing, and how to fuel your body for optimal performance.
                  </p>
                  <Button className="mt-3">Watch Now</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Article Dialog */}
      <Dialog open={articleDialogOpen} onOpenChange={setArticleDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedArticle?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <img
              src={selectedArticle?.imageUrl}
              alt={selectedArticle?.title}
              className="w-full h-60 object-cover rounded-md mb-4"
            />
            <div className="flex items-center mb-4">
              <span className="text-xs font-medium text-primary bg-indigo-50 px-2 py-1 rounded-full">
                {selectedArticle?.category}
              </span>
              <span className="ml-3 text-xs text-gray-500">{selectedArticle?.readTime} min read</span>
            </div>
            <div className="prose max-w-none">
              <p>{selectedArticle?.summary}</p>
              <p className="mt-4">
                {selectedArticle?.content || 
                  "The full article content would be displayed here. This would include detailed information, tips, guidelines, and potentially images or diagrams to illustrate the concepts being discussed."}
              </p>
              <p className="mt-4">
                Articles would typically include sections covering background information, practical advice, scientific evidence supporting the recommendations, and actionable steps the reader can take to improve their fitness and health.
              </p>
              <h3 className="mt-6">Key Takeaways</h3>
              <ul>
                <li>Important point 1 related to the article topic</li>
                <li>Important point 2 related to the article topic</li>
                <li>Important point 3 related to the article topic</li>
                <li>Important point 4 related to the article topic</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
