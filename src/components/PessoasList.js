// src/components/PessoasList.js
import React from 'react';

function PessoasList({ pessoas, onSelectPessoa }) {
  if (pessoas.length === 0) {
    return <p className="empty-message">Nenhuma pessoa encontrada com os filtros atuais.</p>;
  }
  
  return (
    <div className="list-container">
      <table className="pessoas-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Idade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pessoas.map((pessoa) => (
            <tr key={pessoa.id}>
              <td>{pessoa.id}</td>
              <td>{pessoa.nome}</td>
              <td>{pessoa.idade}</td>
              <td>
                <button 
                  className="edit-button"
                  onClick={() => onSelectPessoa(pessoa)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PessoasList;