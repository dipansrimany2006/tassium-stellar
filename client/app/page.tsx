"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import ServiceModal from "@/components/ServiceModal"
import { Links } from "@/constants/nav"
import { servicesData } from "@/constants/service"
import { HyperText } from "@/components/ui/hyper-text"

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
            {Links.map((link) => {
              return(
                <Link href={link.href}>{link.label}</Link>
              )
            })}
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
              Self-hosted container deployment platform. Deploy from GitHub to your own infrastructure with one click. No vendor lock-in.
            </p>
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
          <div className="cta grid place-items-center">
            <HyperText className="text-9xl font-black max-w-3xl">
              START DEPLOYING
            </HyperText>
          </div>
          <div className="footer-bottom">
            <div>Tassium © 2025</div>
            <div>Open Source / Self-Hosted</div>
            <div>GitHub / Discord / Twitter</div>
          </div>
        </footer>
      </div>

      <ServiceModal isOpen={isModalOpen} onClose={closeModal} service={selectedService} />
    </>
  )
}
