"use client"

import dynamic from "next/dynamic"

const Silk = dynamic(() => import("@/components/Silk"), { ssr: false })

export default function SilkBackground() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Silk
        speed={5}
        scale={1.5}
        color="#4a4a4a"
        noiseIntensity={1.5}
        rotation={0.2}
      />
    </div>
  )
}
