import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getApplications = async (
  limit: number | null,
  page: number | null,
  status?: string,
  jobId?: string
) => {
  const query = gql`
    {
      results: getApplications (input: { limit: ${limit}, page: ${page} }, filter: {  status: "${
    status ? status : ''
  }", jobId: "${jobId ? jobId : ''}" }) {
        rows {
          id
          status
          job {
            title
          }
          talent {
            user {
              name email
            }
          }
          referral {
            user {
              name email
            }
          }
          createdAt
        } total
      }
    }
  `;

  return sendGraphQLRequest('job', query);
};

export const deleteApplication = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteApplication (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('job', query);

    return data?.result?.success;
  }
};

export const changeApplicationStatus = async (
  id: string,
  status: string,
  rejection_reason?: string
) => {
  const query = gql`
    mutation changeApplicationStatus($input: ChangeApplicationStatusInput) {
      result: changeApplicationStatus(input: $input) {
        success
      }
    }
  `;

  const variables = {
    input: { id, status, rejection_reason }
  };

  return await sendGraphQLRequest('job', query, variables);
};

export const getApplication = async (id: string) => {
  const query = gql`
    {
      result: getOneApplication (input: { id: "${id}" }) {
        id
        status
        job {
          id
          title
          company {
            contact {
              email
            }
          }
        }
        talent {
          id
          user {
            name email
          }
          contact {
            email phoneNumber
          }
        }
        referral {
          id
          user {
            name email
          }
          contact {
            email
          }
        }
        lm {
          id
          title
        }
        cv {
          id
          title
          file {
            fileUrl
          }
        }
        createdAt
      }
    }
  `;

  return sendGraphQLRequest('job', query);
};
