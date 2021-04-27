/* eslint camelcase: 0 */
import { getAxiosInstance } from '../shared/user-login';
import { CATALOG_API_BASE, SOURCES_API_BASE } from '../../utilities/constants';
import { defaultSettings } from '../shared/pagination';

const axiosInstance = getAxiosInstance();

const getOrderItems = (orderIds) =>
  axiosInstance.get(
    `${CATALOG_API_BASE}/order_items?limit=${
      orderIds.length * 3 || defaultSettings.limit
    }${orderIds.length ? '&' : ''}${orderIds
    .map((orderId) => `filter[order_id][]=${orderId}`)
    .join('&')}`
  );

const getOrderPortfolioItems = (itemIds) =>
  axiosInstance.get(
    `${CATALOG_API_BASE}/portfolio_items?${itemIds
    .map((itemId) => `filter[id][]=${itemId}`)
    .join('&')}`
  );

export const getOrders = () =>
  axiosInstance
  .get(
    `${CATALOG_API_BASE}/orders?&limit=2`
  ) // eslint-disable-line max-len
  .then((orders) =>
    getOrderItems(orders.data.map(({ id }) => id)).then((orderItems) =>
      getOrderPortfolioItems(
        orderItems.data.map(({ portfolio_item_id }) => portfolio_item_id)
      ).then((portfolioItems) => {
        return {
          portfolioItems,
          ...orders,
          data: orders.data.map((order) => ({
            ...order,
            orderItems: orderItems.data.filter(
              ({ order_id }) => order_id === order.id
            )
          }))
        };
      })
    )
  );

export const listPortfolios = () =>
  axiosInstance.get(
    `${CATALOG_API_BASE}/portfolios`);

export const getPortfolioItems = () =>
  axiosInstance.get(
    `${CATALOG_API_BASE}/portfolio_items`);

export const getPlatforms = () =>
  axiosInstance.get(
    `${SOURCES_API_BASE}/sources`);

export const listPortfolioItems = (
  limit = 1
) => {
  return axiosInstance
  .get(
    `${CATALOG_API_BASE}/portfolio_items?sort_by=id:desc&limit=${limit}`
  )
  .then(
    (portfolioItems) => {
      const portfolioReference = portfolioItems.data.reduce(
        (acc, curr, index) =>
          curr.portfolio_id
            ? {
              ...acc,
              [curr.portfolio_id]: acc[curr.portfolio_id]
                ? [ ...acc[curr.portfolio_id], index ]
                : [ index ]
            }
            : acc,
        {}
      );
      return axiosInstance
      .get(
        `${CATALOG_API_BASE}/portfolios?${Object.keys(portfolioReference)
        .map((id) => `filter[id][]=${id}`)
        .join('&')}`
      )
      .then(({ data }) => ({
        portfolioItems,
        portfolioReference,
        portfolios: data
      }));
    }
  )
  .then(({ portfolioItems, portfolioReference, portfolios }) => {
    portfolios.forEach(
      ({ id, name }) =>
        id &&
          portfolioReference[id] &&
          portfolioReference[id].forEach((portfolioItemIndex) => {
            portfolioItems.data[portfolioItemIndex].portfolioName = name;
          })
    );
    return portfolioItems;
  });
};
