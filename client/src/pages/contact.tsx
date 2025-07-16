import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, MapPin, Clock, Twitter, Linkedin, Github } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-6">Get in Touch</h1>
          <p className="text-lg text-slate-600 mb-8">
            I'd love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="text-blue-600 mt-1 mr-3" size={20} />
                  <div>
                    <p className="text-slate-700 font-medium">Email</p>
                    <p className="text-slate-600">hello@myblog.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="text-blue-600 mt-1 mr-3" size={20} />
                  <div>
                    <p className="text-slate-700 font-medium">Location</p>
                    <p className="text-slate-600">San Francisco, CA</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="text-blue-600 mt-1 mr-3" size={20} />
                  <div>
                    <p className="text-slate-700 font-medium">Response Time</p>
                    <p className="text-slate-600">Usually within 24 hours</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Follow Me</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                    <Twitter size={24} />
                  </a>
                  <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                    <Linkedin size={24} />
                  </a>
                  <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                    <Github size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
