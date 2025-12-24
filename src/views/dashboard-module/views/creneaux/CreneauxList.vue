<template>
  <div class="container-xl">
    <!-- Page header -->
    <div class="page-header d-print-none">
      <div class="container-xl">
        <div class="row g-2 align-items-center">
          <div class="col">
            <h2 class="page-title">
              <i class="bi bi-calendar-check me-2"></i>
              Mes Créneaux
            </h2>
            <div class="text-muted">Gérez vos disponibilités et réservations</div>
          </div>
          <div class="col-auto ms-auto d-print-none">
            <div class="btn-list">
              <button
                type="button"
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#blockDateModal"
              >
                <i class="bi bi-x-circle me-1"></i>
                Bloquer une date
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Page body -->
    <div class="page-body">
      <div class="container-xl">
        <div class="row">
          <!-- Calendrier -->
          <div class="col-md-8">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Calendrier des réservations</h3>
                <div class="card-actions">
                  <div class="btn-group" role="group">
                    <button
                      type="button"
                      class="btn btn-sm"
                      :class="{ 'btn-primary': currentView === 'month', 'btn-outline-primary': currentView !== 'month' }"
                      @click="currentView = 'month'"
                    >
                      Mois
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm"
                      :class="{ 'btn-primary': currentView === 'week', 'btn-outline-primary': currentView !== 'week' }"
                      @click="currentView = 'week'"
                    >
                      Semaine
                    </button>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <!-- Navigation du calendrier -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <button class="btn btn-outline-primary btn-sm" @click="previousPeriod">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                  <h4 class="mb-0">{{ currentPeriodLabel }}</h4>
                  <button class="btn btn-outline-primary btn-sm" @click="nextPeriod">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </div>

                <!-- Vue mensuelle -->
                <div v-if="currentView === 'month'" class="calendar-month">
                  <div class="row text-center fw-bold mb-2">
                    <div class="col">Lun</div>
                    <div class="col">Mar</div>
                    <div class="col">Mer</div>
                    <div class="col">Jeu</div>
                    <div class="col">Ven</div>
                    <div class="col">Sam</div>
                    <div class="col">Dim</div>
                  </div>
                  <div v-for="week in monthWeeks" :key="week[0]?.date" class="row mb-1">
                    <div
                      v-for="day in week"
                      :key="day.date"
                      class="col p-1"
                    >
                      <div
                        class="calendar-day"
                        :class="{
                          'other-month': !day.isCurrentMonth,
                          'blocked': day.isBlocked,
                          'has-bookings': day.bookings.length > 0,
                          'today': day.isToday
                        }"
                        @click="selectDay(day)"
                      >
                        <div class="day-number">{{ day.day }}</div>
                        <div v-if="day.bookings.length > 0" class="booking-indicator">
                          {{ day.bookings.length }}
                        </div>
                        <div v-if="day.isBlocked" class="blocked-indicator">
                          <i class="bi bi-x-circle text-danger"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Vue hebdomadaire -->
                <div v-if="currentView === 'week'" class="calendar-week">
                  <div class="row">
                    <div class="col-1"></div>
                    <div v-for="day in weekDays" :key="day.date" class="col text-center">
                      <div class="fw-bold">{{ day.dayName }}</div>
                      <div class="text-muted">{{ day.day }}</div>
                    </div>
                  </div>
                  <div class="time-slots mt-3">
                    <div v-for="hour in timeSlots" :key="hour" class="row mb-1">
                      <div class="col-1 text-end pe-2">
                        <small class="text-muted">{{ hour }}:00</small>
                      </div>
                      <div v-for="day in weekDays" :key="`${day.date}-${hour}`" class="col">
                        <div
                          class="time-slot"
                          :class="{
                            'blocked': isTimeSlotBlocked(day.date, hour),
                            'booked': getBookingAtTime(day.date, hour),
                            'available': !isTimeSlotBlocked(day.date, hour) && !getBookingAtTime(day.date, hour)
                          }"
                          @click="toggleTimeSlot(day.date, hour)"
                        >
                          <div v-if="getBookingAtTime(day.date, hour)" class="booking-info">
                            <small>{{ getBookingAtTime(day.date, hour)?.clientName }}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar avec détails -->
          <div class="col-md-4">
            <!-- Réservations du jour sélectionné -->
            <div class="card mb-3">
              <div class="card-header">
                <h3 class="card-title">
                  {{ selectedDay ? formatDate(selectedDay.date) : 'Sélectionnez une date' }}
                </h3>
              </div>
              <div class="card-body">
                <div v-if="!selectedDay" class="text-muted text-center py-3">
                  Cliquez sur une date pour voir les détails
                </div>
                <div v-else-if="selectedDay.bookings.length === 0 && !selectedDay.isBlocked" class="text-muted text-center py-3">
                  Aucune réservation pour cette date
                </div>
                <div v-else-if="selectedDay.isBlocked" class="text-center py-3">
                  <i class="bi bi-x-circle text-danger fs-1"></i>
                  <div class="text-danger fw-bold">Date bloquée</div>
                  <button class="btn btn-sm btn-outline-danger mt-2" @click="unblockDate(selectedDay.date)">
                    Débloquer
                  </button>
                </div>
                <div v-else>
                  <div 
                    v-for="booking in selectedDay.bookings" 
                    :key="booking.id" 
                    class="booking-card mb-2"
                    :class="{ 'clickable': booking.pricing?.meetingLink }"
                    @click="openMeetingLink(booking)"
                  >
                    <div class="d-flex justify-content-between align-items-start">
                      <div>
                        <div class="fw-bold">{{ booking.clientName }}</div>
                        <div class="text-muted small">{{ booking.clientEmail }}</div>
                        <div class="text-muted small">{{ booking.clientPhone }}</div>
                      </div>
                      <div class="text-end">
                        <div class="badge bg-primary">{{ booking.bookingTime }}</div>
                        <div class="text-muted small">{{ formatCurrency(booking.amount) }}</div>
                      </div>
                    </div>
                    <div class="mt-2">
                      <div class="small">{{ booking.serviceTitle }}</div>
                      <div class="small text-muted">{{ booking.frequency || 'Session unique' }}</div>
                    </div>
                    <div class="mt-2 d-flex justify-content-between align-items-center">
                      <span class="badge" :class="getStatusClass(booking.status)">
                        {{ getStatusLabel(booking.status) }}
                      </span>
                      <span v-if="booking.pricing?.meetingLink" class="text-primary small">
                        <i class="bi bi-box-arrow-up-right me-1"></i>
                        Rejoindre
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Statistiques -->
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Statistiques</h3>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-6">
                    <div class="text-center">
                      <div class="h3 text-primary">{{ stats.totalBookings }}</div>
                      <div class="text-muted small">Réservations</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="text-center">
                      <div class="h3 text-success">{{ formatCurrency(stats.totalRevenue) }}</div>
                      <div class="text-muted small">Revenus</div>
                    </div>
                  </div>
                </div>
                <div class="row mt-3">
                  <div class="col-6">
                    <div class="text-center">
                      <div class="h3 text-warning">{{ stats.blockedDates }}</div>
                      <div class="text-muted small">Dates bloquées</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="text-center">
                      <div class="h3 text-info">{{ stats.availableSlots }}</div>
                      <div class="text-muted small">Créneaux libres</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal pour bloquer une date -->
  <div class="modal fade" id="blockDateModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Bloquer une date</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <!-- Sélection de la date -->
          <div class="mb-4">
            <label class="form-label">Date à bloquer</label>
            <input
              type="date"
              class="form-control"
              v-model="blockForm.date"
              :min="today"
              required
              @change="onDateChange"
            />
          </div>

          <!-- Options de blocage -->
          <div class="mb-4" v-if="blockForm.date">
            <label class="form-label">Type de blocage</label>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="blockType"
                id="blockFullDay"
                value="fullDay"
                v-model="blockForm.type"
              />
              <label class="form-check-label" for="blockFullDay">
                <strong>Bloquer toute la journée</strong>
                <div class="text-muted small">Aucun créneau ne sera disponible ce jour-là</div>
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="blockType"
                id="blockSpecificTimes"
                value="specificTimes"
                v-model="blockForm.type"
              />
              <label class="form-check-label" for="blockSpecificTimes">
                <strong>Bloquer des créneaux spécifiques</strong>
                <div class="text-muted small">Sélectionnez les heures à bloquer</div>
              </label>
            </div>
          </div>

          <!-- Sélection des créneaux spécifiques -->
          <div class="mb-4" v-if="blockForm.type === 'specificTimes' && blockForm.date">
            <label class="form-label">Créneaux à bloquer</label>
            <div class="time-slots-grid">
              <div
                v-for="timeSlot in availableTimeSlots"
                :key="timeSlot"
                class="form-check form-check-inline time-slot-check"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="`time-${timeSlot}`"
                  :value="timeSlot"
                  v-model="blockForm.selectedTimes"
                  :disabled="isTimeSlotAlreadyBooked(timeSlot)"
                />
                <label class="form-check-label" :for="`time-${timeSlot}`">
                  {{ timeSlot }}
                  <span v-if="isTimeSlotAlreadyBooked(timeSlot)" class="text-danger small">(Réservé)</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Raison -->
          <div class="mb-3">
            <label class="form-label">Raison (optionnel)</label>
            <textarea
              class="form-control"
              v-model="blockForm.reason"
              rows="3"
              :placeholder="blockForm.type === 'fullDay' ? 'Ex: Congés, formation, indisponibilité...' : 'Ex: Pause déjeuner, rendez-vous personnel...'"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Annuler
          </button>
          <button 
            type="button" 
            class="btn"
            :class="blockForm.type === 'fullDay' ? 'btn-danger' : 'btn-warning'"
            @click="processBlocking"
            :disabled="!canBlock"
          >
            {{ blockForm.type === 'fullDay' ? 'Bloquer la journée' : `Bloquer ${blockForm.selectedTimes.length} créneau(x)` }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCreneauxStore } from './stores/creneaux.store'
