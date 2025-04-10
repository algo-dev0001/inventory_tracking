<template>
    <v-container class="py-8">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-2">User Profile</h1>
        <p class="text-subtitle-1 mb-6">Manage your account details and preferences</p>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col cols="12" md="4">
        <!-- Profile Card -->
        <v-card class="mb-6">
          <v-card-text class="text-center py-6">
            <v-avatar size="120" class="mb-4">
              <v-img :src="profile.picture" cover></v-img>
            </v-avatar>
            <h2 class="text-h5 font-weight-bold mb-1">{{ profile.name }}</h2>
            <p class="text-subtitle-1 text-medium-emphasis mb-3">{{ profile.email }}</p>
            <v-chip color="primary" size="small">{{ profile.role }}</v-chip>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn 
              block 
              variant="text" 
              color="primary"
              prepend-icon="mdi-pencil"
              @click="editProfileDialog = true"
            >
              Edit Profile
            </v-btn>
          </v-card-actions>
        </v-card>
        
        <!-- Profile Menu -->
        <v-card>
          <v-list>
            <v-list-item 
              v-for="item in menuItems" 
              :key="item.title"
              :prepend-icon="item.icon"
              :title="item.title"
              :active="activeSection === item.value"
              @click="activeSection = item.value"
            ></v-list-item>
          </v-list>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="8">
        <!-- Personal Info Section -->
        <v-card v-if="activeSection === 'personal'" class="mb-6">
          <v-card-title class="d-flex align-center justify-space-between">
            <h2 class="text-h5">Personal Information</h2>
            <v-btn 
              icon
              variant="text"
              color="primary"
              @click="editPersonalInfo = true"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <p class="text-overline mb-1">Full Name</p>
                <p class="text-body-1">{{ profile.name }}</p>
              </v-col>
              <v-col cols="12" sm="6">
                <p class="text-overline mb-1">Email</p>
                <p class="text-body-1">{{ profile.email }}</p>
              </v-col>
              <v-col cols="12" sm="6">
                <p class="text-overline mb-1">Phone</p>
                <p class="text-body-1">{{ profile.phone }}</p>
              </v-col>
              <v-col cols="12" sm="6">
                <p class="text-overline mb-1">Location</p>
                <p class="text-body-1">{{ profile.location }}</p>
              </v-col>
              <v-col cols="12">
                <p class="text-overline mb-1">Bio</p>
                <p class="text-body-1">{{ profile.bio }}</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        
        <!-- Account Settings Section -->
        <v-card v-if="activeSection === 'account'" class="mb-6">
          <v-card-title>
            <h2 class="text-h5">Account Settings</h2>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <h3 class="text-subtitle-1 font-weight-bold mb-3">Password</h3>
            <v-btn 
              color="primary" 
              variant="outlined"
              prepend-icon="mdi-lock-reset"
              @click="changePasswordDialog = true"
              class="mb-6"
            >
              Change Password
            </v-btn>
            
            <h3 class="text-subtitle-1 font-weight-bold mb-3">Two-Factor Authentication</h3>
            <v-switch
              v-model="profile.twoFactorEnabled"
              label="Enable Two-Factor Authentication"
              color="primary"
              hide-details
              class="mb-6"
            ></v-switch>
            
            <h3 class="text-subtitle-1 font-weight-bold mb-3">Email Preferences</h3>
            <v-checkbox
              v-model="profile.emailPreferences.updates"
              label="Product Updates"
              color="primary"
              hide-details
              class="mb-2"
            ></v-checkbox>
            <v-checkbox
              v-model="profile.emailPreferences.alerts"
              label="Price and Stock Alerts"
              color="primary"
              hide-details
              class="mb-2"
            ></v-checkbox>
            <v-checkbox
              v-model="profile.emailPreferences.newsletter"
              label="Newsletter"
              color="primary"
              hide-details
              class="mb-6"
            ></v-checkbox>
            
            <v-btn color="primary" class="mt-4" @click="savePreferences">
              Save Preferences
            </v-btn>
          </v-card-text>
        </v-card>
        
        <!-- Integrations Section -->
        <v-card v-if="activeSection === 'integrations'" class="mb-6">
          <v-card-title>
            <h2 class="text-h5">Connected Accounts</h2>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-list>
              <v-list-item v-for="(connection, index) in connections" :key="index">
                <template v-slot:prepend>
                  <v-avatar color="primary" size="36">
                    <v-icon color="white">{{ connection.icon }}</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ connection.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ connection.connected ? 'Connected' : 'Not Connected' }}
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn 
                    :color="connection.connected ? 'error' : 'primary'" 
                    size="small"
                    variant="text"
                  >
                    {{ connection.connected ? 'Disconnect' : 'Connect' }}
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
        
        <!-- Notification Settings Section -->
        <v-card v-if="activeSection === 'notifications'" class="mb-6">
          <v-card-title>
            <h2 class="text-h5">Notification Settings</h2>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-list>
              <v-list-subheader>Price Alerts</v-list-subheader>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="error">mdi-currency-usd</v-icon>
                </template>
                <v-list-item-title>Price Increases</v-list-item-title>
                <template v-slot:append>
                  <v-switch
                    v-model="notifications.priceIncreases"
                    color="primary"
                    hide-details
                  ></v-switch>
                </template>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="success">mdi-currency-usd</v-icon>
                </template>
                <v-list-item-title>Price Decreases</v-list-item-title>
                <template v-slot:append>
                  <v-switch
                    v-model="notifications.priceDecreases"
                    color="primary"
                    hide-details
                  ></v-switch>
                </template>
              </v-list-item>
              
              <v-divider class="my-3"></v-divider>
              
              <v-list-subheader>Stock Alerts</v-list-subheader>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="warning">mdi-alert-circle</v-icon>
                </template>
                <v-list-item-title>Low Stock</v-list-item-title>
                <template v-slot:append>
                  <v-switch
                    v-model="notifications.lowStock"
                    color="primary"
                    hide-details
                  ></v-switch>
                </template>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="success">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title>Back in Stock</v-list-item-title>
                <template v-slot:append>
                  <v-switch
                    v-model="notifications.backInStock"
                    color="primary"
                    hide-details
                  ></v-switch>
                </template>
              </v-list-item>
              
              <v-divider class="my-3"></v-divider>
              
              <v-list-subheader>Delivery Method</v-list-subheader>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-email</v-icon>
                </template>
                <v-list-item-title>Email</v-list-item-title>
                <template v-slot:append>
                  <v-switch
                    v-model="notifications.email"
                    color="primary"
                    hide-details
                  ></v-switch>
                </template>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-bell</v-icon>
                </template>
                <v-list-item-title>App Notifications</v-list-item-title>
                <template v-slot:append>
                  <v-switch
                    v-model="notifications.app"
                    color="primary"
                    hide-details
                  ></v-switch>
                </template>
              </v-list-item>
            </v-list>

            <v-btn color="primary" class="mt-6" @click="saveNotifications">
              Save Notification Settings
            </v-btn>
          </v-card-text>
        </v-card>
        
        <!-- API Access Section -->
        <v-card v-if="activeSection === 'api'" class="mb-6">
          <v-card-title>
            <h2 class="text-h5">API Access</h2>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <p class="text-body-1 mb-4">
              Use the API to access your inventory data and integrate with other services.
            </p>
            
            <h3 class="text-subtitle-1 font-weight-bold mb-2">Your API Key</h3>
            <v-text-field
              v-model="apiKey"
              readonly
              append-inner-icon="mdi-content-copy"
              @click:append-inner="copyApiKey"
              variant="outlined"
              class="mb-4"
            ></v-text-field>
            
            <v-alert
              v-model="showCopiedAlert"
              type="success"
              variant="tonal"
              closable
              class="mb-4"
            >
              API key copied to clipboard!
            </v-alert>
            
            <v-btn 
              color="secondary" 
              prepend-icon="mdi-key-variant"
              @click="regenerateApiKey"
              class="mb-6"
            >
              Regenerate API Key
            </v-btn>
            
            <h3 class="text-subtitle-1 font-weight-bold mt-4 mb-2">Documentation</h3>
            <p class="text-body-1">
              Check our <a href="#" class="text-primary text-decoration-none">API documentation</a> to learn
              how to use our API endpoints.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Edit Profile Dialog -->
    <v-dialog v-model="editProfileDialog" max-width="500">
      <v-card>
        <v-card-title>Edit Profile</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="updateProfile">
            <v-file-input
              label="Profile Picture"
              accept="image/*"
              prepend-icon="mdi-camera"
              variant="outlined"
              class="mb-4"
            ></v-file-input>
            
            <v-text-field
              v-model="editedProfile.name"
              label="Full Name"
              variant="outlined"
              class="mb-4"
            ></v-text-field>
            
            <v-text-field
              v-model="editedProfile.bio"
              label="Bio"
              variant="outlined"
              class="mb-4"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="editProfileDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="text" @click="updateProfile">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Change Password Dialog -->
    <v-dialog v-model="changePasswordDialog" max-width="500">
      <v-card>
        <v-card-title>Change Password</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="updatePassword">
            <v-text-field
              v-model="passwordData.current"
              label="Current Password"
              type="password"
              variant="outlined"
              class="mb-4"
            ></v-text-field>
            
            <v-text-field
              v-model="passwordData.new"
              label="New Password"
              type="password"
              variant="outlined"
              :rules="[v => v.length >= 8 || 'Password must be at least 8 characters']"
              class="mb-4"
            ></v-text-field>
            
            <v-text-field
              v-model="passwordData.confirm"
              label="Confirm New Password"
              type="password"
              variant="outlined"
              :rules="[v => v === passwordData.new || 'Passwords do not match']"
              class="mb-4"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="changePasswordDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="text" @click="updatePassword">
            Update Password
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Personal Info Dialog -->
    <v-dialog v-model="editPersonalInfo" max-width="500">
      <v-card>
        <v-card-title>Edit Personal Information</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="updatePersonalInfo">
            <v-text-field
              v-model="editedProfile.phone"
              label="Phone"
              variant="outlined"
              class="mb-4"
            ></v-text-field>
            
            <v-text-field
              v-model="editedProfile.location"
              label="Location"
              variant="outlined"
              class="mb-4"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="editPersonalInfo = false">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="text" @click="updatePersonalInfo">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

