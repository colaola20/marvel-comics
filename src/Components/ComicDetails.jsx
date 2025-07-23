import { useParams } from "react-router-dom"
import { useComics } from "../ComicsContext.jsx";

function ComicDetails() {
    const { id } = useParams();
    const { getComicById, loading, error } = useComics();

    const comic = getComicById(id);

    if (loading) {
        return <div>Loading comic details...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!comic) {
        return <div>Comic not found!</div>;
    }

    return (
        <div className="comic-details"> 
            <h1>{comic.title}</h1>
            <div className="comic-details-content">
                <img src={`${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}`}
                alt={comic.title}
                className="comic-detail-image"
                />
                <div clasName="comic-info">
                    <p><strong>Price:</strong> ${comic.prices[0]?.price || 'N/A'}</p>
                    <p><strong>Page Count:</strong> {comic.pageCount || 'N/A'}</p>
                    <p><strong>Series:</strong> {comic.series?.name || 'N/A'}</p>
                    <p><strong>Issue Number:</strong> {comic.issueNumber || 'N/A'}</p>
                    <p><strong>Description:</strong> {comic.description || 'No description available'}</p>

                    {comic.creators?.items?.length > 0 && (
                        <div>
                            <h3>Creators:</h3>
                            <ul>
                                {comic.creators.items.map((creator, index) => (
                                    <li key={index}>{creator.name} - {creator.role}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {comic.characters?.items?.length > 0 && (
                        <div>
                            <h3>Characters:</h3>
                            <ul>
                                {comic.characters.items.slice(0, 5).map((character, index) => (
                                    <li key={index}>{character.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ComicDetails;