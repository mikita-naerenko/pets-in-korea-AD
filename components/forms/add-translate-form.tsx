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
import { useState } from "react";
import { useAddTranslateModal } from "@/hooks/use-tag-modal";

const formSchema = z.object({
  translate: z.string().min(1),
  transcription: z.string().min(1),
});

export default function AddTranslateForm() {
  const [loading, setLoading] = useState(false);
  const addTranslateModal = useAddTranslateModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      translate: "",
      transcription: "",
    },
  });
  //   const currentId = addTranslateModal.item && addTranslateModal.item.phraseId;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!addTranslateModal.item) return;
    const modifiedValues = {
      ...values,
      theme: addTranslateModal.item.theme,
      phraseId: addTranslateModal.item.phraseId,
    };
    try {
      setLoading(true);

      await axios.post(`/api/${addTranslateModal.item.type}`, modifiedValues);
      toast.success(`${addTranslateModal.item.type} has been added`);
      addTranslateModal.setItem("");
      addTranslateModal.onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data, {
          duration: 10000,
        });
      } else {
        toast.error("Something went wrong");
      }

      addTranslateModal.setItem("");
      addTranslateModal.onClose();
    } finally {
      router.refresh();
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    addTranslateModal.setItem("");
    addTranslateModal.onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormDescription className="text-center text-3xl">
          Add {addTranslateModal.item !== "" && addTranslateModal.item.type}
        </FormDescription>
        <FormField
          control={form.control}
          name="translate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Translate Field</FormLabel>
              <FormControl>
                <Input placeholder="Translate" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="transcription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transcription Fiels</FormLabel>
              <FormControl>
                <Input placeholder="Transcription" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
          <Button
            disabled={loading}
            variant="outline"
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
          <Button disabled={loading} type="submit">
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
