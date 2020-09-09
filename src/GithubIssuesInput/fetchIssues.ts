const ENDPOINT = "https://api.github.com/search/issues";
const LIMIT = 5;

const fetchIssues = async (filter: string): Promise<Issue[]> => {
  const headers = new Headers();

  // Authenticated requests have a higher quota.
  // Without it you would quickly run out of quota.
  const username = process.env.GITHUB_USERNAME;
  const password = process.env.GITHUB_PASSWORD;

  if (username && password) {
    headers.set("Authorization", "Basic " + btoa(username + ":" + password));
  }

  const queryString = new URLSearchParams();

  queryString.set("q", `repo:facebook/react is:issue ${filter}`);
  queryString.set("per_page", LIMIT.toString());

  const response = await fetch(`${ENDPOINT}?${queryString}`, { headers });
  const { items: issues } = await response.json();

  if (!issues) {
    throw new Error("No issues returned");
  }

  return issues;
};

export default fetchIssues;
