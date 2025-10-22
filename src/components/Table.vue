<template>
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
          <div>If you proceed, the data will be deleted.</div>
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
            >Confirm</SubmitButton
          >
        </div>
      </div>
    </div>
  </div>

  <div class="card flex-grow-1">
    <div class="card-header" v-if="title">
      <h3 class="card-title">{{ title }}</h3>
    </div>
    <div class="border-bottom p-4">
      <div class="d-flex align-items-center gap-3">
        <input type="checkbox" name="all" id="all" v-model="selectAll" v-if="actions?.length" />
        <div class="text-muted me-auto">
          Show
          <div class="mx-2 d-inline-block">
            <input
              type="number"
              class="form-control form-control-sm"
              v-model="inputLimit"
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
              aria-label="Search invoice"
            />
          </div>
        </div>
        <div class="actions d-flex gap-3" v-if="actions?.length">
          <button
            class="btn btn-primary"
            v-for="button in actions"
            :key="button.label"
            @click.prevent="(selectAll || includedIds?.length) && button.action && button.action()"
            :data-bs-toggle="button['data-bs-toggle']"
            :data-bs-target="selectAll || includedIds?.length ? button['data-bs-target'] : ''"
          >
            {{ button.label }}
          </button>
        </div>
      </div>
    </div>
    <Loader class="h-100" v-if="isLoading" />
    <div class="table-responsive h-100 flex-grow-1" v-else>
      <table class="table card-table table-vcenter text-nowrap datatable">
        <thead>
          <tr>
            <th v-if="actions?.length"></th>
            <th v-for="title in titles" :key="title">{{ title }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td v-if="actions?.length">
              <input
                type="checkbox"
                name="all"
                id="all"
                :checked="
                  (!selectAll && includedIds?.includes(row.id)) ||
                  (selectAll && !excludedIds?.includes(row.id))
                "
                @change="(e) => handleMultipleData(e, row.id)"
              />
            </td>
            <td v-for="key in keys" :key="key">{{ row[key] }}</td>
            <td class="text-end">
              <span class="dropdown">
                <button
                  class="btn dropdown-toggle align-text-top"
                  data-bs-boundary="viewport"
                  data-bs-toggle="dropdown"
                  v-if="
                    canDelete ||
                    editRoute ||
                    editAction ||
                    row.downloadUrl ||
                    applicationRoute ||
                    lmRoute ||
                    cvRoute
                  "
                >
                  Actions
                </button>
                <div class="dropdown-menu dropdown-menu-end">
                  <a
                    class="dropdown-item"
                    href="#"
                    data-bs-toggle="modal"
                    data-bs-target="#delete-modal"
                    @click.prevent="selectToDelete = row.id"
                    v-if="canDelete"
                  >
                    Delete
                  </a>
                  <a
                    v-if="row.downloadUrl"
                    class="dropdown-item"
                    :href="row.downloadUrl"
                    target="_blank"
                  >
                    Download
                  </a>
                  <RouterLink
                    v-else-if="editRoute"
                    class="dropdown-item"
                    :to="{ name: editRoute, params: { id: row.id } }"
                  >
                    Edit
                  </RouterLink>
                  <a
                    v-else-if="editAction"
                    class="dropdown-item"
                    href="#"
                    @click.prevent="editAction(row.id)"
                  >
                    Edit
                  </a>
                  <RouterLink
                    v-if="applicationRoute"
                    class="dropdown-item"
                    :to="{ name: applicationRoute, params: { job: row.id } }"
                  >
                    Applications
                  </RouterLink>
                  <RouterLink
                    v-if="cvRoute"
                    class="dropdown-item"
                    :to="{ name: cvRoute, query: row.isTalent ? { talent_id: row.id } : { freelance_id: row.id } }"
                  >
                    CV
                  </RouterLink>
                  <RouterLink
                    v-if="lmRoute"
                    class="dropdown-item"
                    :to="{ name: lmRoute, query: row.isTalent ? { talent_id: row.id } : { freelance_id: row.id } }"
                  >
                    LM
                  </RouterLink>
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
            aria-disabled="true"
            @click.prevent="() => page--"
          >
            <!-- Download SVG icon from http://tabler-icons.io/i/chevron-left -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M15 6l-6 6l6 6" />
            </svg>
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
          <a class="page-link" href="#" @click.prevent="() => page++">
            next
            <!-- Download SVG icon from http://tabler-icons.io/i/chevron-right -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 6l6 6l-6 6" />
            </svg>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, type VNodeRef } from 'vue';

