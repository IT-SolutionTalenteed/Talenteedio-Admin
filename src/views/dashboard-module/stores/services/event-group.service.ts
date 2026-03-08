import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getEventGroups = async (
  limit: number | null,
  page: number | null,
  search: string | null
) => {
  const query = gql`
    {
      results: getEventGroups (input: { limit: ${limit}, page: ${page} }, filter: { title: "${
    search ? search : ''
  }" }) {
        rows {
          id
          title
          slug
          description
          createdAt
        } total
      }
    }
  `;

  return sendGraphQLRequest('event', query);
};

export const deleteEventGroup = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteEventGroup (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('event', query);

    return data?.result?.success;
  }
};

export const createEventGroup = async (eventGroup: any) => {
  const query = gql`
    mutation createEventGroup($eventGroup: CreateEventGroupInput) {
      result: createEventGroup(input: $eventGroup) {
        id
      }
    }
  `;

  const variables = {
    eventGroup: eventGroup
  };

  return await sendGraphQLRequest('event', query, variables);
};

export const updateEventGroup = async (eventGroup: any) => {
  const query = gql`
    mutation updateEventGroup($eventGroup: UpdateEventGroupInput) {
      result: updateEventGroup(input: $eventGroup) {
        id
      }
    }
  `;

  const variables = {
    eventGroup: eventGroup
  };

  return await sendGraphQLRequest('event', query, variables);
};

export const getEventGroup = async (id: string) => {
  const query = gql`
    {
      result: getOneEventGroup (input: { id: "${id}" }) {
        id
        title
        slug
        description
        metaDescription
        image
      }
    }
  `;

  return sendGraphQLRequest('event', query);
};
