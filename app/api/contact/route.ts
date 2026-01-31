import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import nodemailer from 'nodemailer'

// Validation schema
const contactSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

// Email transporter configuration
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = contactSchema.parse(body)
    
    // Send email to company
    const companyMailOptions = {
      from: process.env.SMTP_USER,
      to: 'info@kefkotravelagency.com',
      subject: `New Contact Form Submission from ${validatedData.fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${validatedData.fullName}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Phone:</strong> ${validatedData.phone}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${validatedData.message}</p>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            This message was sent from the Kefko Travel Agency contact form.
          </p>
        </div>
      `,
    }
    
    // Send confirmation email to customer
    const customerMailOptions = {
      from: process.env.SMTP_USER,
      to: validatedData.email,
      subject: 'Thank you for contacting Kefko Travel Agency',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank You for Contacting Us!</h2>
          <p>Dear ${validatedData.fullName},</p>
          <p>Thank you for reaching out to Kefko Travel Agency. We have received your message and will get back to you within 24 hours.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Message:</h3>
            <p style="white-space: pre-wrap;">${validatedData.message}</p>
          </div>
          
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Our Contact Information:</h3>
            <p><strong>Phone:</strong> +251 925 79 15 88</p>
            <p><strong>Email:</strong> info@kefkotravelagency.com</p>
            <p><strong>Address:</strong> Addis Ababa, Ethiopia</p>
          </div>
          
          <p>Best regards,<br/>The Kefko Travel Team</p>
        </div>
      `,
    }
    
    // Send emails
    await Promise.all([
      transporter.sendMail(companyMailOptions),
      transporter.sendMail(customerMailOptions)
    ])
    
    // Optionally save to database
    // await saveContactToDatabase(validatedData)
    
    return NextResponse.json(
      { message: 'Contact form submitted successfully' },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Contact form error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
