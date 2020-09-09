import React, { useState } from "react";
import styled from "styled-components";

import GithubIssuesInput from "./GithubIssuesInput";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;

  font-family: Tahoma, sans-serif;
`;

const SelectedIssue = styled.div`
  margin-top: 16px;
`;

const App = (): React.ReactNode => {
  const [issue, setIssue] = useState<Issue>();

  return (
    <Root>
      <GithubIssuesInput onChange={setIssue} />

      {issue && (
        <SelectedIssue>
          The selected issue is:
          <br />
          <a href={issue.url} target="_blank" rel="noreferrer">
            [{issue.id}] {issue.title}
          </a>
        </SelectedIssue>
      )}
    </Root>
  );
};

export default App;
