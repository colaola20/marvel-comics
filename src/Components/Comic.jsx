import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Comic = ({id, title, image, printPrice, saleDate}) => {
    // Format the date nicely
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
       <li className="main-list" key={id}>
            <Link style={{color: "White" }}
                to={`/comicDetails/${id}`}
                key={id}
            >
                <img className="comicImg" src={image} alt={title}/>
                <div className="comic-content">
                    <div className="comic-title">{title}</div>
                    <div className="comic-details">
                        <div className="comic-price"> Print price: ${printPrice}</div>
                        <div className="comic-date"> Sale Date: {formatDate(saleDate)}</div>
                    </div>
                </div>
            </Link>
       </li>
    )
}

export default Comic;