<template>
   <div>
    <!-- Hero Section -->
    <section id="hero" class="hero-section">
      <v-parallax src="https://images.unsplash.com/photo-1724709162875-fe100dd0e04b?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBpbnZlbnRvcnklMjBtYW5hZ2VtZW50fGVufDB8fHx8MTc0NDIzMTk2N3ww&ixlib=rb-4.0.3&fit=fillmax&h=800&w=1200" 
        :height="600">
        <div class="hero-overlay"></div>
        <v-container class="hero-content d-flex flex-column justify-center" style="height: 100%">
          <v-row class="align-center fill-height">
            <v-col cols="12" md="7">
              <h1 class="text-h2 text-md-h1 font-weight-bold text-white mb-4">Automated Inventory Tracking</h1>
              <p class="text-h6 text-white mb-8">Revolutionize inventory management with our advanced web scraping solutions</p>
              <div class="d-flex flex-wrap">
                <v-btn size="large" color="primary" class="mr-4 mb-2" to="/sign-in">Start Free Trial</v-btn>
                <v-btn size="large" variant="outlined" color="white" class="mb-2">Watch Demo</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-parallax>
    </section>

    <!-- Services Section -->
    <section class="py-12" :class="{'bg-background': !themeStore.isDark}">
      <v-container>
        <v-row class="text-center mb-10">
          <v-col cols="12">
            <h2 class="text-h3 font-weight-bold mb-2">Our Tracking Solutions</h2>
            <p class="text-subtitle-1 mx-auto" style="max-width: 600px">Comprehensive inventory tracking through intelligent web scraping technology</p>
          </v-col>
        </v-row>
        
        <v-row>
          <v-col v-for="(service, i) in services" :key="i" cols="12" md="4">
            <v-hover v-slot="{ isHovering, props }">
              <v-card v-bind="props" :elevation="isHovering ? 10 : 2" class="h-100">
                <v-card-item>
                  <v-avatar
                    color="primary"
                    size="x-large"
                    rounded
                    class="mb-4"
                  >
                    <v-icon size="24" color="white">{{ service.icon }}</v-icon>
                  </v-avatar>
                  <v-card-title class="text-h5 font-weight-bold">{{ service.title }}</v-card-title>
                  <v-card-text class="text-body-1">
                    {{ service.description }}
                  </v-card-text>
                </v-card-item>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="py-12" :class="{'bg-white': !themeStore.isDark}">
      <v-container>
        <v-row class="text-center mb-10">
          <v-col cols="12">
            <h2 class="text-h3 font-weight-bold mb-2">How It Works</h2>
            <p class="text-subtitle-1 mx-auto" style="max-width: 600px">Our streamlined process makes inventory tracking effortless</p>
          </v-col>
        </v-row>
        
        <v-timeline align="start">
          <v-timeline-item
            v-for="(step, i) in howItWorks"
            :key="i"
            :dot-color="step.color"
            size="small"
          >
            <template v-slot:opposite>
              <div class="text-h6 font-weight-bold">Step {{ i + 1 }}</div>
            </template>
            <v-card class="elevation-2">
              <v-card-title class="text-h6">{{ step.title }}</v-card-title>
              <v-card-text>{{ step.description }}</v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-container>
    </section>

    <!-- About Section -->
    <section class="py-12" :class="{'bg-background': !themeStore.isDark}">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6">
            <v-img
              src="https://images.unsplash.com/photo-1601598838108-5019bf3ea4a6?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHx3YXJlaG91c2UlMjBpbnZlbnRvcnklMjBtYW5hZ2VtZW50fGVufDB8fHx8MTc0NDIzMTk2N3ww&ixlib=rb-4.0.3&fit=fillmax&h=800&w=1200"
              cover
              class="rounded-lg elevation-4"
              height="400"
            ></v-img>
          </v-col>
          <v-col cols="12" md="6" class="px-md-8">
            <h2 class="text-h3 font-weight-bold mb-4">Why Choose InventTrack</h2>
            <p class="text-body-1 mb-4">
              InventTrack is the leading provider of automated inventory tracking solutions powered by advanced web scraping technology. 
              Our platform continuously monitors pricing, stock levels, and product information across multiple sources.
            </p>
            <p class="text-body-1 mb-6">
              With over 5 years of experience in data extraction and inventory management, our solutions help businesses 
              make informed decisions, stay competitive, and optimize their inventory strategies.
            </p>
            <v-btn color="primary" size="large">Learn More</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-12" :class="{'bg-white': !themeStore.isDark}">
      <v-container>
        <v-row class="text-center mb-10">
          <v-col cols="12">
            <h2 class="text-h3 font-weight-bold mb-2">Key Features</h2>
            <p class="text-subtitle-1 mx-auto" style="max-width: 600px">Powerful capabilities that make our inventory tracking solution stand out</p>
          </v-col>
        </v-row>
        
        <v-row>
          <v-col v-for="(feature, i) in features" :key="i" cols="12" sm="6" md="3">
            <v-card class="text-center h-100" variant="outlined">
              <v-card-item>
                <div class="d-flex justify-center mb-4">
                  <v-icon size="36" color="primary">{{ feature.icon }}</v-icon>
                </div>
                <v-card-title class="text-h6 font-weight-bold justify-center">{{ feature.title }}</v-card-title>
                <v-card-text>{{ feature.description }}</v-card-text>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Data Sources Section -->
    <section class="py-12" :class="{'bg-background': !themeStore.isDark}">
      <v-container>
        <v-row class="text-center mb-10">
          <v-col cols="12">
            <h2 class="text-h3 font-weight-bold mb-2">Compatible Data Sources</h2>
            <p class="text-subtitle-1 mx-auto" style="max-width: 600px">Our platform seamlessly integrates with a wide range of data sources</p>
          </v-col>
        </v-row>
        
        <v-row justify="center">
          <v-col v-for="(source, i) in dataSources" :key="i" cols="6" sm="4" md="2" class="text-center">
            <v-hover v-slot="{ isHovering, props }">
              <v-sheet 
                v-bind="props"
                :elevation="isHovering ? 4 : 2"
                class="pa-6 mb-6 rounded transition-swing"
              >
                <v-icon size="42" color="primary">{{ source.icon }}</v-icon>
                <div class="text-subtitle-1 font-weight-medium mt-3">{{ source.name }}</div>
              </v-sheet>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Testimonials -->
    <section class="py-12 bg-primary">
      <v-container>
        <v-row class="text-center mb-10">
          <v-col cols="12">
            <h2 class="text-h3 font-weight-bold text-white mb-2">What Our Clients Say</h2>
            <p class="text-subtitle-1 text-white mx-auto" style="max-width: 600px">
              Hear from businesses that have revolutionized their inventory management
            </p>
          </v-col>
        </v-row>
        
        <v-carousel
          cycle
          height="400"
          hide-delimiters
          show-arrows="hover"
        >
          <v-carousel-item v-for="(testimonial, i) in testimonials" :key="i">
            <v-sheet class="d-flex align-center justify-center" height="100%" color="transparent">
              <v-card class="mx-auto testimonial-card" max-width="800" elevation="5">
                <v-card-item>
                  <v-avatar class="mb-4" size="80">
                    <v-img :src="testimonial.avatar" cover></v-img>
                  </v-avatar>
                  <v-card-text class="text-body-1 font-italic">
                    "{{ testimonial.quote }}"
                  </v-card-text>
                  <v-card-title class="text-h6 font-weight-bold">{{ testimonial.name }}</v-card-title>
                  <v-card-subtitle>{{ testimonial.position }}</v-card-subtitle>
                </v-card-item>
              </v-card>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </v-container>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-12" :class="{'bg-background': !themeStore.isDark}">
      <v-container>
        <v-row class="text-center mb-10">
          <v-col cols="12">
            <h2 class="text-h3 font-weight-bold mb-2">Simple, Transparent Pricing</h2>
            <p class="text-subtitle-1 mx-auto" style="max-width: 600px">Choose the plan that fits your business needs</p>
          </v-col>
        </v-row>
        
        <v-row>
          <v-col v-for="(plan, i) in pricingPlans" :key="i" cols="12" md="4">
            <v-hover v-slot="{ isHovering, props }">
              <v-card 
                v-bind="props"
                :elevation="isHovering ? 12 : 2"
                :class="['h-100', plan.featured ? 'border border-primary border-2' : '']"
              >
                <v-card-item :class="plan.featured ? 'bg-primary text-white' : ''">
                  <v-card-title class="text-h5 font-weight-bold text-center">{{ plan.name }}</v-card-title>
                </v-card-item>
                
                <v-card-text class="text-center pt-6">
                  <div class="text-h3 font-weight-bold mb-2">${{ plan.price }}<span class="text-body-1">/month</span></div>
                  <p class="text-subtitle-1 mb-6">{{ plan.description }}</p>
                  
                  <v-divider class="mb-6"></v-divider>
                  
                  <v-list density="compact" class="bg-transparent">
                    <v-list-item 
                      v-for="(feature, j) in plan.features" 
                      :key="j"
                      :title="feature"
                      class="text-body-2"
                    >
                      <template v-slot:prepend>
                        <v-icon color="success" size="small">mdi-check-circle</v-icon>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card-text>
                
                <v-card-actions class="pa-6 pt-0">
                  <v-btn
                    block
                    :color="plan.featured ? 'primary' : 'default'"
                    :variant="plan.featured ? 'flat' : 'outlined'"
                    size="large"
                    to="/sign-in"
                  >
                    Select Plan
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CTA Section -->
    <section class="py-12" :class="{'bg-white': !themeStore.isDark}">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card color="secondary" class="text-center pa-8 rounded-xl">
              <h2 class="text-h3 font-weight-bold text-white mb-4">Ready to Transform Your Inventory Management?</h2>
              <p class="text-h6 text-white mb-8">Join hundreds of businesses already optimizing their inventory tracking</p>
              <v-btn size="x-large" color="white" class="text-secondary font-weight-bold" to="/sign-in">
                Start Free 14-Day Trial
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '../stores/theme'

