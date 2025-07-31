import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  ChevronUp,
  MapPin,
  Shield,
  Send,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  HelpCircle,
  FileText,
  Briefcase,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours.",
        variant: "default"
      });
      
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hi, I need help with the EdTech platform. Could you please assist me?");
    window.open(`https://wa.me/1234567890?text=${message}`, '_blank');
  };

  const contactChannels = [
    {
      icon: Mail,
      label: "Email Support",
      value: "support@edtechplatform.com",
      action: () => window.open("mailto:support@edtechplatform.com", '_self')
    },
    {
      icon: Phone,
      label: "Call Us",
      value: "+1 (555) 123-4567",
      action: () => window.open("tel:+15551234567", '_self')
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Quick Support",
      action: openWhatsApp
    },
    {
      icon: MessageSquare,
      label: "Live Chat",
      value: "Chat Now",
      action: () => toast({ title: "Live Chat", description: "Live chat will be available soon!" })
    }
  ];

  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com/company/edtechplatform", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com/edtechplatform", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/edtechplatform", label: "Instagram" },
    { icon: Facebook, href: "https://facebook.com/edtechplatform", label: "Facebook" },
    { icon: Youtube, href: "https://youtube.com/@edtechplatform", label: "YouTube" }
  ];

  const quickLinks = [
    { icon: HelpCircle, label: "FAQs", href: "/faq" },
    { icon: MessageSquare, label: "Feedback", href: "/feedback" },
    { icon: FileText, label: "Privacy Policy", href: "/privacy" },
    { icon: FileText, label: "Terms & Conditions", href: "/terms" },
    { icon: Briefcase, label: "Careers", href: "/careers" }
  ];

  return (
    <footer className="contact-footer text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Get in Touch</h2>
              <p className="text-gray-300">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="contact-form-input bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="contact-form-input bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <Input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-cyan-500"
                  />

                  <Textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-cyan-500 resize-none"
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white transition-all duration-200 transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information & Links */}
          <div className="space-y-8">
            {/* Contact Channels */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Contact Channels</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactChannels.map((channel, index) => (
                  <div
                    key={index}
                    onClick={channel.action}
                    className="contact-channel-card flex items-center space-x-3 p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="p-2 bg-cyan-600 rounded-lg group-hover:bg-cyan-500 transition-colors">
                      <channel.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{channel.label}</p>
                      <p className="text-gray-400 text-sm">{channel.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-icon p-3 bg-gray-900 rounded-lg hover:bg-cyan-600 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/20 group"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Access Links */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="flex items-center space-x-2 p-2 text-gray-400 hover:text-cyan-400 transition-colors group"
                  >
                    <link.icon className="h-4 w-4" />
                    <span className="text-sm">{link.label}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>

            {/* Platform Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">About Our Platform</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Empowering students and educators with AI-driven learning solutions. 
                  Transform your educational journey with cutting-edge technology and personalized learning experiences.
                </p>
              </div>

              <div className="flex items-start space-x-2 text-gray-400">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p>EdTech Innovation Center</p>
                  <p>123 Learning Street, Education City, EC 12345</p>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-400" />
                <Badge variant="outline" className="border-green-400 text-green-400">
                  🔒 All data securely encrypted
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-gray-400 text-sm">
                © 2024 EdTech Platform. All rights reserved.
              </p>
            </div>
            
            <Button
              onClick={scrollToTop}
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-400 hover:text-white hover:border-cyan-500 hover:bg-cyan-600/10 transition-all duration-200"
            >
              <ChevronUp className="h-4 w-4 mr-1" />
              Back to Top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
