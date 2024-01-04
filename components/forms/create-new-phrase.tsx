"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { regexSet } from "@/lib/regex";

// const formSchema = z.object({
//   phrase: z.string().min(1).refine((data) => data.length > 0, {
//     message: 'This field is required.',
//   }),
//   selectedTheme: z.string().min(1).refine((data) => data.length > 0, {
//     message: 'This field is required.',
//   }),
//   toRusTranslate: z.string().min(1).optional(),
//   toRusTranscription: z.string().min(1).optional(),
//   toEngTranslate: z.string().min(1).optional(),
//   toEngTranscription: z.string().min(1).optional(),
// });

interface Theme {
  id: string;
  label: string;
}

export default function CreatePhraseForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [addRus, setAddRus] = useState(false);
  const [addEng, setAddEng] = useState(false);

  const formSchema = z.object({
    phrase: z
      .string()
      .min(1)
      .max(200)
      .regex(regexSet.korTranslate, {
        message: "The phrase should be in Korean",
      })
      .refine((data) => data.length > 0, {
        message: "This field is required.",
      }),
    selectedTheme: z
      .string()
      .min(1)
      .refine((data) => data.length > 0, {
        message: "This field is required.",
      }),
    toRusTranslate: z
      .string()
      .min(1)
      .max(200)
      .regex(regexSet.rusTranslate, {
        message: "The translate should be in Russian",
      }),
    toRusTranscription: z
      .string()
      .min(1)
      .max(200)
      .regex(regexSet.rusTranslate, {
        message: "The transcription should be in Russian",
      }),

    toEngTranslate: addEng
      ? z.string().min(1).max(200).regex(regexSet.engTranslate, {
          message: "The translate should be in English",
        })
      : z
          .string()
          .min(1)
          .max(200)
          .regex(regexSet.engTranslate, {
            message: "The translate should be in English",
          })
          .optional()
          .or(z.literal("")),
    toEngTranscription: addEng
      ? z.string().min(1).max(200).regex(regexSet.engTranslate, {
          message: "The transcription should be in English",
        })
      : z
          .string()
          .min(1)
          .max(200)
          .regex(regexSet.engTranslate, {
            message: "The transcription should be in English",
          })
          .optional()
          .or(z.literal("")),
  });

  const handleClickAddRus = () => {
    setAddRus(!addRus);
  };
  const handleClickAddEng = () => {
    setAddEng(!addEng);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phrase: "",
      selectedTheme: "",
      toRusTranslate: "",
      toRusTranscription: "",
      toEngTranslate: "",
      toEngTranscription: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/theme");
        setThemes(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("submitted", values);
    try {
      setLoading(true);
      const response = await axios.post("/api/phrase", values);
      console.log("Phrase has been submited");
      router.refresh();
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormDescription className="text-center text-3xl">
                Create a new Phrase For Dictionary
              </FormDescription>
              <FormField
                control={form.control}
                name="phrase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <p className="mt-3">
                        Phrase length: {field.value.length}
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Write a phrase here"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="selectedTheme"
                render={({ field }) => (
                  <FormItem className="space-y-3 mt-3">
                    <FormLabel>Select one of themes</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap"
                      >
                        {themes.length > 0
                          ? themes.map((theme) => {
                              return (
                                <FormItem
                                  key={theme.id}
                                  className="flex items-center space-x-1 space-y-0 mr-3"
                                >
                                  <FormControl>
                                    <RadioGroupItem value={theme.id} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {theme.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            })
                          : null}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex flex-col items-center justify-center w-full">
                <p>Select at least one language for translate</p>
                <div className="flex flex-wrap space-x-4 mt-3">
                  <Button
                    onClick={handleClickAddRus}
                    variant={addRus ? "default" : "ghost"}
                    size="icon"
                  >
                    RUS
                    {addRus ? <Minus /> : <Plus />}
                  </Button>
                  <Button
                    onClick={handleClickAddEng}
                    variant={addEng ? "default" : "ghost"}
                    size="icon"
                  >
                    ENG
                    {addEng ? <Minus /> : <Plus />}
                  </Button>
                </div>
              </div>
              {addRus ? (
                <div>
                  <p>Translete to Russian</p>
                  <FormField
                    control={form.control}
                    name="toRusTranslate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <p className="mt-3">To russian</p>
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Write a phrase here"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="toRusTranscription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <p className="mt-3">Transcription</p>
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Write a phrase here"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : null}
              {addEng ? (
                <div>
                  <p>Translete to English</p>
                  <FormField
                    control={form.control}
                    name="toEngTranslate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <p className="mt-3">To english</p>
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Write a phrase here"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="toEngTranscription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <p className="mt-3">Transcription</p>
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Write a phrase here"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : null}

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
