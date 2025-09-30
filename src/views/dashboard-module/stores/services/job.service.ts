import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getJobs = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status?: string,
  companyId?: string
) => {
  const query = gql`
    {
      results: getJobs (input: { limit: ${limit}, page: ${page} }, filter: { search: "${
    search ? search : ''
  }" , status: "${status ? status : ''}", companyId: "${companyId ? companyId : ''}" }) {
        rows {
          id
          title
          status
          company {
            user {
              email
            }
          }
          slug
          createdAt
          updatedAt
        } total
      }
    }
  `;

  return sendGraphQLRequest('job', query);
};

export const deleteJob = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteJob (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('job', query);

    return data?.result?.success;
  }
};

export const createJob = async (job: any) => {
  const query = gql`
    mutation createJob($job: CreateJobInput) {
      result: createJob(input: $job) {
        id
      }
    }
  `;

  const variables = {
    job: job
  };

  return await sendGraphQLRequest('job', query, variables);
};

export const updateJob = async (job: any) => {
  const query = gql`
    mutation updateJob($job: UpdateJobInput) {
      result: updateJob(input: $job) {
        id
      }
    }
  `;

  const variables = {
    job: job
  };

  return await sendGraphQLRequest('job', query, variables);
};

export const updateMultipleJobs = async (input: any) => {
  const query = gql`
    mutation updateMultipleJobs($input: UpdateMultipleJobsInput) {
      result: updateMultipleJobs(input: $input) {
        success
      }
    }
  `;

  const variables = {
    input: input
  };

  return await sendGraphQLRequest('job', query, variables);
};

export const getJob = async (id: string) => {
  const query = gql`
    {
      result: getOneJob (input: { id: "${id}" }) {
        id
        title
        slug
        status
        content
        metaDescription
        expirationDate
        hours
        hourType
        gender
        salaryMin
        salaryMax
        salaryType
        experience
        recruitmentNumber
        isFeatured
        isUrgent
        isSharable
        featuredImage {
          fileUrl
        }
        category {
          id
        }
        company {
          id
        }
        jobType {
          id
        }
        location {
          id
        }
        values {
          id
        }
      }
    }
  `;

  return sendGraphQLRequest('job', query);
};
