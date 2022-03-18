/* eslint-disable max-len */
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import DownloadIcon from '@patternfly/react-icons/dist/js/icons/download-icon';
import BreakIcon, { ClockIcon } from '@patternfly/react-icons/dist/js/icons/clock-icon';

import DashboardHeader from '../shared/dashboard-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  PageSection,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextList,
  TextListItem,
  Title
} from '@patternfly/react-core';

import messages from '../../messages/messages';
import trialMessages from '../../messages/trial.messages';

const Link = ({ link, children }) => <Text component="a" href={ link } target="_blank" rel="noopener noreferrer">{ children }</Text>;

Link.propTypes = {
  link: PropTypes.string,
  children: PropTypes.node
};

const Overview = () => {
  const [activeFaq, openFaq] = useState();
  const intl = useIntl();

  const onClick = (index) => () => activeFaq === index ? openFaq(undefined) : openFaq(index);

  const createAccordionItem = (index, values) => (<AccordionItem>
    <AccordionToggle
      isExpanded={ activeFaq === index }
      onClick={ onClick(index) }
    >
      { intl.formatMessage(trialMessages[`faq${index}a`]) }
    </AccordionToggle>
    <AccordionContent
      isHidden={ activeFaq !== index }
    >
      <TextContent>
        { intl.formatMessage(trialMessages[`faq${index}b`], values) }
      </TextContent>
    </AccordionContent>
  </AccordionItem>);

  return <React.Fragment>
    <DashboardHeader title={ intl.formatMessage(messages.overview) }
      description={ '' }/>
    <PageSection>
      <Stack hasGutter="md">
        <StackItem>
          <Title headingLevel="h1" size="3xl">
            { intl.formatMessage(trialMessages.header) }
          </Title>
          <TextContent>
            <Text>
              { intl.formatMessage(trialMessages.description) }
            </Text>
          </TextContent>
          <Button>
            { intl.formatMessage(trialMessages.startButton) }
          </Button>
        </StackItem>
        <StackItem>
          <Card>
            <CardTitle>
              { intl.formatMessage(trialMessages.adCardHeader) }
            </CardTitle>
            <CardBody>
              <Stack hasGutter>
                { intl.formatMessage(trialMessages.adCardContent, {
                  a: (chunks) => <Link link="http://console.redhat.com/">{ chunks }</Link>,
                  li: (chunks) => <StackItem>
                    <div className='pf-u-display-flex'>
                      <div>
                        <CheckCircleIcon className="pf-u-mr-lg" size='lg' color='var(--pf-global--success-color--100)'/>
                      </div>
                      <div style={ { flexGrow: 1, alignSelf: 'center' } }>
                        <Text>{ chunks }</Text>
                      </div>
                    </div>
                  </StackItem>
                }) }
              </Stack>
            </CardBody>
            <CardFooter>
              <TextContent>
                <Text component='small'>
                  { intl.formatMessage(trialMessages.adCardFooter, {
                    a: (chunks) => <Link link="https://www.redhat.com/en/about/agreements">{ chunks }</Link>
                  }) }
                </Text>
              </TextContent>
            </CardFooter>
          </Card>
        </StackItem>
        <StackItem>
          <Card>
            <CardTitle>
              { intl.formatMessage(trialMessages.reqCardHeader) }
            </CardTitle>
            <CardBody>
              <Stack>
                <StackItem>
                  <div className='pf-u-display-flex'>
                    <div>
                      <DownloadIcon className="pf-u-mr-lg" size='xl'/>
                    </div>
                    <div style={ { flexGrow: 1, alignSelf: 'center' } }>
                      <TextContent>
                        <Title headingLevel="h2" size="lg">
                          { intl.formatMessage(trialMessages.reqCardRHELTitle) }
                        </Title>
                        { intl.formatMessage(trialMessages.reqCardRHELContent, {
                          a: (chunks) => <Link link="https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-connect/auth?client_id=rh-product-eval&redirect_uri=https%3A%2F%2Fwww.redhat.com%2Fen%2Ftechnologies%2Flinux-platforms%2Fenterprise-linux%2Ftry-it%2Fsuccess-server&state=efc13e3d-8e01-463c-8f03-892932906f8e&response_mode=fragment&response_type=code&scope=openid&nonce=6448c8c6-364f-485b-841f-4fc9f2d19494">{ chunks }</Link>,
                          a1: (chunks) => <Link link="https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/performing_a_standard_rhel_installation/index">{ chunks }</Link>
                        }) }
                      </TextContent>
                    </div>
                  </div>
                </StackItem>
                <StackItem>
                  <div className='pf-u-display-flex'>
                    <div>
                      <ClockIcon className="pf-u-mr-lg" size='xl' />
                    </div>
                    <div style={ { flexGrow: 1, alignSelf: 'center' } }>
                      <TextContent>
                        <Title headingLevel="h2" size="lg">
                          { intl.formatMessage(trialMessages.reqCardBreakTitle) }
                        </Title>
                        { intl.formatMessage(trialMessages.reqCardBreakContent, {
                          a: (chunks) => <Link link="https://cloud.redhat.com/ansible/automation-hub">{ chunks }</Link>
                        }) }
                      </TextContent>
                    </div>
                  </div>
                </StackItem>
              </Stack>
            </CardBody>
          </Card>
        </StackItem>
        <StackItem>
          <Card>
            <CardTitle>
              { intl.formatMessage(trialMessages.faqTitle) }
            </CardTitle>
          </Card>
          <Accordion isBordered displaySize="large">
            { createAccordionItem(1, {
              a: (chunks) => <Link link="https://access.redhat.com/">{ chunks }</Link>
            }) }
            { createAccordionItem(2) }
            { createAccordionItem(3, {
              p: (chunks) => <Text>{ chunks }</Text>,
              ul: (chunks) => <TextList >{ chunks }</TextList>,
              li: (chunks) => <TextListItem >{ chunks }</TextListItem>,
              a: (chunks) => <Link link="https://access.redhat.com/documentation/en-US/">{ chunks }</Link>,
              a1: (chunks) => <Link link="https://access.redhat.com/search/#/">{ chunks }</Link>
            }) }
            { createAccordionItem(4) }
            { createAccordionItem(5) }
            { createAccordionItem(6, {
              a: (chunks) => <Link link="https://access.redhat.com/downloads/">{ chunks }</Link>,
              a1: (chunks) => <Link link="http://www.redhat.com/en/about/contact/sales">{ chunks }</Link>
            }) }
            { createAccordionItem(7, {
              p: (chunks) => <Text>{ chunks }</Text>,
              ol: (chunks) => <TextList component='ol'>{ chunks }</TextList>,
              li: (chunks) => <TextListItem >{ chunks }</TextListItem>,
              a: (chunks) => <Link link="http://www.redhat.com/en/about/contact/sales">{ chunks }</Link>
            }) }
            { createAccordionItem(8, {
              a: (chunks) => <Link link="http://www.redhat.com/en/about/contact/sales">{ chunks }</Link>
            }) }
            { createAccordionItem(9, {
              ul: (chunks) => <TextList >{ chunks }</TextList>,
              li: (chunks) => <TextListItem >{ chunks }</TextListItem>,
              a: (chunks) => <Link link="http://www.redhat.com/en/about/contact/sales">{ chunks }</Link>
            }) }
          </Accordion>
        </StackItem>
        <StackItem>
          <Title headingLevel="h6" size="md">
            { intl.formatMessage(trialMessages.footerTitle) }
          </Title>
          <TextContent>
            { intl.formatMessage(trialMessages.footerContent, {
              p: (chunks) => <Text>{ chunks }</Text>,
              ul: (chunks) => <TextList >{ chunks }</TextList>,
              li: (chunks) => <TextListItem >{ chunks }</TextListItem>
            }) }
          </TextContent>
        </StackItem>
      </Stack>
    </PageSection>
  </React.Fragment>;
};

export default Overview;
