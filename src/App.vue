<template>
    <v-app :theme="themeStore.isDark ? 'dark' : 'light'">
    <!-- Navigation -->
    <v-app-bar app :color="themeStore.isDark ? 'surface' : 'white'" elevation="1">
      <v-container class="d-flex align-center py-0 px-2">
        <router-link to="/" class="text-decoration-none">
          <v-app-bar-title class="text-primary font-weight-bold">
            <span class="text-h5">InventTrack</span>
          </v-app-bar-title>
        </router-link>
        
        <v-spacer></v-spacer>
        
        <!-- Desktop Navigation -->
        <div class="d-none d-md-flex align-center">
          <router-link 
            v-for="item in menuItems" 
            :key="item.title"
            :to="item.path"
            custom
            v-slot="{ navigate, isActive }"
          >
            <v-btn 
              variant="text" 
              class="text-body-1 font-weight-medium mx-2"
              :color="isActive ? 'primary' : undefined"
              @click="navigate"
            >
              {{ item.title }}
            </v-btn>
          </router-link>
          
          <v-btn icon class="ml-2" @click="themeStore.toggleTheme">
            <v-icon>{{ themeStore.isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
          </v-btn>
          
          <v-menu v-if="authStore.isAuthenticated" offset-y>
            <template v-slot:activator="{ props }">
              <v-btn 
                icon 
                class="ml-2" 
                v-bind="props"
              >
                <v-avatar size="36">
                  <v-img :src="authStore.user?.picture || 'https://cdn.vuetifyjs.com/images/john.jpg'" alt="User"></v-img>
                </v-avatar>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>{{ authStore.user?.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ authStore.user?.email }}</v-list-item-subtitle>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item to="/profile">
                <template v-slot:prepend>
                  <v-icon>mdi-account</v-icon>
                </template>
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item>
              <v-list-item @click="authStore.logout()">
                <template v-slot:prepend>
                  <v-icon>mdi-logout</v-icon>
                </template>
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          
          <router-link 
            v-else
            to="/sign-in"
            custom
            v-slot="{ navigate }"
          >
            <v-btn color="primary" class="ml-4" rounded @click="navigate">
              Sign In
            </v-btn>
          </router-link>
        </div>
        
        <!-- Mobile Menu Button -->
        <v-app-bar-nav-icon class="d-flex d-md-none" @click="drawer = !drawer"></v-app-bar-nav-icon>
      </v-container>
    </v-app-bar>
    
    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item v-for="item in menuItems" :key="item.title" :title="item.title" :to="item.path"></v-list-item>
        
        <v-list-item @click="themeStore.toggleTheme">
          <template v-slot:prepend>
            <v-icon>{{ themeStore.isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
          </template>
          <v-list-item-title>{{ themeStore.isDark ? 'Light Mode' : 'Dark Mode' }}</v-list-item-title>
        </v-list-item>
      </v-list>
      
      <v-divider></v-divider>
      
      <div v-if="authStore.isAuthenticated" class="pa-4">
        <v-list>
          <v-list-item>
            <template v-slot:prepend>
              <v-avatar size="40">
                <v-img :src="authStore.user?.picture || 'https://cdn.vuetifyjs.com/images/john.jpg'" alt="User"></v-img>
              </v-avatar>
            </template>
            <v-list-item-title>{{ authStore.user?.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ authStore.user?.email }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item to="/profile">
            <template v-slot:prepend>
              <v-icon>mdi-account</v-icon>
            </template>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item @click="authStore.logout()">
            <template v-slot:prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
      
      <div v-else class="pa-4">
        <v-btn color="primary" block to="/sign-in">Sign In</v-btn>
      </div>
    </v-navigation-drawer>
    
    <v-main>
      <router-view></router-view>
    </v-main>

    <!-- Footer -->
    <v-footer :class="themeStore.isDark ? 'bg-surface-variant' : 'bg-dark'" class="pt-10 pb-5">
      <v-container>
        <v-row>
          <v-col cols="12" md="4" class="mb-6 mb-md-0">
            <h3 class="text-h5 font-weight-bold mb-4" :class="themeStore.isDark ? 'text-white' : 'text-white'">InventTrack</h3>
            <p class="text-body-2 mb-4" :class="themeStore.isDark ? 'text-medium-emphasis' : 'text-white-darken-1'">
              Automating inventory tracking through advanced web scraping technology for modern businesses.
            </p>
            <div class="d-flex">
              <v-btn icon :color="themeStore.isDark ? 'default' : 'white'" variant="text" class="mr-2">
                <v-icon>mdi-facebook</v-icon>
              </v-btn>
              <v-btn icon :color="themeStore.isDark ? 'default' : 'white'" variant="text" class="mr-2">
                <v-icon>mdi-twitter</v-icon>
              </v-btn>
              <v-btn icon :color="themeStore.isDark ? 'default' : 'white'" variant="text" class="mr-2">
                <v-icon>mdi-linkedin</v-icon>
              </v-btn>
              <v-btn icon :color="themeStore.isDark ? 'default' : 'white'" variant="text">
                <v-icon>mdi-instagram</v-icon>
              </v-btn>
            </div>
          </v-col>
          
          <v-col cols="6" sm="4" md="2">
            <h4 class="text-h6 font-weight-bold mb-4" :class="themeStore.isDark ? 'text-white' : 'text-white'">Company</h4>
            <v-list density="compact" nav :class="themeStore.isDark ? 'bg-transparent' : 'bg-transparent'" class="pa-0">
              <v-list-item 
                v-for="link in companyLinks" 
                :key="link" 
                :title="link"
                :class="themeStore.isDark ? 'text-medium-emphasis' : 'text-white-darken-1'"
                class="px-0"
              ></v-list-item>
            </v-list>
          </v-col>
          
          <v-col cols="6" sm="4" md="2">
            <h4 class="text-h6 font-weight-bold mb-4" :class="themeStore.isDark ? 'text-white' : 'text-white'">Solutions</h4>
            <v-list density="compact" nav :class="themeStore.isDark ? 'bg-transparent' : 'bg-transparent'" class="pa-0">
              <v-list-item 
                v-for="link in solutionLinks" 
                :key="link" 
                :title="link"
                :class="themeStore.isDark ? 'text-medium-emphasis' : 'text-white-darken-1'"
                class="px-0"
              ></v-list-item>
            </v-list>
          </v-col>
          
          <v-col cols="12" sm="4" md="4">
            <h4 class="text-h6 font-weight-bold mb-4" :class="themeStore.isDark ? 'text-white' : 'text-white'">Subscribe</h4>
            <p class="text-body-2 mb-4" :class="themeStore.isDark ? 'text-medium-emphasis' : 'text-white-darken-1'">
              Stay updated with our latest features and updates.
            </p>
            <v-form class="d-flex align-center">
              <v-text-field
                label="Email Address"
                variant="outlined"
                density="compact"
                :bg-color="themeStore.isDark ? 'surface' : 'white'"
                class="rounded mr-2"
              ></v-text-field>
              <v-btn color="primary">
                <v-icon>mdi-send</v-icon>
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
        
        <v-divider class="my-6 border-opacity-25" :color="themeStore.isDark ? 'border' : 'white'"></v-divider>
        
        <div class="text-center text-body-2" :class="themeStore.isDark ? 'text-medium-emphasis' : 'text-white-darken-2'">
          © {{ new Date().getFullYear() }} InventTrack. All rights reserved.
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore } from './stores/theme'
import { useAuthStore } from './stores/auth'

const drawer = ref(false)
const themeStore = useThemeStore()
const authStore = useAuthStore()

const menuItems = [
  { title: 'Home', path: '/' },
  { title: 'Features', path: '/#features' },
  { title: 'How It Works', path: '/#how-it-works' },
  { title: 'Pricing', path: '/#pricing' },
  { title: 'Inventory', path: '/inventory' },
  { title: 'Analytics', path: '/analytics' }
]

const companyLinks = ['About', 'Team', 'Careers', 'Blog', 'Contact']
const solutionLinks = ['Web Scraping', 'Inventory API', 'Price Monitoring', 'Stock Alerts', 'Integrations']
</script>

<style>
:root {
  --font-family: 'Poppins', sans-serif;
}

html {
  font-family: var(--font-family);
  scroll-behavior: smooth;
}

.v-application {
  font-family: var(--font-family) !important;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}

.hero-content {
  position: relative;
  z-index: 1;
}

.testimonial-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
}
</style>
 