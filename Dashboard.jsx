import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout, saveProfile, getProfileByUserId, onAuthStateChanged } from './auth'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const [profile, setProfile] = useState({
    username: '',
    displayName: '',
    bio: '',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    links: [
      { title: '', url: '' }
    ],
    socialLinks: {
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: '',
      github: '',
      discord: ''
    }
  })

  useEffect(() => {
    let mounted = true

    const unsubscribe = onAuthStateChanged(async (currentUser) => {
      if (!mounted) return
      
      if (currentUser) {
        setUser(currentUser)
        try {
          const savedProfile = await getProfileByUserId(currentUser.uid)
          if (savedProfile && mounted) {
            setProfile(savedProfile)
          } else if (mounted) {
            setProfile(prev => ({
              ...prev,
              displayName: currentUser.displayName || '',
              avatar: currentUser.photoURL || prev.avatar
            }))
          }
        } catch (err) {
          console.error('Error loading profile:', err)
        }
      } else {
        setUser(null)
      }
      if (mounted) setLoading(false)
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  const handleSave = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!profile.username) {
      alert('Please enter a username')
      return
    }
    setSaving(true)
    try {
      await saveProfile(user.uid, { 
        ...profile, 
        email: user.email,
        photoURL: user.photoURL,
        updatedAt: new Date().toISOString(),
        createdAt: profile.createdAt || new Date().toISOString()
      })
      alert('Profile saved! Your page is ready at /' + profile.username)
    } catch (error) {
      console.error('Save error:', error)
      alert('Error saving profile: ' + error.message)
    }
    setSaving(false)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const addLink = () => {
    setProfile({
      ...profile,
      links: [...profile.links, { title: '', url: '' }]
    })
  }

  const removeLink = (index) => {
    const newLinks = profile.links.filter((_, i) => i !== index)
    setProfile({ ...profile, links: newLinks })
  }

  const updateLink = (index, field, value) => {
    const newLinks = [...profile.links]
    newLinks[index][field] = value
    setProfile({ ...profile, links: newLinks })
  }

  if (loading) return (
    <div style={styles.loading}>
      <div style={styles.spinner}></div>
      <p>Loading...</p>
    </div>
  )

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <h2 style={styles.logo}>FreeLinks</h2>
        </div>
        <div style={styles.nav}>
          <div style={{...styles.navItem, backgroundColor: '#667eea', color: 'white'}}>📊 Dashboard</div>
          <div style={styles.navItem}>🔗 My Links</div>
          <div style={styles.navItem}>👁️ Appearance</div>
          <div style={styles.navItem}>⚙️ Settings</div>
        </div>
        <div style={styles.userSection}>
          {user && (
            <div style={styles.userInfo}>
              <img 
                src={user.photoURL} 
                style={styles.userAvatar} 
                alt="" 
                onError={(e) => { e.target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=default" }}
              />
              <span style={styles.userName}>{user.displayName}</span>
            </div>
          )}
          {user ? (
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          ) : (
            <button onClick={() => navigate('/login')} style={styles.loginBtn}>Login</button>
          )}
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px' }}>Edit Your Profile</h1>
            {user && profile.username && (
              <p style={{ color: '#666', marginTop: '8px' }}>
                Your page: <a href={`/${profile.username}`} target="_blank" style={styles.previewLink}>
                  {window.location.origin}/{profile.username}
                </a>
              </p>
            )}
            {!user && (
              <p style={{ color: '#ff4757', marginTop: '8px' }}>
                Please <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>log in</span> to save your profile
              </p>
            )}
          </div>
        </div>

        <div style={styles.formGrid}>
          <div style={styles.formSection}>
            <div style={styles.sectionHeader}>
              <h3>Basic Info</h3>
            </div>
            
            <label style={styles.label}>Username *</label>
            <div style={styles.usernameInput}>
              <span style={styles.domainPrefix}>{window.location.hostname}/</span>
              <input
                placeholder="yourname"
                value={profile.username}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
                  setProfile({...profile, username: value})
                }}
                style={{...styles.input, paddingLeft: '8px', marginBottom: 0}}
              />
            </div>
            <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              This will be your public link URL
            </p>

            <label style={styles.label}>Display Name</label>
            <input
              placeholder="Your Name"
              value={profile.displayName}
              onChange={(e) => setProfile({...profile, displayName: e.target.value})}
              style={styles.input}
            />

            <label style={styles.label}>Bio</label>
            <textarea
              placeholder="Tell people about yourself..."
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              style={{...styles.input, height: '100px', resize: 'vertical'}}
            />

            <label style={styles.label}>Avatar URL</label>
            <input
              placeholder="https://..."
              value={profile.avatar}
              onChange={(e) => setProfile({...profile, avatar: e.target.value})}
              style={styles.input}
            />
            {profile.avatar && (
              <img 
                src={profile.avatar} 
                alt="Avatar preview" 
                style={{ width: '60px', height: '60px', borderRadius: '50%', marginTop: '8px', border: '2px solid #ddd' }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            )}
          </div>

          <div style={styles.formSection}>
            <div style={styles.sectionHeader}>
              <h3>Your Links</h3>
              <button onClick={addLink} style={styles.addBtn}>+ Add Link</button>
            </div>
            
            {profile.links.map((link, index) => (
              <div key={index} style={styles.linkCard}>
                <div style={styles.linkCardHeader}>
                  <span style={{ fontWeight: '600', color: '#666' }}>Link #{index + 1}</span>
                  <button onClick={() => removeLink(index)} style={styles.removeBtn}>×</button>
                </div>
                <div style={styles.linkInputs}>
                  <input
                    placeholder="Title (e.g., My Portfolio)"
                    value={link.title}
                    onChange={(e) => updateLink(index, 'title', e.target.value)}
                    style={styles.input}
                  />
                  <input
                    placeholder="URL (e.g., https://example.com)"
                    value={link.url}
                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={styles.formSection}>
            <div style={styles.sectionHeader}>
              <h3>Social Links</h3>
            </div>
            {Object.entries(profile.socialLinks).map(([platform, value]) => (
              <div key={platform}>
                <label style={styles.label}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </label>
                <input
                  placeholder={`https://${platform}.com/yourprofile`}
                  value={value}
                  onChange={(e) => setProfile({
                    ...profile, 
                    socialLinks: {...profile.socialLinks, [platform]: e.target.value}
                  })}
                  style={styles.input}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={styles.saveSection}>
          <button onClick={handleSave} style={styles.saveBtn} disabled={saving}>
            {saving ? '💾 Saving...' : '💾 Save Profile'}
          </button>
          {user && (
            <button 
              onClick={() => window.open(`/${profile.username}`, '_blank')}
              style={styles.viewBtn}
              disabled={!profile.username}
            >
              👁️ View Public Page
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  sidebar: {
    width: '260px',
    backgroundColor: 'white',
    padding: '24px',
    borderRight: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    height: '100vh',
  },
  logo: {
    fontSize: '22px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '24px',
  },
  nav: {
    flex: 1,
  },
  navItem: {
    padding: '12px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '4px',
    color: '#666',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  userSection: {
    borderTop: '1px solid #eee',
    paddingTop: '16px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  logoutBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#ff4757',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  loginBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  main: {
    flex: 1,
    padding: '32px',
    overflow: 'auto',
    maxWidth: '800px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
  },
  previewLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
  },
  formGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  formSection: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid #eee',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#555',
    marginBottom: '6px',
    marginTop: '12px',
  },
  usernameInput: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  domainPrefix: {
    padding: '12px',
    backgroundColor: '#f5f5f5',
    color: '#999',
    fontSize: '14px',
    borderRight: '1px solid #ddd',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    marginBottom: '8px',
    outline: 'none',
  },
  addBtn: {
    padding: '8px 16px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
  linkCard: {
    backgroundColor: '#f8f9fa',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  linkCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  linkInputs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  removeBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ff4757',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '0 4px',
  },
  saveSection: {
    marginTop: '24px',
    display: 'flex',
    gap: '12px',
  },
  saveBtn: {
    padding: '14px 32px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '600',
    flex: 1,
  },
  viewBtn: {
    padding: '14px 24px',
    backgroundColor: 'white',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
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
  }
}

export default Dashboard