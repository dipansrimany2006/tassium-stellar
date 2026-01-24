import Link from "next/link"

export default function Studio() {
  return (
    <div className="container">
      <nav>
        <div className="logo">VOID©</div>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/works">Works</Link>
          <Link href="/studio">Studio</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>

      <section className="hero">
        <h1>
          THE
          <br />
          STUDIO
        </h1>
        <div className="hero-meta">
          <p>
            Founded in 2018, VOID operates at the intersection of design, technology, and culture. We believe in the
            power of restraint, the beauty of structure, and the importance of negative space.
          </p>
        </div>
      </section>

      <section style={{ padding: "100px 0", borderTop: "1px solid var(--accent)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "40px", marginBottom: "100px" }}>
          <div style={{ gridColumn: "1 / span 5" }}>
            <h2 style={{ fontSize: "48px", fontWeight: 900, marginBottom: "20px", textTransform: "uppercase" }}>
              Philosophy
            </h2>
          </div>
          <div style={{ gridColumn: "7 / span 6" }}>
            <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#888888", marginBottom: "30px" }}>
              We strip away the unnecessary to reveal the essential. Our approach is rooted in modernist principles,
              embracing grid systems, monochrome palettes, and bold typography.
            </p>
            <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#888888" }}>
              Every project is an opportunity to challenge conventions and push boundaries. We don't follow trends—we
              set them.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "40px", marginBottom: "100px" }}>
          <div style={{ gridColumn: "1 / span 5" }}>
            <h2 style={{ fontSize: "48px", fontWeight: 900, marginBottom: "20px", textTransform: "uppercase" }}>
              Team
            </h2>
          </div>
          <div style={{ gridColumn: "7 / span 6" }}>
            <div style={{ marginBottom: "40px" }}>
              <h3 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "10px" }}>Alex Chen</h3>
              <p style={{ fontSize: "14px", color: "#666666", textTransform: "uppercase", letterSpacing: "1px" }}>
                Creative Director
              </p>
            </div>
            <div style={{ marginBottom: "40px" }}>
              <h3 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "10px" }}>Maya Rodriguez</h3>
              <p style={{ fontSize: "14px", color: "#666666", textTransform: "uppercase", letterSpacing: "1px" }}>
                Lead Designer
              </p>
            </div>
            <div style={{ marginBottom: "40px" }}>
              <h3 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "10px" }}>Kai Nakamura</h3>
              <p style={{ fontSize: "14px", color: "#666666", textTransform: "uppercase", letterSpacing: "1px" }}>
                Technical Director
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "10px" }}>Zara Kowalski</h3>
              <p style={{ fontSize: "14px", color: "#666666", textTransform: "uppercase", letterSpacing: "1px" }}>
                Strategy Lead
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "40px" }}>
          <div style={{ gridColumn: "1 / span 5" }}>
            <h2 style={{ fontSize: "48px", fontWeight: 900, marginBottom: "20px", textTransform: "uppercase" }}>
              Locations
            </h2>
          </div>
          <div style={{ gridColumn: "7 / span 6" }}>
            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "10px" }}>Berlin</h3>
              <p style={{ fontSize: "16px", color: "#888888" }}>
                Kreuzberg Studio
                <br />
                Oranienstraße 42, 10999
              </p>
            </div>
            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "10px" }}>Tokyo</h3>
              <p style={{ fontSize: "16px", color: "#888888" }}>
                Shibuya Office
                <br />
                3-27-5 Shibuya, 150-0002
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "10px" }}>New York</h3>
              <p style={{ fontSize: "16px", color: "#888888" }}>
                Brooklyn Workshop
                <br />
                123 Wythe Ave, Brooklyn, NY 11249
              </p>
            </div>
          </div>
        </div>
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
  )
}
