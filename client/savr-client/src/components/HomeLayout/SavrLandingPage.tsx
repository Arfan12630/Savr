import './SavrLandingPage.css';

export function SavrLandingPage() {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <h1 className="logo">SAVR</h1>
        <nav
          className="nav"
          aria-label="Main navigation">
          <a href="#how">How it works</a>
          <a href="#restaurants">Restaurants</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
          <a
            href="#login"
            className="auth-link">
            Log in
          </a>
          <a
            href="#signup"
            className="auth-link">
            Sign up
          </a>
          <button
            type="button"
            className="partner-button">
            Become a Partner
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main>
        <section className="hero">
          <p className="badge">🍽️ Reserve smarter, eat happier</p>
          <h2 className="headline">RESERVE & PRE-ORDER WITH EASE</h2>
          <p className="subtext">
            Discover, reserve, and pre-order from your favorite restaurants.
            SAVR gives diners full control with seat maps, real-time
            availability, and AI-powered convenience.
          </p>
          <button
            type="button"
            className="cta-button">
            Download the App
          </button>

          {/* Stats */}
          <section
            className="stats"
            aria-label="Statistics">
            <article className="stat-block">
              <h3 className="stat-number">500+</h3>
              <p>Partner Restaurants</p>
            </article>
            <article className="stat-block">
              <h3 className="stat-number">1M+</h3>
              <p>Diners Seated</p>
            </article>
            <article className="stat-block">
              <h3 className="stat-number">∞</h3>
              <p>Memorable Meals</p>
            </article>
          </section>
        </section>
      </main>
    </div>
  );
}
