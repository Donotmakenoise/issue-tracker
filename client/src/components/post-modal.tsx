import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import TinyMCEEditor from "./tinymce-editor";
import { Plus, Edit2 } from "lucide-react";
import type { Post } from "@shared/schema";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  readTime: z.string().min(1, "Read time is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional(),
  status: z.enum(["published", "draft"]),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostModalProps {
  post?: Post;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export default function PostModal({ post, trigger, onSuccess }: PostModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      excerpt: post?.excerpt || "",
      readTime: post?.readTime || "5 min read",
      category: post?.category || "General",
      tags: post?.tags?.join(", ") || "",
      status: post?.status || "published",
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: PostFormData) => {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
      };
      return await apiRequest("/api/posts", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({ title: "Post created successfully!" });
      form.reset();
      setOpen(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error creating post",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async (data: PostFormData) => {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
      };
      return await apiRequest(`/api/posts/${post?.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({ title: "Post updated successfully!" });
      setOpen(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error updating post",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (title: string) => {
    form.setValue("title", title);
    if (!post) {
      form.setValue("slug", generateSlug(title));
    }
  };

  const onSubmit = (data: PostFormData) => {
    if (post) {
      updatePostMutation.mutate(data);
    } else {
      createPostMutation.mutate(data);
    }
  };

  const defaultTrigger = (
    <Button>
      {post ? (
        <>
          <Edit2 size={16} className="mr-2" />
          Edit Post
        </>
      ) : (
        <>
          <Plus size={16} className="mr-2" />
          New Post
        </>
      )}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {post ? "Edit Post" : "Create New Post"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...form.register("title")}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                {...form.register("slug")}
                placeholder="post-slug"
              />
              {form.formState.errors.slug && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.slug.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Input
              id="excerpt"
              {...form.register("excerpt")}
              placeholder="Brief description of the post"
            />
            {form.formState.errors.excerpt && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.excerpt.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="readTime">Read Time</Label>
              <Input
                id="readTime"
                {...form.register("readTime")}
                placeholder="5 min read"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                {...form.register("category")}
                placeholder="Technology"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={form.watch("status")} onValueChange={(value) => form.setValue("status", value as "published" | "draft")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              {...form.register("tags")}
              placeholder="React, JavaScript, Web Development"
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <TinyMCEEditor
              value={form.watch("content")}
              onChange={(content) => form.setValue("content", content)}
              placeholder="Write your blog post content here..."
              height={400}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.content.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createPostMutation.isPending || updatePostMutation.isPending}
            >
              {createPostMutation.isPending || updatePostMutation.isPending ? "Saving..." : (post ? "Update Post" : "Create Post")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}