import { useToast } from '@/composables/useToast'

const creneauxStore = useCreneauxStore()
const { showToast } = useToast()

const currentView = ref<'month' | 'week'>('month')
const currentDate = ref(new Date())
const selectedDay = ref<any>(null)
const loading = ref(false)

const blockForm = ref({
  date: '',
  type: 'fullDay', // 'fullDay' ou 'specificTimes'
  selectedTimes: [] as string[],
  reason: ''
})

const today = computed(() => new Date().toISOString().split('T')[0])

const bookings = computed(() => creneauxStore.bookings)
const blockedDates = computed(() => creneauxStore.blockedDates)
const blockedTimeSlots = computed(() => creneauxStore.blockedTimeSlots)

// Créneaux horaires (9h à 18h)
const timeSlots = Array.from({ length: 10 }, (_, i) => i + 9)

const currentPeriodLabel = computed(() => {
  if (currentView.value === 'month') {
    return currentDate.value.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  } else {
    const startOfWeek = getStartOfWeek(currentDate.value)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${endOfWeek.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`
  }
})

// Filtrer uniquement les réservations confirmées
const confirmedBookings = computed(() => 
  bookings.value.filter(b => b.status === 'confirmed')
)

const monthWeeks = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const startDate = getStartOfWeek(firstDay)
  const weeks = []
  
  let currentWeekStart = new Date(startDate)
  
  while (currentWeekStart <= lastDay || currentWeekStart.getMonth() === month) {
    const week = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart)
      date.setDate(currentWeekStart.getDate() + i)
      
      const dateStr = date.toISOString().split('T')[0]
      const dayBookings = confirmedBookings.value.filter(b => b.bookingDate === dateStr)
      const isBlocked = blockedDates.value.some(bd => bd.date === dateStr)
      
      week.push({
        date: dateStr,
        day: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: dateStr === today.value,
        bookings: dayBookings,
        isBlocked
      })
    }
    weeks.push(week)
    currentWeekStart.setDate(currentWeekStart.getDate() + 7)
    
    if (weeks.length > 6) break // Sécurité
  }
  
  return weeks
})

const weekDays = computed(() => {
  const startOfWeek = getStartOfWeek(currentDate.value)
  const days = []
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    
    days.push({
      date: dateStr,
      day: date.getDate(),
      dayName: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
      bookings: confirmedBookings.value.filter(b => b.bookingDate === dateStr)
    })
  }
  
  return days
})

const availableTimeSlots = computed(() => {
  const slots = []
  for (let hour = 9; hour <= 17; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
    if (hour < 17) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`)
    }
  }
  slots.push('17:30')
  return slots
})

