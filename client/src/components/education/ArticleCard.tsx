import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Article } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  onReadMore: (articleId: number) => void;
}

export default function ArticleCard({ article, onReadMore }: ArticleCardProps) {
  // Category badges with specific colors
  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      "Nutrition": "bg-secondary text-white",
      "Workout": "bg-primary text-white",
      "Tips": "bg-accent text-white",
      "Health": "bg-emerald-500 text-white",
      "Motivation": "bg-purple-500 text-white"
    };
    
    return (
      <Badge className={cn(colors[category] || "bg-gray-500 text-white")}>
        {category}
      </Badge>
    );
  };
  
  // Create mock URLs for different categories (in production these would be real images)
  const getImageUrl = (category: string) => {
    const demoImages: Record<string, string> = {
      "Nutrition": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
      "Workout": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
      "Tips": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
      "Health": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
      "Motivation": "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80"
    };
    
    return demoImages[category] || "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=800&q=80";
  };
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div 
        className="w-full h-48 bg-cover bg-center" 
        style={{ backgroundImage: `url(${article.imageUrl || getImageUrl(article.category)})` }}
      />
      <CardContent className="p-5 flex-grow">
        <div className="mb-3">
          {getCategoryBadge(article.category)}
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-3">
          {article.content}
        </p>
      </CardContent>
      <CardFooter className="px-5 pb-5 pt-0 flex justify-between items-center">
        <span className="text-xs text-gray-500">{article.readTime} min read</span>
        <Button 
          variant="link" 
          className="text-primary p-0 h-auto"
          onClick={() => onReadMore(article.id)}
        >
          Read more
        </Button>
      </CardFooter>
    </Card>
  );
}
