import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';

class ContinuousForceDirectedLayout extends go.ForceDirectedLayout {
    isFixed(v) {
      return v.node.isSelected;
    }
  
    // optimization: reuse the ForceDirectedNetwork rather than re-create it each time
    doLayout(coll) {
      if (!this._isObserving) {
        this._isObserving = true;
        // cacheing the network means we need to recreate it if nodes or links have been added or removed or relinked,
        // so we need to track structural model changes to discard the saved network.
        this.diagram.addModelChangedListener(e => {
          // modelChanges include a few cases that we don't actually care about, such as
          // "nodeCategory" or "linkToPortId", but we'll go ahead and recreate the network anyway.
          // Also clear the network when replacing the model.
          if (e.modelChange !== "" ||
            (e.change === go.ChangedEvent.Transaction && e.propertyName === "StartingFirstTransaction")) {
            this.network = null;
          }
        });
      }
      var net = this.network;
      if (net === null) {  // the first time, just create the network as normal
        this.network = net = this.makeNetwork(coll);
      } else {  // but on reuse we need to update the LayoutVertex.bounds for selected nodes
        this.diagram.nodes.each(n => {
          var v = net.findVertex(n);
          if (v !== null) v.bounds = n.actualBounds;
        });
      }
      // now perform the normal layout
      super.doLayout(coll);
      // doLayout normally discards the LayoutNetwork by setting Layout.network to null;
      // here we remember it for next time
      this.network = net;
    }
}

/*
  nodeDataArray={[
    { key: 0, text: 'NOMBRE', color: 'lightblue', loc: '0 0', fig: 'Ellipse', edit:false },
    { key: 1, text: 'Beta', color: 'orange', loc: '150 0' },
    { key: 2, text: 'Gamma', color: 'lightgreen', loc: '0 150' },
    { key: 3, text: 'Delta', color: 'pink', loc: '150 150' }
  ]}
  linkDataArray={[
    { key: -1, from: 0, to: 1 },
    { key: -2, from: 0, to: 2 },
    { key: -3, from: 1, to: 1 },
    { key: -4, from: 2, to: 3 },
    { key: -5, from: 3, to: 0 },
    { key: -6, from: 3, to: 2 },
  ]}
*/

