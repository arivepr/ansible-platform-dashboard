import * as ActionTypes from '../action-types';
import * as AnalyticsHelper from '../../helpers/analytics/analytics-helper';

const setAnalyticsAvailability = (dispatch, value = true) => {
  return dispatch({
    type: ActionTypes.SET_ANALYTICS_AVAILABILITY,
    payload: value
  });
};

const setAnalyticsError = (dispatch, value = true) => {
  return dispatch({
    type: ActionTypes.SET_ANALYTICS_ERROR,
    payload: value
  });
};

export const fetchClusters = () => (dispatch) => {
  return dispatch({
    type: ActionTypes.FETCH_CLUSTERS,
    payload: AnalyticsHelper.getClusters().catch((err) => {
      if (err.status === 404) {
        setAnalyticsAvailability(dispatch, false);
      }
      else {
        setAnalyticsError(dispatch, true);
      }}
    )
  });
};

export const fetchWarningNotifications = () => (dispatch) => {
  return dispatch({
    type: ActionTypes.FETCH_WARNING_NOTIFICATIONS,
    payload: AnalyticsHelper.getNotifications('warning').catch((err) => {
      if (err.status === 404) {
        setAnalyticsAvailability(dispatch, false);
      }
      else {
        setAnalyticsError(dispatch, true);
      }}
    )
  });
};

export const fetchErrorNotifications = () => (dispatch) => {
  const load = AnalyticsHelper.getNotifications('error').catch((err) => {
    console.log('Testing error in fetchErrorNotifications: ', err);
    if (err.status === 404) {
      setAnalyticsAvailability(dispatch, false);
    }
    else {
      setAnalyticsError(dispatch, true);
    }}
  );
  return dispatch({
    type: ActionTypes.FETCH_ERROR_NOTIFICATIONS,
    payload: load
  });
};

export const fetchJobsData = () => (dispatch) => {
  return dispatch({
    type: ActionTypes.FETCH_JOBS,
    payload: AnalyticsHelper.getJobsData().catch((err) => {
      if (err.status === 404) {
        setAnalyticsAvailability(dispatch, false);
      }
      else {
        setAnalyticsError(dispatch, true);
      }}
    )
  });
};
