import React from "react";
import { TestimonialsColumn, TestimonialItem } from "@/components/ui/testimonials-columns-1";
import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";
import { WhatsAppIcon as MessageCircle } from "../common/BrandIcons";

const testimonials: TestimonialItem[] = [
  {
    text: "Ordered the Tissot PRX Ice-Blue from Khodal Fashion. The finishing and weight of the solid steel bracelet feel authentic. Delivered in Surat within 2 days with full tin box packaging!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    name: "Aarav Patel",
    role: "Surat, Gujarat • Diamond Merchant",
    watchModel: "Tissot PRX 1853",
    rating: 5,
  },
  {
    text: "Was skeptical about ordering luxury timepieces online, but Khodal Fashion sent me a 4K wrist video on WhatsApp (+91 7575023434) before dispatch. The Casio G-Shock metal bezel is razor sharp!",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    name: "Vikram Malhotra",
    role: "Mumbai, Maharashtra • Banker",
    watchModel: "Casio G-Shock GM2100",
    rating: 5,
  },
  {
    text: "Purchased the Gucci Interlocking G Rose Gold for my anniversary. My wife absolutely loved the emerald dial and sparkle. The concierge assistance on WhatsApp was top-tier!",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    name: "Priya Sharma",
    role: "Delhi NCR • Creative Director",
    watchModel: "Gucci Interlocking G",
    rating: 5,
  },
  {
    text: "The Seiko 5 Sports automatic movement sweeps with mesmerizing precision. 1-year calibre warranty and cash on delivery option made the purchase completely risk-free.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    name: "Rohan Mukherjee",
    role: "Bengaluru, Karnataka • Architect",
    watchModel: "Seiko 5 Sports Diver",
    rating: 5,
  },
  {
    text: "The WhatsApp concierge service at +91 7575023434 is lightning fast! They answered all my questions about calibre power reserve and case diameter in minutes.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    name: "Ananya Iyer",
    role: "Chennai, Tamil Nadu • Consultant",
    watchModel: "Tissot Tiffany Blue",
    rating: 5,
  },
  {
    text: "Delivered to Ahmedabad in heavy-duty hardcase packaging with micro-fiber cloth and warranty certificate. Exceptional attention to horology detail.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    name: "Harsh Mehta",
    role: "Ahmedabad, Gujarat • Business Owner",
    watchModel: "Royal Oak Skeleton",
    rating: 5,
  },
  {
    text: "Superb mechanical skeleton watch! The exposed rotor and dial chamfers look like a 2 Lakh rupee timepiece. 100% recommended for every horology enthusiast.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    name: "Kavita Reddy",
    role: "Hyderabad, Telangana • Architect",
    watchModel: "Cartier Panthère Gold",
    rating: 5,
  },
  {
    text: "Best experience buying luxury watches in India. Instant WhatsApp order confirmation on 7575023434, no advance payment needed, and express courier tracking.",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    name: "Aditya Verma",
    role: "Pune, Maharashtra • Product Lead",
    watchModel: "Rolex Submariner Hulk",
    rating: 5,
  },
  {
    text: "Bought two watches—one chronograph and one automatic. Both keep perfect Swiss timing precision. Khodal Fashion has earned a client for life!",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    name: "Deepak Choudhary",
    role: "Jaipur, Rajasthan • Hotelier",
    watchModel: "Omega Speedmaster",
    rating: 5,
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export const Testimonials = () => {
  return (
    <section 
      style={{ 
        padding: "5rem 0", 
        background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 50%, #FFFFFF 100%)",
        borderTop: "1px solid var(--border-subtle, #E8E6DF)",
        borderBottom: "1px solid var(--border-subtle, #E8E6DF)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div className="container" style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 1.25rem" }}>
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 3rem auto" }}
        >
          {/* Eyebrow Tag */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--gold-light, #FAF6EE)", border: "1px solid var(--gold-border, rgba(148, 108, 31, 0.22))", padding: "0.35rem 0.95rem", borderRadius: "30px", marginBottom: "1rem" }}>
            <ShieldCheck size={14} color="var(--gold-primary, #946C1F)" />
            <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--gold-primary, #946C1F)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
              VERIFIED CLIENT EXPERIENCES • 4.9/5 RATED
            </span>
          </div>

          <h2 
            style={{ 
              fontFamily: "var(--font-heading, serif)",
              fontSize: "clamp(2rem, 4vw, 2.8rem)", 
              color: "var(--text-primary, #121826)", 
              fontWeight: 600,
              lineHeight: 1.2,
              marginBottom: "0.85rem",
              letterSpacing: "-0.01em"
            }}
          >
            Loved by Watch Lovers Across India
          </h2>

          <p style={{ fontSize: "0.95rem", color: "var(--text-secondary, #475467)", lineHeight: 1.7, margin: "0 auto" }}>
            Real reviews from happy customers in Mumbai, Delhi, Surat, Bengaluru, and beyond who ordered directly via our personal WhatsApp Concierge (+91 7575023434).
          </p>
        </motion.div>

        {/* 3-Column Smooth Infinite Marquee */}
        <div 
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1.5rem",
            maxHeight: "640px",
            overflow: "hidden",
            position: "relative",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)"
          }}
        >
          <TestimonialsColumn testimonials={firstColumn} duration={26} />
          <TestimonialsColumn testimonials={secondColumn} className="d-none d-md-block" duration={32} />
          <TestimonialsColumn testimonials={thirdColumn} className="d-none d-lg-block" duration={28} />
        </div>

        {/* Bottom Assurance Note */}
        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <a
            href="https://api.whatsapp.com/send?phone=917575023434&text=Hello%20Khodal%20Fashion!%20I%20want%20to%20view%20more%20client%20reviews%20and%20videos."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-gold btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.4rem", borderRadius: "30px" }}
          >
            <MessageCircle size={16} />
            <span>Chat on WhatsApp (+91 7575023434) to Request Client Wrist Videos</span>
          </a>
        </div>

      </div>
    </section>
  );
};

export default { Testimonials };
