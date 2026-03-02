import api from './index';

export const newsletterApi = {
  async getNewsletters(params: { page: number; limit: number; filter?: any }) {
    const query = `
      query GetNewsletters($input: PaginationInput!, $filter: NewsletterFilter) {
        getNewsletters(input: $input, filter: $filter) {
          rows {
            id
            subject
            status
            totalRecipients
            sentCount
            failedCount
            createdAt
            sentAt
          }
          total
          page
          limit
        }
      }
    `;

    // Nettoyer le filtre pour enlever les valeurs vides
    const cleanFilter = params.filter ? {
      ...(params.filter.subject ? { subject: params.filter.subject } : {}),
      ...(params.filter.status ? { status: params.filter.status } : {}),
    } : undefined;

    const response = await api.post('/newsletter', {
      query,
      variables: {
        input: {
          page: params.page,
          limit: params.limit,
        },
        ...(cleanFilter && Object.keys(cleanFilter).length > 0 ? { filter: cleanFilter } : {}),
      },
    });

    // Vérifier si la réponse contient des erreurs GraphQL
    if (response.data.errors && response.data.errors.length > 0) {
      console.error('GraphQL errors:', response.data.errors);
      const errorMsg = response.data.errors[0]?.message || 'GraphQL query failed';
      console.error('Full error details:', JSON.stringify(response.data.errors, null, 2));
      throw new Error(errorMsg);
    }

    // Vérifier si les données sont présentes
    const result = response.data.data?.getNewsletters;
    if (!result) {
      console.error('No data in response:', response.data);
      // Retourner une structure vide au lieu de lancer une erreur
      return { rows: [], total: 0, page: params.page, limit: params.limit };
    }

    return result;
  },

  async getNewsletter(id: string) {
    const query = `
      query GetOneNewsletter($input: GetOneNewsletterInput!) {
        getOneNewsletter(input: $input) {
          id
          subject
          message
          htmlMessage
          status
          recipientTypes
          customRecipientEmails
          attachments {
            filename
            path
            contentType
          }
          totalRecipients
          sentCount
          failedCount
          scheduledAt
          sentAt
          createdBy {
            id
            firstname
            lastname
            email
          }
          createdAt
          updatedAt
        }
      }
    `;

    const response = await api.post('/newsletter', {
      query,
      variables: {
        input: { id },
      },
    });

    return response.data.data.getOneNewsletter;
  },

  async createNewsletter(data: any) {
    const mutation = `
      mutation CreateNewsletter($input: CreateNewsletterInput!) {
        createNewsletter(input: $input) {
          id
          subject
          status
        }
      }
    `;

    const response = await api.post('/newsletter', {
      query: mutation,
      variables: {
        input: data,
      },
    });

    // Vérifier les erreurs GraphQL
    if (response.data.errors) {
      console.error('GraphQL errors:', response.data.errors);
      throw new Error(response.data.errors[0]?.message || 'Erreur lors de la création');
    }

    // Vérifier que les données sont présentes
    const result = response.data.data?.createNewsletter;
    if (!result) {
      console.error('No data in response:', response.data);
      throw new Error('La création a échoué - aucune donnée retournée');
    }

    return result;
  },

  async updateNewsletter(id: string, data: any) {
    const mutation = `
      mutation UpdateNewsletter($input: UpdateNewsletterInput!) {
        updateNewsletter(input: $input) {
          id
          subject
          status
        }
      }
    `;

    const response = await api.post('/newsletter', {
      query: mutation,
      variables: {
        input: {
          id,
          ...data,
        },
      },
    });

    return response.data.data.updateNewsletter;
  },

  async deleteNewsletter(id: string) {
    const mutation = `
      mutation DeleteNewsletter($input: DeleteNewsletterInput!) {
        deleteNewsletter(input: $input) {
          success
        }
      }
    `;

    const response = await api.post('/newsletter', {
      query: mutation,
      variables: {
        input: { id },
      },
    });

    return response.data.data.deleteNewsletter;
  },

  async sendNewsletter(id: string) {
    const mutation = `
      mutation SendNewsletter($input: SendNewsletterInput!) {
        sendNewsletter(input: $input) {
          id
          status
        }
      }
    `;

    const response = await api.post('/newsletter', {
      query: mutation,
      variables: {
        input: { id },
      },
    });

    return response.data.data.sendNewsletter;
  },

  async countRecipients(data: { recipientTypes: string[]; customRecipientEmails?: string[] }) {
    const query = `
      query CountNewsletterRecipients($input: CountRecipientsInput!) {
        countNewsletterRecipients(input: $input)
      }
    `;

    const response = await api.post('/newsletter', {
      query,
      variables: {
        input: data,
      },
    });

    return response.data.data.countNewsletterRecipients;
  },
};
