import { NextResponse } from "next/server";
import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend("re_efwhafs2_MR4nFDkhnC1G4gxHcKZwm2cg");

export async function POST(req: Request) {
  const body = await req.json();
  const { text, email } = body;

  try {
    const data = await resend.emails.send({
      from: "Mikita <onboarding@resend.dev>",
      to: ["tetropak555666@gmail.com"],
      subject: "CTA-button",
      react: EmailTemplate({ text: text }) || "",
      //   text: text,
    });
    console.log(data);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
// git add .
// git commit -m 'test'
// git push
