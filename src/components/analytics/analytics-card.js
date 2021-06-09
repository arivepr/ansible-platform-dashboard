import React, { Fragment, useEffect, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Bullseye,
  Card,
  CardBody,
  CardTitle, Divider,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Label,
  Text,
  Title, Button
} from '@patternfly/react-core';
import { useIntl } from 'react-intl';
import messages from '../../messages/messages';
import { fetchClusters, fetchErrorNotifications, fetchWarningNotifications, fetchJobsData } from '../../redux/actions/analytics-actions';
import InfoCircleIcon from '@patternfly/react-icons/dist/js/icons/info-circle-icon';
import WarningTriangleIcon from '@patternfly/react-icons/dist/js/icons/warning-triangle-icon';
import JobsChart from './jobs-chart';
import { release } from '../../utilities/app-history';
import ConfigureAnalyticsCard from './configure-analytics-card';
import ErrorCard from '../shared/error-card';
import { AnalyticsCardPlaceholder } from '../shared/loader-placeholders';

const initialState = {
  isFetching: true
};

const analyticsState = (state, action) => {
  switch (action.type) {
    case 'setFetching':
      return { ...state, isFetching: action.payload };
    default:
      return state;
  }
};

const AnalyticsCard = () => {
  const [{ isFetching }, stateDispatch ] = useReducer(analyticsState, initialState);

  const { isAnalyticsAvailable, isError, clusters, errorNotifications, warningNotifications, jobsData } = useSelector(
    ({
      analyticsReducer: {
        isAnalyticsAvailable,
        isError,
        clusters,
        errorNotifications,
        warningNotifications,
        jobsData
      }
    }) => ({ isAnalyticsAvailable, isError, clusters, errorNotifications, warningNotifications, jobsData })
  );

  const dispatch = useDispatch();
  const intl = useIntl();

  useEffect(() => {
    stateDispatch({ type: 'setFetching', payload: true });
    Promise.all([ dispatch(fetchClusters()), dispatch(fetchErrorNotifications()), dispatch(fetchWarningNotifications()), dispatch(fetchJobsData()) ])
    .then(() => stateDispatch({ type: 'setFetching', payload: false }));
  }, []);

  const renderAnalyticsNotifications = () => {
    return <React.Fragment>
      <Title headingLevel="h4">
        { intl.formatMessage(messages.analyticsCardNotificationsTitle) }
      </Title>
      <br/>
      <DescriptionList className="pf-c-description-list.pf-m-vertical" columnModifier={ {
        default: '2Col'
      } }>
        <DescriptionListGroup>
          <DescriptionListTerm>
            { errorNotifications?.payload?.meta?.count || 0 }
          </DescriptionListTerm>
          <DescriptionListDescription>
            <Label
              color="red"
              icon={ <InfoCircleIcon/> }
              isTruncated
              href={ `${release}ansible/automation-analytics/notifications` }
            >
              { intl.formatMessage(messages.critical) }
            </Label>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>
            { warningNotifications?.payload?.meta?.count || 0 }
          </DescriptionListTerm>
          <DescriptionListDescription>
            <Label
              color="orange"
              icon={ <WarningTriangleIcon/> }
              isTruncated
              href={ `${release}ansible/automation-analytics/notifications` }
            >
              { intl.formatMessage(messages.warning) }
            </Label>
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </React.Fragment>;
  };

  const renderAnalyticsInfo = () => {
    return (
      <Fragment>
        <Flex className="automation-analytics_info">
          <FlexItem>
            <Text>
              { intl.formatMessage(messages.hubCardDescription) }
            </Text>
            <br/>
          </FlexItem>
          <FlexItem>
            <Title headingLevel="h4">
              { intl.formatMessage(messages.clusterTitle) }
            </Title>
            <br/>
            <DescriptionList className="pf-c-description-list.pf-m-vertical" columnModifier={ {
              default: '1Col'
            } }>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  { clusters?.payload?.templates?.length || 0 }
                </DescriptionListTerm>
                <DescriptionListDescription>
                  <Button
                    component='a'
                    variant='link'
                    href={ `${release}ansible/insights/clusters` }>
                    { intl.formatMessage(messages.totalClusters) }
                  </Button>
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </FlexItem>
        </Flex>
      </Fragment>);
  };

  const renderAnalyticsOther = () =>
    <Fragment>
      <Title headingLevel="h4">
        { intl.formatMessage(messages.analyticsJobTitle) }
      </Title>
      <br/>
      <Flex direction={ { default: 'column' } }>
        <FlexItem className="pf-u-m-0">
          <JobsChart items={ jobsData?.payload?.items }/>
        </FlexItem>
        <FlexItem className="pf-u-m-0 pf-u-pt-0 pf-u-pb-0 pf-u-pl-lg" >
          <Bullseye>
            <Button
              component='a'
              variant='link'
              href={ `${release}ansible/insights/job-explorer` }>
              { intl.formatMessage(messages.jobsExplorer) }
            </Button>
          </Bullseye>
        </FlexItem>
      </Flex>
    </Fragment>;

  const renderAnalyticsCards = () => {
    if (isError) {
      return <ErrorCard/>;
    }
    else if (isFetching) {
      return (<AnalyticsCardPlaceholder/>);
    }
    else {
      return (
        <Flex direction={ { default: 'column' } }>
          <FlexItem>
            <Flex className="automation-analytics_card">
              <FlexItem>
                { renderAnalyticsInfo() }
              </FlexItem>
              <Divider/>
              <FlexItem>
                { renderAnalyticsNotifications() }
              </FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem>
            <FlexItem>
              { renderAnalyticsOther() }
            </FlexItem>
          </FlexItem>
        </Flex>
      );
    }
  };

  return (
    !isAnalyticsAvailable ?
      <ConfigureAnalyticsCard/> :
      <Fragment>
        <Card className='ins-c-dashboard__card'>
          <CardTitle>
            <Title headingLevel="h3">
              { intl.formatMessage(messages.analyticsTitle) }
            </Title>
          </CardTitle>
          <CardBody className="pf-u-pb-sm">
            { renderAnalyticsCards() }
          </CardBody>
        </Card>
      </Fragment>
  );
};

export default AnalyticsCard;
