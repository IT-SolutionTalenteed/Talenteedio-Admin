<template>
  <div class="appointment-feedback">
    <div v-if="!appointment.feedbackSubmitted" class="no-feedback">
      <i class="bi bi-chat-dots"></i>
      <p>Aucun feedback soumis</p>
    </div>

    <div v-else class="feedback-content">
      <div class="feedback-header">
        <h4>Feedback du candidat</h4>
        <span class="feedback-date">
          {{ formatDate(appointment.feedbackSubmittedAt) }}
        </span>
      </div>

      <div class="feedback-decision" :class="decisionClass">
        <i :class="decisionIcon"></i>
        <span>{{ decisionText }}</span>
      </div>

      <div v-if="appointment.candidateRating" class="feedback-rating">
        <span class="rating-label">Note:</span>
        <div class="stars">
          <i
            v-for="n in 5"
            :key="n"
            class="bi"
            :class="n <= appointment.candidateRating ? 'bi-star-fill' : 'bi-star'"
          ></i>
        </div>
      </div>

      <div class="feedback-text">
        <p>{{ appointment.candidateFeedback }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  appointment: {
    feedbackSubmitted: boolean;
    candidateFeedback?: string;
    candidateDecision?: string;
    candidateRating?: number;
    feedbackSubmittedAt?: string;
  };
}

const props = defineProps<Props>();

const decisionClass = computed(() => {
  return props.appointment.candidateDecision === 'go' ? 'decision-go' : 'decision-not';
});

const decisionIcon = computed(() => {
  return props.appointment.candidateDecision === 'go' 
    ? 'bi bi-check-circle-fill' 
    : 'bi bi-x-circle-fill';
});

const decisionText = computed(() => {
  return props.appointment.candidateDecision === 'go' 
    ? 'Le candidat est intéressé' 
    : 'Le candidat n\'est pas intéressé';
});

const formatDate = (date: string | undefined) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>

<style scoped lang="scss">
.appointment-feedback {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 1rem;
}

.no-feedback {
  text-align: center;
  padding: 2rem;
  color: #6c757d;

  i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  p {
    margin: 0;
    font-style: italic;
  }
}

.feedback-content {
  .feedback-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h4 {
      margin: 0;
      font-size: 1.1rem;
      color: #333;
    }

    .feedback-date {
      font-size: 0.875rem;
      color: #6c757d;
    }
  }

  .feedback-decision {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    font-weight: 500;

    i {
      font-size: 1.25rem;
    }

    &.decision-go {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    &.decision-not {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  }

  .feedback-rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;

    .rating-label {
      font-weight: 500;
      color: #495057;
    }

    .stars {
      display: flex;
      gap: 0.25rem;

      i {
        color: #ffc107;
        font-size: 1.1rem;
      }
    }
  }

  .feedback-text {
    background: white;
    padding: 1rem;
    border-radius: 6px;
    border: 1px solid #dee2e6;

    p {
      margin: 0;
      line-height: 1.6;
      color: #495057;
      white-space: pre-wrap;
    }
  }
}
</style>
