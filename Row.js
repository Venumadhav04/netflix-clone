import React, {useState, useEffect} from 'react'
import axios from './axios';
import "./Row.css"
import Youtube from 'react-youtube';
import movieTrailer from 'movie-trailer';
const baseImgUrl = "https://image.tmdb.org/t/p/original";

function Row({title, fetchUrl, isLargeRow }) {
    const [movies, setMovies]  = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");


    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
          autoplay: 1,
        },
      };
    useEffect(() => {
            async function fetchData(){
                const request = await axios.get(fetchUrl);
                setMovies(request.data.results);
                
            }
            fetchData();
    }, [fetchUrl]);  //the empty [] says that this function useeffect should run only once the row com[ponent is loaded]
    
    const handleClick = (movie) => {
        
        if (trailerUrl) {
          setTrailerUrl("");
        } else {
          movieTrailer(movie?.name || movie?.original_title || "")
            .then((url) => {
                
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get("v"));
            })
            .catch((error) => console.log(error));
        }
      };
    
    return (
        <div className="row">
            <h2>{title}</h2>
            <div className = "row__posters">
            {movies.map((movie) => 
                <img 
                key={movie.id}
                className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                src = {`${baseImgUrl}${
                    isLargeRow ? movie.poster_path : movie.backdrop_path
                  }`} alt = {movie.name} onClick={() => handleClick(movie)} ></img>
            )}
            </div>
            {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
        </div>
    )
}

export default Row
