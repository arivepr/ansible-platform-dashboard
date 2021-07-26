import React, { Fragment, useContext, useEffect, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Bullseye,
  Button,
  Card,
  CardBody,
  CardTitle, Divider,
  Flex,
  FlexItem,
  Grid,
  GridItem, Label, Level, LevelItem,
  Spinner,
  Stack,
  StackItem,
  Text, TextContent, TextVariants,
  Title, Popover
} from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components/Section';
import { useIntl } from 'react-intl';
import messages from '../../messages/messages';
import { fetchCollection, fetchCollections, fetchPartners, fetchSyncCollections } from '../../redux/actions/hub-actions';
import UserContext from '../../user-context';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/js/icons/external-link-alt-icon';
import { contentCounts } from './content-counts';
import { Logo } from './logo';
import { release } from '../../utilities/app-history';
import ErrorCard from '../shared/error-card';
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/js/icons/outlined-question-circle-icon';

const initialState = {
  isFetching: true
};

const hubState = (state, action) => {
  switch (action.type) {
    case 'setFetching':
      return { ...state, isFetching: action.payload };
    default:
      return state;
  }
};

const HubCard = () => {
  const [{ isFetching }, stateDispatch ] = useReducer(hubState, initialState);

  const { isError, collection, collections, syncCollections, partners } = useSelector(
    ({
      hubReducer: {
        isError,
        collection,
        collections,
        syncCollections,
        partners
      }
    }) => ({ isError, collection, collections, syncCollections, partners })
  );

  const {
    userIdentity
  } = useContext(UserContext);

  const dispatch = useDispatch();
  const intl = useIntl();

  useEffect(() => {
    stateDispatch({ type: 'setFetching', payload: true });
    Promise.all([ dispatch(fetchCollections()), dispatch(fetchPartners()), dispatch(fetchSyncCollections(userIdentity?.identity?.account_number)) ])
    .then(() => stateDispatch({ type: 'setFetching', payload: false }));
  }, []);

  useEffect(() => {
    if (collections?.meta?.count > 0) {
      const d = new Date();
      const day = d.getDate();
      const count = collections?.meta?.count;
      stateDispatch({ type: 'setFetching', payload: true });
      dispatch(fetchCollection(count <= day ? count - 1 : day - 1)).then(() =>
        stateDispatch({ type: 'setFetching', payload: false }));
    }
  }, [ collections ]);

  const renderHubInfo = () => (
    <React.Fragment>
      <TextContent>
        <Text>
          { intl.formatMessage(messages.hubCardDescription) } <br/><br/>
        </Text>
      </TextContent>
      <Flex>
        <Flex direction={ { default: 'column' } } className="pf-u-m-0 pf-u-pr-sm">
          <FlexItem align={ { default: 'alignRight' } } className="pf-u-mb-sm pf-u-mt-md">
            <TextContent>
              <Text component={ TextVariants.h1 }>
                { partners?.meta?.count }
              </Text>
            </TextContent>
          </FlexItem>
          <FlexItem align={ { default: 'alignRight' } } className="pf-u-mb-sm pf-u-mt-md">
            <TextContent>
              <Text component={ TextVariants.h1 }>
                { collections?.meta?.count }
              </Text>
            </TextContent>
          </FlexItem>
          <FlexItem align={ { default: 'alignRight' } } className="pf-u-mb-sm pf-u-mt-md">
            <TextContent>
              <Text component={ TextVariants.h1 }>
                { syncCollections?.meta?.count }
              </Text>
            </TextContent>
          </FlexItem>
        </Flex>
        <Flex direction={ { default: 'column' } }>
          <FlexItem>
            <Button
              component='a'
              variant='link'
              href={ `${release}ansible/automation-hub/partners` }>
              { intl.formatMessage(messages.partners) }
            </Button>
          </FlexItem>
          <FlexItem>
            <Button
              component='a'
              variant='link'
              href={ `${release}ansible/automation-hub` }>
              { intl.formatMessage(messages.collections) }
            </Button>
          </FlexItem>
          <FlexItem>
            <Level hasGutter className="pf-u-pl-md pf-u-pt-sm">
              <LevelItem style={ { marginRight: 8 } }>
                { intl.formatMessage(messages.syncCollections) }
              </LevelItem>
              <LevelItem>
                <Popover
                  headerContent={ <div>{ intl.formatMessage(messages.syncCollections) }</div> }
                  bodyContent={ <div>{ intl.formatMessage(messages.syncCollectionsTooltip) }</div> }
                >
                  <Button variant="link" style={ { padding: 0 } } icon={ <OutlinedQuestionCircleIcon /> }/>
                </Popover>
              </LevelItem>
            </Level>
          </FlexItem>
        </Flex>
      </Flex>
    </React.Fragment>
  );

  const filterContents = (contents) => {
    if (contents) {
      return contents.filter(
        item => !['doc_fragments', 'module_utils'].includes(item.content_type)
      );
    }

    return contents;
  };

  const renderHubFeaturedCollection = () => {
    const featuredCollection = collection?.data ? collection?.data[0] : null;
    const content = featuredCollection ? contentCounts(
      filterContents(featuredCollection?.latest_version?.metadata?.contents)
    ) : undefined;
    return (
      <Flex direction={ { default: 'column' } } alignSelf={ { default: 'alignSelfStretch' } }>
        <Title headingLevel="h4">
          { intl.formatMessage(messages.hubCardFeaturedCollectionTitle) }
        </Title>
        <br/>
        {  featuredCollection &&
        <Flex direction={ { default: 'column' } }>
          <FlexItem>
            <Level hasGutter="sm">
              <LevelItem>
                <Logo
                  alt={ featuredCollection?.namespace?.company + ' logo' }
                  image={ featuredCollection?.namespace?.avatar_url }
                  size='50px'
                />
              </LevelItem>
              <LevelItem>
                <Label>Certified</Label>
              </LevelItem>
            </Level>
          </FlexItem>
          <FlexItem>
            <Button
              component='a'
              variant='link'
              className="pf-u-p-0"
              href={ `${release}ansible/automation-hub/repo/published/${featuredCollection?.namespace?.name}/` +
                  `${featuredCollection?.latest_version?.name || featuredCollection?.name}` }>
              { featuredCollection?.latest_version?.name || featuredCollection?.name }
            </Button>
            <TextContent>
              <Text component={ TextVariants.small }> Provided by { featuredCollection?.namespace?.company
                  || featuredCollection?.namespace?.name }</Text>
            </TextContent>
          </FlexItem>
          <FlexItem>
            <TextContent>
              <Text component={ TextVariants.p }>
                { featuredCollection?.latest_version?.metadata?.description }
              </Text>
            </TextContent>
          </FlexItem>
          <FlexItem>
            <Grid hasGutter="md" >
              <GridItem id={ 'collectionModuleCount' } span="4">
                { content?.contents?.module || '0' }
              </GridItem>
              <GridItem id={ 'collectionRoleCount' } span="4">
                { content?.contents?.role || 0 }
              </GridItem>
              <GridItem id={ 'collectionPluginCount' } span="4">
                { content?.contents?.plugin || 0 }
              </GridItem>
              <GridItem span="4">
                <TextContent>
                  <Text component={ TextVariants.p }>
                    { intl.formatMessage(messages.modules) }
                  </Text>
                </TextContent>
              </GridItem>
              <GridItem span="4">
                <TextContent>
                  <Text component={ TextVariants.p }>
                    { intl.formatMessage(messages.roles) }
                  </Text>
                </TextContent>
              </GridItem>
              <GridItem span="4">
                <TextContent>
                  <Text component={ TextVariants.p }>
                    { intl.formatMessage(messages.plugins) }
                  </Text>
                </TextContent>
              </GridItem>
            </Grid>
          </FlexItem>
        </Flex> }
      </Flex>);
  };

  const renderHubOther = () => {
    return (
      <Flex direction={ { default: 'column' } }
        justifyContent={ { default: 'justifyContentSpaceBetween' } }
        alignSelf={ { default: 'alignSelfStretch' } }>
        <FlexItem>
          <Stack hasGutter="sm">
            <StackItem>
              <Title headingLevel="h4">
                { intl.formatMessage(messages.hubCardCertifiedCollectionTitle) }
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={ TextVariants.p }>
                  { intl.formatMessage(messages.hubCardCertifiedCollectionDescription) }
                </Text>
              </TextContent>
            </StackItem>
          </Stack>
        </FlexItem>
        <FlexItem>
          <Bullseye>
            <Button
              component='a'
              variant='link'
              target="_blank"
              rel="noopener noreferrer"
              href={ `https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/1.2/html` +
              `/managing_red_hat_certified_and_ansible_galaxy_collections_in_automation_hub/index` }>
              { intl.formatMessage(messages.learnMoreButton) }&nbsp;
              <ExternalLinkAltIcon />
            </Button>
          </Bullseye>
        </FlexItem>
      </Flex>);
  };

  const renderHubCards = () => {
    if (isError) {
      return <ErrorCard/>;
    }

    if (isFetching) {
      return (
        <Section style={ { backgroundColor: 'white', minHeight: '100%' } }>
          <Bullseye>
            <Spinner isSVG />
          </Bullseye>
        </Section>
      );
    }
    else {
      return (
        <Flex className="automation-hub_card" >
          <Flex>
            { renderHubInfo() }
          </Flex>
          <Divider/>
          { renderHubFeaturedCollection() }
          <Divider/>
          { renderHubOther() }
        </Flex>
      );
    }
  };

  return (
    <Fragment>
      <Card className='ins-c-dashboard__card'>
        <CardTitle>
          <Title headingLevel="h3">
            { intl.formatMessage(messages.hubTitle) }
          </Title>
        </CardTitle>
        <CardBody>
          { renderHubCards() }
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default HubCard;
