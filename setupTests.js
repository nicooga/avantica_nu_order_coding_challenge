import chai from 'chai';
import sinonChai from 'sinon-chai';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JSDOM } from 'jsdom';
import fetchPonyfill from 'fetch-ponyfill';

chai.use(sinonChai);
Enzyme.configure({ adapter: new Adapter() });

// https://enzymejs.github.io/enzyme/docs/guides/jsdom.html#using-enzyme-with-jsdom
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

const copyProps = (src, target) =>
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });

global.window = window;
global.document = window.document;
global.navigator = { userAgent: 'node.js', };
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = clearTimeout;

const {fetch, Request, Response, Headers} = fetchPonyfill();

global.fetch = fetch;
global.Request = Request;
global.Response = Response;
global.Headers = Headers;

copyProps(window, global);
