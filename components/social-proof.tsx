"use client"

import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Sarah Chen",
    avatar: "/diverse-woman-smiling.png",
    rating: 5,
    text: "The Christmas Velvet Dream brought back memories of my childhood holidays. Every bite was pure nostalgia mixed with luxury.",
    location: "New York, NY",
  },
  {
    name: "Michael Rodriguez",
    avatar: "/man-happy.jpg",
    rating: 5,
    text: "Ordered for our family gathering and it was the star of the table. The craftsmanship is evident in every layer.",
    location: "Austin, TX",
  },
  {
    name: "Emily Watson",
    avatar: "/professional-woman.png",
    rating: 5,
    text: "As someone who bakes professionally, I can truly appreciate the perfection in these cheesecakes. Simply outstanding.",
    location: "Portland, OR",
  },
]

export function SocialProof() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          <div className="text-center">
            <div className="font-serif text-5xl md:text-6xl font-bold text-primary mb-2">10k+</div>
            <div className="text-muted-foreground font-medium">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="font-serif text-5xl md:text-6xl font-bold text-primary mb-2">4.9</div>
            <div className="text-muted-foreground font-medium">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="font-serif text-5xl md:text-6xl font-bold text-primary mb-2">100%</div>
            <div className="text-muted-foreground font-medium">Handcrafted</div>
          </div>
          <div className="text-center">
            <div className="font-serif text-5xl md:text-6xl font-bold text-primary mb-2">24hrs</div>
            <div className="text-muted-foreground font-medium">Fresh Guarantee</div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-balance">Loved by Families Everywhere</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands who have made Muxu part of their celebrations and everyday moments.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                  <AvatarFallback>
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                </div>

              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed">"{testimonial.text}"</p>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-8 mt-16 pt-12 border-t border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Free Shipping Over $50</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="font-medium">Satisfaction Guaranteed</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">Same-Day Processing</span>
          </div>
        </div>
      </div>
    </section>
  )
}
