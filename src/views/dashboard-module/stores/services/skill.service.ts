import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const getSkills = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status: string | undefined = undefined,
  orderBy: string = 'name',
  direction: string = 'asc'
) => {
  const query = gql`
    {
      results: getSkills (
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

  return sendGraphQLRequest('skill', query);
};

export const deleteSkill = async (id?: string) => {
  if (id) {
    const query = gql`
      mutation {
        result: deleteSkill (input: { id: "${id}" }) {
          success
        }
      }
    `;

    const { data } = await sendGraphQLRequest('skill', query);

    return data?.result?.success;
  }
};

export const createSkill = async (skill: any) => {
  const query = gql`
    mutation createSkill($skill: CreateSkillInput) {
      result: createSkill(input: $skill) {
        id
      }
    }
  `;

  const variables = {
    skill: skill
  };

  return await sendGraphQLRequest('skill', query, variables);
};

export const updateSkill = async (skill: any) => {
  const query = gql`
    mutation updateSkill($skill: UpdateSkillInput) {
      result: updateSkill(input: $skill) {
        id
      }
    }
  `;

  const variables = {
    skill: skill
  };

  return await sendGraphQLRequest('skill', query, variables);
};

export const getSkill = async (id: string) => {
  const query = gql`
    {
      result: getOneSkill (input: { id: "${id}" }) {
        id
        name
        status
      }
    }
  `;

  return sendGraphQLRequest('skill', query);
};
