import './App.css'

function App() {
  // Placeholder functions for API calls - to be implemented later
  const handleEvent1 = () => {
    console.log('Event 1 triggered - API endpoint to be connected')
    // TODO: Implement API call to endpoint 1
  }

  const handleEvent2 = () => {
    console.log('Event 2 triggered - API endpoint to be connected')
    // TODO: Implement API call to endpoint 2
  }

  return (
    <div className="app-container">
      <header className="hero-section">
        <div className="logo-container">
          <div className="extra-logo">EXTRA</div>
        </div>
        <h1 className="hero-title">Demo Event Triggers</h1>
        <p className="hero-subtitle">Integration Testing Platform</p>
      </header>

      <main className="main-content">
        <div className="info-card">
          <div className="info-icon">ℹ️</div>
          <h2>Demo Page Information</h2>
          <p>
            This is a demonstration page designed to trigger two different events
            for testing and integration purposes. Each button below will call a
            separate API endpoint to demonstrate event handling capabilities.
          </p>
        </div>

        <div className="actions-section">
          <h3>Event Triggers</h3>
          <div className="buttons-container">
            <button 
              className="event-button event-button-1"
              onClick={handleEvent1}
            >
              <span className="button-icon">🚀</span>
              <span className="button-text">Trigger Event 1</span>
            </button>
            
            <button 
              className="event-button event-button-2"
              onClick={handleEvent2}
            >
              <span className="button-icon">⚡</span>
              <span className="button-text">Trigger Event 2</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Extra.com Demo Meeting • {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
