<template>
  <PageHeader
    title="List of users"
    page="Users"
    :rightButton="[{ route: 'user.add', label: 'Create' }]"
  />

  <div class="page-body">
    <Table
      :get-data="getUsers"
      :data-structure="{ name: 'Name', email: 'Email', roles: 'Roles', createdAt: 'Created at' }"
      :normalizer="(arr: any) => {
          return arr.map((data: any) => {
            return {
              id: data.id,
              name: data.name,
              email: data.email,
              roles: data.roles.map((role: any) => role.name)[0],
              createdAt: formatDate(data.createdAt),
            }
          })
        }"
      edit-route="user.edit"
      :delete-data="deleteUser"
    />
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue';
import Table from '@/components/Table.vue';

import { getUsers, deleteUser } from '../../stores/services/user.service';

import { formatDate } from '@/views/dashboard-module/helpers';
</script>
