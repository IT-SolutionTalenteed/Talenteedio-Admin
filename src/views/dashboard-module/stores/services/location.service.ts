import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getLocations = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status: string | undefined = undefined,
  orderBy: string = 'name',
  direction: string = 'asc'
) => {
  const query = gql`
    {
      results: getLocations (
        input: { 
          limit: ${limit}, 
          page: ${page},
          ${orderBy !== undefined ? `orderBy: "${orderBy}",` : ''}
          ${direction !== undefined ? `direction: "${direction}",` : ''} 
        }, 
        filter: { name: "${search ? search : ''}", status: "${status ? status : ''}"  }
      ) {
        rows {
          id
          name
          status
        } total
      }
    }
  `;

  return sendGraphQLRequest('location', query);
};

export const deleteLocation = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteLocation (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('location', query);

    return data?.result?.success;
  }
};

export const createLocation = async (location: any) => {
  const query = gql`
    mutation createLocation($location: CreateLocationInput) {
      result: createLocation(input: $location) {
        id
      }
    }
  `;

  const variables = {
    location: location
  };

  return await sendGraphQLRequest('location', query, variables);
};

export const updateLocation = async (location: any) => {
  const query = gql`
    mutation updateLocation($location: UpdateLocationInput) {
      result: updateLocation(input: $location) {
        id
      }
    }
  `;

  const variables = {
    location: location
  };

  return await sendGraphQLRequest('location', query, variables);
};

export const getLocation = async (id: string) => {
  const query = gql`
    {
      result: getOneLocation (input: { id: "${id}" }) {
        id
        name
        status
        address {
          line city country postalCode state
        }
      }
    }
  `;

  return sendGraphQLRequest('location', query);
};
