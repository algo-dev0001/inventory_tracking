<template>
   <v-container fluid class="fill-height">
    <v-row class="fill-height align-center justify-center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 my-12">
          <v-card-title class="text-center pt-8 pb-0">
            <h1 class="text-h4 font-weight-bold">Welcome Back</h1>
          </v-card-title>
          
          <v-card-subtitle class="text-center pt-2 pb-4">
            Sign in to access your account
          </v-card-subtitle>
          
          <v-card-text>
            <v-form @submit.prevent="submitForm">
              <v-text-field
                v-model="email"
                label="Email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                :rules="[rules.required, rules.email]"
                class="mb-2"
              ></v-text-field>
              
              <v-text-field
                v-model="password"
                label="Password"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                :rules="[rules.required, rules.min]"
                class="mb-6"
              ></v-text-field>
              
              <v-row class="mb-4">
                <v-col class="d-flex justify-space-between align-center" cols="12">
                  <v-checkbox 
                    v-model="rememberMe" 
                    label="Remember me" 
                    hide-details
                    color="primary"
                    density="compact"
                  ></v-checkbox>
                  <a href="#" class="text-primary text-decoration-none">Forgot password?</a>
                </v-col>
              </v-row>
              
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="isLoading"
                class="mb-4"
              >
                Sign In
              </v-btn>
              
              <div class="text-center mb-4">
                <span class="text-medium-emphasis">or continue with</span>
              </div>
              
              <v-btn
                variant="outlined"
                size="large"
                block
                prepend-icon="mdi-google"
                @click="signInWithGoogle"
                :loading="isLoading"
                class="mb-4"
              >
                Google
              </v-btn>
            </v-form>
            
            <div class="text-center">
              <span class="text-medium-emphasis">Don't have an account?</span>
              <a href="#" class="text-primary text-decoration-none ml-2" @click.prevent="isSignUp = true">Sign up</a>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Sign Up Dialog -->
    <v-dialog v-model="isSignUp" max-width="500px">
      <v-card>
        <v-card-title class="text-center pt-8 pb-0">
          <h1 class="text-h4 font-weight-bold">Create Account</h1>
        </v-card-title>
        
        <v-card-subtitle class="text-center pt-2 pb-4">
          Sign up to get started with InventTrack
        </v-card-subtitle>
        
        <v-card-text>
          <v-form @submit.prevent="submitSignUpForm">
            <v-text-field
              v-model="signUpName"
              label="Full Name"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              :rules="[rules.required]"
              class="mb-2"
            ></v-text-field>
            
            <v-text-field
              v-model="signUpEmail"
              label="Email"
              prepend-inner-icon="mdi-email"
              variant="outlined"
              :rules="[rules.required, rules.email]"
              class="mb-2"
            ></v-text-field>
            
            <v-text-field
              v-model="signUpPassword"
              label="Password"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showSignUpPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showSignUpPassword = !showSignUpPassword"
              :type="showSignUpPassword ? 'text' : 'password'"
              variant="outlined"
              :rules="[rules.required, rules.min]"
              class="mb-2"
            ></v-text-field>
            
            <v-text-field
              v-model="signUpPasswordConfirm"
              label="Confirm Password"
              prepend-inner-icon="mdi-lock-check"
              :type="showSignUpPassword ? 'text' : 'password'"
              variant="outlined"
              :rules="[rules.required, passwordMatch]"
              class="mb-6"
            ></v-text-field>
            
            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              :loading="isLoading"
              class="mb-4"
            >
              Sign Up
            </v-btn>
            
            <div class="text-center mb-4">
              <span class="text-medium-emphasis">or sign up with</span>
            </div>
            
            <v-btn
              variant="outlined"
              size="large"
              block
              prepend-icon="mdi-google"
              @click="signInWithGoogle"
              :loading="isLoading"
              class="mb-4"
            >
              Google
            </v-btn>
          </v-form>
          
          <div class="text-center">
            <span class="text-medium-emphasis">Already have an account?</span>
            <a href="#" class="text-primary text-decoration-none ml-2" @click.prevent="isSignUp = false">Sign in</a>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showError"
      :timeout="3000"
      color="error"
    >
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="showError = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isLoading = ref(false)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const isSignUp = ref(false)

// Sign up form
const signUpName = ref('')
const signUpEmail = ref('')
const signUpPassword = ref('')
const signUpPasswordConfirm = ref('')
const showSignUpPassword = ref(false)

// Error handling
const showError = ref(false)
const errorMessage = ref('')

// Form validation
const rules = {
  required: (v: string) => !!v || 'Field is required',
  email: (v: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email must be valid',
  min: (v: string) => v.length >= 8 || 'Password must be at least 8 characters'
}

const passwordMatch = computed(() => {
  return (v: string) => v === signUpPassword.value || 'Passwords do not match'
})

const submitForm = async () => {
  isLoading.value = true
  
  try {
    // This would be a real API call in production
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock successful login
    const mockUser = {
      id: '123456',
      name: 'Demo User',
      email: email.value,
      picture: 'https://randomuser.me/api/portraits/men/1.jpg'
    }
    const mockToken = 'mock_jwt_token'
    
    authStore.login(mockUser, mockToken)
    
    // Redirect to original destination or inventory page
    const redirectPath = route.query.redirect as string || '/inventory'
    router.push(redirectPath)
  } catch (error) {
    errorMessage.value = 'Login failed. Please check your credentials.'
    showError.value = true
  } finally {
    isLoading.value = false
  }
}

const submitSignUpForm = async () => {
  isLoading.value = true
  
  try {
    // This would be a real API call in production
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock successful registration
    const mockUser = {
      id: '123456',
      name: signUpName.value,
      email: signUpEmail.value,
      picture: 'https://randomuser.me/api/portraits/men/1.jpg'
    }
    const mockToken = 'mock_jwt_token'
    
    authStore.login(mockUser, mockToken)
    isSignUp.value = false
    
    // Redirect to inventory page
    router.push('/inventory')
  } catch (error) {
    errorMessage.value = 'Registration failed. Please try again.'
    showError.value = true
  } finally {
    isLoading.value = false
  }
}

const signInWithGoogle = async () => {
  isLoading.value = true
  
  try {
    // This would be a real OAuth flow in production
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo purposes, we'll simulate a successful Google login
    const mockGoogleUser = {
      id: 'google_123456',
      name: 'Google User',
      email: 'google.user@example.com',
      picture: 'https://randomuser.me/api/portraits/men/4.jpg'
    }
    const mockGoogleToken = 'mock_google_oauth_token'
    
    authStore.login(mockGoogleUser, mockGoogleToken)
    isSignUp.value = false
    
    // Redirect to original destination or inventory page
    const redirectPath = route.query.redirect as string || '/inventory'
    router.push(redirectPath)
  } catch (error) {
    errorMessage.value = 'Google sign-in failed. Please try again.'
    showError.value = true
  } finally {
    isLoading.value = false
  }
}
</script>
 