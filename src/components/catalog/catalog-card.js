import React, { Fragment, useContext, useEffect, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Badge,
  Bullseye,
  Button,
  Card,
  CardBody,
  CardTitle, Divider,
  Flex,
  FlexItem,
  Label,
  Spinner,
  Text, TextContent, TextVariants,
  Title
} from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components/Section';
import { useIntl } from 'react-intl';
import messages from '../../messages/messages';
import {
  fetchOrders, fetchPlatforms,
  fetchPortfolioItems,
  fetchPortfolios
} from '../../redux/actions/catalog-actions';
import UserContext from '../../user-context';
import { release } from '../../utilities/app-history';
import { CATALOG_API_BASE } from '../../utilities/constants';
import CardIcon from '../shared/card-icon';
import orderStatusMapper from '../shared/order-status-mapper';
import { TimeAgo } from '../../helpers/shared/helpers';
import ErrorCard from '../shared/error-card';
import ConfigureCatalogCard from './configure-catalog_card';

const initialState = {
  isFetching: true
};

const catalogState = (state, action) => {
  switch (action.type) {
    case 'setFetching':
      return { ...state, isFetching: action.payload };
    default:
      return state;
  }
};

const CatalogCard = () => {
  const [{ isFetching }, stateDispatch ] = useReducer(catalogState, initialState);

  const { isCatalogAvailable, isError, portfolioItems, portfolios, sources, orders } = useSelector(
    ({
      catalogReducer: {
        isCatalogAvailable,
        isError,
        portfolioItems,
        portfolios,
        sources,
        orders
      }
    }) => ({ isCatalogAvailable, isError, portfolioItems, portfolios, sources, orders })
  );

  const {
    permissions
  } = useContext(UserContext);

  const dispatch = useDispatch();
  const intl = useIntl();

  const isCatalogAdmin = permissions.find((permission) => permission.permission === 'catalog:portfolios:create');

  useEffect(() => {
    stateDispatch({ type: 'setFetching', payload: true });
    const promiseList = [ fetchPortfolioItems, fetchPortfolios, fetchOrders ];
    if (isCatalogAdmin) {
      promiseList.push(fetchPlatforms);
    }

    return Promise.all(promiseList.map(fn => dispatch(fn()))).then(() => stateDispatch({ type: 'setFetching', payload: false }));
  }, []);

  const renderCatalogInfo = () => (
    <React.Fragment>
      <TextContent>
        <Text>
          { intl.formatMessage(messages.catalogCardDescription) } <br/><br/>
        </Text>
      </TextContent>
      <Flex>
        <Flex direction={ { default: 'column' } } className="pf-u-m-0 pf-u-pr-sm">
          <FlexItem align={ { default: 'alignRight' } } className="pf-u-mb-sm pf-u-mt-md">
            <TextContent>
              <Text component={ TextVariants.h1 }>
                { portfolioItems?.meta?.count }
              </Text>
            </TextContent>
          </FlexItem>
          <FlexItem align={ { default: 'alignRight' } } className="pf-u-mb-sm pf-u-mt-md">
            <TextContent>
              <Text component={ TextVariants.h1 }>
                { portfolios?.meta?.count }
              </Text>
            </TextContent>
          </FlexItem>
          { isCatalogAdmin &&
          <FlexItem align={ { default: 'alignRight' } } className="pf-u-mb-sm pf-u-mt-md">
            <TextContent>
              <Text component={ TextVariants.h1 }>
                { sources?.length }
              </Text>
            </TextContent>
          </FlexItem> }
        </Flex>
        <Flex direction={ { default: 'column' } }>
          <FlexItem>
            <Button
              component='a'
              variant='link'
              href={ `${release}ansible/catalog/products` }>
              { intl.formatMessage(messages.products) }
            </Button>
          </FlexItem>
          <FlexItem>
            <Button
              component='a'
              variant='link'
              href={ `${release}ansible/catalog/portfolios` }>
              { intl.formatMessage(messages.portfolios) }
            </Button>
          </FlexItem>
          { isCatalogAdmin &&
            <FlexItem>
              <Button variant='link'
                component='a'
                href={ `${release}ansible/catalog/platforms` }>
                { intl.formatMessage(messages.platforms) }
              </Button>
            </FlexItem>
          }
        </Flex>
      </Flex>
    </React.Fragment>
  );

  const renderCatalogFeaturedProduct = () => {
    const featuredProduct = portfolioItems?.data ? portfolioItems?.data[0] : null;
    return (
      <Flex direction={ { default: 'column' } } alignSelf={ { default: 'alignSelfStretch' } }>
        <Title headingLevel="h4">
          { intl.formatMessage(messages.catalogCardFeaturedProduct) }
        </Title>
        <br/>
        {  featuredProduct &&
          <Flex direction={ { default: 'column' } }>
            <FlexItem>
              <CardIcon
                height={ 40 }
                src={ `${CATALOG_API_BASE}/portfolio_items/${featuredProduct.id}/icon` }
              />
            </FlexItem>
            <FlexItem>
              <Button
                className="pf-u-pl-0 pf-u-pt-0"
                component='a'
                variant='link'
                href={ `${release}ansible/catalog/portfolio/portfolio-item?portfolio=${featuredProduct?.portfolio_id}` +
                `&portfolio-item=${featuredProduct.id}&source=${featuredProduct.service_offering_source_ref}` }>
                { featuredProduct?.name }
              </Button>
            </FlexItem>
            <FlexItem>
              <TextContent>
                <Text component={ TextVariants.p }>
                  { featuredProduct?.description }
                </Text>
              </TextContent>
            </FlexItem>
          </Flex>
        }
      </Flex>);
  };

  const orderRow = (order) => {
    return (
      <Flex  direction={ { default: 'column' } }>
        <Flex className="pf-u-mb-0 pf-u-mt-md">
          <FlexItem >
            <Button
              className="pf-u-pl-0 pf-u-pt-0"
              component='a'
              variant='link'
              href={ `${release}ansible/catalog/orders/order?order=${order?.id}` }>
              { order?.id }
            </Button>
          </FlexItem>
          <FlexItem>
            <TextContent>
              <Text component={ TextVariants.p }>
                { order?.orderItems[0]?.name }
              </Text>
            </TextContent>
          </FlexItem>
          <FlexItem align={ { default: 'alignRight' } }>
            <Label { ...orderStatusMapper[order?.state] } variant="outline">
              { order?.state }
            </Label>
          </FlexItem>
        </Flex>
        <Flex>
          <FlexItem>
            <TextContent>
              <Text component={ TextVariants.small }>Last updated &nbsp;
                <TimeAgo date={ order?.created_at }/>
              </Text>
            </TextContent>
          </FlexItem>
        </Flex>
      </Flex>);
  };

  const emptyOrdersList = () => (<Flex direction={ { default: 'column' } }>
    <FlexItem alignSelf={ { default: 'alignSelfCenter' } }>
      <TextContent>
        <Text component={ TextVariants.h6 }>
          { intl.formatMessage(messages.noOrdersTitle) }
        </Text>
      </TextContent>
    </FlexItem>
    <FlexItem  alignSelf={ { default: 'alignSelfCenter' } }>
      <TextContent>
        <Text component={ TextVariants.small }>
          { intl.formatMessage(messages.noOrdersDescription) }
        </Text>
      </TextContent>
    </FlexItem>
  </Flex>);

  const emptyOrderCard = () => (
    <Flex direction={ { default: 'column' } }>
      <FlexItem>
        <Flex>
          <FlexItem>
            <Title headingLevel="h4">
              { intl.formatMessage(messages.catalogCardLatestOrdersTitle) }
            </Title>
          </FlexItem>
        </Flex>
      </FlexItem>
      { emptyOrdersList() }
    </Flex>);

  const renderCatalogOther = () => (!(orders?.meta?.count > 0) ? emptyOrderCard() :
    <Flex direction={ { default: 'column' } }
      justifyContent={ { default: 'justifyContentSpaceBetween' } }
      alignSelf={ { default: 'alignSelfStretch' } }>
      <FlexItem>
        <Flex>
          <FlexItem>
            <Title headingLevel="h4">
              { intl.formatMessage(messages.catalogCardLatestOrdersTitle) }
            </Title>
          </FlexItem>
          <FlexItem>
            <Badge isRead>{ orders?.meta?.count }</Badge>
          </FlexItem>
        </Flex>
      </FlexItem>
      { orders?.data?.map((order) => (
        orderRow(order)
      )) }
      <FlexItem>
        <Bullseye>
          <Button
            component='a'
            variant='link'
            href={ `${release}ansible/catalog/orders` }>
            { intl.formatMessage(messages.viewMore) }&nbsp;
          </Button>
        </Bullseye>
      </FlexItem>
    </Flex>
  );

  const renderCatalogCards = () => {
    if (!isCatalogAvailable) {
      return <ConfigureCatalogCard/>;
    }

    if (isError) {
      return <ErrorCard/>;
    }
    else if (isFetching) {
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
            { renderCatalogInfo() }
          </Flex>
          <Divider/>
          <Flex>
            { renderCatalogFeaturedProduct() }
          </Flex>
          <Divider/>
          { renderCatalogOther() }
        </Flex>
      );
    }
  };

  return (
    <Fragment>
      <Card className='ins-c-dashboard__card'>
        <CardTitle>
          <Title headingLevel="h3">
            { intl.formatMessage(messages.catalogTitle) }
          </Title>
        </CardTitle>
        <CardBody>
          { renderCatalogCards() }
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default CatalogCard;