const canBlock = computed(() => {
  if (!blockForm.value.date) return false
  if (blockForm.value.type === 'fullDay') return true
  return blockForm.value.selectedTimes.length > 0
})

const stats = computed(() => {
  // Utiliser uniquement les réservations confirmées pour les statistiques
  const totalBookings = confirmedBookings.value.length
  const totalRevenue = confirmedBookings.value.reduce((sum, b) => sum + Number(b.amount), 0)
  const blockedDatesCount = blockedDates.value.length
  
  // Calculer les créneaux disponibles (approximatif)
  const totalSlots = 30 * 10 // 30 jours * 10 créneaux par jour
  const bookedSlots = confirmedBookings.value.length
  const blockedSlots = blockedDatesCount * 10
  const availableSlots = totalSlots - bookedSlots - blockedSlots
  
  return {
    totalBookings,
    totalRevenue,
    blockedDates: blockedDatesCount,
    availableSlots: Math.max(0, availableSlots)
  }
})

function getStartOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Lundi = début de semaine
  return new Date(d.setDate(diff))
}

function previousPeriod() {
  if (currentView.value === 'month') {
    currentDate.value.setMonth(currentDate.value.getMonth() - 1)
  } else {
    currentDate.value.setDate(currentDate.value.getDate() - 7)
  }
  currentDate.value = new Date(currentDate.value)
}

