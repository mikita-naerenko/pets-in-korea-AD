import { NextResponse } from "next/server";
import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend("re_efwhafs2_MR4nFDkhnC1G4gxHcKZwm2cg");

export async function POST(req: Request) {
  console.log("pass");
  const body = await req.json();
  const { text } = body;
  try {
    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "Hello world",
      text: "test",
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
// git add .
// git commit -m 'test'
// git push
