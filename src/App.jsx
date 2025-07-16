import { useState, useEffect } from 'react';
import md5 from "md5";
import './App.css';
import Comic from "/Users/olha/vscode101/WEB102/data-dashboard/dataDashboard/Components/Comic.jsx";

function App() {
  const [comics, setComics] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50]);

  const API_KEY = import.meta.env.VITE_APP_API_KEY;
  const second_key = import.meta.env.VITE_APP_PRIVATE_KEY;
  useEffect(() => {
    const fetchComics = async () => {

      const ts = Date.now().toString();
      const hash = md5(ts + second_key + API_KEY);
      
      const url = `https://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${API_KEY}&hash=${hash}&limit=40`;
      
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error:", errorText);
          return;
        }
        
        const data = await response.json();
        setComics(data.data.results);
        console.log("Comics data:", data.data.results);
      } catch (err) {
        console.error("Error fetching comics:", err);
      }
    };
    fetchComics();
  }, []);

  const searchItems = searchValue => {
    setSearchInput(searchValue);
    
    if (searchValue !== "") {
      const filteredData = comics.filter((comic) =>
        comic.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        comic.series?.name?.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredResults(filteredData); // Use the actual filtered data
    } else {
      // If search is empty, show all comics
      setFilteredResults([]);
    }
  }

  const filterByPrice = (comics, priceRange) => {
    return comics.filter(comic => {
      const price = comic.prices[0].price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
  };

  const displayedComics = (() => {
    let comicsToFilter = filteredResults.length > 0 ? filteredResults : comics;
    comicsToFilter = filterByPrice(comicsToFilter, priceRange);

    return comicsToFilter
      .filter((comic) =>
      !comic.thumbnail.path.includes("image_not_available") &&
      comic.prices[0].price !== 0
    );
  })();

  const averagePrice = displayedComics.length > 0
    ? (displayedComics.reduce((sum, comic) =>
      sum + comic.prices[0].price, 0) / displayedComics.length).toFixed(2)
    : 0;

  const mostPopular = displayedComics.length > 0
    ? (displayedComics.reduce((prev, current) => {
        const prevIssue = parseInt(prev.issueNumber) || 0;
        const currentIssue = parseInt(current.issueNumber) || 0;
        return prevIssue > currentIssue ? prev : current;
    }))
    : null;

  // Get min and max prices from all comics for range bounds
  const priceExtents = comics.length > 0 ? (() => {
    const prices = comics
      .filter(comic => comic.prices[0]?.price > 0)
      .map(comic => comic.prices[0].price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)) 
    };
  })() : { min: 0, max: 50 };



  return (
    <>
      <div>
        <h1>Marvel Comics</h1>
        <div className="statistics">
          <div className="comics-statistic">
            <span className="stat-label">Comics Displayed</span>
            <span className="stat-number">{displayedComics.length}</span>
          </div>
          <div className="comics-statistic">
            <span className="stat-label">Average Price</span>
            <span className="stat-number">${averagePrice}</span>
          </div>
          <div className="comics-statistic">
            <span className="stat-label">Highest Issue</span>
            <span className="stat-number">{mostPopular ? mostPopular.title : 'N/A'}</span>
          </div>
        </div>
        <div className="list-block">
          <div className="search">
            <input
              type="text"
              placeholder="Search comics by title or series..."
              onChange={(inputString) => searchItems(inputString.target.value)}
            />
            <div className="price-range-container">
              <label>Price: ${priceRange[0]} - ${priceRange[1]}</label>
              
              <div className="simple-dual-range">
                <input
                  type="range"
                  min={priceExtents.min}
                  max={priceExtents.max}
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1] - 1), priceRange[1]])}
                  className="thumb thumb-left"
                />
                <input
                  type="range"
                  min={priceExtents.min}
                  max={priceExtents.max}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0] + 1)])}
                  className="thumb thumb-right"
                />
              </div>
            </div>
          
          </div>
          <ul>
            {displayedComics
            .map((comic) => {
              
              return (
                <Comic
                  key={comic.id}
                  id={comic.id}
                  title={comic.title}
                  image={`${comic.thumbnail.path}/portrait_xlarge.${comic.thumbnail.extension}`}
                  printPrice={comic.prices[0].price}
                  saleDate={comic.dates[0].date}
                />
              );
            })}
          </ul>
        </div>
        
      </div>
    </>
  )
}

export default App
