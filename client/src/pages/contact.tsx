import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Clock, Twitter, Linkedin, Github, Send } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "All fields are required to send your message.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email address",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Get in Touch</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          I'd love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your message here..."
                  required
                  className="mt-1 resize-none"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={contactMutation.isPending}
              >
                {contactMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2" size={16} />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="text-blue-600 mt-1 mr-4 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-slate-700 font-semibold mb-1">Email</h3>
                  <p className="text-slate-600">hello@myblog.com</p>
                  <p className="text-slate-500 text-sm mt-1">I'll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="text-blue-600 mt-1 mr-4 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-slate-700 font-semibold mb-1">Location</h3>
                  <p className="text-slate-600">San Francisco, CA</p>
                  <p className="text-slate-500 text-sm mt-1">Available for remote work</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="text-blue-600 mt-1 mr-4 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-slate-700 font-semibold mb-1">Response Time</h3>
                  <p className="text-slate-600">Usually within 24 hours</p>
                  <p className="text-slate-500 text-sm mt-1">Monday - Friday, 9 AM - 6 PM PST</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Follow Me</h3>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="text-slate-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-slate-100"
                  aria-label="Twitter"
                >
                  <Twitter size={24} />
                </a>
                <a 
                  href="#" 
                  className="text-slate-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-slate-100"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={24} />
                </a>
                <a 
                  href="#" 
                  className="text-slate-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-slate-100"
                  aria-label="GitHub"
                >
                  <Github size={24} />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="mt-12">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">How quickly do you respond?</h3>
              <p className="text-slate-600 text-sm">I typically respond to all messages within 24 hours during business days.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">What type of projects do you work on?</h3>
              <p className="text-slate-600 text-sm">I work on web development projects, from simple websites to complex web applications.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">Do you offer consulting services?</h3>
              <p className="text-slate-600 text-sm">Yes, I provide consulting services for web development and technical architecture.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">Are you available for remote work?</h3>
              <p className="text-slate-600 text-sm">Absolutely! I work with clients worldwide and am comfortable with remote collaboration.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}