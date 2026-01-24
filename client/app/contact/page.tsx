import Link from "next/link"

export default function Contact() {
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
          LET'S
          <br />
          TALK
        </h1>
        <div className="hero-meta">
          <p>
            Have a project in mind? We're always interested in hearing about new collaborations and opportunities to
            create something extraordinary.
          </p>
        </div>
      </section>

      <section style={{ padding: "100px 0", borderTop: "1px solid var(--accent)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "40px" }}>
          <div style={{ gridColumn: "1 / span 5" }}>
            <h2 style={{ fontSize: "48px", fontWeight: 900, marginBottom: "40px", textTransform: "uppercase" }}>
              Get in Touch
            </h2>
            <div style={{ marginBottom: "40px" }}>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666666",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "10px",
                }}
              >
                General Inquiries
              </p>
              <a href="mailto:hello@void.studio" style={{ fontSize: "24px", color: "#ffffff", textDecoration: "none" }}>
                hello@void.studio
              </a>
            </div>
            <div style={{ marginBottom: "40px" }}>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666666",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "10px",
                }}
              >
                New Business
              </p>
              <a href="mailto:work@void.studio" style={{ fontSize: "24px", color: "#ffffff", textDecoration: "none" }}>
                work@void.studio
              </a>
            </div>
            <div>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666666",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "10px",
                }}
              >
                Press
              </p>
              <a href="mailto:press@void.studio" style={{ fontSize: "24px", color: "#ffffff", textDecoration: "none" }}>
                press@void.studio
              </a>
            </div>
          </div>

          <div style={{ gridColumn: "7 / span 6" }}>
            <form style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    color: "#666666",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  Name *
                </label>
                <input
                  type="text"
                  required
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid var(--accent)",
                    color: "#ffffff",
                    fontSize: "18px",
                    padding: "10px 0",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    color: "#666666",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  required
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid var(--accent)",
                    color: "#ffffff",
                    fontSize: "18px",
                    padding: "10px 0",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    color: "#666666",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  Project Details *
                </label>
                <textarea
                  required
                  rows={6}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid var(--accent)",
                    color: "#ffffff",
                    fontSize: "18px",
                    padding: "10px 0",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  alignSelf: "flex-start",
                  background: "#ffffff",
                  color: "#000000",
                  border: "none",
                  padding: "20px 60px",
                  fontSize: "14px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <section style={{ padding: "100px 0", borderTop: "1px solid var(--accent)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
          <div>
            <h3 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "20px", textTransform: "uppercase" }}>
              Berlin
            </h3>
            <p style={{ fontSize: "16px", color: "#888888", lineHeight: "1.8" }}>
              Kreuzberg Studio
              <br />
              Oranienstraße 42
              <br />
              10999 Berlin
              <br />
              Germany
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "20px", textTransform: "uppercase" }}>
              Tokyo
            </h3>
            <p style={{ fontSize: "16px", color: "#888888", lineHeight: "1.8" }}>
              Shibuya Office
              <br />
              3-27-5 Shibuya
              <br />
              150-0002 Tokyo
              <br />
              Japan
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "20px", textTransform: "uppercase" }}>
              New York
            </h3>
            <p style={{ fontSize: "16px", color: "#888888", lineHeight: "1.8" }}>
              Brooklyn Workshop
              <br />
              123 Wythe Ave
              <br />
              Brooklyn, NY 11249
              <br />
              United States
            </p>
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
