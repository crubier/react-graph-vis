import {default as React, Component} from 'react';
import defaultsDeep from 'lodash/fp/defaultsDeep';
import isEqual from 'lodash/isEqual';
import differenceWith from 'lodash/differenceWith';
import vis from 'vis';
import uuid from 'uuid';

class Graph extends Component {
  constructor(props) {
    super(props);
    const {identifier, graph} = this.props;
    this.updateGraph = this.updateGraph.bind(this);
    this.edges = new vis.DataSet();
    this.edges.add(graph.edges);
    this.nodes = new vis.DataSet();
    this.edges.add(graph.nodes);
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
    
    if (nodesChange) {
      const nodesRemoved = differenceWith(this.props.graph.nodes, nextProps.graph.nodes, isEqual)
      const nodesAdded = differenceWith(nextProps.graph.nodes, this.props.graph.nodes, isEqual)
      this.patchNodes({nodesRemoved, nodesAdded});
    }
    
    if (edgesChange) {
      const edgesRemoved = differenceWith(this.props.graph.edges, nextProps.graph.edges, isEqual)
      const edgesAdded = differenceWith(nextProps.graph.edges, this.props.graph.edges, isEqual)
      this.patchEdges({edgesRemoved, edgesAdded});
    }
    
    return optionsChange;
  }

  componentDidUpdate() {
    this.updateGraph();
  }
  
  patchEdges({edgesRemoved, edgesAdded}) {
    this.edges.add(edgesAdded);
    this.edges.remove(edgesRemoved);
  }
  
  patchNodes({nodesRemoved, nodesAdded}) {
    this.nodes.add(nodesAdded);
    this.nodes.remove(nodesRemoved);
  }

  updateGraph() {
    let container = document.getElementById(this.state.identifier);
    let defaultOptions = {
      physics: {
        stabilization: false
      },
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

    this.Network = new vis.Network(
      container,
      Object.assign(
        {},
        this.props.graph,
        {
          edges: this.edges,
          nodes: this.nodes
        }
      ),
      options
    );

    if (this.props.getNetwork) {
      this.props.getNetwork(this.Network)
    }

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
  getNetwork: React.PropTypes.function,
  style: { width: '640px', height: '480px' }
};

export default Graph;
