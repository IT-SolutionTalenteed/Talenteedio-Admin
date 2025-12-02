<template>
  <PageHeader
    title="List of consultants"
    page="Consultants"
    :rightButton="[{ route: 'consultant.add', label: 'Create' }]"
  />

  <div class="page-body">
    <div class="card flex-grow-1">
      <div class="border-bottom p-4">
        <div class="d-flex align-items-center gap-3">
          <div class="text-muted me-auto">
            Show
            <div class="mx-2 d-inline-block">
              <input
                type="number"
                class="form-control form-control-sm"
                v-model="limit"
                size="3"
                min="1"
              />
            </div>
            entries
          </div>
          <div class="text-muted">
            Search:
            <div class="ms-2 d-inline-block">
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="search"
                aria-label="Search consultant"
              />
            </div>
          </div>
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="showPendingOnly"
              id="pendingFilter"
            />
            <label class="form-check-label" for="pendingFilter">
              Pending only ({{ pendingCount }})
            </label>
          </div>
        </div>
      </div>
      <Loader class="h-100" v-if="isLoading" />
      <div class="table-responsive h-100 flex-grow-1" v-else>
        <table class="table card-table table-vcenter text-nowrap datatable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Expertise</th>
              <th>Experience</th>
              <th>Status</th>
              <th>Created at</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td>{{ row.user?.name || 'N/A' }}</td>
              <td>{{ row.user?.email || 'N/A' }}</td>
              <td>{{ row.expertise }}</td>
              <td>{{ row.yearsOfExperience }} years</td>
              <td>
                <span
                  class="badge"
                  :class="row.user?.isVerified ? 'bg-success' : 'bg-warning'"
                >
                  {{ row.user?.isVerified ? 'Validated' : 'Pending' }}
                </span>
              </td>
              <td>{{ formatDate(row.createdAt) }}</td>
              <td class="text-end">
                <span class="dropdown">
                  <button
                    class="btn dropdown-toggle align-text-top"
                    data-bs-boundary="viewport"
                    data-bs-toggle="dropdown"
                  >
                    Actions
                  </button>
                  <div class="dropdown-menu dropdown-menu-end">
                    <a
                      v-if="!row.user?.isVerified"
                      class="dropdown-item text-success"
                      href="#"
                      @click.prevent="validateConsultant(row)"
                    >
                      <i class="bi bi-check-circle me-2"></i>
                      Validate
                    </a>
                    <RouterLink
                      class="dropdown-item"
                      :to="{ name: 'consultant.edit', params: { id: row.id } }"
                    >
                      <i class="bi bi-pencil me-2"></i>
                      Edit
                    </RouterLink>
                    <a
                      class="dropdown-item text-danger"
                      href="#"
                      data-bs-toggle="modal"
                      data-bs-target="#delete-modal"
                      @click.prevent="selectToDelete = row.id"
                    >
                      <i class="bi bi-trash me-2"></i>
                      Delete
                    </a>
                  </div>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer d-flex align-items-center">
        <p class="m-0 text-muted">
          Showing <span>{{ startIndex }}</span> to <span>{{ endIndex }}</span> of
          <span>{{ total }}</span> entries
        </p>
        <ul class="pagination m-0 ms-auto">
          <li class="page-item" :class="page === 1 && 'disabled'">
            <a
              class="page-link"
              href="#"
              tabindex="-1"
              @click.prevent="() => page > 1 && page--"
            >
              prev
            </a>
          </li>
          <li
            v-for="pageNumber in totalPages"
            :key="pageNumber"
            class="page-item"
            :class="pageNumber === page && 'active'"
          >
            <a class="page-link" href="#" @click.prevent="() => (page = pageNumber)">{{
              pageNumber
            }}</a>
          </li>
          <li class="page-item" :class="(page === totalPages || totalPages === 0) && 'disabled'">
            <a class="page-link" href="#" @click.prevent="() => page < totalPages && page++">
              next
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Delete Modal -->
  <div
    class="modal modal-blur fade"
    id="delete-modal"
    tabindex="-1"
    role="dialog"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <div class="modal-title">Are you sure?</div>
          <div>If you proceed, the consultant will be deleted.</div>
        </div>
        <div class="modal-footer">
          <button
            ref="cancelBtn"
            type="button"
            class="btn btn-secondary me-auto"
            data-bs-dismiss="modal"
            @click="selectToDelete = undefined"
          >
            Cancel
          </button>
          <SubmitButton
            class="btn btn-danger"
            @click="remove"
            :loading="isDeleteLoading"
            :disabled="isDeleteLoading"
          >
            Confirm
          </SubmitButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import Loader from '@/components/Loader.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';

import { getConsultants, deleteConsultant, validateConsultantAccount } from '../../stores/services/consultant.service';
import { formatDate } from '@/views/dashboard-module/helpers';
import Swal from 'sweetalert2';

const limit = ref(50);
const search = ref('');
const page = ref(1);
const showPendingOnly = ref(false);

const startIndex = computed(() => (page.value - 1) * limit.value + 1);
const endIndex = computed(() => Math.min(startIndex.value + limit.value - 1, total.value));

const isLoading = ref(false);

const data = (await getConsultants(limit.value, page.value, search.value))?.data;

const allRows = ref(data?.results?.rows || []);
const rows = computed(() => {
  if (showPendingOnly.value) {
    return allRows.value.filter((row: any) => !row.user?.isVerified);
  }
  return allRows.value;
});

const total = ref(data?.results?.total || 0);
const totalPages = computed(() => Math.ceil(total.value / limit.value));

const pendingCount = computed(() => {
  return allRows.value.filter((row: any) => !row.user?.isVerified).length;
});

const loadData = async () => {
  if (limit.value > 0) {
    isLoading.value = true;
    const data = (await getConsultants(limit.value, page.value, search.value))?.data;
    isLoading.value = false;

    allRows.value = data?.results?.rows || [];
    total.value = data?.results?.total || 0;
  }
};

watch(() => [limit.value, page.value, search.value], loadData);

const selectToDelete = ref(undefined);
const isDeleteLoading = ref(false);
const cancelBtn = ref<any>(undefined);

const remove = async () => {
  isDeleteLoading.value = true;
  await deleteConsultant(selectToDelete.value);
  isDeleteLoading.value = false;

  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });

  cancelBtn.value.dispatchEvent(event);
  loadData();
};

const validateConsultant = async (consultant: any) => {
  const result = await Swal.fire({
    title: 'Validate consultant?',
    text: `Do you want to validate ${consultant.user?.name || 'this consultant'}'s account?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, validate!',
    cancelButtonText: 'Cancel'
  });

  if (result.isConfirmed) {
    try {
      await validateConsultantAccount(consultant.user.id);
      await Swal.fire('Validated!', 'The consultant account has been validated.', 'success');
      loadData();
    } catch (error) {
      await Swal.fire('Error!', 'Failed to validate the consultant account.', 'error');
    }
  }
};
</script>

<style scoped lang="scss">
.dropdown-menu.show {
  transform: translate(0px, 38px) !important;
}

.pagination {
  flex-wrap: wrap;
  gap: 6px;
  padding-left: 50px;
}

td {
  max-width: 300px;
  word-wrap: break-word;
  white-space: normal;
}

.badge {
  padding: 0.35em 0.65em;
  font-size: 0.75em;
}
</style>
