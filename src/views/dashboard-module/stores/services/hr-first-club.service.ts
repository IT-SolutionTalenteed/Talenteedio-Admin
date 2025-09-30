import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getHrFirstClubs = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status?: string
) => {
  const query = gql`
    {
      results: getHrFirstClubs (input: { limit: ${limit}, page: ${page} }, filter: { companyName: "${
    search ? search : ''
  }" , status: "${status ? status : ''}" }) {
        rows {
          id
          companyName
          function
          membershipReason
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

export const deleteHrFirstClub = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteHrFirstClub (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('user', query);

    return data?.result?.success;
  }
};

export const createHrFirstClub = async (hrFirstClub: any) => {
  const query = gql`
    mutation createHrFirstClub($hrFirstClub: CreateHrFirstClubInput) {
      result: createHrFirstClub(input: $hrFirstClub) {
        id
      }
    }
  `;

  const variables = {
    hrFirstClub: hrFirstClub
  };

  return await sendGraphQLRequest('user', query, variables);
};

export const updateHrFirstClub = async (hrFirstClub: any) => {
  const query = gql`
    mutation updateHrFirstClub($hrFirstClub: UpdateHrFirstClubInput) {
      result: updateHrFirstClub(input: $hrFirstClub) {
        id
      }
    }
  `;

  const variables = {
    hrFirstClub: hrFirstClub
  };

  return await sendGraphQLRequest('user', query, variables);
};

export const getHrFirstClub = async (id: string) => {
  const query = gql`
    {
      result: getOneHrFirstClub (input: { id: "${id}" }) {
        id
        companyName
        function
        membershipReason
        status
        contact {
            id phoneNumber address {
                line city country postalCode state
            }
        }
        user {
          id
        }
        logo {
          fileUrl
        }
      }
    }
  `;

  return sendGraphQLRequest('user', query);
};
