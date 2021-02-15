"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _defaultsDeep = require("lodash/fp/defaultsDeep");

var _defaultsDeep2 = _interopRequireDefault(_defaultsDeep);

var _isEqual = require("lodash/isEqual");

var _isEqual2 = _interopRequireDefault(_isEqual);

var _differenceWith = require("lodash/differenceWith");

var _differenceWith2 = _interopRequireDefault(_differenceWith);

var _visData = require("vis-data");

var _visNetwork = require("vis-network");

var _uuid = require("uuid");

var _uuid2 = _interopRequireDefault(_uuid);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Graph = function (_Component) {
  _inherits(Graph, _Component);

  function Graph(props) {
    _classCallCheck(this, Graph);

    var _this = _possibleConstructorReturn(this, (Graph.__proto__ || Object.getPrototypeOf(Graph)).call(this, props));

    var identifier = props.identifier;

    _this.updateGraph = _this.updateGraph.bind(_this);
    _this.state = {
      identifier: identifier !== undefined ? identifier : _uuid2.default.v4()
    };
    _this.container = _react2.default.createRef();
    return _this;
  }

  _createClass(Graph, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.edges = new _visData.DataSet();
      this.edges.add(this.props.graph.edges);
      this.nodes = new _visData.DataSet();
      this.nodes.add(this.props.graph.nodes);
      this.updateGraph();
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var nodesChange = !(0, _isEqual2.default)(this.props.graph.nodes, nextProps.graph.nodes);
      var edgesChange = !(0, _isEqual2.default)(this.props.graph.edges, nextProps.graph.edges);
      var optionsChange = !(0, _isEqual2.default)(this.props.options, nextProps.options);
      var eventsChange = !(0, _isEqual2.default)(this.props.events, nextProps.events);

      if (nodesChange) {
        var idIsEqual = function idIsEqual(n1, n2) {
          return n1.id === n2.id;
        };
        var nodesRemoved = (0, _differenceWith2.default)(this.props.graph.nodes, nextProps.graph.nodes, idIsEqual);
        var nodesAdded = (0, _differenceWith2.default)(nextProps.graph.nodes, this.props.graph.nodes, idIsEqual);
        var nodesChanged = (0, _differenceWith2.default)((0, _differenceWith2.default)(nextProps.graph.nodes, this.props.graph.nodes, _isEqual2.default), nodesAdded);
        this.patchNodes({ nodesRemoved: nodesRemoved, nodesAdded: nodesAdded, nodesChanged: nodesChanged });
      }

      if (edgesChange) {
        var edgesRemoved = (0, _differenceWith2.default)(this.props.graph.edges, nextProps.graph.edges, _isEqual2.default);
        var edgesAdded = (0, _differenceWith2.default)(nextProps.graph.edges, this.props.graph.edges, _isEqual2.default);
        var edgesChanged = (0, _differenceWith2.default)((0, _differenceWith2.default)(nextProps.graph.edges, this.props.graph.edges, _isEqual2.default), edgesAdded);
        this.patchEdges({ edgesRemoved: edgesRemoved, edgesAdded: edgesAdded, edgesChanged: edgesChanged });
      }

      if (optionsChange) {
        this.Network.setOptions(nextProps.options);
      }

      if (eventsChange) {
        var events = this.props.events || {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.keys(events)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var eventName = _step.value;
            this.Network.off(eventName, events[eventName]);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        events = nextProps.events || {};
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = Object.keys(events)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _eventName = _step2.value;
            this.Network.on(_eventName, events[_eventName]);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      return false;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.updateGraph();
    }
  }, {
    key: "patchEdges",
    value: function patchEdges(_ref) {
      var edgesRemoved = _ref.edgesRemoved,
          edgesAdded = _ref.edgesAdded,
          edgesChanged = _ref.edgesChanged;

      this.edges.remove(edgesRemoved);
      this.edges.add(edgesAdded);
      this.edges.update(edgesChanged);
    }
  }, {
    key: "patchNodes",
    value: function patchNodes(_ref2) {
      var nodesRemoved = _ref2.nodesRemoved,
          nodesAdded = _ref2.nodesAdded,
          nodesChanged = _ref2.nodesChanged;

      this.nodes.remove(nodesRemoved);
      this.nodes.add(nodesAdded);
      this.nodes.update(nodesChanged);
    }
  }, {
    key: "updateGraph",
    value: function updateGraph() {
      var defaultOptions = {
        physics: {
          stabilization: false
        },
        autoResize: false,
        edges: {
          smooth: false,
          color: "#000000",
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
      var options = (0, _defaultsDeep2.default)(defaultOptions, this.props.options);

      this.Network = new _visNetwork.Network(this.container.current, Object.assign({}, this.props.graph, {
        edges: this.edges,
        nodes: this.nodes
      }), options);

      if (this.props.getNetwork) {
        this.props.getNetwork(this.Network);
      }

      if (this.props.getNodes) {
        this.props.getNodes(this.nodes);
      }

      if (this.props.getEdges) {
        this.props.getEdges(this.edges);
      }

      // Add user provied events to network
      var events = this.props.events || {};
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = Object.keys(events)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var eventName = _step3.value;

          this.Network.on(eventName, events[eventName]);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var identifier = this.state.identifier;
      var style = this.props.style;

      return _react2.default.createElement("div", {
        id: identifier,
        ref: this.container,
        style: style
      }, identifier);
    }
  }]);

  return Graph;
}(_react.Component);

Graph.defaultProps = {
  graph: {},
  style: { width: "100%", height: "100%" }
};
Graph.propTypes = {
  graph: _propTypes2.default.object,
  style: _propTypes2.default.object,
  getNetwork: _propTypes2.default.func,
  getNodes: _propTypes2.default.func,
  getEdges: _propTypes2.default.func
};

exports.default = Graph;