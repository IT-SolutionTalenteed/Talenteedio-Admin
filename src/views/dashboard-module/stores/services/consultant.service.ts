import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getConsultants = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status?: string
) => {
  const query = gql`
    {
      results: getConsultants (input: { limit: ${limit}, page: ${page} }, filter: { name: "${
    search ? search : ''
  }" , status: "${status ? status : ''}" }) {
        rows {
          id
          expertise
          yearsOfExperience
          user {
            id
            name
            email
            isVerified
            validateAt
          }
          createdAt
        } total
      }
    }
  `;

  return sendGraphQLRequest('user', query);
};

export const deleteConsultant = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteConsultant (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('user', query);

    return data?.result?.success;
  }
};

export const getOneConsultant = async (id: string) => {
  const query = gql`
    {
      result: getOneConsultant (input: { id: "${id}" }) {
        id
        expertise
        yearsOfExperience
        status
        tjm
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
            line
            postalCode
          }
        }
        category {
          id
          name
        }
      }
    }
  `;

  const { data } = await sendGraphQLRequest('user', query);

  return data?.result;
};

export const createConsultant = async (input: any) => {
  const query = gql`
    mutation createConsultant($input: CreateConsultantInput!) {
      result: createConsultant (input: $input) {
        id
      }
    }
  `;

  const variables = { input };

  const { data } = await sendGraphQLRequest('user', query, variables);

  return data?.result;
};

export const updateConsultant = async (input: any) => {
  const query = gql`
    mutation updateConsultant($input: UpdateConsultantInput!) {
      result: updateConsultant (input: $input) {
        id
      }
    }
  `;

  const variables = { input };

  const { data} = await sendGraphQLRequest('user', query, variables);

  return data?.result;
};

export const validateConsultantAccount = async (userId: string) => {
  // Format date as YYYY-MM-DD for MySQL DATE type
  const currentDate = new Date().toISOString().split('T')[0];
  const query = gql`
    mutation {
      result: updateUser (input: { id: "${userId}", validateAt: "${currentDate}" }) {
        id
        isVerified
        validateAt
      }
    }
  `;

  const { data } = await sendGraphQLRequest('user', query);

  return data?.result;
};
