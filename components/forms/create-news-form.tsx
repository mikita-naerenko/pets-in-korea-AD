"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ui/image-upload";
import TextEditor from "../editor";

const formSchema = z.object({
  title: z.string().min(1),
  linkToSource: z.string().min(1),
  nameOfSource: z.string().min(1),
  description: z.string().min(1),
  content: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
});

export default function CreateNewsForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      nameOfSource: "",
      linkToSource: "",
      content: "",
      images: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      setLoading(true);
      const response = await axios.post("/api/news", values);
      toast.success("News has been created");
      console.log("News has been created");
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
      setLoading(false);
    }
  };

  const onCancel = () => {
    router.push("/");
  };

  return (
    <div className="w-3/5 mx-auto">
      <div className="space-y-4 py-2 pb-4">
        <div className="space-y-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormDescription className="text-center text-3xl">
                Create a news
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
                      <p className="mt-3">
                        Description length: {field.value.length}
                      </p>
                      <p className=" text-xs text-slate-400 mb-3">
                        Recommended length between 50 and 150 characters
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
                name="linkToSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <p className="mt-3">Paste link to news' source</p>
                      <p className=" text-xs text-slate-400 mb-3"></p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Paste here"
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
                      <p className="mt-3">Name of news' source</p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Name of news' source"
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
