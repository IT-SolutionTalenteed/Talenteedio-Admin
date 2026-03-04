<template>
  <div class="container-xl">
    <PageHeader :title="isEdit ? 'Modifier la newsletter' : 'Nouvelle newsletter'" page="newsletter" />

    <div class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Contenu de la newsletter</h3>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label required">Sujet</label>
              <input
                v-model="form.subject"
                type="text"
                class="form-control"
                placeholder="Sujet de l'email"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label required">Message</label>
              <textarea
                v-model="form.message"
                class="form-control"
                rows="10"
                placeholder="Contenu du message..."
                required
              ></textarea>
              <small class="form-hint">Le message sera envoyé en texte brut et HTML.</small>
            </div>

            <div class="mb-3">
              <label class="form-label">Message HTML (optionnel)</label>
              <textarea
                v-model="form.htmlMessage"
                class="form-control"
                rows="8"
                placeholder="Version HTML du message (optionnel)..."
              ></textarea>
              <small class="form-hint">
                Si vide, le message texte sera converti automatiquement en HTML.
              </small>
            </div>

            <div class="mb-3">
              <label class="form-label">Pièces jointes</label>
              <input
                type="file"
                class="form-control"
                multiple
                ref="fileInput"
                @change="handleFileUpload"
              />
              <small class="form-hint">
                Note: Les fichiers seront uploadés lors de l'envoi. Taille max recommandée: 5MB par fichier.
              </small>
              <div v-if="selectedFiles.length > 0" class="mt-2">
                <div
                  v-for="(file, index) in selectedFiles"
                  :key="index"
                  class="d-flex align-items-center justify-content-between p-2 border rounded mb-2"
                >
                  <span>{{ file.name }} ({{ formatFileSize(file.size) }})</span>
                  <button
                    type="button"
                    class="btn btn-sm btn-danger"
                    @click="removeFile(index)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Destinataires</h3>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">Sélectionner les groupes</label>

              <div class="form-check">
                <input
                  v-model="form.recipientTypes"
                  class="form-check-input"
                  type="checkbox"
                  value="all_companies"
                  id="all_companies"
                />
                <label class="form-check-label" for="all_companies">
                  Toutes les entreprises
                </label>
              </div>

              <div class="form-check">
                <input
                  v-model="form.recipientTypes"
                  class="form-check-input"
                  type="checkbox"
                  value="all_talents"
                  id="all_talents"
                />
                <label class="form-check-label" for="all_talents"> Tous les talents </label>
              </div>

              <div class="form-check">
                <input
                  v-model="form.recipientTypes"
                  class="form-check-input"
                  type="checkbox"
                  value="all_consultants"
                  id="all_consultants"
                />
                <label class="form-check-label" for="all_consultants">
                  Tous les consultants
                </label>
              </div>

              <div class="form-check">
                <input
                  v-model="form.recipientTypes"
                  class="form-check-input"
                  type="checkbox"
                  value="talents_with_active_appointments"
                  id="talents_with_active_appointments"
                />
                <label class="form-check-label" for="talents_with_active_appointments">
                  Talents avec rendez-vous actifs
                </label>
              </div>

              <div class="form-check">
                <input
                  v-model="form.recipientTypes"
                  class="form-check-input"
                  type="checkbox"
                  value="talents_without_appointments"
                  id="talents_without_appointments"
                />
                <label class="form-check-label" for="talents_without_appointments">
                  Talents sans rendez-vous
                </label>
              </div>

              <div class="form-check">
                <input
                  v-model="form.recipientTypes"
                  class="form-check-input"
                  type="checkbox"
                  value="talents_with_recent_applications"
                  id="talents_with_recent_applications"
                />
                <label class="form-check-label" for="talents_with_recent_applications">
                  Talents avec candidatures récentes (30j)
                </label>
              </div>

              <div class="form-check">
                <input
                  v-model="form.recipientTypes"
                  class="form-check-input"
                  type="checkbox"
                  value="talents_without_applications"
                  id="talents_without_applications"
                />
                <label class="form-check-label" for="talents_without_applications">
                  Talents sans candidatures
                </label>
              </div>

              <div class="form-check">
                <input
                  v-model="form.recipientTypes"
                  class="form-check-input"
                  type="checkbox"
                  value="companies_with_active_jobs"
                  id="companies_with_active_jobs"
                />
                <label class="form-check-label" for="companies_with_active_jobs">
                  Entreprises avec offres actives
                </label>
              </div>

              <div class="form-check">
                <input
                  v-model="form.recipientTypes"
                  class="form-check-input"
                  type="checkbox"
                  value="companies_without_jobs"
                  id="companies_without_jobs"
                />
                <label class="form-check-label" for="companies_without_jobs">
                  Entreprises sans offres
                </label>
              </div>

              <div class="form-check">
                <input
                  v-model="form.recipientTypes"
                  class="form-check-input"
                  type="checkbox"
                  value="verified_users"
                  id="verified_users"
                />
                <label class="form-check-label" for="verified_users">
                  Utilisateurs vérifiés
                </label>
              </div>

              <div class="form-check">
                <input
                  v-model="form.recipientTypes"
                  class="form-check-input"
                  type="checkbox"
                  value="unverified_users"
                  id="unverified_users"
                />
                <label class="form-check-label" for="unverified_users">
                  Utilisateurs non vérifiés
                </label>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Emails personnalisés (un par ligne)</label>
              <textarea
                v-model="customEmailsText"
                class="form-control"
                rows="4"
                placeholder="email1@example.com&#10;email2@example.com"
              ></textarea>
            </div>

            <div class="alert alert-info">
              <strong>Nombre de destinataires estimé :</strong>
              <span v-if="recipientCount !== null">{{ recipientCount }}</span>
              <span v-else>Calcul en cours...</span>
              <button
                type="button"
                class="btn btn-sm btn-primary ms-2"
                @click="calculateRecipients"
              >
                <i class="bi bi-arrow-clockwise"></i> Recalculer
              </button>
            </div>
          </div>
        </div>

        <div class="card mt-3">
          <div class="card-body">
            <button
              type="button"
              class="btn btn-primary w-100 mb-2"
              @click="saveNewsletter"
              :disabled="!isFormValid"
            >
              <i class="bi bi-save"></i>
              {{ isEdit ? 'Mettre à jour' : 'Enregistrer le brouillon' }}
            </button>
            <button
              type="button"
              class="btn btn-success w-100 mb-2"
              @click="saveAndSend"
              :disabled="!isFormValid"
            >
              <i class="bi bi-send"></i> Enregistrer et envoyer
            </button>
            <button type="button" class="btn btn-secondary w-100" @click="cancel">
              <i class="bi bi-x"></i> Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import PageHeader from '@/components/PageHeader.vue';
