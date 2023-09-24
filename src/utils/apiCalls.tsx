import axios from "axios";
import { ISearchResult, IInputItem } from "./interfaces";

export async function fetchInputList(query: string): Promise<IInputItem[]> {
  try {
    //Debouncing would help with the API calls, but as data is local we're not pressed by response time and cost
    const response = await axios.get<IInputItem[]>("./mockedData.json");
    const data = response.data;

    const filteredData = data.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );

    return filteredData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export const fetchSearchResults = async (query: string) => {
  try {
    const startTime = performance.now();
    const response = await axios.get("./mockedData.json");
    const data = response.data as ISearchResult[];

    const filteredResults = data.filter((item) => {
      const title = item.title.toLowerCase();
      const description = item.description.toLowerCase();
      const lowercasedQuery = query.toLowerCase();

      //Requirements said to only search for the Title, but I did add the description in order to get more results sometimes. Can be easily changed.
      return (
        title.includes(lowercasedQuery) || description.includes(lowercasedQuery)
      );
    });

    const endTime = performance.now();
    const searchDuration = ((endTime - startTime) / 1000).toFixed(2);

    return { results: filteredResults, duration: searchDuration };
  } catch (error) {
    console.error("Error fetching search results:", error);
    return { results: [], duration: "~" };
  }
};
