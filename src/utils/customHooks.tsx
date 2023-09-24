import { useState } from "react";

function useLocalStorage(key: string, defValue: boolean) {
  const [localStorageValue, setLocalStorageValue] = useState(() => {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    } else {
      localStorage.setItem(key, JSON.stringify(defValue));
      return defValue;
    }
  });

  const setLocalStorageStateValue = (value: string) => {
    localStorage.setItem(key, JSON.stringify(value));
    setLocalStorageValue(value);
  };
  return [localStorageValue, setLocalStorageStateValue];
}

export default useLocalStorage;
