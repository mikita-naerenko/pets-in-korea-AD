import { NextResponse } from "next/server";
import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend("re_efwhafs2_MR4nFDkhnC1G4gxHcKZwm2cg");

export async function OPTIONS(request: Request) {
  return new Response("Hello, Next.js!", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "https://pets-in-korea.com/",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { text, email, name } = body;
  if (req.method === "OPTIONS") {
    // Handle preflight requests

    return NextResponse.json({ status: "ok" });
  }

  try {
    if (!text && !email) {
      return new NextResponse(
        "Адрес почты и текст сообщения - обязательные поля!",
        {
          status: 400,
        }
      );
    }
    const data = await resend.emails.send({
      from: "Mikita <onboarding@resend.dev>",
      to: ["tetropak555666@gmail.com"],
      subject: "CTA-button",
      react: EmailTemplate({ text: text, email: email, name: name }) || "",
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