function initDiagram() {

    // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
    // For details, see https://gojs.net/latest/intro/buildingObjects.html
    const $ = go.GraphObject.make;  // for conciseness in defining templates
  
    var myDiagram =
      $(go.Diagram,  // must name or refer to the DIV HTML element
        {
          initialAutoScale: go.Diagram.Uniform,  // an initial automatic zoom-to-fit
          contentAlignment: go.Spot.Center,  // align document to the center of the viewport
          layout:
            $(ContinuousForceDirectedLayout,  // automatically spread nodes apart while dragging
              { defaultSpringLength: 30, defaultElectricalCharge: 100 }),
          model: new go.GraphLinksModel(
            {
              linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
            }),
          // do an extra layout at the end of a move
          "SelectionMoved": e => e.diagram.layout.invalidateLayout()
        });
  
    // dragging a node invalidates the Diagram.layout, causing a layout during the drag
    myDiagram.toolManager.draggingTool.doMouseMove = function() {  // method override must be function, not =>
      go.DraggingTool.prototype.doMouseMove.call(this);
      if (this.isActive) this.diagram.layout.doLayout(true);
    }
  
    // define each Node's appearance
    myDiagram.nodeTemplate =
      $(go.Node, "Auto",  // the whole node panel
        // define the node's outer shape, which will surround the TextBlock
        $(go.Shape, "Circle",
          { fill: "CornflowerBlue", stroke: "black", spot1: new go.Spot(0, 0, 5, 5), spot2: new go.Spot(1, 1, -5, -5) }),
        $(go.TextBlock,
          { font: "bold 10pt helvetica, bold arial, sans-serif", textAlign: "center", maxSize: new go.Size(100, NaN) },
          new go.Binding("text", "text"))
      );
  
      myDiagram.nodeTemplate =
      $(go.Node, 'Auto',  // the Shape will go around the TextBlock
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, 'RoundedRectangle',
          new go.Binding("figure", "fig"),
          // Shape.fill is bound to Node.data.color
          new go.Binding('fill', 'color')),
        $(go.TextBlock,
          { margin: 8 },  // some room around the text
          new go.Binding('text').makeTwoWay(),
          //new go.Binding("editable", "edit"),
        )
      );
    // the rest of this app is the same as samples/conceptMap.html
  
    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate =
      $(go.Link,  // the whole link panel
        $(go.Shape,  // the link shape
          { stroke: "black" }),
        $(go.Shape,  // the arrowhead
          { toArrow: "standard", stroke: null }),
        {
            curve: go.Link.Bezier,
            toShortLength: 3
        }
        /*$(go.Panel, "Auto",
          $(go.Shape,  // the label background, which becomes transparent around the edges
            {
              fill: $(go.Brush, "Radial", { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
              stroke: null
            }),
          $(go.TextBlock,  // the label text
            {
              textAlign: "center",
              font: "10pt helvetica, arial, sans-serif",
              stroke: "#555555",
              margin: 4
            },
            new go.Binding("text", "text"))
        )*/
      );
  
    // create the model for the concept map
    /*var nodeDataArray = [
      { key: 1, text: "Concept Maps" },
      { key: 2, text: "Organized Knowledge" },
      { key: 3, text: "Context Dependent" },
      { key: 4, text: "Concepts" },
      { key: 5, text: "Propositions" },
      { key: 6, text: "Associated Feelings or Affect" },
      { key: 7, text: "Perceived Regularities" },
      { key: 8, text: "Labeled" },
      { key: 9, text: "Hierarchically Structured" },
      { key: 10, text: "Effective Teaching" },
      { key: 11, text: "Crosslinks" },
      { key: 12, text: "Effective Learning" },
      { key: 13, text: "Events (Happenings)" },
      { key: 14, text: "Objects (Things)" },
      { key: 15, text: "Symbols" },
      { key: 16, text: "Words" },
      { key: 17, text: "Creativity" },
      { key: 18, text: "Interrelationships" },
      { key: 19, text: "Infants" },
      { key: 20, text: "Different Map Segments" }
    ];
    var linkDataArray = [
      { from: 1, to: 2, text: "represent" },
      { from: 2, to: 3, text: "is" },
      { from: 2, to: 4, text: "is" },
      { from: 2, to: 5, text: "is" },
      { from: 2, to: 6, text: "includes" },
      { from: 2, to: 10, text: "necessary\nfor" },
      { from: 2, to: 12, text: "necessary\nfor" },
      { from: 4, to: 5, text: "combine\nto form" },
      { from: 4, to: 6, text: "include" },
      { from: 4, to: 7, text: "are" },
      { from: 4, to: 8, text: "are" },
      { from: 4, to: 9, text: "are" },
      { from: 5, to: 9, text: "are" },
      { from: 5, to: 11, text: "may be" },
      { from: 7, to: 13, text: "in" },
      { from: 7, to: 14, text: "in" },
      { from: 7, to: 19, text: "begin\nwith" },
      { from: 8, to: 15, text: "with" },
      { from: 8, to: 16, text: "with" },
      { from: 9, to: 17, text: "aids" },
      { from: 11, to: 18, text: "show" },
      { from: 12, to: 19, text: "begins\nwith" },
      { from: 17, to: 18, text: "needed\nto see" },
      { from: 18, to: 20, text: "between" }
    ];
    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);*/
    return myDiagram;
  }

function Grafo({nodos,links}) {
    return (
        <>
            <ReactDiagram
                initDiagram={initDiagram}
                divClassName='w-full h-[90vh] border border-gray-900 rounded-xl'
                nodeDataArray={nodos}
                linkDataArray={links}
            />
        </>
    )
}

export default Grafo;