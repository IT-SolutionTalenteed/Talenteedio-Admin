import gql from 'graphql-tag';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const updateSetting = async (setting: any) => {
  const query = gql`
    mutation createOrUpdateSetting($setting: SettingInput) {
      result: createOrUpdateSetting(input: $setting) {
        success
      }
    }
  `;

  const variables = {
    setting: setting
  };

  return await sendGraphQLRequest('setting', query, variables);
};

export const getSetting = async () => {
  const query = gql`
    {
      result: getSetting {
        contact {
          email
          phoneNumber
          address {
            line
            postalCode
            city
            state
            country
          }
        }
        terms
        confidentiality
        didYouKnow
        gateway
        voice
        initiative
        headerText
        homeImage1 {
          id
          fileUrl
        }
        homeImage2 {
          id
          fileUrl
        }
        homeImage3 {
          id
          fileUrl
        }
      }
    }
  `;

  return sendGraphQLRequest('setting', query);
};
