import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getCompanies = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status?: string
) => {
  const query = gql`
    {
      results: getCompanies (input: { limit: ${limit}, page: ${page} }, filter: { name: "${
    search ? search : ''
  }" , status: "${status ? status : ''}" }) {
        rows {
          id
          company_name
          logo {
            fileUrl
          }
          contact {
            email
          }
          createdAt
        } total
      }
    }
  `;

  return sendGraphQLRequest('user', query);
};

export const deleteCompany = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteCompany (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('user', query);

    return data?.result?.success;
  }
};

export const createCompany = async (company: any) => {
  const query = gql`
    mutation createCompany($company: CreateCompanyInput) {
      result: createCompany(input: $company) {
        id
      }
    }
  `;

  const variables = {
    company: company
  };

  return await sendGraphQLRequest('user', query, variables);
};

export const updateCompany = async (company: any) => {
  const query = gql`
    mutation updateCompany($company: UpdateCompanyInput) {
      result: updateCompany(input: $company) {
        id
      }
    }
  `;

  const variables = {
    company: company
  };

  return await sendGraphQLRequest('user', query, variables);
};

export const getCompany = async (id: string) => {
  const query = gql`
    {
      result: getOneCompany (input: { id: "${id}" }) {
        id
        company_name
        status
        slogan
        description
        about
        website
        industry
        sector
        companySize
        foundedYear
        profileSought
        positionsToFill
        requiredSkills
        requiredExperience
        contractTypes
        workingHours
        socialNetworks {
          linkedin
          twitter
          facebook
        }
        logo {
          id
          fileUrl
        }
        category {
          id
        }
        values {
          id
          title
        }
        contact {
            id email phoneNumber address {
                line city country postalCode state
            }
        }
        user {
            id
        }
        permission {
          id
        }
      }
    }
  `;

  return sendGraphQLRequest('user', query);
};

export const sendCompanyCredentials = async (companyName: string, email: string, password: string) => {
  const query = gql`
    mutation sendCompanyCredentials($input: SendCompanyCredentialsInput!) {
      result: sendCompanyCredentials(input: $input) {
        success
        msg
      }
    }
  `;

  const variables = {
    input: {
      companyName,
      email,
      password
    }
  };

  return await sendGraphQLRequest('user', query, variables);
};
