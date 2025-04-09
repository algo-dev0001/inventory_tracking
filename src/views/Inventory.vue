<template>
    <div>
    <v-container>
      <v-row class="mb-6 mt-4">
        <v-col cols="12">
          <h1 class="text-h3 font-weight-bold">Inventory Management</h1>
          <p class="text-subtitle-1">Track and manage your inventory data collected from various sources</p>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between flex-wrap">
              <div>
                <h2 class="text-h5">Products Inventory</h2>
                <v-chip
                  color="primary"
                  size="small"
                  class="mt-1"
                >
                  Last updated: {{ formatDate(lastUpdated) }}
                </v-chip>
              </div>
              
              <div class="d-flex align-center flex-wrap mt-2 mt-sm-0">
                <v-text-field
                  v-model="search"
                  label="Search"
                  variant="outlined"
                  density="compact"
                  class="mr-2 mb-2 mb-sm-0"
                  hide-details
                  prepend-inner-icon="mdi-magnify"
                  style="max-width: 250px"
                ></v-text-field>
                
                <v-btn 
                  color="primary" 
                  prepend-icon="mdi-refresh"
                  @click="refreshData"
                  :loading="loading"
                >
                  Refresh
                </v-btn>
              </div>
            </v-card-title>
            
            <v-card-text>
              <!-- Filters -->
              <v-row class="mb-4">
                <v-col cols="12" sm="3">
                  <v-select
                    v-model="sourceFilter"
                    :items="['All', ...sources]"
                    label="Source Filter"
                    variant="outlined"
                    density="compact"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-select
                    v-model="stockFilter"
                    :items="stockFilterOptions"
                    label="Stock Filter"
                    variant="outlined"
                    density="compact"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-select
                    v-model="assignedFilter"
                    :items="['All', ...assignedUsers.map(user => user.name)]"
                    label="Assigned To"
                    variant="outlined"
                    density="compact"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-checkbox
                    v-model="importantFilter"
                    label="Important Items Only"
                    color="primary"
                    hide-details
                  ></v-checkbox>
                </v-col>
              </v-row>

              <v-data-table
                :headers="headers"
                :items="filteredItems"
                :search="search"
                :loading="loading"
                :items-per-page="10"
                item-value="id"
                class="elevation-1"
              >
                <template v-slot:item.image="{ item }">
                  <v-avatar size="40">
                    <v-img :src="item.image" cover></v-img>
                  </v-avatar>
                </template>
                
                <template v-slot:item.price="{ item }">
                  <div :class="getPriceColorClass(item.priceDelta)">
                    ${{ item.price.toFixed(2) }}
                    <v-icon
                      v-if="item.priceDelta !== 0"
                      size="small"
                      :color="getPriceColor(item.priceDelta)"
                    >
                      {{ item.priceDelta > 0 ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                    </v-icon>
                  </div>
                </template>
                
                <template v-slot:item.stock="{ item }">
                  <v-chip
                    :color="getStockColor(item.stock)"
                    size="small"
                  >
                    {{ item.stock }}
                  </v-chip>
                </template>
                
                <template v-slot:item.source="{ item }">
                  <v-chip
                    variant="outlined"
                    size="small"
                  >
                    {{ item.source }}
                  </v-chip>
                </template>
                
                <template v-slot:item.tags="{ item }">
                  <div class="d-flex align-center">
                    <v-chip
                      v-for="(tag, index) in item.tags"
                      :key="index"
                      size="small"
                      class="mr-1"
                      color="secondary"
                      variant="flat"
                    >
                      {{ tag }}
                    </v-chip>
                    <v-btn
                      icon
                      size="x-small"
                      variant="text"
                      @click="editTags(item)"
                    >
                      <v-icon size="small">mdi-pencil-outline</v-icon>
                    </v-btn>
                  </div>
                </template>
                
                <template v-slot:item.assignedTo="{ item }">
                  <div class="d-flex align-center">
                    <v-avatar v-if="item.assignedTo" size="24" class="mr-2">
                      <v-img :src="getUserAvatar(item.assignedTo)" cover></v-img>
                    </v-avatar>
                    <span>{{ item.assignedTo ? item.assignedTo : 'Unassigned' }}</span>
                    <v-btn
                      icon
                      size="x-small"
                      variant="text"
                      class="ml-2"
                      @click="assignUser(item)"
                    >
                      <v-icon size="small">mdi-account-edit-outline</v-icon>
                    </v-btn>
                  </div>
                </template>
                
                <template v-slot:item.important="{ item }">
                  <v-checkbox
                    v-model="item.important"
                    color="error"
                    hide-details
                    density="compact"
                  ></v-checkbox>
                </template>
                
                <template v-slot:item.notes="{ item }">
                  <div class="d-flex align-center">
                    <v-icon 
                      size="small" 
                      :color="item.notes ? 'info' : 'grey'"
                      class="mr-1"
                    >
                      mdi-note-text-outline
                    </v-icon>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <span 
                          v-bind="props" 
                          class="text-caption text-truncate d-inline-block"
                          style="max-width: 100px;"
                        >
                          {{ item.notes ? item.notes : 'No notes' }}
                        </span>
                      </template>
                      <span>{{ item.notes ? item.notes : 'No notes' }}</span>
                    </v-tooltip>
                  </div>
                </template>
                
                <template v-slot:item.lastChecked="{ item }">
                  {{ formatDate(item.lastChecked) }}
                </template>
                
                <template v-slot:item.actions="{ item }">
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn
                        icon
                        variant="text"
                        v-bind="props"
                      >
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="viewDetails(item)">
                        <template v-slot:prepend>
                          <v-icon>mdi-eye</v-icon>
                        </template>
                        <v-list-item-title>View Details</v-list-item-title>
                      </v-list-item>
                      
                      <v-list-item @click="editNotes(item)">
                        <template v-slot:prepend>
                          <v-icon>mdi-note-edit-outline</v-icon>
                        </template>
                        <v-list-item-title>Edit Notes</v-list-item-title>
                      </v-list-item>
                      
                      <v-list-item @click="updateNow(item)">
                        <template v-slot:prepend>
                          <v-icon>mdi-refresh</v-icon>
                        </template>
                        <v-list-item-title>Update Now</v-list-item-title>
                      </v-list-item>
                      
                      <v-list-item @click="trackHistory(item)">
                        <template v-slot:prepend>
                          <v-icon>mdi-chart-line</v-icon>
                        </template>
                        <v-list-item-title>Track History</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <v-row class="mt-8">
        <v-col cols="12" md="8">
          <v-card class="mb-4">
            <v-card-title>
              <h2 class="text-h5">Inventory Overview</h2>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" md="3">
                  <v-card variant="outlined">
                    <v-card-text class="text-center">
                      <v-icon size="36" color="primary" class="mb-2">mdi-cube-outline</v-icon>
                      <div class="text-h5 font-weight-bold">{{ inventorySummary.totalProducts }}</div>
                      <div class="text-body-2 text-medium-emphasis">Total Products</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                
                <v-col cols="12" sm="6" md="3">
                  <v-card variant="outlined">
                    <v-card-text class="text-center">
                      <v-icon size="36" color="success" class="mb-2">mdi-check-circle-outline</v-icon>
                      <div class="text-h5 font-weight-bold">{{ inventorySummary.inStock }}</div>
                      <div class="text-body-2 text-medium-emphasis">In Stock</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                
                <v-col cols="12" sm="6" md="3">
                  <v-card variant="outlined">
                    <v-card-text class="text-center">
                      <v-icon size="36" color="warning" class="mb-2">mdi-alert-outline</v-icon>
                      <div class="text-h5 font-weight-bold">{{ inventorySummary.lowStock }}</div>
                      <div class="text-body-2 text-medium-emphasis">Low Stock</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                
                <v-col cols="12" sm="6" md="3">
                  <v-card variant="outlined">
                    <v-card-text class="text-center">
                      <v-icon size="36" color="error" class="mb-2">mdi-close-circle-outline</v-icon>
                      <div class="text-h5 font-weight-bold">{{ inventorySummary.outOfStock }}</div>
                      <div class="text-body-2 text-medium-emphasis">Out of Stock</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>
              <h2 class="text-h5">Data Sources</h2>
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item v-for="source in dataSources" :key="source.name">
                  <template v-slot:prepend>
                    <v-avatar color="primary" size="36">
                      <v-icon color="white">{{ source.icon }}</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title>{{ source.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ source.status === 'active' ? 'Connected' : 'Inactive' }}
                  </v-list-item-subtitle>
                  <template v-slot:append>
                    <v-chip
                      size="small"
                      :color="source.status === 'active' ? 'success' : 'error'"
                    >
                      {{ source.status === 'active' ? 'Active' : 'Inactive' }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Product Details Dialog -->
      <v-dialog v-model="detailDialog" max-width="800px">
        <v-card v-if="selectedProduct">
          <v-card-title class="text-h5">Product Details</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="4">
                <v-img
                  :src="selectedProduct.image"
                  height="200"
                  cover
                  class="rounded"
                ></v-img>
              </v-col>
              <v-col cols="12" sm="8">
                <h3 class="text-h6 mb-2">{{ selectedProduct.name }}</h3>
                <p class="mb-2"><strong>SKU:</strong> {{ selectedProduct.sku }}</p>
                <p class="mb-2"><strong>Price:</strong> ${{ selectedProduct.price.toFixed(2) }}</p>
                <p class="mb-2"><strong>Stock:</strong> {{ selectedProduct.stock }}</p>
                <p class="mb-2"><strong>Source:</strong> {{ selectedProduct.source }}</p>
                <p class="mb-2"><strong>Last Checked:</strong> {{ formatDate(selectedProduct.lastChecked) }}</p>
                <p class="mb-4"><strong>URL:</strong> <a :href="selectedProduct.url" target="_blank" class="text-decoration-none">View Original</a></p>
                
                <p class="mb-2">
                  <strong>Assigned To:</strong> 
                  <span v-if="selectedProduct.assignedTo" class="d-flex align-center">
                    <v-avatar size="24" class="mr-2">
                      <v-img :src="getUserAvatar(selectedProduct.assignedTo)" cover></v-img>
                    </v-avatar>
                    {{ selectedProduct.assignedTo }}
                  </span>
                  <span v-else>Unassigned</span>
                  <v-btn
                    icon
                    size="x-small"
                    variant="text"
                    class="ml-2"
                    @click="assignUser(selectedProduct)"
                  >
                    <v-icon size="small">mdi-account-edit-outline</v-icon>
                  </v-btn>
                </p>
                
                <v-divider class="mb-4"></v-divider>
                
                <h4 class="text-subtitle-1 mb-2">Price History</h4>
                <p class="mb-2"><strong>Previous Price:</strong> ${{ (selectedProduct.price - selectedProduct.priceDelta).toFixed(2) }}</p>
                <p class="mb-2"><strong>Price Change:</strong> 
                  <span :class="getPriceColorClass(selectedProduct.priceDelta)">
                    {{ selectedProduct.priceDelta > 0 ? '+' : '' }}${{ selectedProduct.priceDelta.toFixed(2) }}
                    ({{ ((selectedProduct.priceDelta / (selectedProduct.price - selectedProduct.priceDelta)) * 100).toFixed(1) }}%)
                  </span>
                </p>

                <h4 class="text-subtitle-1 mb-2 mt-4">Tags</h4>
                <div class="d-flex align-center flex-wrap">
                  <v-chip
                    v-for="(tag, index) in selectedProduct.tags"
                    :key="index"
                    size="small"
                    class="mr-1 mb-1"
                    color="secondary"
                    variant="flat"
                  >
                    {{ tag }}
                  </v-chip>
                  <v-btn
                    icon
                    size="x-small"
                    variant="text"
                    @click="editTags(selectedProduct)"
                  >
                    <v-icon size="small">mdi-pencil-outline</v-icon>
                  </v-btn>
                </div>
                
                <h4 class="text-subtitle-1 mb-2 mt-4">Notes</h4>
                <div class="d-flex align-center">
                  <v-textarea
                    v-model="selectedProduct.notes"
                    variant="outlined"
                    rows="3"
                    hide-details
                    density="compact"
                    class="mb-2"
                    :placeholder="selectedProduct.notes ? '' : 'No notes added yet'"
                    readonly
                  ></v-textarea>
                  <v-btn
                    icon
                    variant="text"
                    class="ml-2"
                    @click="editNotes(selectedProduct)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="text" @click="detailDialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Edit Tags Dialog -->
      <v-dialog v-model="tagDialog" max-width="500px">
        <v-card v-if="selectedProduct">
          <v-card-title class="text-h5">Edit Tags for {{ selectedProduct.name }}</v-card-title>
          <v-card-text>
            <v-combobox
              v-model="editedTags"
              :items="availableTags"
              label="Add or Edit Tags"
              multiple
              chips
              variant="outlined"
              hint="Press enter to add new tags"
              persistent-hint
            ></v-combobox>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" variant="text" @click="tagDialog = false">
              Cancel
            </v-btn>
            <v-btn color="primary" variant="text" @click="saveTags">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
      <!-- Edit Notes Dialog -->
      <v-dialog v-model="notesDialog" max-width="600px">
        <v-card v-if="selectedProduct">
          <v-card-title class="text-h5">Edit Notes for {{ selectedProduct.name }}</v-card-title>
          <v-card-text>
            <v-textarea
              v-model="editedNotes"
              label="Notes"
              variant="outlined"
              rows="5"
              auto-grow
              counter
              :placeholder="'Add notes for this product'"
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" variant="text" @click="notesDialog = false">
              Cancel
            </v-btn>
            <v-btn color="primary" variant="text" @click="saveNotes">
              Save Notes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
      <!-- Assign User Dialog -->
      <v-dialog v-model="assignDialog" max-width="500px">
        <v-card v-if="selectedProduct">
          <v-card-title class="text-h5">Assign {{ selectedProduct.name }}</v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedAssignee"
              :items="assignedUsers.map(user => user.name)"
              label="Select User"
              variant="outlined"
              :prepend-inner-icon="'mdi-account'"
            >
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="24" class="mr-2">
                    <v-img :src="getUserAvatar(item.title)" cover></v-img>
                  </v-avatar>
                  {{ item.title }}
                </div>
              </template>
              <template v-slot:item="{ item, props }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-avatar size="24">
                      <v-img :src="getUserAvatar(item.title)" cover></v-img>
                    </v-avatar>
                  </template>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </template>
            </v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn color="error" variant="text" @click="removeAssignment">
              Unassign
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="error" variant="text" @click="assignDialog = false">
              Cancel
            </v-btn>
            <v-btn color="primary" variant="text" @click="saveAssignment">
              Assign
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '../stores/theme'

const themeStore = useThemeStore()

interface InventoryItem {
  id: number
  name: string
  sku: string
  image: string
  price: number
  priceDelta: number
  stock: number
  source: string
  lastChecked: Date
  url: string
  tags: string[]
  important: boolean
  notes?: string
  assignedTo?: string
}

interface User {
  name: string
  avatar: string
  role: string
}

const search = ref('')
const loading = ref(true)
const lastUpdated = ref(new Date())
const detailDialog = ref(false)
const tagDialog = ref(false)
const notesDialog = ref(false)
const assignDialog = ref(false)
const selectedProduct = ref<InventoryItem | null>(null)
const editedTags = ref<string[]>([])
const editedNotes = ref('')
const selectedAssignee = ref<string | null>(null)
const availableTags = ref(['Electronics', 'Office', 'Kitchen', 'Furniture', 'Popular', 'Trending', 'Seasonal', 'Clearance', 'New Arrival', 'Best Seller'])

// Filters
const sourceFilter = ref('All')
const stockFilter = ref('All')
const importantFilter = ref(false)
const assignedFilter = ref('All')

const stockFilterOptions = [
  'All',
  'In Stock',
  'Low Stock',
  'Out of Stock'
]

// Team members
const assignedUsers = ref<User[]>([
  { name: 'Sarah Johnson', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', role: 'Inventory Manager' },
  { name: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', role: 'Product Specialist' },
  { name: 'Emma Wilson', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', role: 'Supply Chain Manager' },
  { name: 'David Kim', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', role: 'Data Analyst' }
])

// Mock data
const headers = [
  { title: 'Image', key: 'image', sortable: false },
  { title: 'Name', key: 'name' },
  { title: 'SKU', key: 'sku' },
  { title: 'Price', key: 'price' },
  { title: 'Stock', key: 'stock' },
  { title: 'Source', key: 'source' },
  { title: 'Tags', key: 'tags', sortable: false },
  { title: 'Assigned To', key: 'assignedTo' },
  { title: 'Important', key: 'important' },
  { title: 'Notes', key: 'notes' },
  { title: 'Last Checked', key: 'lastChecked' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const items = ref<InventoryItem[]>([
  {
    id: 1,
    name: 'Premium Coffee Beans',
    sku: 'CB-001',
    image: 'https://images.unsplash.com/photo-1601598704991-eef6114775e0?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHx3YXJlaG91c2UlMjBpbnZlbnRvcnklMjBtYW5hZ2VtZW50fGVufDB8fHx8MTc0NDIzMTk2N3ww&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200',
    price: 18.99,
    priceDelta: 1.50,
    stock: 142,
    source: 'Amazon',
    lastChecked: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    url: 'https://example.com/product/1',
    tags: ['Kitchen', 'Trending'],
    important: true,
    notes: 'High demand during holiday season. Consider increasing stock in November.',
    assignedTo: 'Sarah Johnson'
  },
  {
    id: 2,
    name: 'Organic Tea Collection',
    sku: 'TC-445',
    image: 'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?auto=format&fit=crop&w=200&h=200&q=80',
    price: 24.99,
    priceDelta: -2.00,
    stock: 78,
    source: 'Walmart',
    lastChecked: new Date(Date.now() - 1000 * 60 * 55), // 55 minutes ago
    url: 'https://example.com/product/2',
    tags: ['Kitchen', 'Best Seller'],
    important: false,
    assignedTo: 'Michael Chen',
    notes: 'New packaging expected in next shipment'
  },
  {
    id: 3,
    name: 'Smart Thermostat',
    sku: 'ST-109',
    image: 'https://images.unsplash.com/photo-1600648056169-f9a36a0a8bdd?auto=format&fit=crop&w=200&h=200&q=80',
    price: 129.99,
    priceDelta: 0,
    stock: 23,
    source: 'BestBuy',
    lastChecked: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    url: 'https://example.com/product/3',
    tags: ['Electronics', 'New Arrival'],
    important: true,
    assignedTo: 'Emma Wilson'
  },
  {
    id: 4,
    name: 'Wireless Headphones',
    sku: 'WH-785',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=200&h=200&q=80',
    price: 89.99,
    priceDelta: -5.00,
    stock: 56,
    source: 'Amazon',
    lastChecked: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    url: 'https://example.com/product/4',
    tags: ['Electronics', 'Popular'],
    important: false,
    notes: 'Competitor lowered price by 10%. Consider matching.',
    assignedTo: 'David Kim'
  },
  {
    id: 5,
    name: 'Fitness Tracker',
    sku: 'FT-332',
    image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=200&h=200&q=80',
    price: 59.95,
    priceDelta: 4.95,
    stock: 12,
    source: 'Target',
    lastChecked: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    url: 'https://example.com/product/5',
    tags: ['Electronics', 'Trending', 'Low Stock'],
    important: true,
    assignedTo: 'Sarah Johnson',
    notes: 'This model being phased out. New version arriving next month.'
  },
  {
    id: 6,
    name: 'Portable Charger',
    sku: 'PC-897',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=200&h=200&q=80',
    price: 39.99,
    priceDelta: 0,
    stock: 89,
    source: 'Amazon',
    lastChecked: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
    url: 'https://example.com/product/6',
    tags: ['Electronics', 'Best Seller'],
    important: false
  },
  {
    id: 7,
    name: 'Ceramic Mug Set',
    sku: 'CM-234',
    image: 'https://images.unsplash.com/photo-1545669577-c2b89ee55388?auto=format&fit=crop&w=200&h=200&q=80',
    price: 34.50,
    priceDelta: -1.50,
    stock: 0,
    source: 'Wayfair',
    lastChecked: new Date(Date.now() - 1000 * 60 * 150), // 2.5 hours ago
    url: 'https://example.com/product/7',
    tags: ['Kitchen', 'Clearance'],
    important: false,
    notes: 'Discontinued by manufacturer. Do not restock.',
    assignedTo: 'Michael Chen'
  },
  {
    id: 8,
    name: 'Ultra HD Monitor',
    sku: 'UM-789',
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=200&h=200&q=80',
    price: 299.99,
    priceDelta: 20.00,
    stock: 7,
    source: 'BestBuy',
    lastChecked: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    url: 'https://example.com/product/8',
    tags: ['Electronics', 'Low Stock'],
    important: true,
    assignedTo: 'David Kim'
  },
  {
    id: 9,
    name: 'Digital Drawing Tablet',
    sku: 'DT-456',
    image: 'https://images.unsplash.com/photo-1551602116-c0d70a21bad6?auto=format&fit=crop&w=200&h=200&q=80',
    price: 149.99,
    priceDelta: 0,
    stock: 3,
    source: 'Amazon',
    lastChecked: new Date(Date.now() - 1000 * 60 * 125), // 2 hours 5 minutes ago
    url: 'https://example.com/product/9',
    tags: ['Electronics', 'Office', 'Low Stock'],
    important: true,
    assignedTo: 'Emma Wilson',
    notes: 'Very popular item. Restock immediately when available.'
  },
  {
    id: 10,
    name: 'Smart Doorbell',
    sku: 'SD-678',
    image: 'https://images.unsplash.com/photo-1585301669225-1c69d71a833d?auto=format&fit=crop&w=200&h=200&q=80',
    price: 199.99,
    priceDelta: -15.00,
    stock: 0,
    source: 'HomeDepot',
    lastChecked: new Date(Date.now() - 1000 * 60 * 300), // 5 hours ago
    url: 'https://example.com/product/10',
    tags: ['Electronics', 'Smart Home', 'Out of Stock'],
    important: false,
    notes: 'New version will replace this model in Q4. Do not restock.'
  }
])

const dataSources = [
  { name: 'Amazon', status: 'active', icon: 'mdi-cart' },
  { name: 'Walmart', status: 'active', icon: 'mdi-store' },
  { name: 'BestBuy', status: 'active', icon: 'mdi-shopping' },
  { name: 'Target', status: 'active', icon: 'mdi-target' },
  { name: 'HomeDepot', status: 'inactive', icon: 'mdi-home' },
  { name: 'Wayfair', status: 'active', icon: 'mdi-sofa' }
]

// Extract all unique sources for the filter
const sources = computed(() => {
  return [...new Set(items.value.map(item => item.source))]
})

const inventorySummary = computed(() => {
  const totalProducts = items.value.length
  const inStock = items.value.filter(item => item.stock > 10).length
  const lowStock = items.value.filter(item => item.stock > 0 && item.stock <= 10).length
  const outOfStock = items.value.filter(item => item.stock === 0).length
  
  return {
    totalProducts,
    inStock,
    lowStock,
    outOfStock
  }
})

const filteredItems = computed(() => {
  let result = [...items.value]
  
  // Apply search if any
  if (search.value) {
    const searchTerm = search.value.toLowerCase()
    result = result.filter(item => 
      item.name.toLowerCase().includes(searchTerm) ||
      item.sku.toLowerCase().includes(searchTerm) ||
      item.source.toLowerCase().includes(searchTerm) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm)) ||
      (item.assignedTo && item.assignedTo.toLowerCase().includes(searchTerm))
    )
  }
  
  // Apply source filter
  if (sourceFilter.value !== 'All') {
    result = result.filter(item => item.source === sourceFilter.value)
  }
  
  // Apply stock filter
  if (stockFilter.value !== 'All') {
    if (stockFilter.value === 'In Stock') {
      result = result.filter(item => item.stock > 10)
    } else if (stockFilter.value === 'Low Stock') {
      result = result.filter(item => item.stock > 0 && item.stock <= 10)
    } else if (stockFilter.value === 'Out of Stock') {
      result = result.filter(item => item.stock === 0)
    }
  }
  
  // Apply assigned filter
  if (assignedFilter.value !== 'All') {
    result = result.filter(item => item.assignedTo === assignedFilter.value)
  }
  
  // Apply important filter
  if (importantFilter.value) {
    result = result.filter(item => item.important)
  }
  
  return result
})

// Format date to a readable string
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Get color based on stock level
const getStockColor = (stock: number): string => {
  if (stock === 0) return 'error'
  if (stock <= 10) return 'warning'
  return 'success'
}

// Get price color based on delta
const getPriceColor = (delta: number): string => {
  if (delta > 0) return 'error'
  if (delta < 0) return 'success'
  return ''
}

// Get price text color class
const getPriceColorClass = (delta: number): string => {
  if (delta > 0) return 'text-error'
  if (delta < 0) return 'text-success'
  return ''
}

// Get user avatar by name
const getUserAvatar = (name: string): string => {
  const user = assignedUsers.value.find(u => u.name === name)
  return user ? user.avatar : 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
}

// Actions
const viewDetails = (item: InventoryItem) => {
  selectedProduct.value = { ...item }
  detailDialog.value = true
}

const editTags = (item: InventoryItem) => {
  selectedProduct.value = item
  editedTags.value = [...item.tags]
  tagDialog.value = true
}

const saveTags = () => {
  if (selectedProduct.value) {
    const index = items.value.findIndex(item => item.id === selectedProduct.value!.id)
    if (index !== -1) {
      // Update the item's tags
      items.value[index].tags = [...editedTags.value]
      
      // Also update the selected product reference
      if (selectedProduct.value) {
        selectedProduct.value.tags = [...editedTags.value]
      }
      
      // Add any new tags to the available tags list
      editedTags.value.forEach(tag => {
        if (!availableTags.value.includes(tag)) {
          availableTags.value.push(tag)
        }
      })
    }
  }
  tagDialog.value = false
}

const editNotes = (item: InventoryItem) => {
  selectedProduct.value = item
  editedNotes.value = item.notes || ''
  notesDialog.value = true
}

const saveNotes = () => {
  if (selectedProduct.value) {
    const index = items.value.findIndex(item => item.id === selectedProduct.value!.id)
    if (index !== -1) {
      // Update the item's notes
      items.value[index].notes = editedNotes.value
      
      // Also update the selected product reference
      if (selectedProduct.value) {
        selectedProduct.value.notes = editedNotes.value
      }
    }
  }
  notesDialog.value = false
}

const assignUser = (item: InventoryItem) => {
  selectedProduct.value = item
  selectedAssignee.value = item.assignedTo || null
  assignDialog.value = true
}

const saveAssignment = () => {
  if (selectedProduct.value) {
    const index = items.value.findIndex(item => item.id === selectedProduct.value!.id)
    if (index !== -1) {
      // Update the assignment
      items.value[index].assignedTo = selectedAssignee.value || undefined
      
      // Also update the selected product reference
      if (selectedProduct.value) {
        selectedProduct.value.assignedTo = selectedAssignee.value || undefined
      }
    }
  }
  assignDialog.value = false
}

const removeAssignment = () => {
  if (selectedProduct.value) {
    const index = items.value.findIndex(item => item.id === selectedProduct.value!.id)
    if (index !== -1) {
      // Remove the assignment
      delete items.value[index].assignedTo
      
      // Also update the selected product reference
      if (selectedProduct.value) {
        delete selectedProduct.value.assignedTo
      }
    }
  }
  assignDialog.value = false
}

const updateNow = (item: InventoryItem) => {
  // Simulate update for this specific item
  const index = items.value.findIndex(i => i.id === item.id)
  if (index !== -1) {
    items.value[index] = {
      ...item,
      lastChecked: new Date()
    }
  }
}

const trackHistory = (item: InventoryItem) => {
  // Would show price history chart in real implementation
  console.log('Tracking history for:', item.name)
}

const refreshData = async () => {
  loading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update last checked timestamps
    items.value = items.value.map(item => ({
      ...item,
      lastChecked: new Date()
    }))
    
    lastUpdated.value = new Date()
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // Simulate loading data
  await new Promise(resolve => setTimeout(resolve, 1000))
  loading.value = false
})
</script>
 