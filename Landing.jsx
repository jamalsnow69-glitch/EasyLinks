import React from 'react'
import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>EasyLinks</h1>
        <div style={styles.navLinks}>
          <button onClick={() => navigate('/login')} style={styles.loginBtn}>Sign In</button>
        </div>
      </nav>

      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>
          Your links, all in one place
        </h2>
        <p style={styles.heroSubtitle}>
          Create a beautiful page to share everything you create, curate and sell online. 
          From YouTube videos to blog posts, products to projects — all your links in one page.
        </p>
        
        <div style={styles.ctaGroup}>
          <button onClick={() => navigate('/login')} style={styles.ctaBtn}>
            <span style={{ fontSize: '20px', marginRight: '10px' }}>G</span>
            Sign up with Google
          </button>
          <button onClick={() => navigate('/dashboard')} style={styles.previewBtn}>
            Try Demo Dashboard →
          </button>
        </div>

        <div style={styles.previewBox}>
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="Preview Avatar"
            style={styles.previewAvatar}
          />
          <p style={styles.previewUsername}>@yourname</p>
          <div style={styles.previewLink}>🌐 My Portfolio</div>
          <div style={styles.previewLink}>📝 Latest Blog Post</div>
          <div style={styles.previewLink}>🎥 YouTube Channel</div>
          <div style={styles.previewSocials}>
            <span>𝕏</span>
            <span>📷</span>
            <span>💼</span>
            <span>▶️</span>
          </div>
        </div>
      </div>

      <div style={styles.features}>
        <div style={styles.featureCard}>
          <span style={styles.featureIcon}>⚡</span>
          <h3>Quick Setup</h3>
          <p>Create your page in seconds. Just sign in with Google and customize.</p>
        </div>
        <div style={styles.featureCard}>
          <span style={styles.featureIcon}>🎨</span>
          <h3>Customizable</h3>
          <p>Add your links, social media, and bio to make it truly yours.</p>
        </div>
        <div style={styles.featureCard}>
          <span style={styles.featureIcon}>🔗</span>
          <h3>One Link</h3>
          <p>Share one link everywhere. Your own domain.com/username.</p>
        </div>
      </div>

      <div style={styles.howItWorks}>
        <h2 style={styles.sectionTitle}>How it works</h2>
        <div style={styles.steps}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <h4>Sign up with Google</h4>
            <p>No passwords to remember</p>
          </div>
          <div style={styles.stepDivider}>→</div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <h4>Customize your page</h4>
            <p>Add links, bio & social media</p>
          </div>
          <div style={styles.stepDivider}>→</div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <h4>Share your link</h4>
            <p>domain.com/yourname</p>
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>© 2026 EasyLinks. Built with ❤️</p>
      </footer>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#fafafa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    backgroundColor: 'white',
    borderBottom: '1px solid #eee',
  },
  logo: {
    fontSize: '24px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navLinks: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  loginBtn: {
    padding: '10px 24px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '80px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '800',
    marginBottom: '16px',
    maxWidth: '600px',
  },
  heroSubtitle: {
    fontSize: '18px',
    lineHeight: '1.6',
    maxWidth: '600px',
    opacity: '0.95',
    marginBottom: '40px',
  },
  ctaGroup: {
    display: 'flex',
    gap: '16px',
    marginBottom: '60px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ctaBtn: {
    padding: '16px 32px',
    backgroundColor: 'white',
    color: '#333',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  previewBtn: {
    padding: '16px 32px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.5)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
  },
  previewBox: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '16px',
    width: '300px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
  },
  previewAvatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    border: '3px solid #667eea',
    marginBottom: '8px',
  },
  previewUsername: {
    color: '#333',
    fontWeight: '600',
    marginBottom: '20px',
  },
  previewLink: {
    backgroundColor: '#f5f5f5',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '10px',
    color: '#333',
    fontSize: '14px',
    fontWeight: '500',
  },
  previewSocials: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '20px',
    color: '#667eea',
    fontSize: '20px',
  },
  features: {
    display: 'flex',
    gap: '24px',
    padding: '80px 40px',
    maxWidth: '1100px',
    margin: '0 auto',
    flexWrap: 'wrap',
  },
  featureCard: {
    flex: 1,
    minWidth: '250px',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  },
  featureIcon: {
    fontSize: '32px',
    marginBottom: '16px',
    display: 'block',
  },
  howItWorks: {
    padding: '80px 40px',
    backgroundColor: 'white',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '36px',
    fontWeight: '800',
    color: '#333',
    marginBottom: '60px',
  },
  steps: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '24px',
    maxWidth: '800px',
    margin: '0 auto',
    flexWrap: 'wrap',
  },
  step: {
    textAlign: 'center',
  },
  stepNumber: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#667eea',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 auto 12px',
  },
  stepDivider: {
    fontSize: '24px',
    color: '#667eea',
    fontWeight: '700',
  },
  footer: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
    fontSize: '14px',
  }
}

export default Landing