import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { HelpCircle, MessageCircle, Mail } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      question: "How do I join a live class?",
      answer: "To join a live class, go to your dashboard and click on 'Live Classes'. Find the class you want to join and click the 'Join' button. Make sure you have a stable internet connection and allow camera/microphone access when prompted."
    },
    {
      question: "Can I access recorded classes later?",
      answer: "Yes! All live classes are automatically recorded (if enabled by the instructor). You can access recordings from your dashboard under 'My Classes' or 'Course Materials' section."
    },
    {
      question: "What technical requirements do I need?",
      answer: "You need a modern web browser (Chrome, Firefox, Safari, or Edge), stable internet connection (minimum 2 Mbps), and a device with camera/microphone for interactive sessions."
    },
    {
      question: "How does the mock interview feature work?",
      answer: "Our AI-powered mock interview system asks you relevant questions based on your field and experience level. It analyzes your responses, body language, and speaking patterns to provide detailed feedback."
    },
    {
      question: "Is my personal data secure?",
      answer: "Absolutely! We use end-to-end encryption for all communications and follow industry-standard security practices. Your personal information is never shared with third parties without your consent."
    },
    {
      question: "How can I contact my instructor?",
      answer: "You can contact instructors through the messaging system in your dashboard, during live Q&A sessions, or through the course discussion forums."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. For institutional subscriptions, we also offer invoice-based payments."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "Yes, we offer a 30-day money-back guarantee for most courses. Please check our refund policy or contact support for specific details about your purchase."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-cyan-100 rounded-full">
              <HelpCircle className="h-8 w-8 text-cyan-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our EdTech platform. 
            Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Common Questions</CardTitle>
            <CardDescription>
              Click on any question below to see the answer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Still Have Questions?</CardTitle>
            <CardDescription>
              Our support team is here to help you succeed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={() => window.open('mailto:support@edtechplatform.com')}
              >
                <Mail className="h-4 w-4" />
                <span>Email Support</span>
              </Button>
              <Button 
                className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700"
                onClick={() => {
                  const message = encodeURIComponent("Hi, I have a question about the platform that's not covered in the FAQ.");
                  window.open(`https://wa.me/1234567890?text=${message}`, '_blank');
                }}
              >
                <MessageCircle className="h-4 w-4" />
                <span>Live Chat</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
