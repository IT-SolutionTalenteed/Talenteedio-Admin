import { api } from '@/views/dashboard-module/api'
import type { Booking, BlockedDate, BlockedTimeSlot } from '../stores/creneaux.store'

export const creneauxApi = {
  // Récupérer les réservations du consultant connecté
  getBookings: () => {
    return api.get<Booking[]>('/creneaux/bookings')
  },

  // Récupérer les dates bloquées du consultant connecté
  getBlockedDates: () => {
    return api.get<BlockedDate[]>('/creneaux/blocked-dates')
  },

  // Bloquer une date
  blockDate: (data: { date: string; reason?: string }) => {
    return api.post<BlockedDate>('/creneaux/block-date', data)
  },

  // Débloquer une date
  unblockDate: (date: string) => {
    return api.delete(`/creneaux/unblock-date/${date}`)
  },

  // Vérifier la disponibilité d'un créneau
  checkAvailability: (date: string, time: string) => {
    return api.get<{ available: boolean }>(`/creneaux/check-availability?date=${date}&time=${time}`)
  },

  // Récupérer les créneaux horaires bloqués
  getBlockedTimeSlots: () => {
    return api.get<BlockedTimeSlot[]>('/creneaux/blocked-time-slots')
  },

  // Bloquer un créneau horaire
  blockTimeSlot: (data: { date: string; time: string; reason?: string }) => {
    return api.post<BlockedTimeSlot>('/creneaux/block-time-slot', data)
  },

  // Débloquer un créneau horaire
  unblockTimeSlot: (date: string, time: string) => {
    return api.delete(`/creneaux/unblock-time-slot/${date}/${time}`)
  }
}