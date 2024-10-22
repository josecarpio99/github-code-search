export interface SearchResult {
  name: string;
  path: string;
  repository: {
    full_name: string;
    html_url: string;
  };
  html_url: string;
  query?: string;
}