import React, {useEffect, useState} from 'react'
import {BrowserRouter, useNavigate, Routes, Route, useParams, NavLink} from 'react-router-dom'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

const IMDB_API_KEY = process.env.REACT_APP_IMDB_API_KEY

function IMDB() {
    return (
        <BrowserRouter>
        <div className='row'>
            <NavLink to={'/'}><img src={require('./imdb.png')} alt='logo' width={'100px'} height={'80px'}></img></NavLink>
        </div>
            <Routes>
                <Route path='/' element={<IMDbSearchPage />}></Route>
                <Route path='/filter/:inputText' element={<IMDbFilterPage />}></Route>
                <Route path='/detail/:id' element={<IMDbDetailPage />}></Route>
                <Route path='*' element={<p>Error Page 404</p>}></Route>
            </Routes>
        </BrowserRouter>
    )
}

function IMDbSearchPage(props) {
    const [movies, setMovies] = useState([])
    const [favMovies, setFavMovies] = useState(
        JSON.parse(window.sessionStorage.getItem('favMov')) || []
    )
    const [input, setInput] = useState('')
    const navigate = useNavigate()

    const handleInput = (event) => {
        setInput(event.target.value)
    }
    const handleSearch = (event) => {
        event.preventDefault()
        navigate(`/filter/${input}`)
    }
    const handleFav = (result) => {
        if(favMovies.filter((movie) => movie.id === result.id).length === 0) {
            window.sessionStorage.setItem('favMov', JSON.stringify([...favMovies, result]))
            setFavMovies([...favMovies, result])
        }
    }
    const deleteFav = (index) => {
        const newFavMovie = [...favMovies.slice(0,index), ...favMovies.slice(index+1)]
        window.sessionStorage.setItem('favMov', JSON.stringify(newFavMovie))
        setFavMovies(newFavMovie)
    }
    useEffect(() => {
        const url_latest_movies = `https://imdb-api.com/en/API/MostPopularMovies/${IMDB_API_KEY}`
        fetch(url_latest_movies).then((response) => {
            response.json().then((data) => {
                setMovies(data.items)
            })
        })
    },[])
    return (
    <div>
        <Stack direction="row" spacing={1}>
            <TextField
            id="outlined-password-input"
            label="Search Movie"
            type="text"
            autoComplete="current-password"
            onChange={handleInput}
            value={input}
            style={{"backgroundColor" : "white"}}
            />
            <Button variant="contained" onClick={handleSearch}>Search</Button>
        </Stack>
        <br></br>
        <h2>Top Popular Movies</h2>
        <div className='row'>
            {
            movies.length !== 0 ? 
            movies.map((result) => {
                return <IMDbMovie key={result.id} movie={result} desc={" Add to Favourite"} handle={() => handleFav(result)}/>
            }) : <div>No movies at the moment</div>
            }
        </div>
        {
        favMovies.length !== 0 ?
        <div>
            <h2>Favourite Movies</h2>
            <div className='row'>
                {
                favMovies.map((result, index) => {
                    return <IMDbMovie key={result.id} movie={result} desc={" Remove Favourite"} handle={() => deleteFav(index)}/>
                })
                }
            </div>
        </div> : <div></div>
        }
    </div>
    )
}

function IMDbFilterPage(props) {
    const [searchMovies, setSearchMovies] = useState({})
    const [input, setInput] = useState('')
    const navigate = useNavigate()

    const handleInput = (event) => {
        setInput(event.target.value)
    }
    const handleSearch = (event) => {
        event.preventDefault()
        navigate(`/filter/${input}`)
    }
    const handleFav = (result) => {
        const newFavMovie = JSON.parse(window.sessionStorage.getItem('favMov'))
        if(newFavMovie.filter((movie) => movie.id === result.id).length === 0) {
            window.sessionStorage.setItem('favMov', JSON.stringify([...newFavMovie, result]))
        }
    }
    const params = useParams()
    useEffect(() => {
        const url_latest_movies = `https://imdb-api.com/en/API/SearchMovie/${IMDB_API_KEY}/${params.inputText}`
        fetch(url_latest_movies).then((response) => {
            response.json().then((data) => {
                setSearchMovies(data.results)
            })
        })
    },[params.inputText])
    return (
    <div>
        <Stack direction="row" spacing={1}>
            <input type={'text'} onChange={handleInput} value={input}/>
            <Button variant="contained" onClick={handleSearch}>Search</Button>
        </Stack>
        <br></br>
        <p>Search "{params.inputText}"</p>
        {
            Object.keys(searchMovies).length !== 0 ? 
            searchMovies.map((result) => {
                return <IMDbMovie key={result.id} movie={result} desc={" Add to Favourite"} handle={() => handleFav(result)}/>
            })
            : <div></div>
        }
    </div>
    )
}

function IMDbDetailPage(props) {
    const [trailer, setTrailer] = useState({})
    const params = useParams()
    useEffect(() => {
        const url_trailer = `https://imdb-api.com/en/API/Trailer/${IMDB_API_KEY}/${params.id}`
        fetch(url_trailer).then((response) => {
            response.json().then((data) => {
                setTrailer(data)
            })
        })
    },[params.id])
    return (
    <div>
        <h2>{trailer.fullTitle}</h2>
        <p>{trailer.videoDescription}</p>
        <div className='ratio ratio-21x9'>
            <iframe src={trailer.linkEmbed} title={trailer.title} allowFullScreen></iframe>
        </div>
    </div>
    )
}

function IMDbMovie(props) {
    const navigate = useNavigate()
    const handleDetail = (event) => {
        event.preventDefault()
        navigate(`/detail/${props.movie.id}`)
    }
    return (
    <div className='column'>
        <div className='image-container'>
            <img alt={props.movie.title} src={props.movie.image} height="160px" width="120px" onClick={handleDetail}/>
            <div className='overlay d-flex align-items-center justify-content'>
                <div onClick={props.handle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-square-heart-fill" viewBox="0 0 16 16">
                    <path d="M2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm6 3.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132Z"/>
                </svg>
                <span>{props.desc}</span>
                </div>
            </div>
        </div>
    </div>
    )
}

export default IMDB;