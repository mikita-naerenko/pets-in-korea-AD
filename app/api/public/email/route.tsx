import { NextResponse } from "next/server";
import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  console.log("pass");
  const body = await req.json();
  const { text } = body;
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "Hello world",
    react: EmailTemplate({ text }),
  });

  if (error) {
    return new NextResponse(error.message, {
      status: 400,
    });
  }

  return NextResponse.json(data);
}
