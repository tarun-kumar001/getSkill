import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, ArrowLeft, FileText, Shield, Briefcase } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface PlaceholderPageProps {
  title?: string;
  description?: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps = {}) {
  const location = useLocation();

  // Define content based on the current path
  const getPageContent = () => {
    switch (location.pathname) {
      case '/privacy':
        return {
          title: 'Privacy Policy',
          description: 'Your privacy and data security are our top priorities.',
          icon: Shield,
          color: 'from-green-500 to-green-600'
        };
      case '/terms':
        return {
          title: 'Terms & Conditions',
          description: 'Our terms of service and platform usage guidelines.',
          icon: FileText,
          color: 'from-blue-500 to-blue-600'
        };
      case '/careers':
        return {
          title: 'Career Opportunities',
          description: 'Join our team and help shape the future of education.',
          icon: Briefcase,
          color: 'from-purple-500 to-purple-600'
        };
      default:
        return {
          title: title || 'Coming Soon',
          description: description || 'This page is under development.',
          icon: Construction,
          color: 'from-gray-500 to-gray-600'
        };
    }
  };

  const content = getPageContent();
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto text-center border-0 bg-white/80 backdrop-blur shadow-xl">
          <CardHeader className="pt-12 pb-8">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${content.color} p-5`}>
              <content.icon className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl lg:text-4xl mb-4 text-gray-900">
              {content.title}
            </CardTitle>
            <p className="text-xl text-gray-600 max-w-lg mx-auto">
              {content.description}
            </p>
          </CardHeader>
          <CardContent className="pb-12">
            <p className="text-gray-600 mb-8">
              This page is currently under development. We're working hard to bring you an amazing experience.
              Continue exploring our platform or check back soon for updates!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white hover:opacity-90">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white"
                onClick={() => window.open('mailto:support@edtechplatform.com?subject=Stay Updated Request')}
              >
                Stay Updated
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