const themeStore = useThemeStore()

const services = [
  {
    title: 'Competitor Price Tracking',
    icon: 'mdi-currency-usd',
    description: 'Track competitor pricing in real-time to stay competitive and optimize your pricing strategy.'
  },
  {
    title: 'Stock Monitoring',
    icon: 'mdi-package-variant-closed',
    description: 'Never miss inventory changes with automated monitoring of stock levels across multiple sources.'
  },
  {
    title: 'Product Data Extraction',
    icon: 'mdi-database',
    description: 'Extract detailed product information including specifications, images, and descriptions automatically.'
  }
]

const howItWorks = [
  {
    title: 'Define Your Data Needs',
    description: 'Tell us what product information and sources you need to track for your inventory management.',
    color: 'primary'
  },
  {
    title: 'Configure Data Sources',
    description: 'We set up custom web scrapers to extract relevant information from your specified sources.',
    color: 'secondary'
  },
  {
    title: 'Automated Tracking',
    description: 'Our system continuously monitors and collects data at your preferred intervals.',
    color: 'info'
  },
  {
    title: 'Data Integration',
    description: 'All collected information is processed and delivered to your dashboard or integrated with your existing systems.',
    color: 'success'
  }
]

const features = [
  {
    title: 'Custom Alerts',
    icon: 'mdi-bell-ring',
    description: 'Get notified about price changes, stock availability, and more'
  },
  {
    title: 'Automated Reports',
    icon: 'mdi-file-chart',
    description: 'Scheduled reports delivered to your inbox'
  },
  {
    title: 'API Access',
    icon: 'mdi-api',
    description: 'Integrate scraped data with your existing systems'
  },
  {
    title: 'Data Visualization',
    icon: 'mdi-chart-line',
    description: 'Intuitive charts and graphs for trend analysis'
  }
]

