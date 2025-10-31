import axios from 'axios';
import Swal from 'sweetalert2';
import { print } from 'graphql';

import { useAuthStore } from '@/views/auth-module/stores/auth.store';

const apiUrl = import.meta.env.VITE_API_URL; // Replace with your GraphQL API endpoint

const graphqlApi = axios.create({
  baseURL: apiUrl
});

// Function to send a GraphQL request
export const sendGraphQLRequest = async (
  url: string,
  query: any,
  variables: any = undefined,
  formData: any = undefined
) => {
  try {
    const request = async () =>
      await graphqlApi.post(
        url,
        formData
          ? formData
          : {
              query: print(query),
              variables
            }
      );

    const response = await request();

    const { data, errors } = response.data;

    if (errors) {
      for (const error of errors) {
        if ([401].includes(error.extensions?.statusCode)) {
          const authStore = useAuthStore();
          const { resetAuth, refresh } = authStore;

          await refresh();

          const accessToken = authStore.accessToken;

          if (accessToken) {
            const response = await request();
            const { data, errors } = response.data;
            return { data, errors };
          }

          Swal.fire({
            icon: 'error',
            title: 'Message',
            text: error.message
          });

          resetAuth();
          window.location.href = import.meta.env.VITE_HOST_URL + '/authentication/sign-in';
        } else if ([500].includes(error.extensions?.statusCode)) {
          // Cas spécial pour matchCVWithJob/cv matcher, message plus informatif
          if (query?.loc?.source?.body?.includes('matchCVWithJob')) {
            Swal.fire({
              icon: 'error',
              title: 'Erreur serveur (CV Matching)',
              html: `<b>Impossible de valider votre CV en ce moment.</b><br><br>Causes possibles :<ul><li>La clé OpenAI n'est pas configurée côté serveur</li><li>Le format de votre CV n'est pas supporté (seuls PDF ou DOCX)</li><li>Impossible de contacter l'IA pour analyser le CV</li><li>Un bug sur le serveur matching</li></ul>Contactez le support si l'erreur persiste.`
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Erreur serveur',
              text: error.message || 'Une erreur interne est survenue (500).'
            });
          }
        } else if ([422].includes(error.extensions?.statusCode)) {
          Swal.fire({
            icon: 'warning',
            title: 'Message',
            text: error.message
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Message',
            text: error.message,
            toast: true,
            position: 'bottom-right',
            showConfirmButton: false,
            timer: 3000 // Adjust the duration as needed
          });
        }
      }
    } else {
      if (query?.loc?.source?.body?.includes('mutation')) {
        Swal.fire({
          icon: 'success',
          title: 'Message',
          text: 'Success',
          toast: true,
          position: 'bottom-right',
          showConfirmButton: false,
          timer: 3000 // Adjust the duration as needed
        });
      }
    }

    return { data, errors };
  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: 'error',
      title: 'Message',
      text: 'An error occured'
    });

    return { data: undefined, errors: error };
  }
};

graphqlApi.interceptors.request.use((request) => {
  const { accessToken } = useAuthStore();

  const controller = new AbortController();

  if (!navigator.onLine) {
    Swal.fire({
      icon: 'warning',
      title: 'Message',
      text: 'You are offline'
    });

    controller.abort();
  }

  request.headers.Authorization = 'Bearer ' + accessToken;
  request.withCredentials = true;

  return {
    ...request,
    signal: controller.signal
  };
});

export default graphqlApi;
