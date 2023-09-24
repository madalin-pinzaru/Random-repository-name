import { useEffect, useState } from "react";
import SearchBar from "../Search/SearchBar";
import { useLocation } from "react-router-dom";
import { fetchSearchResults } from "../../utils/apiCalls";
import { IResultsProps, ISearchResult } from "../../utils/interfaces";
import { useTranslation } from "react-i18next";
import "./styles.css";
import { RESULTS_PER_PAGE } from "../../utils/constants";

const Results: React.FC<IResultsProps> = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const query = new URLSearchParams(location.search).get("query") || "";
  const [searchResults, setSearchResults] = useState<ISearchResult[]>([]);
  const [searchCount, setSearchCount] = useState<number>(0);
  const [searchDuration, setSearchDuration] = useState<string>("N/A");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = RESULTS_PER_PAGE;

  useEffect(() => {
    const fetchData = async () => {
      const { results, duration } = await fetchSearchResults(query);
      setSearchResults(results);
      setSearchCount(results.length);
      setSearchDuration(duration);
    };

    fetchData();
  }, [query]);

  const calculateDisplayRange = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return searchResults.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="content-wrapper">
      <div className="searchBar-container">
        <SearchBar searchTerm={query} />
        <p>
          {t("resultsTime", {
            resultsNumber: searchCount,
            time: searchDuration,
          })}
        </p>
      </div>

      <h2>Search Results</h2>

      {calculateDisplayRange().map((result, index) => (
        <div key={index} className="search-result">
          <div className="result-header">
            <img
              loading="lazy"
              alt="header-image"
              src="/headerIcon.png"
              width="32"
            />
            <div className="result-header-info">
              <span>{result.programming_language}</span>
              <a
                href={result.documentation_url}
                target="_blank"
                rel="noopener noreferrer"
                className="result-url"
              >
                {result.documentation_url}
              </a>
            </div>
          </div>
          <a
            href={result.documentation_url}
            target="_blank"
            className="result-title"
          >
            {result.title}
          </a>
          <div className="description">{result.description}</div>
        </div>
      ))}
      {/* Pagination controls */}
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        <span>Page {currentPage}</span>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage * itemsPerPage >= searchCount}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Results;
