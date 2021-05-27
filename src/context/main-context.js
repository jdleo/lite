import { Component, createContext } from 'react';
const { Provider, Consumer } = createContext();

class MainContextProvider extends Component {
  state = {
    error: '',
  };

  /**
   * helper method to set error state
   * @param {string} error
   */
  setError(error) {
    this.setState({ error });
  }

  render() {
    return <Provider value={this}>{this.props.children}</Provider>;
  }
}

export { MainContextProvider, Consumer as MainContextConsumer };
