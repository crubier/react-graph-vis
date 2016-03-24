import {default as React, Component} from 'react';
const vis = require('vis');
const uuid = require('uuid');

class Graph extends Component {
  constructor(props) {
    super(props);
    this.updateGraph = this.updateGraph.bind(this);
    this.state = {
      hierarchicalLayout: true
    };
  }

  componentDidMount() {
    this.updateGraph();
  }

  componentDidUpdate() {
    this.updateGraph();
  }

  changeMode(event) {
    this.setState({hierarchicalLayout: !this.state.hierarchicalLayout});
    this.updateGraph();
  }

  updateGraph() {
    let container = document.getElementById(this.props.identifier);
    let options = {
      stabilize: false,
      smoothCurves: false,
      edges: {
        color: '#000000',
        width: 0.5,
        arrowScaleFactor: 0.5,
        style: 'arrow'
      }
    };

    if (this.state.hierarchicalLayout) {
      options.hierarchicalLayout = {
        enabled: true,
        direction: 'UD',
        levelSeparation: 100,
        nodeSpacing: 1
      };
    } else {
      options.hierarchicalLayout = {
        enabled: false
      };
    }

    new vis.Network(container, this.props.graph, options);
  }

  render() {
    return React.createElement('div', {onDoubleClick: this.changeMode.bind(this), id: this.props.identifier, style: this.props.style}, this.props.identifier);
  }
}

Graph.defaultProps = {
  graph: {},
  identifier: uuid.v4(),
  style: {width: '640px', height: '480px'}
};

module.exports = Graph;
