"use client"

import React from "react"
import Image from "next/image"
import { Users, Award, Globe, HeartHandshake } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function AboutSection() {
  const { t } = useLanguage()

  const stats = [
    { icon: Users, value: "10,000+", label: t.about.stats.travelers },
    { icon: Globe, value: "50+", label: t.about.stats.destinations },
    { icon: Award, value: "15+", label: t.about.stats.experience },
    { icon: HeartHandshake, value: "99%", label: t.about.stats.satisfaction },
  ]

  const teamMembers = [
    {
      name: t.about.team.members.ceo.name,
      role: t.about.team.members.ceo.role,
      image: "/team/ceo.jpg",
    },
    {
      name: t.about.team.members.operations.name,
      role: t.about.team.members.operations.role,
      image: "/team/operations.jpg",
    },
    {
      name: t.about.team.members.consultant.name,
      role: t.about.team.members.consultant.role,
      image: "/team/consultant.jpg",
    },
    {
      name: t.about.team.members.relations.name,
      role: t.about.team.members.relations.role,
      image: "/team/relations.jpg",
    },
  ]

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* About Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">{t.about.tagline}</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-2 mb-4 text-balance">
            {t.about.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            {t.about.subtitle}
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="mt-20 mb-20 grid md:grid-cols-2 gap-8">
          <div className="bg-primary/5 rounded-xl p-8 border border-primary/10">
            <h4 className="text-xl font-serif font-bold text-foreground mb-4">{t.about.mission.title}</h4>
            <p className="text-muted-foreground leading-relaxed">
              {t.about.mission.description}
            </p>
          </div>
          <div className="bg-accent/5 rounded-xl p-8 border border-accent/10">
            <h4 className="text-xl font-serif font-bold text-foreground mb-4">{t.about.vision.title}</h4>
            <p className="text-muted-foreground leading-relaxed">
              {t.about.vision.description}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-xl p-6 text-center border border-border hover:border-primary/30 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Our Team */}
        <div id="team" className="scroll-mt-24">
          <div className="text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">{t.about.team.tagline}</span>
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground mt-2 mb-4">
              {t.about.team.title}
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t.about.team.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5">
                  <h4 className="font-semibold text-foreground text-lg">{member.name}</h4>
                  <p className="text-primary text-sm font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
