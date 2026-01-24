"use client"

import { useEffect } from "react"

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  service: {
    number: string
    title: string
    description: string
    details: string[]
  } | null
}

export default function ServiceModal({ isOpen, onClose, service }: ServiceModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      window.addEventListener("keydown", handleEscape)
    }
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  if (!isOpen || !service) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-header">
          <span className="modal-number">{service.number}</span>
          <h2 className="modal-title">{service.title}</h2>
        </div>

        <div className="modal-body">
          <p className="modal-description">{service.description}</p>

          <div className="modal-details">
            <h3>What We Deliver</h3>
            <ul>
              {service.details.map((detail, index) => (
                <li key={index}>
                  <span className="detail-marker">—</span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-cta" onClick={onClose}>
            LET'S DISCUSS YOUR PROJECT
          </button>
        </div>
      </div>
    </div>
  )
}
