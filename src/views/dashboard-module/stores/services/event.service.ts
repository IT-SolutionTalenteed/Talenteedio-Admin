import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getEvents = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status?: string,
  companyId?: string
) => {
  const query = gql`
    {
      results: getEvents (input: { limit: ${limit}, page: ${page} }, filter: { title: "${
    search ? search : ''
  }" , status: "${status ? status : ''}", companyId: "${companyId ? companyId : ''}" }) {
        rows {
          id
          title
          date
          status
          company {
            id
            company_name
          }
        } total
      }
    }
  `;

  return sendGraphQLRequest('event', query);
};

export const deleteEvent = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteEvent (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('event', query);

    return data?.result?.success;
  }
};

export const createEvent = async (event: any) => {
  const query = gql`
    mutation createEvent($event: CreateEventInput) {
      result: createEvent(input: $event) {
        id
      }
    }
  `;

  const variables = {
    event: event
  };

  return await sendGraphQLRequest('event', query, variables);
};

export const updateEvent = async (event: any) => {
  const query = gql`
    mutation updateEvent($event: UpdateEventInput) {
      result: updateEvent(input: $event) {
        id
      }
    }
  `;

  const variables = {
    event: event
  };

  return await sendGraphQLRequest('event', query, variables);
};

export const getEvent = async (id: string) => {
  const query = gql`
    {
      result: getOneEvent (input: { id: "${id}" }) {
        id
        title
        slug
        content
        status
        metaDescription
        date
        startTime
        endTime
        location
        maxParticipants
        category {
          id
          name
        }
        companies {
          id
          company_name
        }
      }
    }
  `;

  return sendGraphQLRequest('event', query);
};
