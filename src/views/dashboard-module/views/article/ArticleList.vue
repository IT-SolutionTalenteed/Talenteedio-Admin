<template>
  <PageHeader
    title="List of articles"
    page="Articles"
    :rightButton="is('admin') ? [{ route: 'article.add', label: 'Create' }] : []"
  />

  <div class="page-body">
    <Table
      :get-data="getData"
      :data-structure="{
        title: 'Title',
        author: 'Author',
        company: 'Company',
        url: 'Link',
        createdAt: 'Created at'
      }"
      :normalizer="(arr: any) => {
        return arr.map((data: any) => {
          return {
            id: data.id,
            title: data.title,
            author: data.admin?.user?.email,
            company: data.company?.company_name ?? data.admin?.user?.email,
            url: `${hostUrl}/blog/detail/${data.slug}`,
            createdAt: formatDate(data.createdAt),
          }
        })
      }"
      :edit-route="is('admin') ? 'article.edit' : ''"
      :can-delete="is('admin')"
      :delete-data="deleteArticle"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import PageHeader from '@/components/PageHeader.vue';
import Table from '@/components/Table.vue';

import { getArticles, deleteArticle } from '../../stores/services/article.service';

import { useAuthStore } from '@/views/auth-module/stores/auth.store';

import { formatDate } from '@/views/dashboard-module/helpers';

const hostUrl = import.meta.env.VITE_HOST_URL;

const authStore = useAuthStore();
const { is } = authStore;
const { user } = storeToRefs(authStore);

const getData = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status?: string
) => {
  return await getArticles(
    limit,
    page,
    search,
    status,
    is('company') ? user.value!.company!.id : undefined
  );
};
</script>
