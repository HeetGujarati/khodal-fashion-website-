"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { Star, CheckCircle2 } from "lucide-react";

export interface TestimonialItem {
  text: string;
  image: string;
  name: string;
  role: string;
  watchModel?: string;
  rating?: number;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: TestimonialItem[];
  duration?: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={props.className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: "100%", maxWidth: "370px" }}
    >
      <motion.div
        animate={{
          translateY: isHovered ? "var(--current-y, -25%)" : "-50%",
        }}
        transition={{
          duration: props.duration || 24,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-5 pb-5"
        style={{ willChange: "transform" }}
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role, watchModel, rating = 5 }, i) => (
                <div 
                  key={`${index}-${i}`}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid var(--border-subtle, #EAE7E0)",
                    borderRadius: "16px",
                    padding: "1.5rem 1.4rem",
                    boxShadow: "0 4px 16px rgba(18, 24, 38, 0.04)",
                    transition: "all 0.25s ease",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.85rem"
                  }}
                  className="hover:border-[#946C1F]/40 hover:shadow-lg transition-all"
                >
                  {/* Top Bar: 5 Gold Stars & Watch Tag */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                      {[...Array(rating)].map((_, starIdx) => (
                        <Star key={starIdx} size={14} fill="#D97706" color="#D97706" />
                      ))}
                    </div>
                    {watchModel && (
                      <span 
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: "var(--gold-primary, #946C1F)",
                          background: "var(--gold-light, #FAF6EE)",
                          border: "1px solid rgba(148, 108, 31, 0.22)",
                          padding: "2px 8px",
                          borderRadius: "20px",
                          letterSpacing: "0.02em"
                        }}
                      >
                        {watchModel}
                      </span>
                    )}
                  </div>

                  {/* Review Quote */}
                  <p 
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--text-primary, #1E293B)",
                      lineHeight: 1.65,
                      margin: 0,
                      fontWeight: 450
                    }}
                  >
                    "{text}"
                  </p>

                  {/* Bottom Author Row */}
                  <div 
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                      borderTop: "1px solid #F1EFEA",
                      paddingTop: "0.85rem",
                      marginTop: "0.25rem"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div 
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          border: "1.5px solid rgba(148, 108, 31, 0.35)",
                          flexShrink: 0,
                          boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
                        }}
                      >
                        <img
                          src={image}
                          alt={name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary, #0F172A)", lineHeight: 1.2 }}>
                          {name}
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "var(--text-secondary, #64748B)", marginTop: "2px" }}>
                          {role}
                        </div>
                      </div>
                    </div>

                    <div 
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: "var(--wa-green, #0F8A5F)",
                        background: "#F0FDF4",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        border: "1px solid #BBF7D0",
                        whiteSpace: "nowrap"
                      }}
                      title="Verified Khodal Fashion Buyer"
                    >
                      <CheckCircle2 size={12} />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
