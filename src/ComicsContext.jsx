import { createContext, useContext, useState, useEffect } from 'react';
import md5 from 'md5';

// Create the context
const ComicsContext = createContext();

// Provider component that will wrap your app
export const ComicsProvider = ({ children }) => {
    const [comics, setComics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Marvel API keys
    const API_KEY = import.meta.env.VITE_APP_API_KEY;
    const PRIVATE_KEY = import.meta.env.VITE_APP_PRIVATE_KEY;

    useEffect(() => {
        const fetchComics = async () => {
            try {
                setLoading(true);
                setError(null);

                // Marvel API authentication
                const ts = Date.now().toString();
                const hash = md5(ts + PRIVATE_KEY + API_KEY);
                
                const url = `https://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${API_KEY}&hash=${hash}&limit=40`;
                
                const response = await fetch(url);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API Error: ${errorText}`);
                }
                
                const data = await response.json();
                setComics(data.data.results);
                console.log("Comics data loaded into context:", data.data.results);
                
            } catch (err) {
                console.error("Error fetching comics:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchComics();
    }, [API_KEY, PRIVATE_KEY]);

    // Helper functions to work with comics data
    const getComicById = (id) => {
        return comics.find(comic => comic.id === parseInt(id));
    };

    const getComicsBySeries = (seriesName) => {
        return comics.filter(comic => 
            comic.series?.name?.toLowerCase().includes(seriesName.toLowerCase())
        );
    };

    const getComicsInPriceRange = (min, max) => {
        return comics.filter(comic => {
            const price = comic.prices[0]?.price || 0;
            return price >= min && price <= max;
        });
    };

    // Value object that will be provided to components
    const contextValue = {
        // State
        comics,
        loading,
        error,
        
        // Helper functions
        getComicById,
        getComicsBySeries,
        getComicsInPriceRange,
        
        // Computed values
        totalComics: comics.length,
        uniqueSeries: [...new Set(comics.map(comic => comic.series?.name).filter(Boolean))],
    };

    return (
        <ComicsContext.Provider value={contextValue}>
            {children}
        </ComicsContext.Provider>
    );
};

// Custom hook to use the comics context
export const useComics = () => {
    const context = useContext(ComicsContext);
    if (!context) {
        throw new Error('useComics must be used within a ComicsProvider');
    }
    return context;
};

export default ComicsContext;