// Generated by CoffeeScript 1.4.0
(function() {
  var drawTool, _base, _ref, _ref1;

  if ((_ref = window.tacit) == null) {
    window.tacit = {};
  }

  if ((_ref1 = (_base = window.tacit).tools) == null) {
    _base.tools = {};
  }

  drawTool = {
    drawStart: null,
    name: "draw",
    mouseDown: function(easel, eventType, mouseLoc, object) {
      var node, pos;
      if (!this.drawStart) {
        if (eventType !== "node") {
          pos = {
            x: mouseLoc[0],
            y: mouseLoc[1]
          };
          node = new easel.pad.sketch.structure.Node(pos);
          node.force.y = -100;
          easel.pad.sketch.updateDrawing();
        } else {
          pos = {
            x: object.x,
            y: object.y
          };
        }
        this.drawStart = pos;
        return easel.pad.sketch.dragline.attr("x1", pos.x).attr("x2", pos.x).attr("y1", pos.y).attr("y2", pos.y);
      }
    },
    mouseUp: function(easel, eventType, mouseLoc, object) {
      var node, pos;
      if (window.tutorial_state === 6) {
        window.advance_tutorial();
      }
      if (this.drawStart) {
        if (eventType !== "node") {
          pos = {
            x: mouseLoc[0],
            y: mouseLoc[1]
          };
          node = new easel.pad.sketch.structure.Node(pos);
          node.force.y = -100;
        } else {
          pos = {
            x: object.x,
            y: object.y
          };
        }
        if (pos.x !== this.drawStart.x && pos.y !== this.drawStart.y) {
          new easel.pad.sketch.structure.Beam(this.drawStart, pos);
          easel.pad.sketch.dragline.attr("x1", pos.x).attr("x2", pos.x).attr("y1", pos.y).attr("y2", pos.y);
          easel.pad.sketch.updateDrawing();
          return this.drawStart = null;
        }
      }
    },
    mouseMove: function(easel, eventType, mouseLoc, object) {
      if (this.drawStart) {
        easel.pad.sketch.dragline.attr("x2", mouseLoc[0]).attr("y2", mouseLoc[1]);
        return easel.pad.sketch.quickDraw();
      }
    }
  };

  window.tacit.tools.draw = drawTool;

}).call(this);
