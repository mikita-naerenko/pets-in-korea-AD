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
import { Article, Tag, Theme } from "@/lib/interfaces";
import TextEditor from "../editor";

// interface Tag {
//   id: string;
//   label: string;
// }

interface ApiResponse<T> {
  data: T[];
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: object;
}

export default function EditThemeForm({ theme }: { theme: Theme }) {
  const [loading, setLoading] = useState(false);
  const [themesList, setThemesList] = useState<Theme[]>([]);
  const [tagsList, setTegsList] = useState<Tag[]>([]);
  const router = useRouter();

  const formSchema = z.object({
    rusLabel: z.string().min(1).max(300),
    label: z
      .string()
      .min(1)
      .refine(
        (value) => {
          // Check if the value is not in the existing theme list
          const isTagNotExist = !themesList.some(
            (theme) => theme.label === value
          );
          return isTagNotExist;
        },
        { message: "The theme already exists" }
      ),
    description: z.string().min(1).max(200),
    tagsList: z.array(z.string()),
    images: z.object({ url: z.string() }).array(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: theme.label || "",
      rusLabel: theme.rusLabel || "",
      description: theme.description || "",
      tagsList: (theme.tags && theme.tags.map((tag) => tag.id)) || [],
      images: theme.images && theme.images.length > 0 ? theme.images : [],
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
      const response = await axios.patch(`/api/theme/${theme.id}`, values);
      console.log("Theme has been edited");
      toast.success("Theme has been edited");
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
          Edit Theme
        </FormDescription>
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <p className="mt-4">Label length: {field.value.length}</p>
                <p className=" text-xs text-slate-400 mb-3">Maxlength - 300</p>
              </FormLabel>
              <FormControl>
                <Input disabled={loading} placeholder="label" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rusLabel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <p className="mt-4">RusLabel length: {field.value.length}</p>
                <p className=" text-xs text-slate-400 mb-3">Maxlength - 300</p>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Russian label"
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
                <p className="mt-4">Description length: {field.value.length}</p>
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
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <ImageUpload
                  editItem={theme}
                  editItemType="theme"
                  value={field.value.map((image) => image.url)}
                  disabled={loading}
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
