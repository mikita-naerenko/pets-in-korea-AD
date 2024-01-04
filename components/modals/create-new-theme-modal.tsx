"use client";

import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useThemeModal } from "@/hooks/use-tag-modal";
import { Button } from "@/components/ui/button";

interface Theme {
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

export default function CreateNewThemeModal() {
  const themeModal = useThemeModal();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [themesList, setThemesList] = useState<Theme[]>([]);

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
    theme: z
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
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      //   setLoading(true);
      await axios.post("/api/theme", values);
      console.log("Tag has been submited");
      router.refresh();
      themeModal.onClose();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create new Theme"
      description=""
      isOpen={themeModal.isOpen}
      onClose={themeModal.onClose}
    >
      <div>
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
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Theme name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Write theme here"
                          {...field}
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
                    onClick={themeModal.onClose}
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
    </Modal>
  );
}