const dataSources = [
  { name: 'E-commerce Sites', icon: 'mdi-cart' },
  { name: 'Retail Websites', icon: 'mdi-store' },
  { name: 'Marketplaces', icon: 'mdi-shopping' },
  { name: 'Supplier Portals', icon: 'mdi-truck-delivery' },
  { name: 'Product Catalogs', icon: 'mdi-bookshelf' },
  { name: 'API Integrations', icon: 'mdi-api' }
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    position: 'Inventory Manager, RetailCorp',
    quote: 'InventTrack has transformed how we monitor competition. We save hours daily and have improved our pricing strategy with the real-time data.',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    name: 'Michael Chen',
    position: 'E-commerce Director, TechStore',
    quote: 'The automated stock alerts have been a game-changer. We never miss a restock opportunity and our inventory turnover has improved by 35%.',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    name: 'Emma Wilson',
    position: 'Supply Chain Manager, GlobalRetail',
    quote: "We've been using InventTrack for over 3 years. The data accuracy and reliability have helped us optimize our inventory levels across multiple warehouses.",
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
  }
]

const pricingPlans = [
  {
    name: 'Startup',
    price: '99',
    description: 'Perfect for small businesses',
    featured: false,
    features: [
      'Track up to 500 products',
      'Daily data updates',
      'Email notifications',
      'Basic reporting',
      '2 user accounts'
    ]
  },
  {
    name: 'Business',
    price: '249',
    description: 'Most popular for growing teams',
    featured: true,
    features: [
      'Track up to 2,000 products',
      'Hourly data updates',
      'Custom alerts',
      'Advanced reporting',
      '5 user accounts',
      'API access'
    ]
  },
  {
    name: 'Enterprise',
    price: '499',
    description: 'For large-scale operations',
    featured: false,
    features: [
      'Unlimited product tracking',
      'Real-time data updates',
      'Priority support',
      'Custom integrations',
      'Unlimited user accounts',
      'Dedicated account manager'
    ]
  }
]
</script>
 