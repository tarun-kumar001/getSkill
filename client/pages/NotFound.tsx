import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-surface via-background to-accent/10">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto text-center border-0 bg-background/80 backdrop-blur">
          <CardHeader className="pt-12 pb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 p-5">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-6xl font-bold text-muted-foreground mb-4">
              404
            </CardTitle>
            <CardTitle className="text-3xl lg:text-4xl mb-4">
              Page Not Found
            </CardTitle>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto">
              Oops! The page you're looking for seems to have gone on a learning adventure of its own.
            </p>
          </CardHeader>
          <CardContent className="pb-12">
            <p className="text-muted-foreground mb-8">
              Don't worry, there's still plenty to explore on GETSKILL. Head back to discover amazing courses, 
              AI tools, and learning opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white hover:opacity-90">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link to="/courses">
                <Button variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Courses
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
