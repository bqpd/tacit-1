// Generated by CoffeeScript 1.4.0
(function() {
  var Versions, dummyEasel, _ref;

  if ((_ref = window.tacit) == null) {
    window.tacit = {};
  }

  dummyEasel = (function() {

    function dummyEasel(versions, i) {
      this.versions = versions;
      this.i = i;
      null;
    }

    dummyEasel.prototype.mouseDown = function(easel, eventType, mouseLoc, object) {
      var structure;
      if (window.tutorial_state === 2 || window.tutorial_state === 8) {
        window.advance_tutorial();
      }
      structure = new tacit.Structure(this.versions.history[this.i].sketch.structure);
      this.versions.project.easel.pad.load(structure);
      this.versions.project.easel.pad.sketch.updateDrawing();
      this.versions.project.onChange();
      window.log += "\n# loaded structure\n" + structure.strucstr;
      return false;
    };

    dummyEasel.prototype.allowPan = function() {
      return false;
    };

    dummyEasel.prototype.mouseUp = function(easel, eventType, mouseLoc, object) {
      return false;
    };

    dummyEasel.prototype.mouseMove = function(easel, eventType, mouseLoc, object) {
      return false;
    };

    return dummyEasel;

  })();

  Versions = (function() {

    function Versions(project, htmlLoc) {
      this.project = project;
      this.htmlLoc = htmlLoc;
      this.history = [];
      this.newVersion();
    }

    Versions.prototype.newVersion = function() {
      var easel, pad, structure, versionObj;
      structure = new tacit.Structure(this.project.easel.pad.sketch.structure);
      structure.solve();
      versionObj = d3.select(this.htmlLoc).append("div").attr("id", "ver" + this.history.length).classed("ver", true);
      easel = new dummyEasel(this, this.history.length);
      versionObj.append("div").attr("id", "versvg" + this.history.length).classed("versvg", true);
      easel.weightDisplay = versionObj.append("div").classed("verwd", true)[0][0];
      pad = new tacit.Pad(easel, "#versvg" + this.history.length, 50, 50, structure);
      pad.load(structure);
      pad.sketch.nodeSize = 0;
      pad.sketch.showforce = false;
      pad.sketch.updateDrawing();
      return this.history.push(pad);
    };

    Versions.prototype.save = function() {
      var currently_at, structure;
      if (this.project.actionQueue.length > 1) {
        this.newVersion();
      }
      currently_at = this.project.actionQueue[undoredo.pointer];
      structure = new tacit.Structure(currently_at);
      structure.solve();
      this.project.actionQueue = [structure];
      undoredo.pointer = 0;
      return window.log += "\n# saved";
    };

    return Versions;

  })();

  window.tacit.Versions = Versions;

}).call(this);
