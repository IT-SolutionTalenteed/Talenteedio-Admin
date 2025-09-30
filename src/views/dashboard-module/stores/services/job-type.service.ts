import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getJobTypes = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status?: string
) => {
  const query = gql`
    {
      results: getJobTypes (input: { limit: ${limit}, page: ${page} }, filter: { name: "${
    search ? search : ''
  }", status: "${status ? status : ''}"  }) {
        rows {
          id
          name
          status
        } total
      }
    }
  `;

  return sendGraphQLRequest('job-type', query);
};

export const deleteJobType = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteJobType (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('job-type', query);

    return data?.result?.success;
  }
};

export const createJobType = async (jobType: any) => {
  const query = gql`
    mutation createJobType($jobType: CreateJobTypeInput) {
      result: createJobType(input: $jobType) {
        id
      }
    }
  `;

  const variables = {
    jobType: jobType
  };

  return await sendGraphQLRequest('job-type', query, variables);
};

export const updateJobType = async (jobType: any) => {
  const query = gql`
    mutation updateJobType($jobType: UpdateJobTypeInput) {
      result: updateJobType(input: $jobType) {
        id
      }
    }
  `;

  const variables = {
    jobType: jobType
  };

  return await sendGraphQLRequest('job-type', query, variables);
};

export const getJobType = async (id: string) => {
  const query = gql`
    {
      result: getOneJobType (input: { id: "${id}" }) {
        id
        name
        status
      }
    }
  `;

  return sendGraphQLRequest('job-type', query);
};
