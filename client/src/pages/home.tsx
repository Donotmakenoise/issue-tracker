import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Clock, ArrowRight, Tag, Eye, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Post } from "@shared/schema";

export default function Home() {
  const [selectedTag, setSelectedTag] = useState<string>("");
  
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const { data: tagResults } = useQuery<Post[]>({
    queryKey: ["/api/posts/tag", selectedTag],
    enabled: selectedTag.length > 0,
  });

  // Get all unique tags from posts
  const allTags = posts?.reduce((tags: string[], post) => {
    if (post.tags) {
      post.tags.forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    }
    return tags;
  }, []) || [];

  const filteredPosts = selectedTag && selectedTag !== "all" && tagResults ? tagResults : posts;
  const featuredPost = filteredPosts?.[0];
  const recentPosts = filteredPosts?.slice(1, 4) || [];

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="text-center mb-16">
            <div className="h-12 bg-slate-200 rounded w-2/3 mx-auto mb-4"></div>
            <div className="h-6 bg-slate-200 rounded w-1/2 mx-auto"></div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          Welcome to My Blog
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Thoughts, stories, and insights on technology, life, and everything in between.
        </p>
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-slate-600" />
                <span className="text-slate-600 font-medium">Filter by tag:</span>
              </div>
              <div className="flex items-center gap-3">
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All topics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All topics</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTag && selectedTag !== "all" && (
                  <Button variant="outline" size="sm" onClick={() => setSelectedTag("all")}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
            {selectedTag && selectedTag !== "all" && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                  <Tag size={14} />
                  Showing posts tagged: {selectedTag}
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Featured Post */}
      {featuredPost && (
        <Card className="mb-12 hover:shadow-lg transition-shadow">
          <CardContent className="p-8">
            <div className="flex items-center mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                Featured
              </span>
              <span className="text-slate-500 text-sm ml-3">
                {new Date(featuredPost.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <Link href={`/post/${featuredPost.slug}`}>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 hover:text-blue-600 cursor-pointer transition-colors">
                {featuredPost.title}
              </h2>
            </Link>
            <p className="text-slate-600 mb-6">
              {featuredPost.excerpt}
            </p>
            
            {/* Tags */}
            {featuredPost.tags && featuredPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {featuredPost.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1">
                    <Tag size={12} />
                    {tag}
                  </Badge>
                ))}
                {featuredPost.tags.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{featuredPost.tags.length - 4} more
                  </Badge>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Clock className="text-slate-400 mr-2" size={16} />
                  <span className="text-slate-500 text-sm">{featuredPost.readTime}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="text-slate-400 mr-2" size={16} />
                  <span className="text-slate-500 text-sm">{featuredPost.viewCount || 0} views</span>
                </div>
              </div>
              <Link href={`/post/${featuredPost.slug}`}>
                <Button>Read More</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Posts */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">Recent Posts</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <span className="text-slate-500 text-sm">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <Link href={`/post/${post.slug}`}>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3 hover:text-blue-600 cursor-pointer transition-colors">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-slate-600 text-sm mb-4">
                  {post.excerpt}
                </p>
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <Clock className="text-slate-400 mr-1" size={14} />
                      <span className="text-slate-500 text-xs">{post.readTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="text-slate-400 mr-1" size={14} />
                      <span className="text-slate-500 text-xs">{post.viewCount || 0}</span>
                    </div>
                  </div>
                  <ArrowRight className="text-blue-600" size={16} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
        <p className="text-blue-100 mb-6">Get the latest posts delivered directly to your inbox.</p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-white border-blue-500 focus:ring-blue-300"
          />
          <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
}
