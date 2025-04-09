<template>
   <v-container fluid>
    <v-row class="mb-6 mt-4">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold">Analytics Dashboard</h1>
        <p class="text-subtitle-1">Track trends and gain insights from your inventory data</p>
      </v-col>
    </v-row>

    <!-- Date Range Selection -->
    <v-row class="mb-6">
      <v-col cols="12" md="9">
        <v-card flat>
          <v-card-text class="d-flex flex-wrap align-center">
            <v-menu
              v-model="dateMenu"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  color="primary"
                  variant="outlined"
                  v-bind="props"
                  prepend-icon="mdi-calendar"
                  class="mr-4 mb-2 mb-sm-0"
                >
                  {{ formatDateRange }}
                </v-btn>
              </template>
              <v-date-picker
                v-model="dateRange"
                range
              ></v-date-picker>
            </v-menu>

            <div class="d-flex flex-wrap">
              <v-btn
                v-for="period in timePeriods"
                :key="period.value"
                variant="text"
                class="mr-2 mb-2 mb-sm-0"
                :color="period.value === selectedPeriod ? 'primary' : undefined"
                @click="selectPeriod(period.value)"
              >
                {{ period.label }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn 
          color="primary" 
          block
          prepend-icon="mdi-file-export"
          class="text-none"
        >
          Export Report
        </v-btn>
      </v-col>
    </v-row>

    <!-- Source Filter -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card flat>
          <v-card-text>
            <h3 class="text-subtitle-1 font-weight-bold mb-2">Filter by Source</h3>
            <div class="d-flex flex-wrap gap-2">
              <v-chip-group v-model="selectedSource" mandatory selected-class="primary">
                <v-chip 
                  v-for="source in dataSources" 
                  :key="source"
                  filter
                  :value="source"
                >
                  {{ source }}
                </v-chip>
              </v-chip-group>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Summary Cards -->
    <v-row>
      <v-col v-for="(stat, index) in filteredSummaryStats" :key="index" cols="12" sm="6" md="3">
        <v-card class="h-100">
          <v-card-text>
            <div class="d-flex align-center mb-2">
              <v-avatar
                :color="stat.color"
                size="42"
                rounded
                class="mr-3"
              >
                <v-icon color="white">{{ stat.icon }}</v-icon>
              </v-avatar>
              <div>
                <div class="text-overline text-medium-emphasis">{{ stat.label }}</div>
                <div class="text-h4 font-weight-bold">{{ stat.value }}</div>
              </div>
            </div>
            <div class="d-flex align-center">
              <v-icon
                size="small"
                :color="stat.change >= 0 ? 'success' : 'error'"
                class="mr-1"
              >
                {{ stat.change >= 0 ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
              </v-icon>
              <span :class="stat.change >= 0 ? 'text-success' : 'text-error'">
                {{ Math.abs(stat.change) }}%
              </span>
              <span class="text-caption text-medium-emphasis ml-1">vs previous period</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts -->
    <v-row class="mt-6">
      <v-col cols="12" lg="8">
        <v-card class="h-100">
          <v-card-title>
            <h2 class="text-h5">{{ selectedSource === 'All Sources' ? 'Overall Price Trends' : `${selectedSource} Price Trends` }}</h2>
          </v-card-title>
          <v-card-text class="d-flex justify-center align-center" style="height: 350px">
            <v-responsive width="100%" class="price-chart">
              <v-img 
                src="https://images.unsplash.com/photo-1542744173-05336fcc7ad4?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxidXNpbmVzcyUyMGFuYWx5dGljcyUyMGRhc2hib2FyZCUyMGNoYXJ0cyUyMGdyYXBoc3xlbnwwfHx8fDE3NDQyMzU2NjN8MA&ixlib=rb-4.0.3&fit=fillmax&h=350"
                class="rounded"
                cover
              >
              </v-img>
            </v-responsive>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card class="h-100">
          <v-card-title>
            <h2 class="text-h5">{{ selectedSource === 'All Sources' ? 'Stock Distribution' : `${selectedSource} Stock Levels` }}</h2>
          </v-card-title>
          <v-card-text class="d-flex justify-center align-center" style="height: 350px">
            <v-responsive width="100%" class="pie-chart">
              <v-img 
                src="https://images.unsplash.com/photo-1556155092-490a1ba16284?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw0fHxidXNpbmVzcyUyMGFuYWx5dGljcyUyMGRhc2hib2FyZCUyMGNoYXJ0cyUyMGdyYXBoc3xlbnwwfHx8fDE3NDQyMzU2NjN8MA&ixlib=rb-4.0.3&fit=fillmax&h=350" 
                class="rounded"
                cover
              >
              </v-img>
            </v-responsive>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card class="h-100">
          <v-card-title>
            <h2 class="text-h5">Product Distribution by Source</h2>
          </v-card-title>
          <v-card-text class="d-flex justify-center align-center" style="height: 300px">
            <v-responsive width="100%" class="bar-chart">
              <v-img 
                src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxidXNpbmVzcyUyMGFuYWx5dGljcyUyMGRhc2hib2FyZCUyMGNoYXJ0cyUyMGdyYXBoc3xlbnwwfHx8fDE3NDQyMzU2NjN8MA&ixlib=rb-4.0.3&fit=fillmax&h=300"
                class="rounded"
                cover
              >
              </v-img>
            </v-responsive>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="h-100">
          <v-card-title>
            <h2 class="text-h5">Sales Trends by Source</h2>
          </v-card-title>
          <v-card-text class="d-flex justify-center align-center" style="height: 300px">
            <v-responsive width="100%" class="radar-chart">
              <v-img 
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGFuYWx5dGljcyUyMGRhc2hib2FyZCUyMGNoYXJ0cyUyMGdyYXBocyUyMGJ5JTIwc291cmNlfGVufDB8fHx8MTc0NDIzNjg3OXww&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800"
                class="rounded"
                cover
              >
              </v-img>
            </v-responsive>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Product Performance Table -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center flex-wrap">
            <h2 class="text-h5">
              {{ selectedSource === 'All Sources' ? 'Top Performing Products' : `Top ${selectedSource} Products` }}
            </h2>
            <v-select
              v-model="performanceMetric"
              :items="performanceMetrics"
              label="Metric"
              variant="outlined"
              density="compact"
              hide-details
              style="max-width: 200px"
            ></v-select>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="performanceHeaders"
              :items="filteredTopProducts"
              :loading="loading"
              density="compact"
            >
              <template v-slot:item.image="{ item }">
                <v-avatar size="36">
                  <v-img :src="item.image" cover></v-img>
                </v-avatar>
              </template>
              
              <template v-slot:item.price="{ item }">
                ${{ item.price.toFixed(2) }}
              </template>
              
              <template v-slot:item.priceChange="{ item }">
                <span :class="getPriceColorClass(item.priceChange)">
                  {{ item.priceChange > 0 ? '+' : '' }}{{ item.priceChange.toFixed(2) }}%
                </span>
              </template>
              
              <template v-slot:item.performanceScore="{ item }">
                <v-progress-linear
                  :model-value="item.performanceScore"
                  height="8"
                  color="primary"
                  rounded
                ></v-progress-linear>
              </template>
              
              <template v-slot:item.trend="{ item }">
                <v-icon
                  :color="item.trend === 'up' ? 'success' : item.trend === 'down' ? 'error' : ''"
                >
                  {{ 
                    item.trend === 'up' ? 'mdi-trending-up' : 
                    item.trend === 'down' ? 'mdi-trending-down' : 
                    'mdi-trending-neutral'
                  }}
                </v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Source Performance -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <h2 class="text-h5">Source Performance Comparison</h2>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col v-for="(source, index) in sourcePerformance" :key="index" cols="12" sm="6" lg="4">
                <v-card variant="outlined" class="h-100">
                  <v-card-title class="d-flex align-center">
                    <v-avatar color="primary" size="36" class="mr-3">
                      <v-icon color="white">{{ getSourceIcon(source.source) }}</v-icon>
                    </v-avatar>
                    {{ source.source }}
                  </v-card-title>
                  <v-card-text>
                    <v-list density="compact">
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon size="small" color="primary">mdi-cube</v-icon>
                        </template>
                        <v-list-item-title>Products: {{ source.products }}</v-list-item-title>
                      </v-list-item>
                      
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon size="small" color="success">mdi-check-circle</v-icon>
                        </template>
                        <v-list-item-title>In Stock: {{ source.inStock }}</v-list-item-title>
                      </v-list-item>
                      
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon size="small" color="error">mdi-close-circle</v-icon>
                        </template>
                        <v-list-item-title>Out of Stock: {{ source.outOfStock }}</v-list-item-title>
                      </v-list-item>
                      
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon size="small" color="info">mdi-currency-usd</v-icon>
                        </template>
                        <v-list-item-title>Avg. Price: ${{ source.avgPrice.toFixed(2) }}</v-list-item-title>
                      </v-list-item>
                      
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon 
                            size="small" 
                            :color="source.priceChange >= 0 ? 'error' : 'success'"
                          >
                            {{ source.priceChange >= 0 ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                          </v-icon>
                        </template>
                        <v-list-item-title>
                          Price Change: 
                          <span :class="source.priceChange >= 0 ? 'text-error' : 'text-success'">
                            {{ source.priceChange >= 0 ? '+' : '' }}{{ source.priceChange.toFixed(2) }}%
                          </span>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                    
                    <div class="mt-4">
                      <h3 class="text-subtitle-2 font-weight-bold mb-2">Sales Trend</h3>
                      <v-sparkline
                        :value="source.salesTrend"
                        :gradient="['#00c6ff', '#0072ff']"
                        :smooth="10"
                        :padding="8"
                        line-width="2"
                        stroke-linecap="round"
                        gradient-direction="top"
                        height="60"
                        auto-draw
                      ></v-sparkline>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recommendations Section -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <h2 class="text-h5">
              {{ selectedSource === 'All Sources' ? 'Smart Recommendations' : `Recommendations for ${selectedSource}` }}
            </h2>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col v-for="(rec, index) in filteredRecommendations" :key="index" cols="12" md="4">
                <v-card variant="outlined" class="h-100">
                  <v-card-item>
                    <template v-slot:prepend>
                      <v-avatar 
                        :color="rec.color"
                        rounded
                      >
                        <v-icon color="white">{{ rec.icon }}</v-icon>
                      </v-avatar>
                    </template>
                    <v-card-title>{{ rec.title }}</v-card-title>
                    <v-card-subtitle>{{ rec.subtitle }}</v-card-subtitle>
                    <v-card-text>
                      <p>{{ rec.description }}</p>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn 
                        variant="text" 
                        color="primary"
                        size="small"
                      >
                        Take Action
                      </v-btn>
                    </v-card-actions>
                  </v-card-item>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Date ranges
const dateMenu = ref(false)
const dateRange = ref(['2023-10-01', '2023-10-31'])
const selectedPeriod = ref('30d')

const timePeriods = [
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '3 Months', value: '3m' },
  { label: '6 Months', value: '6m' },
  { label: '1 Year', value: '1y' },
]

const formatDateRange = computed(() => {
  if (dateRange.value?.length === 2) {
    const start = new Date(dateRange.value[0])
    const end = new Date(dateRange.value[1])
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
  }
  return 'Select date range'
})

const selectPeriod = (period: string) => {
  selectedPeriod.value = period
  const today = new Date()
  const end = new Date(today)
  let start = new Date(today)
  
  switch (period) {
    case '7d':
      start.setDate(today.getDate() - 7)
      break
    case '30d':
      start.setDate(today.getDate() - 30)
      break
    case '3m':
      start.setMonth(today.getMonth() - 3)
      break
    case '6m':
      start.setMonth(today.getMonth() - 6)
      break
    case '1y':
      start.setFullYear(today.getFullYear() - 1)
      break
  }
  
  dateRange.value = [
    start.toISOString().split('T')[0],
    end.toISOString().split('T')[0]
  ]
}

// Data sources for filtering
const selectedSource = ref('All Sources')
const dataSources = ['All Sources', 'Amazon', 'Walmart', 'BestBuy', 'Target', 'HomeDepot', 'Wayfair']

// Performance metrics
const performanceMetric = ref('Sales')
const performanceMetrics = ['Sales', 'Price Change', 'Stock Turnover', 'View-to-Purchase']

// Summary statistics by source
const summaryStatsBySource = {
  'All Sources': [
    {
      label: 'Total Products',
      value: '367',
      icon: 'mdi-package-variant-closed',
      color: 'primary',
      change: 12.4
    },
    {
      label: 'Avg. Price',
      value: '$47.82',
      icon: 'mdi-currency-usd',
      color: 'success',
      change: -3.1
    },
    {
      label: 'Out of Stock',
      value: '26',
      icon: 'mdi-alert-circle',
      color: 'error',
      change: -7.8
    },
    {
      label: 'Price Alerts',
      value: '42',
      icon: 'mdi-bell',
      color: 'warning',
      change: 22.5
    }
  ],
  'Amazon': [
    {
      label: 'Total Products',
      value: '159',
      icon: 'mdi-package-variant-closed',
      color: 'primary',
      change: 15.2
    },
    {
      label: 'Avg. Price',
      value: '$52.49',
      icon: 'mdi-currency-usd',
      color: 'success',
      change: -2.3
    },
    {
      label: 'Out of Stock',
      value: '8',
      icon: 'mdi-alert-circle',
      color: 'error',
      change: -12.5
    },
    {
      label: 'Sales Growth',
      value: '18.6%',
      icon: 'mdi-chart-line',
      color: 'info',
      change: 8.2
    }
  ],
  'Walmart': [
    {
      label: 'Total Products',
      value: '87',
      icon: 'mdi-package-variant-closed',
      color: 'primary',
      change: 7.4
    },
    {
      label: 'Avg. Price',
      value: '$38.75',
      icon: 'mdi-currency-usd',
      color: 'success',
      change: -5.1
    },
    {
      label: 'Out of Stock',
      value: '6',
      icon: 'mdi-alert-circle',
      color: 'error',
      change: -2.0
    },
    {
      label: 'Sales Growth',
      value: '12.3%',
      icon: 'mdi-chart-line',
      color: 'info',
      change: 4.6
    }
  ],
  'BestBuy': [
    {
      label: 'Total Products',
      value: '43',
      icon: 'mdi-package-variant-closed',
      color: 'primary',
      change: 22.8
    },
    {
      label: 'Avg. Price',
      value: '$129.99',
      icon: 'mdi-currency-usd',
      color: 'success',
      change: 1.5
    },
    {
      label: 'Out of Stock',
      value: '3',
      icon: 'mdi-alert-circle',
      color: 'error',
      change: -25.0
    },
    {
      label: 'Sales Growth',
      value: '21.7%',
      icon: 'mdi-chart-line',
      color: 'info',
      change: 11.3
    }
  ],
  'Target': [
    {
      label: 'Total Products',
      value: '52',
      icon: 'mdi-package-variant-closed',
      color: 'primary',
      change: 18.2
    },
    {
      label: 'Avg. Price',
      value: '$45.17',
      icon: 'mdi-currency-usd',
      color: 'success',
      change: -2.8
    },
    {
      label: 'Out of Stock',
      value: '4',
      icon: 'mdi-alert-circle',
      color: 'error',
      change: 0.0
    },
    {
      label: 'Sales Growth',
      value: '15.4%',
      icon: 'mdi-chart-line',
      color: 'info',
      change: 7.1
    }
  ],
  'HomeDepot': [
    {
      label: 'Total Products',
      value: '12',
      icon: 'mdi-package-variant-closed',
      color: 'primary',
      change: 0.0
    },
    {
      label: 'Avg. Price',
      value: '$89.50',
      icon: 'mdi-currency-usd',
      color: 'success',
      change: -8.4
    },
    {
      label: 'Out of Stock',
      value: '3',
      icon: 'mdi-alert-circle',
      color: 'error',
      change: 50.0
    },
    {
      label: 'Sales Growth',
      value: '5.2%',
      icon: 'mdi-chart-line',
      color: 'info',
      change: -3.8
    }
  ],
  'Wayfair': [
    {
      label: 'Total Products',
      value: '14',
      icon: 'mdi-package-variant-closed',
      color: 'primary',
      change: 16.7
    },
    {
      label: 'Avg. Price',
      value: '$63.40',
      icon: 'mdi-currency-usd',
      color: 'success',
      change: -1.2
    },
    {
      label: 'Out of Stock',
      value: '2',
      icon: 'mdi-alert-circle',
      color: 'error',
      change: -33.3
    },
    {
      label: 'Sales Growth',
      value: '9.8%',
      icon: 'mdi-chart-line',
      color: 'info',
      change: 2.3
    }
  ]
}

// Source performance data
const sourcePerformance = [
  {
    source: 'Amazon',
    products: 159,
    inStock: 151,
    outOfStock: 8,
    avgPrice: 52.49,
    priceChange: -2.3,
    salesTrend: [32, 41, 35, 48, 56, 52, 60, 65, 63, 68, 75, 82]
  },
  {
    source: 'Walmart',
    products: 87,
    inStock: 81,
    outOfStock: 6,
    avgPrice: 38.75,
    priceChange: -5.1,
    salesTrend: [18, 23, 21, 25, 32, 28, 31, 34, 36, 39, 42, 44]
  },
  {
    source: 'BestBuy',
    products: 43,
    inStock: 40,
    outOfStock: 3,
    avgPrice: 129.99,
    priceChange: 1.5,
    salesTrend: [12, 13, 15, 14, 16, 19, 21, 20, 22, 25, 28, 31]
  },
  {
    source: 'Target',
    products: 52,
    inStock: 48,
    outOfStock: 4,
    avgPrice: 45.17,
    priceChange: -2.8,
    salesTrend: [15, 18, 17, 19, 22, 24, 26, 25, 28, 30, 32, 35]
  },
  {
    source: 'HomeDepot',
    products: 12,
    inStock: 9,
    outOfStock: 3,
    avgPrice: 89.50,
    priceChange: -8.4,
    salesTrend: [5, 6, 5, 7, 6, 8, 7, 6, 5, 6, 7, 8]
  },
  {
    source: 'Wayfair',
    products: 14,
    inStock: 12,
    outOfStock: 2,
    avgPrice: 63.40,
    priceChange: -1.2,
    salesTrend: [4, 5, 6, 7, 8, 8, 9, 10, 9, 11, 10, 12]
  }
]

// Filtered summary stats based on selected source
const filteredSummaryStats = computed(() => {
  return summaryStatsBySource[selectedSource.value] || summaryStatsBySource['All Sources']
})

// Top products table
const loading = ref(false)

const performanceHeaders = [
  { title: '', key: 'image' },
  { title: 'Product', key: 'name' },
  { title: 'Price', key: 'price' },
  { title: 'Price Change', key: 'priceChange' },
  { title: 'Source', key: 'source' },
  { title: 'Performance', key: 'performanceScore' },
  { title: 'Trend', key: 'trend' }
]

// Products by source
const topProductsBySource = {
  'All Sources': [
    {
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=48&h=48&q=80',
      name: 'Wireless Headphones',
      price: 89.99,
      priceChange: -5.2,
      source: 'Amazon',
      performanceScore: 92,
      trend: 'up'
    },
    {
      image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=48&h=48&q=80',
      name: 'Fitness Tracker',
      price: 59.95,
      priceChange: 8.5,
      source: 'Target',
      performanceScore: 85,
      trend: 'up'
    },
    {
      image: 'https://images.unsplash.com/photo-1600648056169-f9a36a0a8bdd?auto=format&fit=crop&w=48&h=48&q=80',
      name: 'Smart Thermostat',
      price: 129.99,
      priceChange: 0,
      source: 'BestBuy',
      performanceScore: 78,
      trend: 'neutral'
    },
    {
      image: 'https://images.unsplash.com/photo-1601598704991-eef6114775e0?auto=format&fit=crop&w=48&h=48&q=80',
      name: 'Premium Coffee Beans',
      price: 18.99,
      priceChange: 7.9,
      source: 'Amazon',
      performanceScore: 76,
      trend: 'down'
    },
    {
      image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=48&h=48&q=80',
      name: 'Ultra HD Monitor',
      price: 299.99,
      priceChange: 6.7,
      source: 'BestBuy',
      performanceScore: 70,
      trend: 'down'
    }
  ],
  'Amazon': [
    {
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=48&h=48&q=80',
      name: 'Wireless Headphones',
      price: 89.99,
      priceChange: -5.2,
      source: 'Amazon',
      performanceScore: 92,
      trend: 'up'
    },
    {
      image: 'https://images.unsplash.com/photo-1601598704991-eef6114775e0?auto=format&fit=crop&w=48&h=48&q=80',
      name: 'Premium Coffee Beans',
      price: 18.99,
      priceChange: 7.9,
      source: 'Amazon',
      performanceScore: 76,
      trend: 'down'
    },
    {
      image: 'https://images.unsplash.com/photo-1551602116-c0d70a21bad6?auto=format&fit=crop&w=48&h=48&q=80',
      name: 'Digital Drawing Tablet',
      price: 149.99,
      priceChange: 0,
      source: 'Amazon',
      performanceScore: 68,
      trend: 'neutral'
    }
  ],
  'Walmart': [
    {
      image: 'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?auto=format&fit=crop&w=48&h=48&q=80',
      name: 'Organic Tea Collection',
      price: 24.99,
      priceChange: -2.0,
      source: 'Walmart',
      performanceScore: 81,
      trend: 'up'
    },
    {
      image: 'https://images.unsplash.com/photo-1591155426209-259b046aae4e?auto=format&fit=crop&w=48&h=48&q=80',
      name: 'Kitchen Knife Set',
      price: 79.95,
      priceChange: -1.2,
      source: 'Walmart',
      performanceScore: 74,
      trend: 'up'
    }
  ],
  'BestBuy': [
    {
      image: 'https://images.unsplash.com/photo-1600648056169-f9a36a0a8bdd?auto=format&fit=crop&w=48&h=48&q=80',
      name: 'Smart Thermostat',
      price: 129.99,
      priceChange: 0,
      source: 'BestBuy',
      performanceScore: 78,
      trend: 'neutral'
    },
    {
      image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=48&h=48&q=80',
      name: 'Ultra HD Monitor',
      price: 299.99,
      priceChange: 6.7,
      source: 'BestBuy',
      performanceScore: 70,
      trend: 'down'
    }
  ],
  'Target': [
    {
      image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=48&h=48&q=80',
      name: 'Fitness Tracker',
      price: 59.95,
      priceChange: 8.5,
      source: 'Target',
      performanceScore: 85,
      trend: 'up'
    }
  ],
  'HomeDepot': [
    {
      image: 'https://images.unsplash.com/photo-1585301669225-1c69d71a833d?auto=format&fit=crop&w=48&h=48&q=80',
      name: 'Smart Doorbell',
      price: 199.99,
      priceChange: -15.0,
      source: 'HomeDepot',
      performanceScore: 62,
      trend: 'down'
    }
  ],
  'Wayfair': [
    {
      image: 'https://images.unsplash.com/photo-1545669577-c2b89ee55388?auto=format&fit=crop&w=48&h=48&q=80',
      name: 'Ceramic Mug Set',
      price: 34.50,
      priceChange: -1.5,
      source: 'Wayfair',
      performanceScore: 65,
      trend: 'neutral'
    }
  ]
}

// Filtered top products based on selected source
const filteredTopProducts = computed(() => {
  if (selectedSource.value === 'All Sources') {
    return topProductsBySource['All Sources']
  } else {
    return topProductsBySource[selectedSource.value] || []
  }
})

// Recommendations by source
const recommendationsBySource = {
  'All Sources': [
    {
      title: 'Price Opportunity',
      subtitle: 'Competitor Analysis',
      description: 'Your Smart Thermostat is priced 15% higher than competitors. Consider adjusting price to increase competitiveness.',
      icon: 'mdi-currency-usd',
      color: 'primary'
    },
    {
      title: 'Inventory Alert',
      subtitle: 'Stock Management',
      description: 'Digital Drawing Tablet has low stock (3 units) but high demand. Consider restocking soon to avoid lost sales.',
      icon: 'mdi-package-variant',
      color: 'warning'
    },
    {
      title: 'Trend Opportunity',
      subtitle: 'Market Intelligence',
      description: 'Fitness trackers are showing a 22% increase in searches. Consider featuring your products more prominently.',
      icon: 'mdi-trending-up',
      color: 'success'
    }
  ],
  'Amazon': [
    {
      title: 'Price Adjustment',
      subtitle: 'Amazon Pricing',
      description: 'Wireless Headphones price reduction is driving increased sales. Consider similar strategy for other electronics.',
      icon: 'mdi-currency-usd',
      color: 'success'
    },
    {
      title: 'Inventory Alert',
      subtitle: 'Amazon Stock',
      description: 'Digital Drawing Tablet has low stock on Amazon but high demand. Prioritize restocking this channel.',
      icon: 'mdi-package-variant',
      color: 'warning'
    }
  ],
  'Walmart': [
    {
      title: 'Category Focus',
      subtitle: 'Walmart Strategy',
      description: 'Kitchen products are outperforming other categories on Walmart. Consider expanding your kitchen product line.',
      icon: 'mdi-food-variant',
      color: 'info'
    }
  ],
  'BestBuy': [
    {
      title: 'Competitive Pricing',
      subtitle: 'BestBuy Analysis',
      description: 'Your electronics are priced 8% higher than BestBuy average. Consider price adjustment for this channel.',
      icon: 'mdi-currency-usd',
      color: 'error'
    }
  ],
  'Target': [
    {
      title: 'Growth Opportunity',
      subtitle: 'Target Channel',
      description: 'Fitness products have 85% higher engagement on Target compared to other channels. Focus promotion here.',
      icon: 'mdi-trending-up',
      color: 'success'
    }
  ],
  'HomeDepot': [
    {
      title: 'Price Reduction',
      subtitle: 'HomeDepot Strategy',
      description: 'Smart home devices seeing price pressure. The 15% reduction on Smart Doorbell has improved rank position.',
      icon: 'mdi-currency-usd',
      color: 'primary'
    }
  ],
  'Wayfair': [
    {
      title: 'Inventory Focus',
      subtitle: 'Wayfair Channel',
      description: 'Home goods performing steadily on Wayfair despite overall market fluctuations. Maintain inventory levels.',
      icon: 'mdi-package-variant',
      color: 'info'
    }
  ]
}

// Filtered recommendations based on selected source
const filteredRecommendations = computed(() => {
  if (selectedSource.value === 'All Sources') {
    return recommendationsBySource['All Sources']
  } else {
    return recommendationsBySource[selectedSource.value] || []
  }
})

// Helper function to get source icon
const getSourceIcon = (source: string): string => {
  const icons = {
    'Amazon': 'mdi-cart',
    'Walmart': 'mdi-store',
    'BestBuy': 'mdi-shopping',
    'Target': 'mdi-target',
    'HomeDepot': 'mdi-home',
    'Wayfair': 'mdi-sofa'
  }
  
  return icons[source] || 'mdi-database'
}

// Get price text color class
const getPriceColorClass = (delta: number): string => {
  if (delta > 0) return 'text-error'
  if (delta < 0) return 'text-success'
  return ''
}
</script>

<style scoped>
.price-chart, .pie-chart, .bar-chart, .radar-chart {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.gap-2 {
  gap: 8px;
}
</style>
 