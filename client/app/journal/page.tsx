import Link from "next/link"

export default function Journal() {
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
        <h1>JOURNAL</h1>
        <div className="hero-meta">
          <p>
            Thoughts on design, culture, and the future. Essays, case studies, and observations from the VOID
            collective.
          </p>
        </div>
      </section>

      <section className="services">
        <div className="service-row">
          <span className="service-num">01.15.25</span>
          <h2>The Death of Ornament</h2>
          <span className="service-num">↗</span>
        </div>
        <div className="service-row">
          <span className="service-num">01.08.25</span>
          <h2>Grid as Philosophy</h2>
          <span className="service-num">↗</span>
        </div>
        <div className="service-row">
          <span className="service-num">12.20.24</span>
          <h2>Monochrome Manifesto</h2>
          <span className="service-num">↗</span>
        </div>
        <div className="service-row">
          <span className="service-num">12.10.24</span>
          <h2>Beyond the Screen</h2>
          <span className="service-num">↗</span>
        </div>
        <div className="service-row">
          <span className="service-num">11.28.24</span>
          <h2>Type and Territory</h2>
          <span className="service-num">↗</span>
        </div>
        <div className="service-row">
          <span className="service-num">11.15.24</span>
          <h2>Void Spaces</h2>
          <span className="service-num">↗</span>
        </div>
        <div className="service-row">
          <span className="service-num">11.01.24</span>
          <h2>Digital Brutalism</h2>
          <span className="service-num">↗</span>
        </div>
        <div className="service-row">
          <span className="service-num">10.22.24</span>
          <h2>Form Follows Nothing</h2>
          <span className="service-num">↗</span>
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
