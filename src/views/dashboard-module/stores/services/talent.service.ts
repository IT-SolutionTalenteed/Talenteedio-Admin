import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getTalents = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status?: string
) => {
  const query = gql`
    {
      results: getTalents (input: { limit: ${limit}, page: ${page} }, filter: { name: "${
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

export const deleteTalent = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteTalent (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('user', query);

    return data?.result?.success;
  }
};

export const createTalent = async (talent: any) => {
  const query = gql`
    mutation createTalent($talent: CreateTalentInput) {
      result: createTalent(input: $talent) {
        id
      }
    }
  `;

  const variables = {
    talent: talent
  };

  return await sendGraphQLRequest('user', query, variables);
};

export const updateTalent = async (talent: any) => {
  const query = gql`
    mutation updateTalent($talent: UpdateTalentInput) {
      result: updateTalent(input: $talent) {
        id
      }
    }
  `;

  const variables = {
    talent: talent
  };

  return await sendGraphQLRequest('user', query, variables);
};

export const getTalent = async (id: string) => {
  const query = gql`
    {
      result: getOneTalent (input: { id: "${id}" }) {
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
        consent {
          fileUrl
        }
        gender
        experience
        educationLevel
        values {
          id
        }
      }
    }
  `;

  return sendGraphQLRequest('user', query);
};
