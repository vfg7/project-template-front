// src/App.js
import React, { useState, useEffect } from 'react';
import PessoasList from './components/PessoasList';
import Filters from './components/Filters';
import PessoaForm from './components/PessoaForm';
import Loading from './components/Loading';
import './styles.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function App() {
  const [pessoas, setPessoas] = useState([]);
  const [filteredPessoas, setFilteredPessoas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [displayCount, setDisplayCount] = useState(20);
  const [ageRange, setAgeRange] = useState({ min: 0, max: 100 });
  const [currentAgeFilter, setCurrentAgeFilter] = useState({ min: 0, max: 100 });
  const [searchName, setSearchName] = useState('');
  const [searchAge, setSearchAge] = useState('');
  const [alphaSorted, setAlphaSorted] = useState(false);
  const [selectedPessoa, setSelectedPessoa] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Carregar dados da API
  const fetchPessoas = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/pessoas`);
      const data = await response.json();
      
      // Processamento de dados
      const loadedPessoas = data.pessoas || [];
      
      // Determinar o range de idade para o slider
      if (loadedPessoas.length > 0) {
        const ages = loadedPessoas.map(p => p.idade);
        const minAge = Math.min(...ages);
        const maxAge = Math.max(...ages);
        setAgeRange({ min: minAge, max: maxAge });
        setCurrentAgeFilter({ min: minAge, max: maxAge });
      }
      
      setPessoas(loadedPessoas);
      setFilteredPessoas(loadedPessoas);
      setIsLoaded(true);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar pessoas. Verifique o console para mais detalhes.');
    } finally {
      setIsLoading(false);
    }
  };

  // Aplicar filtros e ordenação
  useEffect(() => {
    if (!isLoaded) return;
    
    let result = [...pessoas];
    
    // Filtro por nome
    if (searchName.trim()) {
      result = result.filter(p => 
        p.nome.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    
    // Filtro por idade
    if (searchAge.trim()) {
      result = result.filter(p => 
        p.idade.toString() === searchAge
      );
    }
    
    // Filtro por range de idade
    result = result.filter(p => 
      p.idade >= currentAgeFilter.min && p.idade <= currentAgeFilter.max
    );
    
    // Ordenação alfabética
    if (alphaSorted) {
      result.sort((a, b) => a.nome.localeCompare(b.nome));
    }
    
    setFilteredPessoas(result);
  }, [pessoas, searchName, searchAge, currentAgeFilter, alphaSorted, isLoaded]);

  // Deletar pessoa
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta pessoa?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/pessoas/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Atualiza a lista após deletar
        setPessoas(pessoas.filter(p => p.id !== id));
        setShowForm(false);
        setSelectedPessoa(null);
        alert('Pessoa excluída com sucesso!');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao excluir pessoa');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert(`Erro ao excluir: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar pessoa
  const handleUpdate = async (id, pessoaData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/pessoas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pessoaData),
      });
      
      if (response.ok) {
        const updatedPessoa = await response.json();
        // Atualiza a lista após editar
        setPessoas(pessoas.map(p => 
          p.id === id ? {...p, ...pessoaData} : p
        ));
        setShowForm(false);
        setSelectedPessoa(null);
        alert('Pessoa atualizada com sucesso!');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao atualizar pessoa');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert(`Erro ao atualizar: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Criar nova pessoa
  const handleCreate = async (pessoaData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/pessoas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pessoaData),
      });
      
      if (response.ok) {
        const result = await response.json();
        // Adiciona à lista
        setPessoas([...pessoas, result.pessoa]);
        setShowForm(false);
        alert('Pessoa criada com sucesso!');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar pessoa');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert(`Erro ao criar: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPessoa = (pessoa) => {
    setSelectedPessoa(pessoa);
    setShowForm(true);
  };

  return (
    <div className="app-container">
      <h1>Gerenciamento de Pessoas</h1>
      
      {isLoading && <Loading />}
      
      {!isLoaded && !isLoading && (
        <div className="initial-screen">
          <button className="load-button" onClick={fetchPessoas}>
            Carregar Pessoas
          </button>
        </div>
      )}
      
      {isLoaded && !showForm && (
        <>
          <Filters 
            ageRange={ageRange}
            currentAgeFilter={currentAgeFilter}
            setCurrentAgeFilter={setCurrentAgeFilter}
            searchName={searchName}
            setSearchName={setSearchName}
            searchAge={searchAge}
            setSearchAge={setSearchAge}
            alphaSorted={alphaSorted}
            setAlphaSorted={setAlphaSorted}
            displayCount={displayCount}
            setDisplayCount={setDisplayCount}
          />
          
          <div className="results-info">
            <p>Exibindo {Math.min(displayCount, filteredPessoas.length)} de {filteredPessoas.length} resultados</p>
          </div>
          
          <PessoasList 
            pessoas={filteredPessoas.slice(0, displayCount)} 
            onSelectPessoa={handleSelectPessoa}
          />
          
          <div className="action-buttons">
            <button 
              className="new-button"
              onClick={() => {
                setSelectedPessoa(null);
                setShowForm(true);
              }}
            >
              Nova Pessoa
            </button>
          </div>
        </>
      )}
      
      {showForm && (
        <PessoaForm 
          pessoa={selectedPessoa}
          onSave={(pessoaData) => {
            if (selectedPessoa) {
              handleUpdate(selectedPessoa.id, pessoaData);
            } else {
              handleCreate(pessoaData);
            }
          }}
          onDelete={selectedPessoa ? () => handleDelete(selectedPessoa.id) : null}
          onCancel={() => {
            setShowForm(false);
            setSelectedPessoa(null);
          }}
        />
      )}
    </div>
  );
}

export default App;