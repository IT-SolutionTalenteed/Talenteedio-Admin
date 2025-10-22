import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getUsers = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status?: string,
  withoutRole = false
) => {
  const query = gql`
    {
      results: getUsers (input: { limit: ${limit}, page: ${page} }, filter: { name: "${
    search ? search : ''
  }", email: "${search ? search : ''}", withoutRole: ${withoutRole ? withoutRole : false} }) {
        rows {
          id
          name
          email
          roles {
            name
          }
          createdAt
        } total
      }
    }
  `;

  return sendGraphQLRequest('user', query);
};

export const deleteUser = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteUser (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('user', query);

    return data?.result?.success;
  }
};

export const createUser = async (user: any) => {
  const query = gql`
    mutation createUser($user: CreateUserInput) {
      result: createUser(input: $user) {
        id
      }
    }
  `;

  const variables = {
    user: user
  };

  return await sendGraphQLRequest('user', query, variables);
};

export const updateUser = async (user: any) => {
  const query = gql`
    mutation updateUser($user: UpdateUserInput) {
      result: updateUser(input: $user) {
        id
      }
    }
  `;

  const variables = {
    user: user
  };

  return await sendGraphQLRequest('user', query, variables);
};

export const getUser = async (id: string) => {
  const query = gql`
    {
      result: getOneUser (input: { id: "${id}" }) {
        id
        email
        firstname
        lastname
        roles {
          name
        }
        profilePicture {
          id
          fileUrl
          fileName
        }
      }
    }
  `;

  return sendGraphQLRequest('user', query);
};
