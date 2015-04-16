// Generated by CoffeeScript 1.9.2
(function() {
  var base, eraseTool;

  if (window.tacit == null) {
    window.tacit = {};
  }

  if ((base = window.tacit).tools == null) {
    base.tools = {};
  }

  eraseTool = {
    mouseDown: function(easel, eventType, mouseLoc, object) {
      var idx, selection;
      this.dragging = true;
      if (eventType !== "background") {
        if (eventType === "node") {
          selection = easel.pad.sketch.selectedNodes;
        } else {
          selection = easel.pad.sketch.selectedLinks;
        }
        idx = selection.indexOf(object);
        if (idx === -1) {
          selection.push(object);
        } else {
          selection.splice(idx, 1);
        }
        if (eventType === "node") {
          easel.pad.sketch.selectedNodes = selection;
        } else {
          easel.pad.sketch.selectedLinks = selection;
        }
        return easel.pad.sketch.slowDraw();
      }
    },
    mouseUp: function(easel, eventType, mouseLoc, object) {
      var i, j, len, len1, link, node, ref, ref1;
      this.dragging = false;
      ref = easel.pad.sketch.selectedNodes;
      for (i = 0, len = ref.length; i < len; i++) {
        node = ref[i];
        node["delete"]();
      }
      ref1 = easel.pad.sketch.selectedLinks;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        link = ref1[j];
        link["delete"]();
      }
      easel.pad.sketch.selectedLinks = easel.pad.sketch.selectedNodes = [];
      return easel.pad.sketch.updateDrawing();
    },
    mouseMove: function(easel, eventType, mouseLoc, object) {
      var idx, selection;
      if (this.dragging) {
        if (eventType !== "background") {
          if (eventType === "node") {
            selection = easel.pad.sketch.selectedNodes;
          } else {
            selection = easel.pad.sketch.selectedLinks;
          }
          idx = selection.indexOf(object);
          if (idx === -1) {
            selection.push(object);
          }
          if (eventType === "node") {
            easel.pad.sketch.selectedNodes = selection;
          } else {
            easel.pad.sketch.selectedLinks = selection;
          }
          return easel.pad.sketch.quickDraw();
        }
      }
    }
  };

  window.tacit.tools.erase = eraseTool;

}).call(this);