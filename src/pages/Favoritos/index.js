import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './favoritos.css';

function Favoritos(){

    const [filmes,setFilmes] = useState([]);

    useEffect(()=>{
        const minhaLista = localStorage.getItem("@primeflix");
        setFilmes(JSON.parse(minhaLista) || []);
    }, [])

    function excluirFilme(id){
        let filtroFilmes = filmes.filter((filme) => {
            return(filme.id !== id)
        })

        setFilmes(filtroFilmes);
        localStorage.setItem("@primeflix", JSON.stringify(filtroFilmes));
        toast.success("Filme removido com sucesso!")
    }

    return(
        <div className='meus-filmes'>
            <h1>Meus Filmes</h1>

            {filmes.length === 0 && <span>Você não possui nenhum filme salvo :( </span>}

            <ul>
                {filmes.map((filme)=>{
                    return(
                        <li key={filme.id}>
                                <img src={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`} alt={filme.title}/>
                            <span>{filme.title}</span>
                            <div>
                                <Link to={`/filme/${filme.id}`}>ver detalhes</Link>
                                <button onClick={() => excluirFilme(filme.id)}>Excluir</button>
                            </div>                           
                        </li>                        
                    );
                })}
            </ul>
            <div className='btn-voltar'>
                <button>
                    <Link to="/">Voltar a página principal</Link>
                    </button>
            </div>
        </div>
    );
}

export default Favoritos;