import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, Clock, Eye, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { renderMarkdown } from "@/lib/markdown";
import type { Post } from "@shared/schema";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ["/api/posts", slug],
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="mb-8">
            <div className="h-4 bg-slate-200 rounded w-24 mb-4"></div>
            <div className="h-12 bg-slate-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="space-y-4">
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              <div className="h-4 bg-slate-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <Card>
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Post Not Found</h1>
            <p className="text-slate-600 mb-6">The blog post you're looking for doesn't exist.</p>
            <Link href="/">
              <Button>
                <ArrowLeft className="mr-2" size={16} />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderedContent = renderMarkdown(post.content);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Post Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href="/">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
              <ArrowLeft className="mr-2" size={16} />
              Back to Home
            </Button>
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center text-slate-600 mb-6 gap-2">
          <span>
            {new Date(post.createdAt || new Date()).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <Clock className="mr-1" size={16} />
            <span>{post.readTime}</span>
          </div>
          <span className="mx-2">•</span>
          <span>{post.category}</span>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <Eye className="mr-1" size={16} />
            <span>{post.viewCount || 0} views</span>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                <Tag size={12} />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Post Content */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div 
            className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-700 prose-a:text-blue-600 prose-strong:text-slate-800 prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-slate-800"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />
          
          {/* Google AdSense Ad */}
          <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-xs text-slate-500 mb-2 text-center">Advertisement</p>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
            <ins className="adsbygoogle block w-full"
                 style={{display: 'block'}}
                 data-ad-client="ca-pub-xxxxxxxxxx"
                 data-ad-slot="xxxxxxxxxx"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }}></script>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Comments</h3>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
            <div className="text-slate-400 text-2xl mb-2">💬</div>
            <p className="text-slate-600">Comments feature would be implemented here</p>
            <p className="text-slate-500 text-sm">Consider using a service like Disqus or building a custom solution</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
