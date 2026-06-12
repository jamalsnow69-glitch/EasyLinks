import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithGoogle } from './auth.js'

function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const user = await signInWithGoogle()
      console.log('Logged in as:', user.displayName)
      navigate('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      setError(error.message || 'Login failed. Please add your Google Client ID to auth.js')
    }
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', marginBottom: '24px' }}>
          <h1 style={styles.logo}>EasyLinks</h1>
        </div>
        <h1 style={styles.title}>Welcome</h1>
        <p style={styles.subtitle}>Sign in with Google to manage your link page</p>
        
        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>
        )}
        
        <button 
          onClick={handleGoogleLogin} 
          style={{
            ...styles.googleBtn,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          disabled={loading}
        >
          {loading ? (
            <span>Connecting to Google...</span>
          ) : (
            <>
              <svg style={{ marginRight: '12px' }} width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </>
          )}
        </button>

        <p style={styles.footer}>Get your own for FREE page in seconds</p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    backgroundColor: 'white',
    padding: '48px 40px',
    borderRadius: '20px',
    textAlign: 'center',
    maxWidth: '420px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
  },
  logo: {
    fontSize: '28px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#666',
    marginBottom: '32px',
    fontSize: '16px',
  },
  googleBtn: {
    backgroundColor: 'white',
    color: '#333',
    border: '2px solid #e0e0e0',
    padding: '14px 24px',
    borderRadius: '12px',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    fontWeight: '600',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  errorBox: {
    backgroundColor: '#fff3f3',
    color: '#d32f2f',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    border: '1px solid #ffcdd2',
  },
  footer: {
    marginTop: '24px',
    color: '#999',
    fontSize: '14px',
  }
}

export default Login