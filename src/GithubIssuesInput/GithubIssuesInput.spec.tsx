import React from 'react';
import fetchMock from 'fetch-mock';
import { mount, ReactWrapper } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import GithubIssuesInput from './GithubIssuesInput';
import { SuggestionsBoxItem } from './styledComponents'

// Ideally, I would simulate the delay to save execution time in tests
const DEBOUNCE_DELAY = 300;
const FETCH_DELAY = 100;

const simulateUserTypes = (input: ReactWrapper, str: string) => {
  for(let i = 0; i < str.length; i++) {
    input.simulate('change', { target: { value: str.substring(0, i + 1) } });
  }
};

const regexpUnion = (array: string[]) => new RegExp(array.join('|'));
const sleep = (ms?: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('GithubIssuesInput', () => {
  let wrapper: ReactWrapper;
  let input: ReactWrapper;
  let onChange: sinon.SinonSpy;

  const issues = [
    { id: 1, title: 'Some issue 1' },
    { id: 2, title: 'Some other issue 2' },
    { id: 3, title: 'Another issue 3' },
  ];

  beforeEach(() => {
    fetchMock.mock(
      'https://api.github.com/search/issues?q=repo%3Afacebook%2Freact+is%3Aissue+someinput&per_page=5',
      { items: issues },
      { delay: FETCH_DELAY }
    );
    onChange = sinon.spy();
    wrapper = mount(<GithubIssuesInput onChange={onChange} />);
    input = wrapper.find('input');
    simulateUserTypes(input, 'someinput');
  });

  afterEach(() => fetchMock.reset());

  describe('when user types', () => {
    it('hits Github API once each 300ms and displays a list of suggestions for autocomplete', async () => {
      await sleep(DEBOUNCE_DELAY);

      expect(wrapper.text()).to.match(/loading/);

      await sleep(FETCH_DELAY);

      expect(wrapper.text()).to.match(regexpUnion(issues.map(i => i.title)));
      expect(fetchMock.calls().length).to.eq(1);
    });
  });

  describe('when user selects a suggestion using the keyboard', () => {
    it('closes the suggestions box and sets the input value', async () => {
      await sleep(DEBOUNCE_DELAY + FETCH_DELAY + 10);
      expect(wrapper.text()).to.match(regexpUnion(issues.map(i => i.title)));
      wrapper.simulate('keydown', { key: 'Enter' });
      expect(onChange).to.have.been.calledOnceWith(issues[0]);
      expect(wrapper.text()).not.to.match(regexpUnion(issues.map(i => i.title)));
    });
  });

  describe('when user selects a suggestion by clicking on it', () => {
    it('closes the suggestions box and sets the input value', async () => {
      await sleep(DEBOUNCE_DELAY + FETCH_DELAY + 100);
      wrapper.update();
      expect(wrapper.text()).to.match(regexpUnion(issues.map(i => i.title)));
      wrapper.find(SuggestionsBoxItem).at(1).simulate('click');
      expect(onChange).to.have.been.calledOnceWith(issues[1]);
      expect(wrapper.text()).not.to.match(regexpUnion(issues.map(i => i.title)));
    });
  });

  describe('when there are suggestions, and user types and hits enter', () => {
    it('selects the first suggestion', async () => {
      await sleep(DEBOUNCE_DELAY + FETCH_DELAY + 10);
      wrapper.simulate('keydown', { key: 'Enter' });
      expect(onChange).to.have.been.calledOnceWith(issues[0]);
    });
  });

  describe('when there are suggestions, and user hits down arrow and hits enter', () => {
    it('selects the second suggestion', async () => {
      await sleep(DEBOUNCE_DELAY + FETCH_DELAY + 10);
      wrapper.simulate('keydown', { key: 'ArrowDown' });
      wrapper.simulate('keydown', { key: 'Enter' });
      expect(onChange).to.have.been.calledOnceWith(issues[1]);
    });
  });

  describe('when there are suggestions, and user hits down arrow reaching the end and hits enter', () => {
    it('selects the last suggestion', async () => {
      await sleep(DEBOUNCE_DELAY + FETCH_DELAY + 10);
      wrapper.update();
      wrapper.simulate('keydown', { key: 'ArrowDown' });
      wrapper.simulate('keydown', { key: 'ArrowDown' });
      wrapper.simulate('keydown', { key: 'ArrowDown' });
      wrapper.simulate('keydown', { key: 'Enter' });
      expect(onChange).to.have.been.calledOnceWith(issues[2]);
    });
  });

  describe('when there are suggestions, and user hits up arrow hits enter', () => {
    it('selects the second suggestion', async () => {
      await sleep(DEBOUNCE_DELAY + FETCH_DELAY + 10);
      wrapper.update();
      wrapper.simulate('keydown', { key: 'ArrowDown' });
      wrapper.simulate('keydown', { key: 'ArrowDown' });
      wrapper.simulate('keydown', { key: 'ArrowUp' });
      wrapper.simulate('keydown', { key: 'Enter' });
      expect(onChange).to.have.been.calledOnceWith(issues[1]);
    });
  });

  describe('when there are suggestions, and user hits up arrow reaching the beggining and hits enter', () => {
    it('selects the first suggestion', async () => {
      await sleep(DEBOUNCE_DELAY + FETCH_DELAY + 10);
      wrapper.update();
      wrapper.simulate('keydown', { key: 'ArrowUp' });
      wrapper.simulate('keydown', { key: 'Enter' });
      expect(onChange).to.have.been.calledOnceWith(issues[0]);
    });
  });
});
