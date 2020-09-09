import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';

import { Root, SuggestionsBox, SuggestionsBoxItem, Input } from './styledComponents';
import doFetchIssues from './fetchIssues';

type Props = {
  onChange: (issue: Issue) => void
};

const FETCH_DELAY = 300;

const GithubIssuesInput = ({ onChange: externalOnChange }: Props) => {
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<Issue[]>([]);
  const [focusedSuggestion, setFocusedSuggestion] = useState<number>();

  const fetchIssues = useCallback(
    debounce(
      async (filter: string) => {
        setLoading(true);

        try {
          const suggestions = await doFetchIssues(filter);
          setSuggestions(suggestions);
          setFocusedSuggestion(0);
        } finally {
          setLoading(false);
        }
      },
      FETCH_DELAY
    ),
    [setSuggestions, setFocusedSuggestion, setLoading]
  );

  const onChange = useCallback(ev => {
    const value = ev.target.value;
    setValue(value);
    fetchIssues(value);
  }, [])

  const selectSuggestion = useCallback((issue: Issue) => {
    externalOnChange(issue);
    setFocusedSuggestion(0);
    setSuggestions([]);
    setValue(`[${issue.id}] ${issue.title}`);
  }, [setSuggestions, setFocusedSuggestion, externalOnChange]);

  const onKeyDown = useCallback(ev => {
    const key = ev.key;

    if (focusedSuggestion === undefined) {
      return;
    }

    if (key === 'ArrowUp' && focusedSuggestion > 0) {
      setFocusedSuggestion(focusedSuggestion - 1);
    } else if (key === 'ArrowDown' && focusedSuggestion < suggestions.length - 1) {
      setFocusedSuggestion(focusedSuggestion + 1);
    } else if (key === 'Enter') {
      selectSuggestion(suggestions[focusedSuggestion]);
    }
  }, [focusedSuggestion, setFocusedSuggestion, suggestions]);

  return (
    <Root onKeyDown={onKeyDown}>
      <label>
        Search react repo issues:
      </label>

      <Input
        value={value}
        onChange={onChange}
      />

      {loading ? (
        <SuggestionsBox>
          <SuggestionsBoxItem>
            ... loading
          </SuggestionsBoxItem>
        </SuggestionsBox>
      ) : !!suggestions.length ? (
        <SuggestionsBox>
          {suggestions.map((issue, index) => (
            <SuggestionsBoxItem
              key={issue.id}
              onClick={_ev => selectSuggestion(issue)}
              className={focusedSuggestion === index ? 'active' : undefined}
            >
              [{issue.id}] {issue.title}
            </SuggestionsBoxItem>
          ))}
        </SuggestionsBox>
      ) : null}
    </Root>
  )
};

export default GithubIssuesInput;
