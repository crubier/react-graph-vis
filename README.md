# React graph vis

A React component to display beautiful network graphs using vis.js

Make sure to visit [visjs.org](http://visjs.org) for more info.

This package allows to render network graphs using vis.js.

Rendered graphs are scrollable, zoomable, retina ready, dynamic, and switch layout on double click.

![A graph rendered by vis js](example.png)


    var Graph = require('react-graph-vis');

    var data = {
      nodes: [
          {id: 1, label: 'Node 1'},
          {id: 2, label: 'Node 2'},
          {id: 3, label: 'Node 3'},
          {id: 4, label: 'Node 4'},
          {id: 5, label: 'Node 5'}
        ],
      edges: [
          {from: 1, to: 2},
          {from: 1, to: 3},
          {from: 2, to: 4},
          {from: 2, to: 5}
        ]
    };

    React.render(<Graph graph={data}/>, document.body);
