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

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div style={styles.notFound}>
        <div style={styles.notFoundCard}>
          <h2 style={styles.notFoundTitle}>Profile not found</h2>
          <p style={styles.notFoundText}>
            The page @{username} doesn&apos;t exist yet.
          </p>

          <button onClick={() => navigate('/')} style={styles.homeBtn}>
            Go to Homepage
          </button>
        </div>
      </div>
    )
  }

  const filteredLinks = profile.links?.filter(link => link.title && link.url) || []
  const hasSocialLinks =
    profile.socialLinks && Object.values(profile.socialLinks).some(url => url)

  const initial = (profile.username || profile.displayName || '?')
    .slice(0, 1)
    .toUpperCase()

  const safeUrl = (url) => {
    if (!url) return '#'
    return url.startsWith('http') ? url : `https://${url}`
  }

  return (
    <div style={styles.container}>
      <main style={styles.profileWrap}>
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt="Avatar"
            style={styles.avatar}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div style={styles.initialAvatar}>{initial}</div>
        )}

        <h1 style={styles.username}>@{profile.username || username}</h1>

        {profile.displayName && (
          <h2 style={styles.displayName}>{profile.displayName}</h2>
        )}

        <p style={styles.bio}>{profile.bio || 'No bio yet'}</p>

        {filteredLinks.length > 0 && (
          <div style={styles.mainLinks}>
            {filteredLinks.map((link, index) => (
              <a
                key={index}
                href={safeUrl(link.url)}
                style={styles.mainLinkButton}
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
              <a
                href={safeUrl(profile.socialLinks.twitter)}
                style={styles.socialIcon}
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter / X"
              >
                𝕏
              </a>
            )}

            {profile.socialLinks.instagram && (
              <a
                href={safeUrl(profile.socialLinks.instagram)}
                style={styles.socialIcon}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
              >
                📷
              </a>
            )}

            {profile.socialLinks.linkedin && (
              <a
                href={safeUrl(profile.socialLinks.linkedin)}
                style={styles.socialIcon}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
              >
                💼
              </a>
            )}

            {profile.socialLinks.youtube && (
              <a
                href={safeUrl(profile.socialLinks.youtube)}
                style={styles.socialIcon}
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
              >
                ▶️
              </a>
            )}

            {profile.socialLinks.github && (
              <a
                href={safeUrl(profile.socialLinks.github)}
                style={styles.socialIcon}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
              >
                🐙
              </a>
            )}
          </div>
        )}

        <div style={styles.branding}>
          <span onClick={() => navigate('/')} style={styles.brandLink}>
            Powered by EasyLinks - Made by UCNMVC
          </span>
        </div>
      </main>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '42px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    color: 'white',
    boxSizing: 'border-box',
  },

  profileWrap: {
    width: '100%',
    maxWidth: '620px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },

  avatar: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    border: '4px solid rgba(255,255,255,0.95)',
    marginBottom: '18px',
    objectFit: 'cover',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  initialAvatar: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    border: '4px solid rgba(255,255,255,0.95)',
    marginBottom: '18px',
    display: 'grid',
    placeItems: 'center',
    fontSize: '48px',
    fontWeight: '400',
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  username: {
    color: 'white',
    fontSize: '20px',
    fontWeight: '800',
    margin: '0 0 4px 0',
    lineHeight: '1.1',
  },

  displayName: {
    color: 'white',
    fontSize: '16px',
    fontWeight: '800',
    margin: '0 0 22px 0',
    lineHeight: '1.3',
  },

  bio: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: '14px',
    lineHeight: '1.5',
    margin: '0 auto 58px',
    maxWidth: '420px',
    textAlign: 'center',
    whiteSpace: 'pre-wrap',
  },

  mainLinks: {
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '34px',
  },

  mainLinkButton: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    color: '#222',
    padding: '15px 18px',
    borderRadius: '14px',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '700',
    textAlign: 'center',
    boxShadow: '0 8px 22px rgba(0,0,0,0.12)',
    boxSizing: 'border-box',
  },

  socialIcons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '42px',
  },

  socialIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.96)',
    color: '#222',
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
    border: 'none',
    fontSize: '20px',
    textDecoration: 'none',
    boxShadow: '0 8px 22px rgba(0,0,0,0.12)',
  },

  branding: {
    marginTop: '4px',
  },

  brandLink: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: '12px',
    cursor: 'pointer',
    textDecoration: 'underline',
  },

  loading: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    color: 'white',
    gap: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  },

  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255,255,255,0.35)',
    borderTop: '3px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  notFound: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  },

  notFoundCard: {
    backgroundColor: 'white',
    padding: '48px',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    maxWidth: '400px',
  },

  notFoundTitle: {
    color: '#333',
    marginBottom: '8px',
  },

  notFoundText: {
    color: '#777',
    marginBottom: '24px',
  },

  homeBtn: {
    padding: '12px 24px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '700',
  },
}

export default PublicProfile