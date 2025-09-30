import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getArticles = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status?: string,
  companyId?: string
) => {
  const query = gql`
    {
      results: getArticles (input: { limit: ${limit}, page: ${page} }, filter: { title: "${
    search ? search : ''
  }" , status: "${status ? status : ''}", companyId: "${companyId ? companyId : ''}" }) {
        rows {
          id
          title
          status
          company {
            company_name
          }
          admin {
            user {
              email
            }
          }
          createdAt
          slug
        } total
      }
    }
  `;

  return sendGraphQLRequest('article', query);
};

export const deleteArticle = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteArticle (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('article', query);

    return data?.result?.success;
  }
};

export const createArticle = async (article: any) => {
  const query = gql`
    mutation createArticle($article: CreateArticleInput) {
      result: createArticle(input: $article) {
        id
      }
    }
  `;

  const variables = {
    article: article
  };

  return await sendGraphQLRequest('article', query, variables);
};

export const updateArticle = async (article: any) => {
  const query = gql`
    mutation updateArticle($article: UpdateArticleInput) {
      result: updateArticle(input: $article) {
        id
      }
    }
  `;

  const variables = {
    article: article
  };

  return await sendGraphQLRequest('article', query, variables);
};

export const getArticle = async (id: string) => {
  const query = gql`
    {
      result: getOneArticle (input: { id: "${id}" }) {
        id
        title
        slug
        status
        content
        publicContent
        isPremium
        metaDescription
        image {
          fileUrl
        }
        categories {
          id
        }
        company {
          id
        }
      }
    }
  `;

  return sendGraphQLRequest('article', query);
};
