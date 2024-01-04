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
import { useModalEdit } from "@/hooks/use-tag-modal";
import { regexSet } from "@/lib/regex";

const formSchema = z.object({
  phrase: z
    .string()
    .min(1)
    .max(200)
    .regex(regexSet.korTranslate, { message: "The phrase should be in Korean" })
    .refine((data) => data.length > 0, {
      message: "This field is required.",
    }),
});

export default function EditPhraseForm() {
  const [loading, setLoading] = useState(false);
  const modalEdit = useModalEdit();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phrase: modalEdit.item ? modalEdit.item.content.phrase : "not found",
    },
  });
  const currentId = modalEdit.item && modalEdit.item.id;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    if (!modalEdit.item) return;
    try {
      setLoading(true);

      await axios.patch(`/api/${modalEdit.item.type}/${currentId}`, values);

      console.log("Phrase has been edited");
      modalEdit.setItem("");
      modalEdit.onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data, {
          duration: 10000,
        });
      } else {
        toast.error("Something went wrong");
      }
      modalEdit.setItem("");
      modalEdit.onClose();
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  const handleCancelClick = () => {
    modalEdit.setItem("");
    modalEdit.onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormDescription className="text-center text-3xl">
          Edit Phrase
        </FormDescription>
        <FormField
          control={form.control}
          name="phrase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <p className="mt-3">Title length: {field.value.length}</p>
                <p className=" text-xs text-slate-400 mb-3">
                  Recommended length between 10 and 60 characters
                </p>
              </FormLabel>
              <FormControl>
                <Input placeholder="Phrase" {...field} />
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
