import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Trash2, Edit, BarChart3, Users, FileText, TrendingUp, Eye, Mail, MessageSquare, Clock, CheckCircle, Bell } from "lucide-react";
import PostModal from "@/components/post-modal";
import type { Post, Contact } from "@shared/schema";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
    enabled: isAuthenticated,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated,
  });

  const { data: contacts } = useQuery<Contact[]>({
    queryKey: ["/api/admin/contacts"],
    enabled: isAuthenticated,
  });

  const { data: unreadContacts } = useQuery<Contact[]>({
    queryKey: ["/api/admin/contacts/unread"],
    enabled: isAuthenticated,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const loginMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await apiRequest("POST", "/api/admin/login", { password });
      return response.json();
    },
    onSuccess: () => {
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: "Welcome to the admin panel!",
      });
    },
    onError: () => {
      toast({
        title: "Login failed",
        description: "Invalid password. Please try again.",
        variant: "destructive",
      });
    },
  });



  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/posts/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Post deleted",
        description: "The blog post has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: () => {
      toast({
        title: "Error deleting post",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PATCH", `/api/admin/contacts/${id}/read`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts/unread"] });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/contacts/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Contact deleted",
        description: "The contact message has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts/unread"] });
    },
    onError: () => {
      toast({
        title: "Error deleting contact",
        description: "Failed to delete contact. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(password);
  };



  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Admin Panel</CardTitle>
            <p className="text-slate-600">This panel is only accessible via direct URL.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Notification Box */}
      {unreadContacts && unreadContacts.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <Bell className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            You have {unreadContacts.length} unread contact message{unreadContacts.length !== 1 ? 's' : ''}.
          </AlertDescription>
        </Alert>
      )}

      {/* Dashboard Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="text-blue-600 mr-3" size={24} />
                <div>
                  <p className="text-sm text-slate-600">Total Posts</p>
                  <p className="text-2xl font-bold">{stats.totalPosts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="text-green-600 mr-3" size={24} />
                <div>
                  <p className="text-sm text-slate-600">Published</p>
                  <p className="text-2xl font-bold">{stats.publishedPosts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="text-purple-600 mr-3" size={24} />
                <div>
                  <p className="text-sm text-slate-600">This Month</p>
                  <p className="text-2xl font-bold">{stats.thisMonthPosts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="text-orange-600 mr-3" size={24} />
                <div>
                  <p className="text-sm text-slate-600">Total Views</p>
                  <p className="text-2xl font-bold">{stats.totalViews}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Posts & Tag Distribution */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top 5 Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topPosts.map((post, index) => (
                  <div key={post.id} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-slate-500 mr-3">#{index + 1}</span>
                      <div>
                        <p className="font-medium text-sm">{post.title}</p>
                        <p className="text-xs text-slate-500">{post.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Eye size={14} className="mr-1" />
                      {post.viewCount || 0}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tag Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(stats.tagDistribution).map(([tag, count]) => (
                  <div key={tag} className="flex items-center justify-between">
                    <Badge variant="outline">{tag}</Badge>
                    <span className="text-sm text-slate-600">{count} posts</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText size={16} />
            Posts Management
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Mail size={16} />
            Contact Messages
            {unreadContacts && unreadContacts.length > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {unreadContacts.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          {/* Create Post Action */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Post Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <PostModal 
                  onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Existing Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Existing Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-12 bg-slate-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {posts?.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-md">
                      <div>
                        <p className="font-medium text-slate-800">{post.title}</p>
                        <p className="text-slate-500 text-sm">{post.slug}.md</p>
                      </div>
                      <div className="space-x-2">
                        <PostModal 
                          post={post} 
                          trigger={
                            <Button variant="outline" size="sm">
                              <Edit size={16} className="mr-1" />
                              Edit
                            </Button>
                          }
                          onSuccess={() => {
                            queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
                          }}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deletePostMutation.mutate(post.id)}
                          disabled={deletePostMutation.isPending}
                        >
                          <Trash2 size={16} className="mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <MessageSquare size={24} />
                Contact Messages
                {unreadContacts && unreadContacts.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadContacts.length} new
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contacts && contacts.length > 0 ? (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div 
                      key={contact.id} 
                      className={`p-4 border rounded-lg ${
                        contact.status === 'unread' 
                          ? 'border-orange-200 bg-orange-50 shadow-md' 
                          : 'border-slate-200 bg-white hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-800 text-lg">{contact.subject}</h3>
                            {contact.status === 'unread' && (
                              <Badge variant="destructive" className="text-xs animate-pulse">
                                NEW
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                            <span>
                              <strong>From:</strong> {contact.name}
                            </span>
                            <span>
                              <strong>Email:</strong> 
                              <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline ml-1">
                                {contact.email}
                              </a>
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock size={12} />
                            <span>
                              {new Date(contact.createdAt || new Date()).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {contact.status === 'unread' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markAsReadMutation.mutate(contact.id)}
                              disabled={markAsReadMutation.isPending}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              <CheckCircle size={14} className="mr-1" />
                              Mark Read
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteContactMutation.mutate(contact.id)}
                            disabled={deleteContactMutation.isPending}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-l-blue-300">
                        <h4 className="font-medium text-slate-700 mb-2">Message:</h4>
                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {contact.message}
                        </p>
                      </div>
                      
                      {contact.status === 'read' && (
                        <div className="mt-3 text-xs text-green-600 flex items-center">
                          <CheckCircle size={12} className="mr-1" />
                          Message has been read
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 mb-2">No contact messages yet</h3>
                  <p className="text-slate-600 max-w-sm mx-auto">
                    Contact messages from your website visitors will appear here. 
                    You'll be notified when new messages arrive.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
