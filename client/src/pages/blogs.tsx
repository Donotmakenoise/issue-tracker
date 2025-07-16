import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search, Filter, Calendar, Tag, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Post } from "@shared/schema";

export default function Blogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const { data: searchResults } = useQuery<Post[]>({
    queryKey: ["/api/posts/search", searchQuery],
    enabled: searchQuery.length > 0,
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

  // Filter and sort posts
  let filteredPosts = posts || [];
  
  if (searchQuery && searchResults) {
    filteredPosts = searchResults;
  } else if (selectedTag && selectedTag !== "all" && tagResults) {
    filteredPosts = tagResults;
  }

  // Sort posts
  filteredPosts = [...filteredPosts].sort((a, b) => {
    const dateA = new Date(a.createdAt || new Date()).getTime();
    const dateB = new Date(b.createdAt || new Date()).getTime();
    return sortBy === "latest" ? dateB - dateA : dateA - dateB;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedTag(""); // Clear tag filter when searching
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setSearchQuery(""); // Clear search when filtering by tag
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTag("");
    setSortBy("latest");
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-10 bg-slate-200 rounded w-1/3 mb-8"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-6 bg-slate-200 rounded mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">All Blog Posts</h1>
        <p className="text-slate-600">
          Explore our collection of articles on web development, programming, and technology.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>

          {/* Tag Filter */}
          <div className="lg:w-48">
            <Select value={selectedTag} onValueChange={handleTagSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tags</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Options */}
          <div className="lg:w-48">
            <Select value={sortBy} onValueChange={(value: "latest" | "oldest") => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>

        {/* Active Filters */}
        {(searchQuery || selectedTag) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary">
                <Search size={14} className="mr-1" />
                Search: {searchQuery}
              </Badge>
            )}
            {selectedTag && selectedTag !== "all" && (
              <Badge variant="secondary">
                <Tag size={14} className="mr-1" />
                Tag: {selectedTag}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-slate-600">
          Showing {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow h-full">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-sm">
                  {new Date(post.createdAt || new Date()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <div className="flex items-center text-slate-400">
                  <Clock size={14} className="mr-1" />
                  <span className="text-xs">{post.readTime}</span>
                </div>
              </div>

              <Link href={`/post/${post.slug}`}>
                <h3 className="text-xl font-semibold text-slate-800 mb-3 hover:text-blue-600 cursor-pointer transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </Link>

              <p className="text-slate-600 text-sm mb-4 flex-grow line-clamp-3">
                {post.excerpt}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs cursor-pointer hover:bg-slate-100"
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {post.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{post.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Category and View Count */}
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span className="bg-slate-100 px-2 py-1 rounded text-xs">
                  {post.category}
                </span>
                <div className="flex items-center">
                  <ArrowRight size={14} className="text-blue-600" />
                  <span className="ml-2">{post.viewCount || 0} views</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No posts found</h3>
          <p className="text-slate-600 mb-4">
            {searchQuery || selectedTag
              ? "Try adjusting your search or filter criteria"
              : "No blog posts are available at the moment"}
          </p>
          {(searchQuery || selectedTag) && (
            <Button onClick={clearFilters}>Clear Filters</Button>
          )}
        </div>
      )}
    </div>
  );
}