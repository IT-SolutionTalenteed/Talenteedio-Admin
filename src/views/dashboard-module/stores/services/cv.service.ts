import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getCVs = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  talentId?: string,
  freelanceId?: string
) => {
  const talent_id = talentId ? `"${talentId}"` : null;
  const freelance_id = freelanceId ? `"${freelanceId}"` : null;

  const query = gql`
    {
      results: getCVs (input: { limit: ${limit}, page: ${page} }, filter: { title: "${
    search ? search : ''
  }", talentId: ${talent_id}, freelanceId: ${freelance_id} }) {
        rows {
          id
          title
          file {
            fileUrl
          }
          createdAt
        } total
      }
    }
  `;

  return sendGraphQLRequest('user', query);
};

export const deleteCV = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteCV (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('user', query);

    return data?.result?.success;
  }
};

export const createCV = async (cv: any) => {
  const query = gql`
    mutation createCV($cv: CreateCVInput) {
      result: createCV(input: $cv) {
        id
      }
    }
  `;

  const variables = {
    cv: cv
  };

  return await sendGraphQLRequest('user', query, variables);
};

export const uploadCV = async (cv: any) => {
  const query = gql`
    mutation uploadCV($cv: UploadCVInput) {
      result: uploadCV(input: $cv) {
        id
      }
    }
  `;

  const variables = {
    cv: cv
  };

  return await sendGraphQLRequest('user', query, variables);
};

export const updateCV = async (cv: any) => {
  const query = gql`
    mutation updateCV($cv: UpdateCVInput) {
      result: updateCV(input: $cv) {
        id
      }
    }
  `;

  const variables = {
    cv: cv
  };

  return await sendGraphQLRequest('user', query, variables);
};

export const getCV = async (id: string) => {
  const query = gql`
    {
      result: getOneCV (input: { id: "${id}" }) {
        id
        title
        description
        skills {
          id
          text
        }
        diplomas {
          id
          text
        }
        languages {
          id
          text
        }
        experiences {
          id
          title
          description
          start
          end
        }
        talent {
          id
        }
      }
    }
  `;

  return sendGraphQLRequest('user', query);
};

export const generateCV = async (id: string) => {
  const query = gql`
    {
      result: generateCV (input: { id: "${id}" })
    }
  `;

  return sendGraphQLRequest('user', query);
};
