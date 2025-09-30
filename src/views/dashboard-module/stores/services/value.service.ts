import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getValues = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status: string | undefined = undefined,
  orderBy: string = 'title',
  direction: string = 'asc'
) => {
  const query = gql`
    {
      results: getValues (
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

  return sendGraphQLRequest('value', query);
};

export const deleteValue = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteValue (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('value', query);

    return data?.result?.success;
  }
};

export const createValue = async (value: any) => {
  const query = gql`
    mutation createValue($value: CreateValueInput) {
      result: createValue(input: $value) {
        id
      }
    }
  `;

  const variables = {
    value: value
  };

  return await sendGraphQLRequest('value', query, variables);
};

export const updateValue = async (value: any) => {
  const query = gql`
    mutation updateValue($value: UpdateValueInput) {
      result: updateValue(input: $value) {
        id
      }
    }
  `;

  const variables = {
    value: value
  };

  return await sendGraphQLRequest('value', query, variables);
};

export const getValue = async (id: string) => {
  const query = gql`
    {
      result: getOneValue (input: { id: "${id}" }) {
        id
        title
        status
      }
    }
  `;

  return sendGraphQLRequest('value', query);
};
