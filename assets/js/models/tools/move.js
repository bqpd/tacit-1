// Generated by CoffeeScript 1.4.0
(function() {
  var abs, atan2, max, moveTool, sin, sqr, sqrt, _base, _ref, _ref1,
    __slice = [].slice;

  if ((_ref = window.tacit) == null) {
    window.tacit = {};
  }

  if ((_ref1 = (_base = window.tacit).tools) == null) {
    _base.tools = {};
  }

  sqr = function(a) {
    return Math.pow(a, 2);
  };

  abs = function(a) {
    return Math.abs(a);
  };

  sqrt = function(a) {
    return Math.sqrt(a);
  };

  max = function() {
    var n;
    n = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return Math.max.apply(Math, n);
  };

  sin = function(a) {
    return Math.sin(a);
  };

  atan2 = function(a, b) {
    return Math.atan2(a, b);
  };

  moveTool = {
    allowPan: true,
    name: "move",
    dontSelectImmovable: true,
    mouseDown: function(easel, eventType, mouseLoc, object) {
      var idx;
      if (eventType === "node") {
        if (!(object.immovable != null)) {
          this.selection = object;
          this.selectiontype = "node";
          this.allowPan = false;
          this.dragstart = true;
          idx = easel.pad.sketch.selectedNodes.indexOf(object);
          if (idx === -1) {
            easel.pad.sketch.selectedNodes.push(object);
          }
          return easel.pad.sketch.quickDraw();
        }
      } else if (eventType === "beam") {
        this.selection = object;
        this.selectiontype = "beam";
        this.allowPan = false;
        this.dragstart = {
          x: mouseLoc[0],
          y: mouseLoc[1],
          size: object.size
        };
        easel.pad.sketch.selectedLinks = [this.selection];
        return easel.pad.sketch.slowDraw();
      }
    },
    mouseUp: function(easel, eventType, mouseLoc, object) {
      var idx;
      if (this.selectiontype === "node") {
        idx = easel.pad.sketch.selectedNodes.indexOf(this.selection);
        easel.pad.sketch.selectedNodes.splice(idx, 1);
        easel.pad.sketch.quickDraw();
      } else if (this.selectiontype === "beam") {
        easel.pad.sketch.selectedLinks = [];
        easel.pad.sketch.slowDraw();
      }
      this.selection = null;
      this.selectiontype = null;
      this.dragstart = null;
      return this.allowPan = true;
    },
    mouseMove: function(easel, eventType, mouseLoc, object) {
      var b_x, b_y, d_x, d_y, orthogonal, pos;
      if (this.dragstart) {
        pos = {
          x: mouseLoc[0],
          y: mouseLoc[1]
        };
        if (this.selectiontype === "node") {
          this.selection.moveto(pos);
        } else if (this.selectiontype === "beam") {
          d_x = pos.x - this.dragstart.x;
          d_y = pos.y - this.dragstart.y;
          b_x = this.selection.source.x - this.selection.target.x;
          b_y = this.selection.source.y - this.selection.target.y;
          orthogonal = -(b_x * d_y - b_y * d_x) / this.selection.L;
          orthogonal *= abs(orthogonal) / 10;
          if (orthogonal < 0) {
            orthogonal = orthogonal / 2;
          }
          this.selection.size = max(0.5, orthogonal + this.dragstart.size);
        }
        return easel.pad.sketch.quickDraw();
      }
    }
  };

  window.tacit.tools.move = moveTool;

}).call(this);
