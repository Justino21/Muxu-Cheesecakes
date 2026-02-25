import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactFormData {
  name: string
  surname: string
  email: string
  phone?: string
  countryCode?: string
  message?: string
  turnstileToken?: string
}

interface TurnstileVerifyResponse {
  success: boolean
  "error-codes"?: string[]
}

async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) {
    console.error("TURNSTILE_SECRET_KEY not configured")
    return false
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      }
    )

    const data: TurnstileVerifyResponse = await response.json()
    return data.success
  } catch (error) {
    console.error("Turnstile verification error:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()
    const { name, surname, email, phone, countryCode, message, turnstileToken } = body

    // Validate required fields
    if (!name || !surname || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Verify Turnstile token
    if (!turnstileToken) {
      return NextResponse.json(
        { error: "CAPTCHA verification required" },
        { status: 400 }
      )
    }

    const isValidCaptcha = await verifyTurnstileToken(turnstileToken)
    if (!isValidCaptcha) {
      return NextResponse.json(
        { error: "CAPTCHA verification failed" },
        { status: 400 }
      )
    }

    // Format phone number if provided
    const formattedPhone = phone ? `${countryCode || ""} ${phone}` : "Not provided"

    // Send email to Muxu team
    const { data, error } = await resend.emails.send({
      from: "Muxu Contact Form <onboarding@resend.dev>",
      to: ["chisscake.cc@gmail.com"],
      replyTo: email,
      subject: `New Contact Form Submission from ${name} ${surname}`,
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FFF5EA;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3f210c; font-size: 28px; margin: 0;">MUXU</h1>
            <p style="color: #3f210c; opacity: 0.7; margin: 5px 0;">New Contact Form Submission</p>
          </div>
          
          <div style="background-color: white; border-radius: 12px; padding: 24px; border: 1px solid rgba(63, 33, 12, 0.1);">
            <h2 style="color: #3f210c; font-size: 20px; margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid rgba(63, 33, 12, 0.1); padding-bottom: 10px;">
              Contact Details
            </h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #3f210c; opacity: 0.7; width: 100px;">Name:</td>
                <td style="padding: 8px 0; color: #3f210c; font-weight: 500;">${name} ${surname}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #3f210c; opacity: 0.7;">Email:</td>
                <td style="padding: 8px 0; color: #3f210c; font-weight: 500;">
                  <a href="mailto:${email}" style="color: #3f210c;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #3f210c; opacity: 0.7;">Phone:</td>
                <td style="padding: 8px 0; color: #3f210c; font-weight: 500;">${formattedPhone}</td>
              </tr>
            </table>
            
            ${message ? `
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(63, 33, 12, 0.1);">
                <h3 style="color: #3f210c; font-size: 16px; margin-top: 0; margin-bottom: 10px;">Message:</h3>
                <p style="color: #3f210c; opacity: 0.85; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
            ` : ""}
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(63, 33, 12, 0.1);">
            <p style="color: #3f210c; opacity: 0.5; font-size: 12px; margin: 0;">
              This email was sent from the Muxu Cheesecakes contact form.
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      )
    }

    // Optionally send confirmation email to the user
    await resend.emails.send({
      from: "Muxu Cheesecakes <onboarding@resend.dev>",
      to: [email],
      subject: "Thank you for contacting Muxu Cheesecakes!",
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FFF5EA;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3f210c; font-size: 32px; margin: 0;">MUXU</h1>
            <p style="color: #3f210c; opacity: 0.7; margin: 5px 0; font-style: italic;">Cheesecakes</p>
          </div>
          
          <div style="background-color: white; border-radius: 12px; padding: 24px; border: 1px solid rgba(63, 33, 12, 0.1);">
            <h2 style="color: #3f210c; font-size: 20px; margin-top: 0;">Hello ${name}!</h2>
            
            <p style="color: #3f210c; opacity: 0.85; line-height: 1.6;">
              Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.
            </p>
            
            <p style="color: #3f210c; opacity: 0.85; line-height: 1.6;">
              In the meantime, feel free to explore our delicious cheesecakes at <a href="https://muxu.es" style="color: #3f210c; font-weight: 500;">muxu.es</a>
            </p>
            
            <p style="color: #3f210c; opacity: 0.85; line-height: 1.6; margin-top: 20px;">
              Warm regards,<br/>
              <strong>The Muxu Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #3f210c; opacity: 0.7; font-size: 14px; margin-bottom: 10px;">Follow us on social media</p>
            <a href="https://www.instagram.com/muxu.cheesecakes" style="color: #3f210c; text-decoration: none; margin: 0 10px;">Instagram</a>
            <a href="https://www.tiktok.com/@muxu.cheesecakes" style="color: #3f210c; text-decoration: none; margin: 0 10px;">TikTok</a>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(63, 33, 12, 0.1);">
            <p style="color: #3f210c; opacity: 0.5; font-size: 12px; margin: 0;">
              © 2025 Muxu Cheesecake. All rights reserved.
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
