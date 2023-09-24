import "./styles.css";

interface SuggestionProps {
  suggestion: string;
  onClick: (suggestion: string) => void;
  searched: boolean;
  onRemove: (suggestion: string) => void;
}

const Suggestion: React.FC<SuggestionProps> = ({
  suggestion,
  onClick,
  searched,
  onRemove,
}) => {
  const suggestionClass = searched
    ? "suggestion suggestion-searched"
    : "suggestion";

  return (
    <div className={suggestionClass}>
      <div onClick={() => onClick(suggestion)}>{suggestion}</div>
      {searched && (
        <button
          className="suggestion-remove-button"
          onClick={() => onRemove(suggestion)}
        >
          X
        </button>
      )}
    </div>
  );
};

export default Suggestion;
