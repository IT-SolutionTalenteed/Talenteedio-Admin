import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getCategories = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status: string | undefined = undefined,
  model: string | undefined = undefined,
  orderBy: string = 'name',
  direction: string = 'asc'
) => {
  const query = gql`
    {
      results: getCategories (
        input: { 
          limit: ${limit}, 
          page: ${page},
          ${orderBy !== undefined ? `orderBy: "${orderBy}",` : ''}
          ${direction !== undefined ? `direction: "${direction}",` : ''} 
        }, 
        filter: { 
          name: "${search ? search : ''}", 
          status: "${status ? status : ''}", 
          model: "${model ? model : ''}" 
        }
      ) {
        rows {
          id
          name
          status
          model
          slug
          subtitle
          description
          image
          faq {
            question
            answer
          }
          gallery
          testimonials {
            avatar
            fullname
            job
            avis
          }
          video
          detailList
        } total
      }
    }
  `;

  return sendGraphQLRequest('category', query);
};

export const deleteCategory = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteCategory (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('category', query);

    return data?.result?.success;
  }
};

export const createCategory = async (category: any) => {
  const query = gql`
    mutation createCategory($category: CreateCategoryInput) {
      result: createCategory(input: $category) {
        id
      }
    }
  `;

  const variables = {
    category: category
  };

  return await sendGraphQLRequest('category', query, variables);
};

export const updateCategory = async (category: any) => {
  const query = gql`
    mutation updateCategory($category: UpdateCategoryInput) {
      result: updateCategory(input: $category) {
        id
      }
    }
  `;

  const variables = {
    category: category
  };

  return await sendGraphQLRequest('category', query, variables);
};

export const getCategory = async (id: string) => {
  const query = gql`
    {
      result: getOneCategory (input: { id: "${id}" }) {
        id
        name
        slug
        subtitle
        description
        image
        faq {
          question
          answer
        }
        gallery
        testimonials {
          avatar
          fullname
          job
          avis
        }
        video
        detailList
        status
      }
    }
  `;

  return sendGraphQLRequest('category', query);
};
