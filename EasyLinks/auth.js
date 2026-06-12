import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

const STORAGE_KEY = 'linkapp_current_user'

const GOOGLE_CLIENT_ID = '791535277980-os1mpr3lnhp030kmt8213el3qdm09lv3.apps.googleusercontent.com'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

function cleanUsername(username) {
  return String(username || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 24)
}

function toAppProfile(row) {
  if (!row) return null

  return {
    id: row.id,
    userId: row.user_id,
    username: row.username || '',
    displayName: row.display_name || '',
    bio: row.bio || '',
    avatar: row.avatar || '',
    links: Array.isArray(row.links) ? row.links : [],
    socialLinks: row.social_links || {
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: '',
      github: '',
      discord: ''
    },
    email: row.email || '',
    photoURL: row.photo_url || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export const signInWithGoogle = async () => {
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID.length > 10) {
    return new Promise((resolve, reject) => {
      try {
        const width = 500
        const height = 600
        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2

        const redirectUri = window.location.origin + '/login'

        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
        authUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID)
        authUrl.searchParams.append('redirect_uri', redirectUri)
        authUrl.searchParams.append('response_type', 'token')
        authUrl.searchParams.append('scope', 'profile email')
        authUrl.searchParams.append('prompt', 'consent')

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
                    photoURL:
                      userInfo.picture ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo.email}`,
                    accessToken
                  }

                  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
                  resolve(user)
                })
                .catch(reject)
            }
          } catch (e) {
            // Cross-origin access is expected until Google redirects back.
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
  const username = cleanUsername(profileData.username)

  if (!userId) {
    throw new Error('Missing user ID')
  }

  if (!username) {
    throw new Error('Username is required')
  }

  const row = {
    user_id: String(userId),
    username,
    display_name: profileData.displayName || '',
    bio: profileData.bio || '',
    avatar: profileData.avatar || '',
    links: Array.isArray(profileData.links) ? profileData.links : [],
    social_links: profileData.socialLinks || {},
    email: profileData.email || '',
    photo_url: profileData.photoURL || '',
    updated_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert(row, {
      onConflict: 'user_id'
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return toAppProfile(data)
}

export const getProfileByUserId = async (userId) => {
  if (!userId) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', String(userId))
    .maybeSingle()

  if (error) {
    throw error
  }

  return toAppProfile(data)
}

export const getProfileByUsername = async (username) => {
  const clean = cleanUsername(username)

  if (!clean) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', clean)
    .maybeSingle()

  if (error) {
    throw error
  }

  return toAppProfile(data)
}

export const onAuthStateChanged = (callback) => {
  const user = getCurrentUser()

  setTimeout(() => {
    callback(user)
  }, 0)

  return () => {}
}