// User profile data
const profile = reactive({
  name: authStore.user?.name || 'John Doe',
  email: authStore.user?.email || 'john.doe@example.com',
  picture: authStore.user?.picture || 'https://randomuser.me/api/portraits/men/1.jpg',
  role: 'Premium User',
  phone: '+1 (555) 123-4567',
  location: 'New York, USA',
  bio: 'Inventory manager with 5+ years of experience in retail and e-commerce.',
  twoFactorEnabled: false,
  emailPreferences: {
    updates: true,
    alerts: true,
    newsletter: false
  }
})

// For editing profile
const editedProfile = reactive({ ...profile })

// Active section
const activeSection = ref('personal')

// Dialog states
const editProfileDialog = ref(false)
const changePasswordDialog = ref(false)
const editPersonalInfo = ref(false)

// Password change form
const passwordData = reactive({
  current: '',
  new: '',
  confirm: ''
})

// Connected accounts
const connections = ref([
  { name: 'Google', icon: 'mdi-google', connected: true },
  { name: 'Microsoft', icon: 'mdi-microsoft', connected: false },
  { name: 'Slack', icon: 'mdi-slack', connected: true },
  { name: 'GitHub', icon: 'mdi-github', connected: false }
])

// Notification settings
const notifications = reactive({
  priceIncreases: true,
  priceDecreases: true,
  lowStock: true,
  backInStock: true,
  email: true,
  app: true
})

