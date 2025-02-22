import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Define the Data Type (Update with your actual data structure)
interface DataType {
  id: number;
  name: string;
  slug: string;
  [key: string]: any;
}

interface DataContextType {
  data: DataType[] | null;
  dataMap: Map<string, DataType> | null;
  loading: boolean;
  error: string | null;
  getSingleData: (id: string) => Promise<DataType | undefined>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [data, setData] = useState<DataType[] | null>(null);
  const [dataMap, setDataMap] = useState<Map<string, DataType> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://hello.seasidebeachvacations.com/listing-data.php"
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const result: DataType[] = await response.json();

        // Store data in an array and also create a Map for fast lookups
        const dataMap = new Map(result.map((item) => [item.slug, item]));

        setData(result);
        setDataMap(dataMap);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch single item in O(1) time using Map, but now as a promise
  const getSingleData = async (id: string) => {
    try {
      const response = await fetch(
        `https://hello.seasidebeachvacations.com/listing-data.php?id=${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch listing data");
      return await response.json();
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  const value = { data, dataMap, loading, error, getSingleData };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
