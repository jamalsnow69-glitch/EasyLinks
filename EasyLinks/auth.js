
const STORAGE_KEY = 'linkapp_current_user'
const USERS_KEY = 'linkapp_users'
const PROFILES_KEY = 'linkapp_profiles'
const USERNAME_MAP_KEY = 'linkapp_username_map'


const GOOGLE_CLIENT_ID = '791535277980-os1mpr3lnhp030kmt8213el3qdm09lv3.apps.googleusercontent.com'

// Real Google sign-in using OAuth 2.0 Implicit Flow
export const signInWithGoogle = async () => {
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID.length > 10) {
    return new Promise((resolve, reject) => {
      try {
        const width = 500
        const height = 600
        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2
        
        // Use window.location.origin to dynamically get the correct redirect URI
        const redirectUri = window.location.origin + '/login'
        console.log('Redirect URI:', redirectUri)
        
        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
        authUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID)
        authUrl.searchParams.append('redirect_uri', redirectUri)
        authUrl.searchParams.append('response_type', 'token')
        authUrl.searchParams.append('scope', 'profile email')
        authUrl.searchParams.append('prompt', 'consent')
        
        console.log('Auth URL:', authUrl.toString())
        
        const popup = window.open(
          authUrl.toString(),
          'Google Login',
          `width=${width},height=${height},left=${left},top=${top}`
        )

        if (!popup) {
          reject(new Error('Popup blocked. Please allow popups for this site.'))
          return
        }

        const checkPopup = setInterval(() => {
          try {
            if (popup.closed) {
              clearInterval(checkPopup)
              reject(new Error('Login cancelled'))
              return
            }

            const popupUrl = popup.location.href
            
            if (popupUrl.includes('access_token=')) {
              const params = new URLSearchParams(popupUrl.split('#')[1])
              const accessToken = params.get('access_token')
              
              popup.close()
              clearInterval(checkPopup)
              
              fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` }
              })
              .then(res => res.json())
              .then(userInfo => {
                const user = {
                  uid: userInfo.sub,
                  displayName: userInfo.name,
                  email: userInfo.email,
                  photoURL: userInfo.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo.email}`,
                  accessToken
                }
                
                const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}')
                users[user.uid] = user
                localStorage.setItem(USERS_KEY, JSON.stringify(users))
                localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
                
                resolve(user)
              })
              .catch(reject)
            }
          } catch (e) {
            // Cross-origin access - expected until redirect
          }
        }, 500)
      } catch (error) {
        reject(error)
      }
    })
  }
  
  throw new Error('Please add your Google Client ID to auth.js')
}

export const logout = async () => {
  localStorage.removeItem(STORAGE_KEY)
}

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem(STORAGE_KEY)
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}

export const saveProfile = async (userId, profileData) => {
  try {
    const profiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || '{}')
    const usernameMap = JSON.parse(localStorage.getItem(USERNAME_MAP_KEY) || '{}')
    
    if (profiles[userId]?.username) {
      delete usernameMap[profiles[userId].username]
    }
    
    profiles[userId] = {
      ...profileData,
      userId,
      updatedAt: new Date().toISOString()
    }
    
    if (profileData.username) {
      usernameMap[profileData.username] = userId
    }
    
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
    localStorage.setItem(USERNAME_MAP_KEY, JSON.stringify(usernameMap))
    
    return true
  } catch (error) {
    console.error('Save profile error:', error)
    throw error
  }
}

export const getProfileByUserId = async (userId) => {
  try {
    const profiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || '{}')
    return profiles[userId] || null
  } catch (error) {
    console.error('Get profile error:', error)
    return null
  }
}

export const getProfileByUsername = async (username) => {
  try {
    const usernameMap = JSON.parse(localStorage.getItem(USERNAME_MAP_KEY) || '{}')
    const profiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || '{}')
    const userId = usernameMap[username]
    
    if (userId && profiles[userId]) {
      return profiles[userId]
    }
    return null
  } catch (error) {
    console.error('Get profile error:', error)
    return null
  }
}

export const onAuthStateChanged = (callback) => {
  const user = getCurrentUser()
  setTimeout(() => {
    callback(user)
  }, 0)
  
  return () => {}
}