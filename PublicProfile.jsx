import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProfileByUsername } from './auth'

function PublicProfile() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfileByUsername(username)
        setProfile(data)
      } catch (error) {
        setProfile(null)
      }
      setLoading(false)
    }
    loadProfile()
  }, [username])

  if (loading) return (
    <div style={styles.loading}>
      <div style={styles.spinner}></div>
      <p>Loading profile...</p>
    </div>
  )
  
  if (!profile) return (
    <div style={styles.notFound}>
      <div style={styles.notFoundCard}>
        <h2 style={{ color: '#666', marginBottom: '8px' }}>Profile not found</h2>
        <p style={{ color: '#999', marginBottom: '24px' }}>
          The page @{username} doesn't exist yet.
        </p>
        <button onClick={() => navigate('/')} style={styles.homeBtn}>
          Go to Homepage
        </button>
      </div>
    </div>
  )

  const filteredLinks = profile.links?.filter(link => link.title && link.url) || []
  const hasSocialLinks = profile.socialLinks && Object.values(profile.socialLinks).some(url => url)

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img 
          src={profile.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
          alt="Avatar"
          style={styles.avatar}
          onError={(e) => { e.target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback" }}
        />
        <h1 style={styles.title}>@{profile.username || 'username'}</h1>
        {profile.displayName && <h2 style={styles.name}>{profile.displayName}</h2>}
        <p style={styles.bio}>{profile.bio || 'No bio yet'}</p>
        
        {filteredLinks.length > 0 && (
          <div style={styles.links}>
            {filteredLinks.map((link, index) => (
              <a 
                key={index}
                href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                style={styles.linkButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.title}
              </a>
            ))}
          </div>
        )}

        {hasSocialLinks && (
          <div style={styles.socialIcons}>
            {profile.socialLinks.twitter && (
              <a href={profile.socialLinks.twitter} style={styles.socialIcon} target="_blank" title="Twitter">𝕏</a>
            )}
            {profile.socialLinks.instagram && (
              <a href={profile.socialLinks.instagram} style={styles.socialIcon} target="_blank" title="Instagram">📷</a>
            )}
            {profile.socialLinks.linkedin && (
              <a href={profile.socialLinks.linkedin} style={styles.socialIcon} target="_blank" title="LinkedIn">💼</a>
            )}
            {profile.socialLinks.youtube && (
              <a href={profile.socialLinks.youtube} style={styles.socialIcon} target="_blank" title="YouTube">▶️</a>
            )}
            {profile.socialLinks.github && (
              <a href={profile.socialLinks.github} style={styles.socialIcon} target="_blank" title="GitHub">🐙</a>
            )}
          </div>
        )}

        <div style={styles.branding}>
          <span onClick={() => navigate('/')} style={styles.brandLink}>
            Powered by FreeLinks - Made by UCNMVC
          </span>
        </div>
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
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  loading: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    color: '#666',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #eee',
    borderTop: '3px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  notFound: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f5f5f5',
  },
  notFoundCard: {
    backgroundColor: 'white',
    padding: '48px',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    maxWidth: '400px',
  },
  homeBtn: {
    padding: '12px 24px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  card: {
    maxWidth: '680px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    border: '4px solid white',
    marginBottom: '16px',
    objectFit: 'cover',
  },
  title: {
    color: 'white',
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 0 4px 0',
  },
  name: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: '16px',
    fontWeight: '500',
    margin: '0 0 8px 0',
  },
  bio: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '14px',
    marginBottom: '32px',
    textAlign: 'center',
  },
  links: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  linkButton: {
    backgroundColor: 'white',
    color: '#333',
    padding: '16px 20px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    textAlign: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    border: 'none',
    width: '100%',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    boxSizing: 'border-box',
  },
  socialIcons: {
    display: 'flex',
    gap: '16px',
    marginTop: '32px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  socialIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    fontSize: '18px',
    color: '#764ba2',
    textDecoration: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  branding: {
    marginTop: '40px',
  },
  brandLink: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '12px',
    cursor: 'pointer',
    textDecoration: 'underline',
  }
}

export default PublicProfile