import Loader from '@/components/Loader.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';

interface Props {
  getData: (
    limit: number | null,
    page: number | null,
    search: string | null,
    status?: string
  ) => any;
  deleteData?: (id?: string) => Promise<void>;
  normalizer: (arr: any) => any;
  editRoute?: string;
  canDelete?: boolean;
  applicationRoute?: string;
  cvRoute?: string;
  lmRoute?: string;
  editAction?: (id: string) => void;
  dataStructure?: Record<string, string>;
  title?: string;
  limitProp?: number;
  actions?: { label: string; action?: any; 'data-bs-toggle': string; 'data-bs-target': string }[];
  includedIds?: string[];
  excludedIds?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  limitProp: () => 50,
  dataStructure: () => ({
    name: 'Name'
  }),
  canDelete: () => true
});

const emits = defineEmits(['update:includedIds', 'update:excludedIds']);

const inputLimit = ref(props.limitProp);
const limit = computed(() => Number(inputLimit.value));
const search = ref('');
const page = ref(1);

const keys = computed(() => Object.keys(props.dataStructure));
const titles = computed(() => Object.values(props.dataStructure));

const startIndex = computed(() => (page.value - 1) * limit.value + 1);
const endIndex = computed(() => startIndex.value + limit.value - 1);

const isLoading = ref(false);

const data = (await props.getData(limit.value, page.value, search.value))?.data;

const rows = ref(props.normalizer(data?.results?.rows) || []);
const total = ref(data?.results?.total || 0);
const totalPages = computed(() => Math.ceil(total.value / limit.value));

const loadData = async () => {
  if (limit.value > 0) {
    isLoading.value = true;
    const data = (await props.getData(limit.value, page.value, search.value))?.data;
    isLoading.value = false;

    rows.value = props.normalizer(data?.results?.rows) || [];
    total.value = data?.results?.total || 0;
  }
};

watch(() => [limit.value, page.value, search.value], loadData);

const selectToDelete = ref(undefined);
const isDeleteLoading = ref(false);
const cancelBtn = ref<VNodeRef | undefined>(undefined);

const remove = async () => {
  isDeleteLoading.value = true;
  if (props.deleteData) {
    await props?.deleteData(selectToDelete.value);
  }
  isDeleteLoading.value = false;

  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });

  cancelBtn.value.dispatchEvent(event);

  loadData();
};

const selectAll = ref(false);

watch(selectAll, () => {
  emits('update:includedIds', []);
  emits('update:excludedIds', []);
});

const handleMultipleData = (event: any, id: string) => {
  const value = event.target.checked;

  if (selectAll.value) {
    emits('update:includedIds', []);
    if (value) {
      emits(
        'update:excludedIds',
        props.excludedIds?.length ? props.excludedIds.filter((item) => item === id) : []
      );
    } else {
      emits('update:excludedIds', props.excludedIds?.length ? [...props.excludedIds, id] : [id]);
    }
  } else {
    emits('update:excludedIds', []);
    if (value) {
      emits('update:includedIds', props.includedIds?.length ? [...props.includedIds, id] : [id]);
    } else {
      emits(
        'update:includedIds',
        props.includedIds?.length ? props.includedIds.filter((item) => item === id) : []
      );
    }
  }
};
</script>

<style lang="scss" scoped>
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
</style>
