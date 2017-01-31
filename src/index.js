import {default as React, Component} from 'react';
import defaultsDeep from 'lodash/fp/defaultsDeep';
import isEqual from 'lodash/isEqual';


const vis = require('vis');
const uuid = require('uuid');

class Graph extends Component {
  constructor(props) {
    super(props);
    const {identifier} = this.props;
    this.updateGraph = this.updateGraph.bind(this);
    this.state = {
      identifier : identifier !== undefined ? identifier : uuid.v4()
    };
  }

  componentDidMount() {
    this.updateGraph();
  }

  shouldComponentUpdate(nextProps, nextState) {
    let nodesChange = !isEqual(this.props.graph.nodes, nextProps.graph.nodes);
    let edgesChange = !isEqual(this.props.graph.edges, nextProps.graph.edges);
    let optionsChange = !isEqual(this.props.options, nextProps.options);
    return nodesChange || edgesChange || optionsChange;
  }

  componentDidUpdate() {
    this.updateGraph();
  }

  updateGraph() {
    let container = document.getElementById(this.state.identifier);
    let defaultOptions = {
      autoResize: false,
      edges: {
        smooth: false,
        color: '#000000',
        width: 0.5,
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 0.5
          }
        }   
      }
    };
    // merge user provied options with our default ones
    let options = defaultsDeep(defaultOptions, this.props.options);
    console.log("new graph created hey");
    this.Network = new vis.Network(container, this.props.graph, options);
    // Add user provied events to network
    let events = this.props.events || {};
    for (let eventName of Object.keys(events)) {
      this.Network.on(eventName, events[eventName]);
    }
  }

  render() {
    const { identifier } = this.state;
    const { style } = this.props;
    return React.createElement('div', 
        {
          id: identifier, 
          style
        }, 
        identifier
      );
  }
}

Graph.defaultProps = {
  graph: {},
  style: { width: '640px', height: '480px' }
};

export default Graph;
