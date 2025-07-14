import { useState, useEffect } from 'react';
import md5 from "md5";
import './App.css';
import Comic from "/Users/olha/vscode101/WEB102/data-dashboard/dataDashboard/Components/Comic.jsx";

function App() {
  const [comics, setComics] = useState([]);
  const [filteredResults, setFilteredREsults] = useState([]);
  const [serchInput, setSearchInput] = useState("");

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

  // const searchItems = searchValue => {
  //   setSearchInput(searchValue)
  //   if 
  // }

  return (
    <>
      <div>
        <h1>Marvel Comics</h1>
        <div className="list-block">
          <div className="search">
            <input
              type="text"
              placeholder="Search..."
              onChange={(inputString) => searchItems(inputString.target.vaalue)}
            />
          </div>
          <ul>
            {comics && comics
            .filter((comic) =>
              !comic.thumbnail.path.includes("image_not_available") &&
              comic.prices[0].price != 0
            )
            .map((comic) => {
              console.log(comic.dates[0].date);
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