function nextPeriod() {
  if (currentView.value === 'month') {
    currentDate.value.setMonth(currentDate.value.getMonth() + 1)
  } else {
    currentDate.value.setDate(currentDate.value.getDate() + 7)
  }
  currentDate.value = new Date(currentDate.value)
}

function selectDay(day: any) {
  selectedDay.value = day
}

function isTimeSlotBlocked(date: string, hour: number): boolean {
  // Vérifier si la date entière est bloquée
  if (blockedDates.value.some(bd => bd.date === date)) return true
  
  // Vérifier si le créneau horaire spécifique est bloqué
  const timeStr = `${hour.toString().padStart(2, '0')}:00`
  return blockedTimeSlots.value.some(bts => bts.date === date && bts.time === timeStr)
}

function getBookingAtTime(date: string, hour: number) {
  return bookings.value.find(b => {
    if (b.bookingDate !== date) return false
    const bookingHour = parseInt(b.bookingTime.split(':')[0])
    return bookingHour === hour
  })
}

function onDateChange() {
  // Réinitialiser les sélections quand la date change
  blockForm.value.selectedTimes = []
  blockForm.value.type = 'fullDay'
}

function isTimeSlotAlreadyBooked(timeSlot: string): boolean {
  if (!blockForm.value.date) return false
  
  // Vérifier s'il y a une réservation confirmée
  return bookings.value.some(b => 
    b.bookingDate === blockForm.value.date && 
    b.bookingTime === timeSlot && 
    b.status !== 'cancelled'
  )
}

async function processBlocking() {
  if (!blockForm.value.date) return
  
  if (blockForm.value.type === 'fullDay') {
    await blockDate()
  } else {
    await blockSelectedTimeSlots()
  }
}

async function blockSelectedTimeSlots() {
  if (blockForm.value.selectedTimes.length === 0) return
  
  loading.value = true
  try {
    // Bloquer chaque créneau sélectionné
    for (const time of blockForm.value.selectedTimes) {
      await creneauxStore.blockTimeSlot(blockForm.value.date, time, blockForm.value.reason)
    }
    
    showToast(`${blockForm.value.selectedTimes.length} créneau(x) bloqué(s) avec succès`, 'success')
    
    // Fermer le modal
    const modal = document.getElementById('blockDateModal')
    if (modal) {
      const bsModal = (window as any).bootstrap.Modal.getInstance(modal)
      if (bsModal) bsModal.hide()
    }
    
    // Reset form
    blockForm.value = { date: '', type: 'fullDay', selectedTimes: [], reason: '' }
  } catch (error: any) {
    showToast(error.message || 'Erreur lors du blocage des créneaux', 'error')
  } finally {
    loading.value = false
  }
}

function toggleTimeSlot(date: string, hour: number) {
  const timeStr = `${hour.toString().padStart(2, '0')}:00`
  
  // Vérifier si le créneau est bloqué
  const isBlocked = blockedTimeSlots.value.some(bts => bts.date === date && bts.time === timeStr)
  
  if (isBlocked) {
    // Débloquer le créneau
    unblockTimeSlot(date, timeStr)
  } else {
    // Vérifier s'il y a une réservation
    const booking = getBookingAtTime(date, hour)
    if (booking) {
      // Sélectionner le jour pour voir les détails
      const day = monthWeeks.value.flat().find(d => d.date === date)
      if (day) selectDay(day)
    } else {
      // Pré-remplir le formulaire de blocage avec cette date et ce créneau
      blockForm.value.date = date
      blockForm.value.type = 'specificTimes'
      blockForm.value.selectedTimes = [timeStr]
      
      // Ouvrir le modal
      const modal = document.getElementById('blockDateModal')
      if (modal) {
        const bsModal = new (window as any).bootstrap.Modal(modal)
        bsModal.show()
      }
    }
  }
}

