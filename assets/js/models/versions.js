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
      var _this = this;
      console.log(this.i);
      this.versions.project.easel.pad.load(this.versions.history[this.i].sketch.structure);
      this.versions.project.easel.pad.sketch.onChange = function() {
        return suggestions.update(suggestions.project.easel.pad.sketch.structure);
      };
      this.versions.project.easel.pad.sketch.updateDrawing();
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
      var pad, structure;
      structure = new tacit.Structure(this.project.easel.pad.sketch.structure);
      structure.solve();
      pad = new tacit.Pad(new dummyEasel(this, this.history.length), this.htmlLoc, 60, 60, structure);
      this.history.push(pad);
      pad.load(structure);
      pad.sketch.nodeSize = 0;
      pad.sketch.showforce = false;
      return pad.sketch.updateDrawing();
    };

    Versions.prototype.save = function() {
      if (this.project.actionQueue.length > 1) {
        this.newVersion();
      }
      this.project.actionQueue = [this.project.actionQueue[this.project.actionQueue.length - 1]];
      return undoredo.pointer = 0;
    };

    return Versions;

  })();

  window.tacit.Versions = Versions;

}).call(this);