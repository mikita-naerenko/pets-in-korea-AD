"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import ImageUpload from "../ui/image-upload";
import { Article } from "@/lib/interfaces";
import TextEditor from "../editor";

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().min(1),
  nameOfSource: z.string().min(2).optional().or(z.literal("")),
  linkToSource: z
    .string()
    .min(2)
    .url({ message: "Invalid url" })
    .optional()
    .or(z.literal("")),
  authorName: z.string().min(2).optional().or(z.literal("")),
  authorLink: z
    .string()
    .min(2)
    .url({ message: "Invalid url" })
    .optional()
    .or(z.literal("")),
  tagsList: z.array(z.string()).refine((data) => data.length > 0, {
    message: "Please select at least one tag",
  }),
  images: z.object({ url: z.string() }).array(),
});

interface ArticleProps {
  article: Article;
}

interface Tag {
  id: string;
  label: string;
}

interface ApiResponse<T> {
  data: T[];
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: object;
}

export default function EditForm({ article }: ArticleProps) {
  const [tagsList, setTegsList] = useState<Tag[]>([]);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: article.title,
      description: article.description,
      content: article.content,
      nameOfSource: article.nameOfSource || "",
      linkToSource: article.linkToSource || "",
      authorName: article.authorName || "",
      authorLink: article.authorLink || "",
      tagsList: article.tags.map((tag) => tag.id),
      images: article.images.length > 0 ? article.images : [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: ApiResponse<Tag> = await axios.get("/api/tags");
        setTegsList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/${article.id}`, values);
      console.log("Article has been edited");
      toast.success("Article has been edited");
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data, {
          duration: 10000,
        });
      } else {
        toast.error("Something went wrong");
      }
    } finally {
    }
  };

  const handleCancelClick = () => {
    router.back();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormDescription className="text-center text-3xl">
          Edit Article
        </FormDescription>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <p className="mt-3">Title length: {field.value.length}</p>
                <p className=" text-xs text-slate-400 mb-3">
                  Recommended length between 10 and 60 characters
                </p>
              </FormLabel>
              <FormControl>
                <Input placeholder="Title of Article" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <p className="mt-3">Description length: {field.value.length}</p>
                <p className=" text-xs text-slate-400 mb-3">
                  Recommended length between 50 and 150 characters
                </p>
              </FormLabel>
              <FormControl>
                <Input placeholder="Description of Article" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nameOfSource"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <p className=" text-xs text-slate-400 mt-4">
                  If article has been copied from another resource, fill out
                  name of resource
                </p>
              </FormLabel>
              <FormControl>
                <Input placeholder="Name of resource" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkToSource"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <p className=" text-xs text-slate-400 mt-4">
                  If article has been copied from another resource, fill out
                  link to resource
                </p>
              </FormLabel>
              <FormControl>
                <Input placeholder="Link to resource" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="authorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <p className=" text-xs text-slate-400 mt-4">
                  If article has author, fill out this field
                </p>
              </FormLabel>
              <FormControl>
                <Input placeholder="Author's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="authorLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <p className=" text-xs text-slate-400 mt-4">
                  If article has been copied from another resource and you know
                  author&apos;s account, fill out this field
                </p>
              </FormLabel>
              <FormControl>
                <Input placeholder="Link to the author" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col mt-5">
          <p>Select at least one tag</p>
          <div className="flex flex-wrap mt-5">
            {tagsList.length > 0
              ? tagsList.map((tag) => {
                  return (
                    <FormField
                      key={tag.id}
                      control={form.control}
                      name="tagsList"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={tag.id}
                            className="flex flex-row items-start space-x-1 space-y-0 mr-3"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(tag.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, tag.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== tag.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {tag.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  );
                })
              : null}
          </div>
        </div>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextEditor {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value.map((image) => image.url)}
                  // disabled={loading}
                  onChange={(url) => field.onChange([...field.value, { url }])}
                  onRemove={(url) =>
                    field.onChange([
                      ...field.value.filter((current) => current.url !== url),
                    ])
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
          <Button
            // disabled={loading}
            variant="outline"
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Form>
  );
}
