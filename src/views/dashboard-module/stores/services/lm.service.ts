import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getLMs = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  talentId?: string
) => {
  const talent_id = talentId ? `"${talentId}"` : null;

  const query = gql`
    {
      results: getLMs (input: { limit: ${limit}, page: ${page} }, filter: { title: "${
    search ? search : ''
  }", talentId: ${talent_id} }) {
        rows {
          id
          title
          createdAt
        } total
      }
    }
  `;

  return sendGraphQLRequest('user', query);
};

export const deleteLM = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteLM (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('user', query);

    return data?.result?.success;
  }
};

export const createLM = async (lm: any) => {
  const query = gql`
    mutation createLM($lm: CreateLMInput) {
      result: createLM(input: $lm) {
        id
      }
    }
  `;

  const variables = {
    lm: lm
  };

  return await sendGraphQLRequest('user', query, variables);
};

export const updateLM = async (lm: any) => {
  const query = gql`
    mutation updateLM($lm: UpdateLMInput) {
      result: updateLM(input: $lm) {
        id
      }
    }
  `;

  const variables = {
    lm: lm
  };

  return await sendGraphQLRequest('user', query, variables);
};

export const getLM = async (id: string) => {
  const query = gql`
    {
      result: getOneLM (input: { id: "${id}" }) {
        id
        title
        content
        talent {
          id
        }
      }
    }
  `;

  return sendGraphQLRequest('user', query);
};

export const generateLM = async (id: string) => {
  const query = gql`
    {
      result: generateLM (input: { id: "${id}" })
    }
  `;

  return sendGraphQLRequest('user', query);
};
