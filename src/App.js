import React, { useState, useEffect } from 'react';
import './App.css'; 
import axios from 'axios';

const API_URL ='http://192.168.0.100:8080/livros'; 

function App() {
  const [livros, setLivros] = useState([]);
  const [novoLivro, setNovoLivro] = useState({ titulo: '', autor: '', ano: '' });
  const [editandoLivroId, setEditandoLivroId] = useState(null);
  const [livroEditado, setLivroEditado] = useState({ titulo: '', autor: '', ano: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarLivros = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(API_URL);
        setLivros(response.data);
      } catch (err) {
        setError(err.message || 'Erro ao carregar os livros.');
      } finally {
        setLoading(false);
      }
    };

    carregarLivros();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoLivro({ ...novoLivro, [name]: value });
  };

  const handleInputChangeEdicao = (e) => {
    const { name, value } = e.target;
    setLivroEditado({ ...livroEditado, [name]: value });
  };

  const adicionarLivro = async () => {
    if (novoLivro.titulo && novoLivro.autor && novoLivro.ano) {
      try {
        const response = await axios.post(API_URL, novoLivro);
        setLivros([...livros, response.data]); 
        setNovoLivro({ titulo: '', autor: '', ano: '' }); 
      } catch (err) {
        setError(err.message || 'Erro ao adicionar o livro.');
      }
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  const editarLivro = (id) => {
    setEditandoLivroId(id);
    const livroParaEditar = livros.find(livro => livro.id === id);
    setLivroEditado({ ...livroParaEditar });
  };

  const salvarEdicaoLivro = async () => {
    if (livroEditado.titulo && livroEditado.autor && livroEditado.ano) {
      try {
        await axios.put(`${API_URL}/${editandoLivroId}`, livroEditado);
        const novosLivros = livros.map(livro =>
          livro.id === editandoLivroId ? { ...livroEditado } : livro
        );
        setLivros(novosLivros);
        setEditandoLivroId(null);
        setLivroEditado({ titulo: '', autor: '', ano: '' });
      } catch (err) {
        setError(err.message || 'Erro ao salvar as alterações.');
      }
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  const cancelarEdicaoLivro = () => {
    setEditandoLivroId(null);
    setLivroEditado({ titulo: '', autor: '', ano: '' });
  };

  const excluirLivro = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setLivros(livros.filter((livro) => livro.id !== id));
    } catch (err) {
      setError(err.message || 'Erro ao excluir o livro.');
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div className="App">
      <h1>Gerenciador de Livros</h1>

      
      <h2>Adicionar Livro</h2>
      <input
        type="text"
        name="titulo"
        placeholder="Título"
        value={novoLivro.titulo}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="autor"
        placeholder="Autor"
        value={novoLivro.autor}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="ano"
        placeholder="Ano"
        value={novoLivro.ano}
        onChange={handleInputChange}
      />
      <button onClick={adicionarLivro}>Adicionar</button>

      
      <h2>Lista de Livros</h2>
      <ul>
        {livros.map((livro) => (
          <li key={livro.id}>
            {editandoLivroId === livro.id ? (
              <>
                <input
                  type="text"
                  name="titulo"
                  value={livroEditado.titulo}
                  onChange={handleInputChangeEdicao}
                />
                <input
                  type="text"
                  name="autor"
                  value={livroEditado.autor}
                  onChange={handleInputChangeEdicao}
                />
                <input
                  type="number"
                  name="ano"
                  value={livroEditado.ano}
                  onChange={handleInputChangeEdicao}
                />
                <button onClick={salvarEdicaoLivro}>Salvar</button>
                <button onClick={cancelarEdicaoLivro}>Cancelar</button>
              </>
            ) : (
              <>
                {livro.titulo} - {livro.autor} ({livro.ano})
                <button onClick={() => editarLivro(livro.id)}>Editar</button>
                <button onClick={() => excluirLivro(livro.id)}>Excluir</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;