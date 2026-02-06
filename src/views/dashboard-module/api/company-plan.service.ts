import api from './index';

export const getCompanyPlans = async (filter?: any) => {
  const query = `
    query GetCompanyPlans($input: PaginationInput, $filter: CompanyPlanFilter) {
      getCompanyPlans(input: $input, filter: $filter) {
        rows {
          id
          title
          description
          features
          maxArticles
          maxEvents
          maxJobs
          price
          billingPeriod
          isActive
          displayOrder
          isPopular
          createdAt
          updatedAt
        }
        total
        page
        limit
      }
    }
  `;

  const variables = {
    input: { limit: 100, page: 1 },
    filter: filter || {},
  };

  const response = await api.post('/company-plan', { query, variables });
  return response.data.data.getCompanyPlans;
};

export const getOneCompanyPlan = async (id: string) => {
  const query = `
    query GetOneCompanyPlan($id: String!) {
      getOneCompanyPlan(id: $id) {
        id
        title
        description
        features
        maxArticles
        maxEvents
        maxJobs
        price
        billingPeriod
        isActive
        displayOrder
        isPopular
        createdAt
        updatedAt
      }
    }
  `;

  const variables = { id };

  const response = await api.post('/company-plan', { query, variables });
  return response.data.data.getOneCompanyPlan;
};

export const createCompanyPlan = async (input: any) => {
  const mutation = `
    mutation CreateCompanyPlan($input: CreateCompanyPlanInput!) {
      createCompanyPlan(input: $input) {
        id
        title
        description
        features
        maxArticles
        maxEvents
        maxJobs
        price
        billingPeriod
        isActive
        displayOrder
        isPopular
      }
    }
  `;

  const variables = { input };

  const response = await api.post('/company-plan', { query: mutation, variables });
  return response.data.data.createCompanyPlan;
};

export const updateCompanyPlan = async (input: any) => {
  const mutation = `
    mutation UpdateCompanyPlan($input: UpdateCompanyPlanInput!) {
      updateCompanyPlan(input: $input) {
        id
        title
        description
        features
        maxArticles
        maxEvents
        maxJobs
        price
        billingPeriod
        isActive
        displayOrder
        isPopular
      }
    }
  `;

  const variables = { input };

  const response = await api.post('/company-plan', { query: mutation, variables });
  return response.data.data.updateCompanyPlan;
};

export const deleteCompanyPlan = async (id: string) => {
  const mutation = `
    mutation DeleteCompanyPlan($id: String!) {
      deleteCompanyPlan(id: $id)
    }
  `;

  const variables = { id };

  const response = await api.post('/company-plan', { query: mutation, variables });
  return response.data.data.deleteCompanyPlan;
};
