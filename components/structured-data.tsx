"use client"

import Head from 'next/head'

interface StructuredDataProps {
  type?: 'Organization' | 'LocalBusiness'
}

export function StructuredData({ type = 'Organization' }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    "name": "Kefko Travel Agency",
    "description": "Expert travel services including flight booking, hotel reservations, tour packages, visa assistance, and travel insurance",
    "url": "https://kefkotravelagency.com",
    "logo": "https://kefkotravelagency.com/logo.png",
    "telephone": "+251925791588",
    "email": "info@kefkotravelagency.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "ET",
      "addressLocality": "Addis Ababa",
      "streetAddress": "Addis Ababa, Ethiopia"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "9.1450",
      "longitude": "40.4897"
    },
    "openingHours": "Mo-Fr 09:00-18:00",
    "sameAs": [
      "https://facebook.com/kefkotravel",
      "https://instagram.com/kefkotravel",
      "https://twitter.com/kefkotravel"
    ],
    "services": [
      "Flight Booking",
      "Hotel Reservations", 
      "Tour Packages",
      "Visa Assistance",
      "Travel Insurance",
      "Business Travel",
      "Holiday Packages"
    ],
    "areaServed": [
      "Ethiopia",
      "Dubai",
      "International"
    ],
    "paymentAccepted": [
      "Cash",
      "Credit Card",
      "Bank Transfer"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
