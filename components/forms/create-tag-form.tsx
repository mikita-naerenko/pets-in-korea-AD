"use client";

import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTagModal } from "@/hooks/use-tag-modal";
import { Button } from "@/components/ui/button";
import { Img } from "@/lib/interfaces";
import ImageUpload from "@/components/ui/image-upload";

interface Tag {
  id: string;
  label: string;
  rusTitle: string;
  images: Img[];
}

interface ApiResponse<T> {
  data: T[];
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: object;
}

export default function CreateTagForm() {
  const tagModal = useTagModal();
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

  const formSchema = z.object({
    tag: z
      .string()
      .min(1)
      .max(20)
      .refine(
        (value) => {
          // Check if the value is not in the existing tagsList
          const isTagNotExist = !tagsList.some((tag) => tag.label === value);
          return isTagNotExist;
        },
        { message: "Tag already exists" }
      ),
    rusTitle: z
      .string()
      .min(1)
      .max(100)
      .refine(
        (value) => {
          // Check if the value is not in the existing tagsList
          const isTagNotExist = !tagsList.some((tag) => tag.rusTitle === value);
          return isTagNotExist;
        },
        { message: "Tag already exists" }
      ),
    images: z.object({ url: z.string() }).array(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tag: "",
      rusTitle: "",
      images: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      //   setLoading(true);
      await axios.post("/api/tags", values);
      console.log("Tag has been submited");
      router.push("/");
      tagModal.onClose();
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
  return (
    <div className="w-3/5 mx-auto">
      <p>Already existing tags:</p>
      <div className="flex flex-wrap">
        {tagsList.length > 0
          ? tagsList.map((tag) => (
              <span key={tag.id} className="mr-2">
                #{tag.label}
              </span>
            ))
          : null}
      </div>
      <div className="space-y-4 py-2 pb-4">
        <div className="space-y-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English lable</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Write tag here"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rusTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Russian lable</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Title on Russian"
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

              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={loading}
                  variant="outline"
                  onClick={tagModal.onClose}
                >
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
