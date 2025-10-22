import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getFreelances = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status?: string
) => {
  const query = gql`
    {
      results: getFreelances (input: { limit: ${limit}, page: ${page} }, filter: { name: "${
    search ? search : ''
  }" , status: "${status ? status : ''}" }) {
        rows {
          id
          title
          user {
            name
            email
          }
          createdAt
        } total
      }
    }
  `;

  return sendGraphQLRequest('user', query);
};

export const deleteFreelance = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteFreelance (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('user', query);

    return data?.result?.success;
  }
};

export const getOneFreelance = async (id: string) => {
  const query = gql`
    {
      result: getOneFreelance (input: { id: "${id}" }) {
        id
        title
        status
        tjm
        mobility
        availabilityDate
        desiredLocation
        workMode
        user {
          id
          email
          firstname
          lastname
        }
        contact {
          phoneNumber
          address {
            country
            city
            street
            zipCode
          }
        }
        category {
          id
          title
        }
        values {
          id
          title
        }
      }
    }
  `;

  const { data } = await sendGraphQLRequest('user', query);

  return data?.result;
};

export const createFreelance = async (input: any) => {
  const query = gql`
    mutation {
      result: createFreelance (input: ${JSON.stringify(input).replace(/"([^"]+)":/g, '$1:')}) {
        id
      }
    }
  `;

  const { data } = await sendGraphQLRequest('user', query);

  return data?.result;
};

export const updateFreelance = async (input: any) => {
  const query = gql`
    mutation {
      result: updateFreelance (input: ${JSON.stringify(input).replace(/"([^"]+)":/g, '$1:')}) {
        id
      }
    }
  `;

  const { data } = await sendGraphQLRequest('user', query);

  return data?.result;
};
