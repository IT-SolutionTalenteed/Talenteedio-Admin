import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getInterviews = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status?: string
) => {
  const query = gql`
    {
      results: getInterviews (input: { limit: ${limit}, page: ${page} }, filter: { title: "${
    search ? search : ''
  }" , status: "${status ? status : ''}" }) {
        rows {
          id
          title
          date
          status
        } total
      }
    }
  `;

  return sendGraphQLRequest('interview', query);
};

export const deleteInterview = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteInterview (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('interview', query);

    return data?.result?.success;
  }
};

export const createInterview = async (interview: any) => {
  const query = gql`
    mutation createInterview($interview: CreateInterviewInput) {
      result: createInterview(input: $interview) {
        id
      }
    }
  `;

  const variables = {
    interview: interview
  };

  return await sendGraphQLRequest('interview', query, variables);
};

export const updateInterview = async (interview: any) => {
  const query = gql`
    mutation updateInterview($interview: UpdateInterviewInput) {
      result: updateInterview(input: $interview) {
        id
      }
    }
  `;

  const variables = {
    interview: interview
  };

  return await sendGraphQLRequest('interview', query, variables);
};

export const getInterview = async (id: string) => {
  const query = gql`
    {
      result: getOneInterview (input: { id: "${id}" }) {
        id
        title
        slug
        content
        status
        metaDescription
        date
        guests {
          id
          name
        }
        videoSrc
      }
    }
  `;

  return sendGraphQLRequest('interview', query);
};
