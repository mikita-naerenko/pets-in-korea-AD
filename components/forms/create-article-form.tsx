"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { useStoreModal } from "@/hooks/use-move-to-trash-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/ui/image-upload";
import TextEditor from "../editor";

const formSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(200),
  content: z.string().min(100),
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

export default function CreateArticleForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tagsList, setTegsList] = useState<Tag[]>([]);

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      // editor: "",
      content: "",
      nameOfSource: "",
      linkToSource: "",
      authorName: "",
      authorLink: "",
      tagsList: [],
      images: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      setLoading(true);
      const response = await axios.post("/api/articles", values);
      console.log("Article has been submited");
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data, {
          duration: 10000,
        });
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <div className="w-3/5 mx-auto">
      <div className="space-y-4 py-2 pb-4">
        <div className="space-y-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormDescription className="text-center text-3xl">
                Create a new article
              </FormDescription>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <p className="mt-4">Title length: {field.value.length}</p>
                      <p className=" text-xs text-slate-400 mb-3">
                        *Recommended length between 10 and 60 characters
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Title of Article"
                        {...field}
                      />
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
                      <p className="mt-4">
                        Description length: {field.value.length}
                      </p>
                      <p className=" text-xs text-slate-400 mb-3">
                        *Recommended length between 50 and 150 characters
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Description of Article"
                        {...field}
                      />
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
                        If article has been copied from another resource, fill
                        out name of resource
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Name of resource"
                        {...field}
                      />
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
                        If article has been copied from another resource, fill
                        out link to resource
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Link to resource"
                        {...field}
                      />
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
                      <Input
                        disabled={loading}
                        placeholder="Author's name"
                        {...field}
                      />
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
                        If article has been copied from another resource and you
                        know author&apos;s account, fill out this field
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Link to the author"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        disabled={loading}
                        onChange={(url) =>
                          field.onChange([...field.value, { url }])
                        }
                        onRemove={(url) =>
                          field.onChange([
                            ...field.value.filter(
                              (current) => current.url !== url
                            ),
                          ])
                        }
                      />
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
                                          ? field.onChange([
                                              ...field.value,
                                              tag.id,
                                            ])
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
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading} variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button disabled={loading} type="submit">
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
