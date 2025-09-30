import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getReferrals = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status?: string
) => {
  const query = gql`
    {
      results: getReferrals (input: { limit: ${limit}, page: ${page} }, filter: { name: "${
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

export const deleteReferral = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteReferral (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('user', query);

    return data?.result?.success;
  }
};

export const createReferral = async (referral: any) => {
  const query = gql`
    mutation createReferral($referral: CreateReferralInput) {
      result: createReferral(input: $referral) {
        id
      }
    }
  `;

  const variables = {
    referral: referral
  };

  return await sendGraphQLRequest('user', query, variables);
};

export const updateReferral = async (referral: any) => {
  const query = gql`
    mutation updateReferral($referral: UpdateReferralInput) {
      result: updateReferral(input: $referral) {
        id
      }
    }
  `;

  const variables = {
    referral: referral
  };

  return await sendGraphQLRequest('user', query, variables);
};

export const getReferral = async (id: string) => {
  const query = gql`
    {
      result: getOneReferral (input: { id: "${id}" }) {
        id
        title
        status
        category {
          id
        }
        contact {
            id phoneNumber address {
                line city country postalCode state
            }
        }
        user {
          id
        }
      }
    }
  `;

  return sendGraphQLRequest('user', query);
};
