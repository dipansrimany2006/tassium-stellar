import Link from "next/link"

export default function Works() {
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
          SELECTED
          <br />
          WORKS
        </h1>
        <div className="hero-meta">
          <p>
            A curated collection of our most impactful projects. Each piece represents our commitment to stark
            aesthetics and uncompromising design excellence.
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
            <p>Architecture / Identity / 2024</p>
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
            <p>Product Design / 2024</p>
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
            <p>Editorial / Type / 2023</p>
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
            <p>Digital Experience / 2023</p>
          </div>
        </div>

        <div className="project-card card-1">
          <div className="img-wrapper">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
              alt="Modern Architecture"
            />
          </div>
          <div className="project-info">
            <h3>Axis Tower</h3>
            <p>Architecture / Branding / 2023</p>
          </div>
        </div>

        <div className="project-card card-2">
          <div className="img-wrapper" style={{ aspectRatio: "3/4" }}>
            <img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800"
              alt="Technology"
            />
          </div>
          <div className="project-info">
            <h3>Grid Protocol</h3>
            <p>Tech / Interface / 2022</p>
          </div>
        </div>

        <div className="project-card card-3">
          <div className="img-wrapper" style={{ aspectRatio: "1/1" }}>
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800"
              alt="Automotive"
            />
          </div>
          <div className="project-info">
            <h3>Velocity</h3>
            <p>Automotive / Motion / 2022</p>
          </div>
        </div>

        <div className="project-card card-4">
          <div className="img-wrapper">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200"
              alt="Space"
            />
          </div>
          <div className="project-info">
            <h3>Cosmic Grid</h3>
            <p>Data Visualization / 2022</p>
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