// API key
const apiKey = ref('sk_test_51NcH7GLkhI9JdN7hZqWEzUT6nMfVs8')
const showCopiedAlert = ref(false)

// Snackbar
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
})

// Side menu items
const menuItems = [
  { title: 'Personal Information', icon: 'mdi-account', value: 'personal' },
  { title: 'Account Settings', icon: 'mdi-cog', value: 'account' },
  { title: 'Connected Accounts', icon: 'mdi-link-variant', value: 'integrations' },
  { title: 'Notification Settings', icon: 'mdi-bell', value: 'notifications' },
  { title: 'API Access', icon: 'mdi-key', value: 'api' }
]

// Methods
const updateProfile = () => {
  Object.assign(profile, {
    name: editedProfile.name,
    bio: editedProfile.bio
  })
  
  editProfileDialog.value = false
  showSuccessSnackbar('Profile updated successfully')
}

const updatePersonalInfo = () => {
  Object.assign(profile, {
    phone: editedProfile.phone,
    location: editedProfile.location
  })
  
  editPersonalInfo.value = false
  showSuccessSnackbar('Personal information updated successfully')
}

const updatePassword = () => {
  if (passwordData.new === passwordData.confirm && passwordData.new.length >= 8) {
    // Would normally call an API here
    changePasswordDialog.value = false
    passwordData.current = ''
    passwordData.new = ''
    passwordData.confirm = ''
    showSuccessSnackbar('Password changed successfully')
  } else {
    showErrorSnackbar('Please check your password inputs')
  }
}

const savePreferences = () => {
  showSuccessSnackbar('Preferences saved successfully')
}

const saveNotifications = () => {
  showSuccessSnackbar('Notification settings saved successfully')
}

const copyApiKey = () => {
  navigator.clipboard.writeText(apiKey.value)
  showCopiedAlert.value = true
  setTimeout(() => {
    showCopiedAlert.value = false
  }, 3000)
}

const regenerateApiKey = () => {
  // Simulate API key regeneration
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let newKey = 'sk_test_'
  for (let i = 0; i < 28; i++) {
    newKey += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  apiKey.value = newKey
  showSuccessSnackbar('API key regenerated successfully')
}

const showSuccessSnackbar = (text: string) => {
  snackbar.text = text
  snackbar.color = 'success'
  snackbar.show = true
}

const showErrorSnackbar = (text: string) => {
  snackbar.text = text
  snackbar.color = 'error'
  snackbar.show = true
}
</script>
 