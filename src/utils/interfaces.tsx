export interface IResultsProps {
  query?: string;
}

export interface ISearchResult {
  title: string;
  description: string;
  documentation_url: string;
  programming_language: string;
}

export interface IInputItem {
  title: string;
  programming_language: string;
  release_date: string;
  version: string;
  documentation_url: string;
  description: string;
}

export type ISearchQuery = {
  searchTerm?: string;
};
