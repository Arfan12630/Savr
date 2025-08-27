import './SavrLandingPage.css';

const SavrLandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="logo">SAVR</div>
        <nav className="nav">
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
          <button className="partner-button">Become a Partner</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <p className="badge">🍽️ Reserve smarter, eat happier</p>
        <h1 className="headline">RESERVE & PRE-ORDER WITH EASE</h1>
        <p className="subtext">
          Discover, reserve, and pre-order from your favorite restaurants. SAVR
          gives diners full control with seat maps, real-time availability, and
          AI-powered convenience.
        </p>
        <button className="cta-button">Download the App</button>

        {/* Stats */}
        <div className="stats">
          <div className="stat-block">
            <h2 className="stat-number">500+</h2>
            <p>Partner Restaurants</p>
          </div>
          <div className="stat-block">
            <h2 className="stat-number">1M+</h2>
            <p>Diners Seated</p>
          </div>
          <div className="stat-block">
            <h2 className="stat-number">∞</h2>
            <p>Memorable Meals</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export { SavrLandingPage };
