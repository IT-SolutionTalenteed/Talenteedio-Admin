import { gql } from 'graphql-tag';
import { sendGraphQLRequest } from '../../api/graphql.api';

export const getPricings = async (consultantId: string) => {
  const query = gql`
    query GetPricings($consultantId: ID!) {
      result: getPricings(consultantId: $consultantId) {
        rows {
          id
          title
          description
          price
          unit
          duration
          features
          createdAt
          updatedAt
        }
        count
      }
    }
  `;

  const variables = { consultantId };
  const { data } = await sendGraphQLRequest('pricing', query, variables);
  return data?.result;
};

export const getOnePricing = async (id: string) => {
  const query = gql`
    query GetOnePricing($id: ID!) {
      result: getOnePricing(id: $id) {
        id
        title
        description
        price
        unit
        duration
        features
      }
    }
  `;

  const variables = { id };
  const { data } = await sendGraphQLRequest('pricing', query, variables);
  return data?.result;
};

export const createPricing = async (input: any) => {
  const query = gql`
    mutation CreatePricing($input: CreatePricingInput!) {
      result: createPricing(input: $input) {
        id
      }
    }
  `;

  const variables = { input };
  const { data } = await sendGraphQLRequest('pricing', query, variables);
  return data;
};

export const updatePricing = async (input: any) => {
  const query = gql`
    mutation UpdatePricing($input: UpdatePricingInput!) {
      result: updatePricing(input: $input) {
        id
      }
    }
  `;

  const variables = { input };
  const { data } = await sendGraphQLRequest('pricing', query, variables);
  return data;
};

export const deletePricing = async (id: string) => {
  const query = gql`
    mutation DeletePricing($id: ID!) {
      result: deletePricing(id: $id)
    }
  `;

  const variables = { id };
  const { data } = await sendGraphQLRequest('pricing', query, variables);
  return data;
};