async function blockDate() {
  if (!blockForm.value.date) return
  
  loading.value = true
  try {
    await creneauxStore.blockDate(blockForm.value.date, blockForm.value.reason)
    showToast('Date bloquée avec succès', 'success')
    
    // Fermer le modal
    const modal = document.getElementById('blockDateModal')
    if (modal) {
      const bsModal = (window as any).bootstrap.Modal.getInstance(modal)
      if (bsModal) bsModal.hide()
    }
    
    // Reset form
    blockForm.value = { date: '', type: 'fullDay', selectedTimes: [], reason: '' }
  } catch (error: any) {
    showToast(error.message || 'Erreur lors du blocage', 'error')
  } finally {
    loading.value = false
  }
}

async function unblockDate(date: string) {
  loading.value = true
  try {
    await creneauxStore.unblockDate(date)
    showToast('Date débloquée avec succès', 'success')
    
    // Refresh selected day
    if (selectedDay.value && selectedDay.value.date === date) {
      selectedDay.value.isBlocked = false
    }
  } catch (error: any) {
    showToast(error.message || 'Erreur lors du déblocage', 'error')
  } finally {
    loading.value = false
  }
}



async function unblockTimeSlot(date: string, time: string) {
  loading.value = true
  try {
    await creneauxStore.unblockTimeSlot(date, time)
    showToast('Créneau débloqué avec succès', 'success')
  } catch (error: any) {
    showToast(error.message || 'Erreur lors du déblocage du créneau', 'error')
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

function getStatusClass(status: string): string {
  const classes = {
    pending: 'bg-warning',
    confirmed: 'bg-success',
    cancelled: 'bg-danger',
    completed: 'bg-info'
  }
  return classes[status as keyof typeof classes] || 'bg-secondary'
}

function getStatusLabel(status: string): string {
  const labels = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    cancelled: 'Annulé',
    completed: 'Terminé'
  }
  return labels[status as keyof typeof labels] || status
}

function openMeetingLink(booking: any) {
  if (booking.pricing?.meetingLink) {
    window.open(booking.pricing.meetingLink, '_blank')
  }
}

onMounted(async () => {
  await creneauxStore.fetchBookings()
  await creneauxStore.fetchBlockedDates()
  await creneauxStore.fetchBlockedTimeSlots()
})
</script>

<style scoped>
.calendar-day {
  min-height: 80px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.calendar-day:hover {
  background-color: #f8f9fa;
}

.calendar-day.other-month {
  opacity: 0.5;
}

.calendar-day.blocked {
  background-color: #f8d7da;
  border-color: #dc3545;
}

.calendar-day.has-bookings {
  background-color: #d1ecf1;
  border-color: #17a2b8;
}

.calendar-day.today {
  background-color: #fff3cd;
  border-color: #ffc107;
  font-weight: bold;
}

.day-number {
  font-weight: bold;
}

.booking-indicator {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #17a2b8;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.blocked-indicator {
  position: absolute;
  top: 2px;
  right: 2px;
}

.time-slot {
  height: 40px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.time-slot.available {
  background-color: #d4edda;
  border-color: #28a745;
}

.time-slot.available:hover {
  background-color: #c3e6cb;
}

.time-slot.blocked {
  background-color: #fff3cd;
  border-color: #ffc107;
  cursor: pointer;
  position: relative;
}

.time-slot.blocked::after {
  content: '🚫';
  position: absolute;
  top: 2px;
  right: 4px;
  font-size: 12px;
}

.time-slot.blocked:hover {
  background-color: #ffeaa7;
}

.time-slot.booked {
  background-color: #d1ecf1;
  border-color: #17a2b8;
}

.booking-card {
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 12px;
  background-color: #f8f9fa;
  transition: all 0.2s;
}

.booking-card.clickable {
  cursor: pointer;
}

.booking-card.clickable:hover {
  background-color: #e3f2fd;
  border-color: #2196f3;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.2);
}

.booking-info {
  font-size: 12px;
  text-align: center;
}

.time-slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.time-slot-check {
  margin: 0 !important;
}

.time-slot-check .form-check-label {
  font-size: 14px;
  padding: 5px 10px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: block;
  text-align: center;
}

.time-slot-check .form-check-input:checked + .form-check-label {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #000;
}

.time-slot-check .form-check-input:disabled + .form-check-label {
  background-color: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.time-slot-check .form-check-label:hover:not(.disabled) {
  background-color: #fff3cd;
  border-color: #ffc107;
}
</style>