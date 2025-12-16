import { defineStore } from 'pinia'
import { ref } from 'vue'
import { creneauxApi } from '../api/creneaux.api'

export interface Booking {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  consultantId: string
  serviceTitle: string
  bookingDate: string
  bookingTime: string
  timezone: string
  amount: number
  frequency?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
}

export interface BlockedDate {
  id: string
  consultantId: string
  date: string
  reason?: string
  createdAt: string
}

export interface BlockedTimeSlot {
  id: string
  consultantId: string
  date: string
  time: string
  reason?: string
  createdAt: string
}

export const useCreneauxStore = defineStore('creneaux', () => {
  const bookings = ref<Booking[]>([])
  const blockedDates = ref<BlockedDate[]>([])
  const blockedTimeSlots = ref<BlockedTimeSlot[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchBookings = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await creneauxApi.getBookings()
      bookings.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des réservations'
      console.error('Error fetching bookings:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchBlockedDates = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await creneauxApi.getBlockedDates()
      blockedDates.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des dates bloquées'
      console.error('Error fetching blocked dates:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchBlockedTimeSlots = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await creneauxApi.getBlockedTimeSlots()
      blockedTimeSlots.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des créneaux bloqués'
      console.error('Error fetching blocked time slots:', err)
    } finally {
      loading.value = false
    }
  }

  const blockDate = async (date: string, reason?: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await creneauxApi.blockDate({ date, reason })
      blockedDates.value.push(response.data)
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du blocage de la date'
      throw err
    } finally {
      loading.value = false
    }
  }

  const unblockDate = async (date: string) => {
    loading.value = true
    error.value = null
    
    try {
      await creneauxApi.unblockDate(date)
      blockedDates.value = blockedDates.value.filter(bd => bd.date !== date)
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du déblocage de la date'
      throw err
    } finally {
      loading.value = false
    }
  }

  const blockTimeSlot = async (date: string, time: string, reason?: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await creneauxApi.blockTimeSlot({ date, time, reason })
      blockedTimeSlots.value.push(response.data)
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du blocage du créneau'
      throw err
    } finally {
      loading.value = false
    }
  }

  const unblockTimeSlot = async (date: string, time: string) => {
    loading.value = true
    error.value = null
    
    try {
      await creneauxApi.unblockTimeSlot(date, time)
      blockedTimeSlots.value = blockedTimeSlots.value.filter(
        bts => !(bts.date === date && bts.time === time)
      )
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du déblocage du créneau'
      throw err
    } finally {
      loading.value = false
    }
  }

  const isDateBlocked = (date: string): boolean => {
    return blockedDates.value.some(bd => bd.date === date)
  }

  const isTimeSlotBlocked = (date: string, time: string): boolean => {
    return blockedTimeSlots.value.some(bts => bts.date === date && bts.time === time)
  }

  const isTimeSlotAvailable = (date: string, time: string): boolean => {
    // Vérifier si la date entière est bloquée
    if (isDateBlocked(date)) return false
    
    // Vérifier si le créneau horaire spécifique est bloqué
    if (isTimeSlotBlocked(date, time)) return false
    
    // Vérifier si le créneau est déjà réservé
    const isBooked = bookings.value.some(b => 
      b.bookingDate === date && b.bookingTime === time && b.status !== 'cancelled'
    )
    
    return !isBooked
  }

  const getBookingsForDate = (date: string): Booking[] => {
    return bookings.value.filter(b => b.bookingDate === date)
  }

  const getBookingsForDateRange = (startDate: string, endDate: string): Booking[] => {
    return bookings.value.filter(b => b.bookingDate >= startDate && b.bookingDate <= endDate)
  }

  return {
    // State
    bookings,
    blockedDates,
    blockedTimeSlots,
    loading,
    error,
    
    // Actions
    fetchBookings,
    fetchBlockedDates,
    fetchBlockedTimeSlots,
    blockDate,
    unblockDate,
    blockTimeSlot,
    unblockTimeSlot,
    
    // Getters
    isDateBlocked,
    isTimeSlotBlocked,
    isTimeSlotAvailable,
    getBookingsForDate,
    getBookingsForDateRange
  }
})