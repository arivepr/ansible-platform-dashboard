import { configure, mount, render, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';

configure({ adapter: new Adapter() });
React.useLayoutEffect = React.useEffect;

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.React = React;
