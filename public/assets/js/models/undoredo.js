// Generated by CoffeeScript 1.11.1
(function() {
  var UndoRedo;

  if (window.tacit == null) {
    window.tacit = {};
  }

  UndoRedo = (function() {
    function UndoRedo(project1) {
      var base;
      this.project = project1;
      this.pointer = -1;
      if ((base = this.project).actionQueue == null) {
        base.actionQueue = [];
      }
      this.log();
    }

    UndoRedo.prototype.log = function() {
      var beam, beamObjs, beams, clock, data, end, i, len, size, start, structure, tickfn;
      this.project.onChange();
      structure = new tacit.Structure(this.project.easel.pad.sketch.structure);
      structure.solve();
      clock = document.getElementById("timer");
      tickfn = function() {
        var fractions, itstopped, limit, minutes, seconds, t;
        limit = 60 * (window.tutorial ? 20.99 : 12.99);
        t = limit - (Date.parse(new Date()) - Date.parse(project.starttime)) / 1000;
        itstopped = Math.abs(project.last_t - t) > 1;
        console.log(t);
        project.last_t = t;
        fractions = t % 1;
        t -= fractions;
        seconds = t % 60;
        minutes = (t - seconds) / 60;
        seconds--;
        if (t < 0) {
          if (window.log.search("ran out of time") === -1) {
            return;
          }
        }
        if (t < 1) {
          $("#export-btn").click();
          window.log += "# ran out of time at " + new Date().toLocaleString() + " \n";
          firebase.database().ref(window.userid+'/structures/').push().set({
            type: "ran out of time",
            timestamp: new Date().toLocaleString()
          });
        } else if (t >= 0) {
          if (seconds < 10) {
            seconds = "0" + seconds;
          }
          if (minutes >= 1) {
            clock.innerHTML = ' | ' + minutes + ' minutes';
          } else {
            clock.innerHTML = " | " + minutes + ':' + seconds;
          }
        }
        return itstopped;
      };
      if (tickfn()) {
        console.log("restarting clock");
        setInterval(tickfn, 1000);
      }
      if ((this.project.actionQueue[this.pointer] == null) || this.project.actionQueue[this.pointer].strucstr !== structure.strucstr) {
        if (window.log == null) {
          window.log = "";
        }
        window.log += ("# at " + (new Date().toLocaleString()) + ", a new structure of weight " + structure.lp.obj + " with " + project.easel.pad.sketch.structure.nodeList.length + " nodes and " + project.easel.pad.sketch.structure.beamList.length + " beams was created by the " + project.easel.currentTool.name + " tool\n") + structure.strucstr + "\n";
        beams = structure.strucstr.split(/\r?\n/);
        beamObjs = [];
        for (i = 0, len = beams.length; i < len; i++) {
          beam = beams[i];
          data = beam.split(/\|/);
          size = data[1];
          data = data[0].split(/\>\>/);
          start = data[0].split(/\,/);
          end = data[1].split(/\,/);
          beamObjs.push({
            size: size.replace(/^\s+|\s+$/g, ""),
            start_x: start[0].replace(/^\s+|\s+$/g, ""),
            start_y: start[1].replace(/^\s+|\s+$/g, ""),
            end_x: end[0].replace(/^\s+|\s+$/g, ""),
            end_y: end[1].replace(/^\s+|\s+$/g, "")
          });
        }
        firebase.database().ref(window.userid+'/structures/').push().set({
          weight: structure.lp.obj,
          nodes: project.easel.pad.sketch.structure.nodeList.length,
          beams: project.easel.pad.sketch.structure.beamList.length,
          tool: project.easel.currentTool.name,
          details: beamObjs
        });
        this.project.actionQueue = this.project.actionQueue.slice(0, this.pointer + 1);
        this.project.actionQueue.push(structure);
        return this.pointer = this.project.actionQueue.length - 1;
      }
    };

    UndoRedo.prototype.undo = function() {
      var beam, beamObjs, beams, data, end, i, len, size, start, structure;
      if (this.pointer - 1 >= 0) {
        if (window.triggers.undo != null) {
          window.triggers.undo();
        }
        this.pointer -= 1;
        structure = new tacit.Structure(this.project.actionQueue[this.pointer]);
        this.project.easel.pad.load(structure);
        this.project.easel.pad.sketch.feapad = window.feapadpad;
        this.project.easel.pad.sketch.updateDrawing();
        this.project.easel.pad.sketch.dragline.attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("y2", 0);
        this.project.easel.currentTool.drawStart = false;
        window.log += ("# at " + (new Date().toLocaleString()) + ", a new structure of weight " + structure.lp.obj + " with " + project.easel.pad.sketch.structure.nodeList.length + " nodes and " + project.easel.pad.sketch.structure.beamList.length + " beams was created by the undo tool\n") + structure.strucstr + "\n";
        beams = structure.strucstr.split(/\r?\n/);
        beamObjs = [];
        for (i = 0, len = beams.length; i < len; i++) {
          beam = beams[i];
          data = beam.split(/\|/);
          size = data[1];
          data = data[0].split(/\>\>/);
          start = data[0].split(/\,/);
          end = data[1].split(/\,/);
          beamObjs.push({
            size: size.replace(/^\s+|\s+$/g, ""),
            start_x: start[0].replace(/^\s+|\s+$/g, ""),
            start_y: start[1].replace(/^\s+|\s+$/g, ""),
            end_x: end[0].replace(/^\s+|\s+$/g, ""),
            end_y: end[1].replace(/^\s+|\s+$/g, "")
          });
        }
        return firebase.database().ref(window.userid+'/structures/').push().set({
          weight: structure.lp.obj,
          nodes: project.easel.pad.sketch.structure.nodeList.length,
          beams: project.easel.pad.sketch.structure.beamList.length,
          tool: "undo",
          details: beamObjs
        });
      }
    };

    UndoRedo.prototype.redo = function() {
      var beam, beamObjs, beams, data, end, i, len, size, start;
      if (this.pointer + 1 < this.project.actionQueue.length) {
        this.pointer += 1;
        this.project.easel.pad.load(this.project.actionQueue[this.pointer]);
        this.project.easel.pad.sketch.feapad = window.feapadpad;
        this.project.easel.pad.sketch.updateDrawing();
        window.log += ("# at " + (new Date().toLocaleString()) + ", a new structure of weight " + structure.lp.obj + " with " + project.easel.pad.sketch.structure.nodeList.length + " nodes and " + project.easel.pad.sketch.structure.beamList.length + " beams was created by the redo tool\n") + structure.strucstr + "\n";
        beams = structure.strucstr.split(/\r?\n/);
        beamObjs = [];
        for (i = 0, len = beams.length; i < len; i++) {
          beam = beams[i];
          data = beam.split(/\|/);
          size = data[1];
          data = data[0].split(/\>\>/);
          start = data[0].split(/\,/);
          end = data[1].split(/\,/);
          beamObjs.push({
            size: size.replace(/^\s+|\s+$/g, ""),
            start_x: start[0].replace(/^\s+|\s+$/g, ""),
            start_y: start[1].replace(/^\s+|\s+$/g, ""),
            end_x: end[0].replace(/^\s+|\s+$/g, ""),
            end_y: end[1].replace(/^\s+|\s+$/g, "")
          });
        }
        return firebase.database().ref(window.userid+'/structures/').push().set({
          weight: structure.lp.obj,
          nodes: project.easel.pad.sketch.structure.nodeList.length,
          beams: project.easel.pad.sketch.structure.beamList.length,
          tool: "redo",
          details: beamObjs
        });
      }
    };

    return UndoRedo;

  })();

  window.tacit.UndoRedo = UndoRedo;

}).call(this);
