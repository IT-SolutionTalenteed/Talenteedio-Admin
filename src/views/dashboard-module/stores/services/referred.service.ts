import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getReferreds = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  orderBy: string = 'createdAt',
  direction: string = 'asc'
) => {
  const query = gql`
    {
      results: getReferreds (
        input: { 
          limit: ${limit}, 
          page: ${page},
          ${orderBy !== undefined ? `orderBy: "${orderBy}",` : ''}
          ${direction !== undefined ? `direction: "${direction}",` : ''} 
        }, 
        filter: { talentEmail: "${search ? search : ''}"  }
      ) {
        rows {
          id
          talentFullName
          talentEmail
          talentNumber
          referral {
            user {
              firstname
              lastname
            }
          }
          job {
            title
          }
          createdAt
        } total
      }
    }
  `;

  return sendGraphQLRequest('referred', query);
};

export const deleteReferred = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteReferred (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('referred', query);

    return data?.result?.success;
  }
};

export const getReferred = async (id: string) => {
  const query = gql`
    {
      result: getOneReferred (input: { id: "${id}" }) {
          id
          talentEmail
          talentNumber
          referral {
            user {
              firstname
              lastname
            }
          }
          job {
            title
          }
        } total
      }
    }
  `;

  return sendGraphQLRequest('referred', query);
};
