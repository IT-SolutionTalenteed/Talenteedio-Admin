import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getPermissions = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  orderBy: string = 'title',
  direction: string = 'asc'
) => {
  const query = gql`
    {
      results: getPermissions (
        input: { 
          limit: ${limit}, 
          page: ${page},
          ${orderBy !== undefined ? `orderBy: "${orderBy}",` : ''}
          ${direction !== undefined ? `direction: "${direction}",` : ''} 
        }, 
        filter: { title: "${search ? search : ''}" }
      ) {
        rows {
          id
          title
        } total
      }
    }
  `;

  return sendGraphQLRequest('permission', query);
};

export const deletePermission = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deletePermission (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('permission', query);

    return data?.result?.success;
  }
};

export const createPermission = async (permission: any) => {
  const query = gql`
    mutation createPermission($permission: CreatePermissionInput) {
      result: createPermission(input: $permission) {
        id
      }
    }
  `;

  const variables = {
    permission: permission
  };

  return await sendGraphQLRequest('permission', query, variables);
};

export const updatePermission = async (permission: any) => {
  const query = gql`
    mutation updatePermission($permission: UpdatePermissionInput) {
      result: updatePermission(input: $permission) {
        id
      }
    }
  `;

  const variables = {
    permission: permission
  };

  return await sendGraphQLRequest('permission', query, variables);
};

export const getPermission = async (id: string) => {
  const query = gql`
    {
      result: getOnePermission (input: { id: "${id}" }) {
        id
        title
        numberOfJobsPerYear
        numberOfArticlesPerYear
        validityPeriodOfAJob
      }
    }
  `;

  return sendGraphQLRequest('permission', query);
};
