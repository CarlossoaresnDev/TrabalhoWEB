import React, { Component } from 'react';

export default class Main extends Component {
  state = {
    novaTarefa: '',
    tarefas: [],
  };

  handleChange = (e) => {
    this.setState({ novaTarefa: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { novaTarefa, tarefas } = this.state;
    if (novaTarefa) {
      this.setState({
        tarefas: [...tarefas, novaTarefa],
        novaTarefa: '',
      });
    }
  };

  render() {
    const { novaTarefa, tarefas } = this.state;

    return (
      <div className="main">
        <h1>Lista de Tarefas</h1>
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.handleChange} value={novaTarefa} type="text" />
          <button type="submit">Enviar</button>
        </form>
        <ul>
          {tarefas.map((tarefa, index) => (
            <li key={index}>{tarefa}</li>
          ))}
        </ul>
      </div>
    );
  }
}
