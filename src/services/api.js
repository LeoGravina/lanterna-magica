import axios from "axios";

// URL DA API =   https://api.themoviedb.org/3/movie/now_playing?api_key=dcc25bbd4631ae970481e14d27999ca7&language=pt-BR

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/'
});

export default api;