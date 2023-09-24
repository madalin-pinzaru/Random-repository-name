import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchInputList } from "../../utils/apiCalls.tsx";
import { useTranslation } from "react-i18next";
import { LOCAL_STORAGE_KEY } from "../../utils/constants.tsx";
import { ISearchQuery } from "../../utils/interfaces.tsx";

import Suggestion from "./Suggestion";
import "./styles.css";

const SearchBar: React.FC<ISearchQuery> = ({ searchTerm }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState(searchTerm ? searchTerm : "");
  const [suggestionHistory, setSuggestionHistory] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedSuggestions = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedSuggestions) {
      setSuggestionHistory(JSON.parse(storedSuggestions));
    }
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        suggestionDropdownRef.current &&
        showSuggestions &&
        !suggestionDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    window.addEventListener("click", handleDocumentClick);

    return () => {
      window.removeEventListener("click", handleDocumentClick);
    };
  }, [showSuggestions]);

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setQuery(value);

    const data = await fetchInputList(value);
    const filtered = data.map((item) => item.title);

    setFilteredSuggestions(filtered.slice(0, 10));
    setShowSuggestions(value.length > 0 && filtered.length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!suggestionHistory.includes(suggestion)) {
      setSuggestionHistory([...suggestionHistory, suggestion]);
    }

    setQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleSearchClick = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(suggestionHistory));
    navigate(`/results?query=${encodeURIComponent(query)}`);
  };

  const handleRemoveSuggestion = (suggestion: string) => {
    const updatedSuggestions = suggestionHistory.filter(
      (item) => item !== suggestion
    );
    const storedSuggestions = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedSuggestions) {
      const storedSuggestionsArray = JSON.parse(storedSuggestions) as string[];
      const updatedStoredSuggestions = storedSuggestionsArray.filter(
        (item) => item !== suggestion
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(updatedStoredSuggestions)
      );
    }
    setSuggestionHistory(updatedSuggestions);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearchClick();
      setShowSuggestions(false);
    }
  };

  return (
    <div>
      <a href="/" style={{ textDecoration: "none", color: "white" }}>
        <h2>{t("vanillaSearch")}</h2>
      </a>
      <div className="container">
        <div className="search-bar">
          <input
            id="search-input"
            className="search-input"
            type="text"
            placeholder={t("search")}
            value={query}
            onChange={handleInputChange}
            ref={searchInputRef}
            autoFocus
            onKeyDown={handleInputKeyDown}
          />
          <button className="search-button" onClick={handleSearchClick}>
            Search
          </button>
        </div>

        {showSuggestions && (
          <div className="suggestion-container" ref={suggestionDropdownRef}>
            {filteredSuggestions.map((suggestion) => (
              <Suggestion
                key={suggestion}
                suggestion={suggestion}
                searched={suggestionHistory.includes(suggestion)}
                onClick={handleSuggestionClick}
                onRemove={handleRemoveSuggestion}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
