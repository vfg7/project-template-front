// src/components/PessoaForm.js
import React, { useState, useEffect } from 'react';

function PessoaForm({ pessoa, onSave, onDelete, onCancel }) {
  const [formData, setFormData] = useState({
    nome: '',
    idade: ''
  });
  
  // Inicializa o formulário se estiver editando
  useEffect(() => {
    if (pessoa) {
      setFormData({
        nome: pessoa.nome,
        idade: pessoa.idade
      });
    }
  }, [pessoa]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'idade' ? Number(value) : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <div className="form-overlay">
      <div className="form-container">
        <h2>{pessoa ? 'Editar Pessoa' : 'Adicionar Nova Pessoa'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="idade">Idade:</label>
            <input
              type="number"
              id="idade"
              name="idade"
              min="1"
              max="120"
              value={formData.idade}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="save-button">
              Salvar
            </button>
            
            {onDelete && (
              <button 
                type="button" 
                className="delete-button"
                onClick={onDelete}
              >
                Excluir
              </button>
            )}
            
            <button 
              type="button" 
              className="cancel-button"
              onClick={onCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PessoaForm;