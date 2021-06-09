/* eslint-disable react/prop-types */
import React from 'react';
import { Skeleton } from '@patternfly/react-core';
import { Divider, Flex, FlexItem } from '@patternfly/react-core';

const AppPlaceholder = () => {
  return (
    <React.Fragment>
      <Skeleton size="md" />
      <br />
      <Skeleton size="md" />
    </React.Fragment>
  );
};

export const IconPlaceholder = ({
  height
}) => (
  <svg height={ height } width={ height }>
    <circle cx={ height / 2 } cy={ height / 2 } r={ height / 2 } fill="#ecebeb" />
  </svg>
);

export const AppCardPlaceholder = () => (
  <Flex className="automation-hub_card" >
    <Flex>
      <Skeleton height="200px" width="90%"/>
    </Flex>
    <Divider/>
    <Flex>
      <Skeleton height="200px" width="90%"/>
    </Flex>
    <Divider/>
    <Skeleton height="200px" width="90%"/>
  </Flex>
);

export const AnalyticsCardPlaceholder = () => (
  <React.Fragment>
    <Flex direction={ { default: 'column' } }>
      <FlexItem>
        <Flex className="automation-analytics_card">
          <FlexItem>
            <Skeleton height="140px" width="90%" />
          </FlexItem>
          <Divider/>
          <FlexItem>
            <Skeleton height="140px" width="90%" />
          </FlexItem>
        </Flex>
      </FlexItem>
      <FlexItem>
        <FlexItem>
          <Skeleton height="140px" width="90%" />
        </FlexItem>
      </FlexItem>
    </Flex>
  </React.Fragment>);

export default AppPlaceholder;
