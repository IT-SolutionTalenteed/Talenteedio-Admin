import gql from 'graphql-tag';
import { print } from 'graphql';

import { sendGraphQLRequest } from '../../api/graphql.api';

export const uploadMedia = async (file: any, type = 'image') => {
  const method = type === 'image' ? 'uploadImage' : 'uploadPdf';

  const query = gql`
    mutation ${method}($file: Upload!) {
      result: ${method}(input: $file) {
        id
        fileUrl
        fileName
        fileType
      }
    }
  `;

  const formData = new FormData();

  formData.append(
    'operations',
    JSON.stringify({
      query: print(query),
      variables: {
        file: null
      }
    })
  );

  formData.append(
    'map',
    JSON.stringify({
      '0': ['variables.file']
    })
  );

  formData.append('0', file);

  return await sendGraphQLRequest('media', undefined, undefined, formData);
};