import { newsletterApi } from '../../api/newsletter.api';

const router = useRouter();
const route = useRoute();

const isEdit = computed(() => !!route.params.id);

const form = ref({
  subject: '',
  message: '',
  htmlMessage: '',
  recipientTypes: [] as string[],
});

const selectedFiles = ref<File[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const customEmailsText = ref('');
const recipientCount = ref<number | null>(null);

const isFormValid = computed(() => {
  return (
    form.value.subject.trim() !== '' &&
    form.value.message.trim() !== '' &&
    (form.value.recipientTypes.length > 0 || customEmailsText.value.trim() !== '')
  );
});

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (!files || files.length === 0) return;

  selectedFiles.value = Array.from(files);
};

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1);
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const calculateRecipients = async () => {
  try {
    const customEmails = customEmailsText.value
      .split('\n')
      .map((e) => e.trim())
      .filter((e) => e !== '');

    const count = await newsletterApi.countRecipients({
      recipientTypes: form.value.recipientTypes,
      customRecipientEmails: customEmails,
    });

    recipientCount.value = count;
  } catch (error) {
    console.error('Error calculating recipients:', error);
    Swal.fire('Erreur', 'Impossible de calculer le nombre de destinataires', 'error');
  }
};

const saveNewsletter = async () => {
  try {
    const customEmails = customEmailsText.value
      .split('\n')
      .map((e) => e.trim())
      .filter((e) => e !== '');

    const data = {
      ...form.value,
      customRecipientEmails: customEmails,
      attachments: [], // Note: Pour l'instant, les pièces jointes nécessitent un système d'upload
    };

    if (isEdit.value) {
      await newsletterApi.updateNewsletter(route.params.id as string, data);
      Swal.fire('Succès', 'Newsletter mise à jour avec succès', 'success');
    } else {
      await newsletterApi.createNewsletter(data);
      Swal.fire('Succès', 'Newsletter créée avec succès', 'success');
    }

    router.push({ name: 'newsletter.list' });
  } catch (error) {
    console.error('Error saving newsletter:', error);
    Swal.fire('Erreur', 'Impossible de sauvegarder la newsletter', 'error');
  }
};

const saveAndSend = async () => {
  const result = await Swal.fire({
    title: 'Envoyer la newsletter ?',
    text: `Cette action enverra la newsletter à environ ${recipientCount.value} destinataires.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, envoyer',
    cancelButtonText: 'Annuler',
  });

  if (result.isConfirmed) {
    try {
      const customEmails = customEmailsText.value
        .split('\n')
        .map((e) => e.trim())
        .filter((e) => e !== '');

      const data = {
        ...form.value,
        customRecipientEmails: customEmails,
        attachments: [], // Note: Pour l'instant, les pièces jointes nécessitent un système d'upload
      };

      let newsletterId: string;

      if (isEdit.value) {
        await newsletterApi.updateNewsletter(route.params.id as string, data);
        newsletterId = route.params.id as string;
      } else {
        const created = await newsletterApi.createNewsletter(data);
        if (!created || !created.id) {
          throw new Error('La création de la newsletter a échoué - aucun ID retourné');
        }
        newsletterId = created.id;
      }

      await newsletterApi.sendNewsletter(newsletterId);

      Swal.fire('Envoyé !', 'La newsletter est en cours d\'envoi.', 'success');
      router.push({ name: 'newsletter.list' });
    } catch (error) {
      console.error('Error sending newsletter:', error);
      Swal.fire('Erreur', 'Impossible d\'envoyer la newsletter', 'error');
    }
  }
};

const cancel = () => {
  router.push({ name: 'newsletter.list' });
};

const loadNewsletter = async () => {
  if (!isEdit.value) return;

  try {
    const newsletter = await newsletterApi.getNewsletter(route.params.id as string);

    form.value = {
      subject: newsletter.subject,
      message: newsletter.message,
      htmlMessage: newsletter.htmlMessage || '',
      recipientTypes: newsletter.recipientTypes,
    };

    customEmailsText.value = (newsletter.customRecipientEmails || []).join('\n');

    calculateRecipients();
  } catch (error) {
    console.error('Error loading newsletter:', error);
    Swal.fire('Erreur', 'Impossible de charger la newsletter', 'error');
    router.push({ name: 'newsletter.list' });
  }
};

watch(
  () => [form.value.recipientTypes, customEmailsText.value],
  () => {
    if (form.value.recipientTypes.length > 0 || customEmailsText.value.trim() !== '') {
      calculateRecipients();
    }
  },
  { deep: true }
);

onMounted(() => {
  loadNewsletter();
});
</script>
