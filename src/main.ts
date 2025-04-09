import  { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#5E35B1',
          secondary: '#FF5722',
          accent: '#03A9F4',
          success: '#4CAF50',
          info: '#2196F3',
          warning: '#FB8C00',
          error: '#FF5252',
          background: '#F5F5F5'
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: '#7E57C2',
          secondary: '#FF7043',
          accent: '#29B6F6',
          success: '#66BB6A',
          info: '#42A5F5',
          warning: '#FFA726',
          error: '#EF5350',
          background: '#121212'
        }
      }
    }
  }
})

createApp(App)
  .use(pinia)
  .use(router)
  .use(vuetify)
  .mount('#app')
 