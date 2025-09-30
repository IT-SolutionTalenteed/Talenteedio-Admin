import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getPartners = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status: string | undefined = undefined,
  orderBy: string = 'title',
  direction: string = 'asc'
) => {
  const query = gql`
    {
      results: getPartners (
        input: { 
          limit: ${limit}, 
          page: ${page},
          ${orderBy !== undefined ? `orderBy: "${orderBy}",` : ''}
          ${direction !== undefined ? `direction: "${direction}",` : ''} 
        }, 
        filter: { title: "${search ? search : ''}", status: "${status ? status : ''}"  }
      ) {
        rows {
          id
          title
          status
        } total
      }
    }
  `;

  return sendGraphQLRequest('partner', query);
};

export const deletePartner = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deletePartner (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('partner', query);

    return data?.result?.success;
  }
};

export const createPartner = async (partner: any) => {
  const query = gql`
    mutation createPartner($partner: CreatePartnerInput) {
      result: createPartner(input: $partner) {
        id
      }
    }
  `;

  const variables = {
    partner: partner
  };

  return await sendGraphQLRequest('partner', query, variables);
};

export const updatePartner = async (partner: any) => {
  const query = gql`
    mutation updatePartner($partner: UpdatePartnerInput) {
      result: updatePartner(input: $partner) {
        id
      }
    }
  `;

  const variables = {
    partner: partner
  };

  return await sendGraphQLRequest('partner', query, variables);
};

export const getPartner = async (id: string) => {
  const query = gql`
    {
      result: getOnePartner (input: { id: "${id}" }) {
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

  return sendGraphQLRequest('partner', query);
};
