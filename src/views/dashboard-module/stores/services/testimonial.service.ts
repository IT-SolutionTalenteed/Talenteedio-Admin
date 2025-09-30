import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getTestimonials = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status?: string
) => {
  const query = gql`
    {
      results: getTestimonials (input: { limit: ${limit}, page: ${page} }, filter: { name: "${
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

  return sendGraphQLRequest('testimonial', query);
};

export const deleteTestimonial = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteTestimonial (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('testimonial', query);

    return data?.result?.success;
  }
};

export const createTestimonial = async (testimonial: any) => {
  const query = gql`
    mutation createTestimonial($testimonial: CreateTestimonialInput) {
      result: createTestimonial(input: $testimonial) {
        id
      }
    }
  `;

  const variables = {
    testimonial: testimonial
  };

  return await sendGraphQLRequest('testimonial', query, variables);
};

export const updateTestimonial = async (testimonial: any) => {
  const query = gql`
    mutation updateTestimonial($testimonial: UpdateTestimonialInput) {
      result: updateTestimonial(input: $testimonial) {
        id
      }
    }
  `;

  const variables = {
    testimonial: testimonial
  };

  return await sendGraphQLRequest('testimonial', query, variables);
};

export const getTestimonial = async (id: string) => {
  const query = gql`
    {
      result: getOneTestimonial (input: { id: "${id}" }) {
        id
        name
        comment
        jobPosition
        status
      }
    }
  `;

  return sendGraphQLRequest('testimonial', query);
};
