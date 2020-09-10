import React, { useCallback, useState } from "react";
import debounce from "lodash.debounce";

import {
  Root,
  SuggestionsBox,
  SuggestionsBoxItem,
  Input,
} from "./styledComponents";

import doFetchIssues from "./fetchIssues";

type Props = {
  onChange: (issue: Issue) => void;
};

const FETCH_DELAY = 300;

const GithubIssuesInput = ({
  onChange: externalOnChange,
}: Props): JSX.Element => {
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<Issue[]>([]);
  const [focusedSuggestion, setFocusedSuggestion] = useState<number>();
  const [fetched, setFetched] = useState<boolean>(false);
  const [error, setError] = useState<boolean>();
  const [hovering, setHovering] = useState<boolean>(false);

  const fetchIssues = useCallback(
    debounce(async (filter: string) => {
      setError(false);
      setLoading(true);
      setFetched(false);

      try {
        const suggestions = await doFetchIssues(filter);
        setSuggestions(suggestions);
        setFocusedSuggestion(0);
      } catch (_error) {
        setError(true);
      } finally {
        setLoading(false);
        setFetched(true);
      }
    }, FETCH_DELAY),
    [setSuggestions, setFocusedSuggestion, setLoading]
  );

  const onChange = useCallback((ev) => {
    const value = ev.target.value;
    setValue(value);
    fetchIssues(value);
  }, []);

  const selectSuggestion = useCallback(
    (issue: Issue) => {
      externalOnChange(issue);
      setValue(`[${issue.id}] ${issue.title}`);
      setFocusedSuggestion(0);
      setSuggestions([]);
      setFetched(false);
    },
    [setSuggestions, setFocusedSuggestion, externalOnChange]
  );

  const onKeyDown = useCallback(
    (ev) => {
      const key = ev.key;

      if (focusedSuggestion === undefined) {
        return;
      }

      if (key === "ArrowUp" && focusedSuggestion > 0) {
        setFocusedSuggestion(focusedSuggestion - 1);
      } else if (
        key === "ArrowDown" &&
        focusedSuggestion < suggestions.length - 1
      ) {
        setFocusedSuggestion(focusedSuggestion + 1);
      } else if (key === "Enter") {
        selectSuggestion(suggestions[focusedSuggestion]);
      }
    },
    [focusedSuggestion, setFocusedSuggestion, suggestions]
  );

  const onBlur = useCallback(() => {
    if (hovering) {
      return;
    }
    setSuggestions([]);
    setFetched(false);
  }, [hovering]);

  return (
    <Root onKeyDown={onKeyDown} onBlur={onBlur}>
      <label>Search react repo issues:</label>

      <Input value={value} onChange={onChange} />

      {loading ? (
        <SuggestionsBox>
          <SuggestionsBoxItem>... loading</SuggestionsBoxItem>
        </SuggestionsBox>
      ) : fetched && error ? (
        <SuggestionsBox>
          <SuggestionsBoxItem>Error while fetching issues</SuggestionsBoxItem>
        </SuggestionsBox>
      ) : fetched && !!suggestions.length ? (
        <SuggestionsBox
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {suggestions.map((issue, index) => (
            <SuggestionsBoxItem
              key={issue.id}
              onClick={() => {
                selectSuggestion(issue);
              }}
              className={focusedSuggestion === index ? "active" : undefined}
            >
              [{issue.id}] {issue.title}
            </SuggestionsBoxItem>
          ))}
        </SuggestionsBox>
      ) : fetched ? (
        <SuggestionsBox>
          <SuggestionsBoxItem>No matching issues found</SuggestionsBoxItem>
        </SuggestionsBox>
      ) : null}
    </Root>
  );
};

export default GithubIssuesInput;
