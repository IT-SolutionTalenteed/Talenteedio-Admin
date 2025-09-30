import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getAds = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  orderBy: string = 'title',
  direction: string = 'asc'
) => {
  const query = gql`
    {
      results: getAds (
        input: { 
          limit: ${limit}, 
          page: ${page},
          ${orderBy !== undefined ? `orderBy: "${orderBy}",` : ''}
          ${direction !== undefined ? `direction: "${direction}",` : ''} 
        }, 
        filter: { title: "${search ? search : ''}"  }
      ) {
        rows {
          id
          title
          status
        } total
      }
    }
  `;

  return sendGraphQLRequest('ad', query);
};

export const deleteAd = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteAd (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('ad', query);

    return data?.result?.success;
  }
};

export const createAd = async (ad: any) => {
  const query = gql`
    mutation createAd($ad: CreateAdInput) {
      result: createAd(input: $ad) {
        id
      }
    }
  `;

  const variables = {
    ad: ad
  };

  return await sendGraphQLRequest('ad', query, variables);
};

export const updateAd = async (ad: any) => {
  const query = gql`
    mutation updateAd($ad: UpdateAdInput) {
      result: updateAd(input: $ad) {
        id
      }
    }
  `;

  const variables = {
    ad: ad
  };

  return await sendGraphQLRequest('ad', query, variables);
};

export const getAd = async (id: string) => {
  const query = gql`
    {
      result: getOneAd (input: { id: "${id}" }) {
        id
        title
        slug
        status
        image {
          id
          fileUrl
        }
        link
      }
    }
  `;

  return sendGraphQLRequest('ad', query);
};
