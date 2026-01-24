"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import ServiceModal from "@/components/ServiceModal"

const servicesData = [
  {
    number: "01",
    title: "Visual Strategy",
    description:
      "We craft bold visual systems that define your brand's identity. From concept to execution, we create stark, memorable design languages that cut through the noise.",
    details: [
      "Brand Identity Development",
      "Visual System Architecture",
      "Design Language Creation",
      "Strategic Brand Positioning",
      "Market Analysis & Research",
    ],
  },
  {
    number: "02",
    title: "Interface Design",
    description:
      "Brutalist interfaces that prioritize function without sacrificing form. We design digital experiences that are direct, honest, and unforgettable.",
    details: [
      "Web & Mobile UI Design",
      "User Experience Strategy",
      "Interaction Design",
      "Design System Creation",
      "Prototyping & Testing",
    ],
  },
  {
    number: "03",
    title: "Type Foundry",
    description:
      "Custom typefaces engineered for impact. We develop proprietary fonts that become the cornerstone of your brand's visual voice.",
    details: [
      "Custom Typeface Design",
      "Font Family Development",
      "Typographic System Creation",
      "Variable Font Engineering",
      "Licensing & Technical Support",
    ],
  },
  {
    number: "04",
    title: "Motion Systems",
    description:
      "Dynamic design systems that bring static elements to life. We create motion languages that enhance usability and amplify brand personality.",
    details: [
      "Motion Design Systems",
      "Animation Principles",
      "Micro-interaction Design",
      "Loading & Transition States",
      "Video & Motion Graphics",
    ],
  },
]

export default function Home() {
  const [selectedService, setSelectedService] = useState<(typeof servicesData)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (service: (typeof servicesData)[0]) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedService(null), 300)
  }

  return (
    <>
      <div className="container">
        <nav>
          <div className="logo flex gap-2 ">
            <Image src="/TASSIUM.png" alt="Tassium Logo" width={38} height={38} />
            TASSIUM
          </div>
          <div className="nav-links">
            <Link href="/journal">DOCUMENTS</Link>
            <Link href="/contact">GET STARTED</Link>
          </div>
        </nav>

        <section className="hero">
          <h1>
            Distributed
            <br />
            Compute
            <br />
            Sharing
          </h1>
          <div className="hero-meta">
            <p>
              We are a multidisciplinary design practice operating at the intersection of brutalist aesthetics and
              digital precision. Crafting monochrome legacies for forward-thinking brands since 2018.
            </p>
          </div>
        </section>

        <section className="project-grid">
          <div className="project-card card-1">
            <div className="img-wrapper">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200"
                alt="Brutalist Architecture"
              />
            </div>
            <div className="project-info">
              <h3>Concrete Monolith</h3>
              <p>Architecture / Identity</p>
            </div>
          </div>

          <div className="project-card card-2">
            <div className="img-wrapper" style={{ aspectRatio: "3/4" }}>
              <img
                src="https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=800"
                alt="Minimalist Object"
              />
            </div>
            <div className="project-info">
              <h3>Nul System</h3>
              <p>Product Design</p>
            </div>
          </div>

          <div className="project-card card-3">
            <div className="img-wrapper" style={{ aspectRatio: "1/1" }}>
              <img
                src="https://images.unsplash.com/photo-1515462277126-2dd0c162007a?auto=format&fit=crop&q=80&w=800"
                alt="Editorial Design"
              />
            </div>
            <div className="project-info">
              <h3>Void Mag</h3>
              <p>Editorial / Type</p>
            </div>
          </div>

          <div className="project-card card-4">
            <div className="img-wrapper">
              <img
                src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200"
                alt="Abstract Pattern"
              />
            </div>
            <div className="project-info">
              <h3>Static Motion</h3>
              <p>Digital Experience</p>
            </div>
          </div>
        </section>

        <section className="services">
          {servicesData.map((service) => (
            <div
              key={service.number}
              className="service-row"
              onClick={() => openModal(service)}
              style={{ cursor: "pointer" }}
            >
              <span className="service-num">{service.number}</span>
              <h2>{service.title}</h2>
              <span className="service-num">↗</span>
            </div>
          ))}
        </section>

        <footer>
          <div className="cta">
            <h2>
              START A<br />
              REVOLUTION
            </h2>
          </div>
          <div className="footer-bottom">
            <div>VOID Studio © 2025</div>
            <div>Berlin / Tokyo / NYC</div>
            <div>Instagram / Twitter / Behance</div>
          </div>
        </footer>
      </div>

      <ServiceModal isOpen={isModalOpen} onClose={closeModal} service={selectedService} />
    </>
  )
}
