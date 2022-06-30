import axios from 'axios';
import { stringify } from 'qs';

const axiosInstance = axios.create({
  paramsSerializer: (params) => stringify(params)
});

const resolveInterceptor = (response) => response.data || response;
const errorInterceptor = (error = {}) => {
  const requestId = error.response?.headers?.['x-rh-insights-request-id'];
  throw requestId ? { ...error.response, requestId } : { ...error.response };
};

// check identity before each request. If the token is expired it will log out user
axiosInstance.interceptors.request.use(async (config) => {
  await window.insights.chrome.auth.getUser();
  return config;
});
axiosInstance.interceptors.response.use(resolveInterceptor);
axiosInstance.interceptors.response.use(undefined, errorInterceptor);

export function getAxiosInstance() {
  return axiosInstance;
}

const grapqlInstance = axios.create();
grapqlInstance.interceptors.request.use(async (config) => {
  await window.insights.chrome.auth.getUser();
  return config;
});
/**
 * Graphql does not return error response when the qery fails.
 * Instead it returns 200 response with error object.
 * We catch it and throw it to trigger notification middleware
 */
grapqlInstance.interceptors.response.use(({ data }) => {
  if (data.errors) {
    console.log('There was an error in userLogin: ', data);
    throw {
      message: data.errors[0].errorType,
      data: data.errors[0].message
    };
  }

  return data;
});

export function getGraphqlInstance() {
  return grapqlInstance;
}
