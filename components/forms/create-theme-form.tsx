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
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/ui/image-upload";
import { Theme } from "@/lib/interfaces";

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

export default function CreateThemeForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [themesList, setThemesList] = useState<Theme[]>([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: ApiResponse<Theme> = await axios.get("/api/theme");
        setThemesList(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data, {
            duration: 10000,
          });
        } else {
          toast.error("Something went wrong");
        }
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
      label: "",
      rusLabel: "",
      description: "",
      tagsList: [],
      images: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      setLoading(true);
      const response = await axios.post("/api/theme", values);
      console.log("Theme has been submitted");
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
    router.back();
  };

  return (
    <div className="w-3/5 mx-auto">
      <div className="space-y-4 py-2 pb-4">
        <div className="space-y-2">
          <div>
            <p>Already existing themes:</p>
            {themesList.length > 0
              ? themesList.map((theme) => (
                  <span key={theme.id} className="mr-2">
                    #{theme.label}
                  </span>
                ))
              : null}
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormDescription className="text-center text-3xl">
                Create a new theme
              </FormDescription>
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <p className="mt-4">Label length: {field.value.length}</p>
                      <p className=" text-xs text-slate-400 mb-3">
                        Maxlength - 300
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="label"
                        {...field}
                      />
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
                      <p className="mt-4">
                        RusLabel length: {field.value.length}
                      </p>
                      <p className=" text-xs text-slate-400 mb-3">
                        Maxlength - 300
                      </p>
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
