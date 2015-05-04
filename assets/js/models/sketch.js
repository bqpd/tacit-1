// Generated by CoffeeScript 1.4.0
(function() {
  var Sketch, abs, dist, max, min, pow, print, sqr, sqrt, sum, _ref,
    __slice = [].slice;

  abs = function(n) {
    return Math.abs(n);
  };

  min = function() {
    var n;
    n = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return Math.min.apply(Math, n);
  };

  max = function() {
    var n;
    n = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return Math.max.apply(Math, n);
  };

  pow = function(n, p) {
    return Math.pow(n, p);
  };

  sqr = function(n) {
    return Math.pow(n, 2);
  };

  sqrt = function(n) {
    return Math.sqrt(n);
  };

  sum = function(o) {
    if (o.length) {
      return o.reduce(function(a, b) {
        return a + b;
      });
    } else {
      return "";
    }
  };

  dist = function(a, b) {
    var ai, i;
    return sqrt(sum((function() {
      var _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = a.length; _i < _len; i = ++_i) {
        ai = a[i];
        _results.push(sqr(ai - (b ? b[i] : 0)));
      }
      return _results;
    })()));
  };

  print = function(o) {
    return console.log(o);
  };

  if ((_ref = window.tacit) == null) {
    window.tacit = {};
  }

  Sketch = (function() {

    function Sketch(pad, htmlLoc, structure, height, width, scale, translate) {
      var autozoom, d, draw, easel, htmlObj, list, maxs, means, mins, mousedn, n, _i, _len, _ref1, _ref2,
        _this = this;
      this.pad = pad;
      if (htmlLoc == null) {
        htmlLoc = "body";
      }
      this.height = height;
      this.width = width;
      this.showgrad = false;
      this.showforce = true;
      this.showzero = true;
      htmlObj = d3.select(htmlLoc);
      if (structure != null) {
        autozoom = true;
        this.structure = structure;
      } else {
        autozoom = false;
        this.structure = new tacit.Structure;
      }
      this.svg = htmlObj.append("svg:svg").attr("width", this.width).attr("height", this.height).attr("pointer-events", "all");
      if (autozoom && (scale != null) && (translate != null)) {
        autozoom = false;
      }
      this.translate = [10, 10];
      this.scale = 0.00001;
      this.nodeSize = 9;
      easel = this.pad.easel;
      this.zoomer = d3.behavior.zoom().on("zoom", function() {
        if (easel.allowPan()) {
          return _this.rescale();
        }
      });
      mousedn = function() {
        return _this.blank.call(d3.behavior.zoom().on("zoom"), function() {
          if (easel.allowPan()) {
            return _this.rescale();
          }
        });
      };
      this.selectedNodes = this.selectedLinks = [];
      this.blank = this.svg.append("svg:g").attr("transform", "translate(0," + height + ") scale(1,-1)").append("svg:g").call(this.zoomer).on("dblclick.zoom", null).append("svg:g").on("mousedown", mousedn);
      this.rect = this.blank.append("svg:rect").attr("x", -this.width / 2).attr("y", -this.height / 2).attr("width", this.width).attr("height", this.height).attr("fill", "transparent").on("mousedown", function(d) {
        return easel.mouseDown(easel, "background", d3.mouse(this), d);
      }).on("mousemove", function(d) {
        return easel.mouseMove(easel, "background", d3.mouse(this), d);
      }).on("mouseup", function(d) {
        return easel.mouseUp(easel, "background", d3.mouse(this), d);
      });
      if (!window.keysCaptured) {
        d3.select(window).on("keydown", function() {
          return easel.keyDown(easel, "window", d3.event.keyCode);
        });
        window.keysCaptured = true;
      }
      this.nodes = this.blank.selectAll(".node");
      this.links = this.blank.selectAll(".link");
      this.forces = this.blank.selectAll(".force");
      this.grads = this.blank.selectAll(".grad");
      this.dragline = this.blank.append("line").attr("class", "dragline").attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("y2", 0);
      if (autozoom != null) {
        _ref1 = [{}, {}, {}], mins = _ref1[0], maxs = _ref1[1], means = _ref1[2];
        _ref2 = ["x", "y", "z"];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          d = _ref2[_i];
          list = (function() {
            var _j, _len1, _ref3, _results;
            _ref3 = structure.nodeList;
            _results = [];
            for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
              n = _ref3[_j];
              _results.push(n[d]);
            }
            return _results;
          })();
          mins[d] = min.apply(null, list);
          maxs[d] = max.apply(null, list);
        }
        if (scale == null) {
          scale = 0.75 * min(this.width / (maxs.x - mins.x), this.height / (maxs.y - mins.y));
        }
        if (translate == null) {
          translate = [scale * (mins.x - maxs.x) / 2 + this.width / 2, scale * (mins.y - maxs.y) / 2 + this.height / 2];
        }
      }
      this.rescale(translate, scale, draw = false);
      this.initial_translate = [this.translate[0] * this.scale, this.translate[1] * this.scale];
      this.initial_scale = this.scale;
    }

    Sketch.prototype.defaultZoom = function() {
      return this.rescale(this.initial_translate, this.initial_scale);
    };

    Sketch.prototype.rescale = function(translate, scale, draw) {
      var d, list, maxs, means, mins, n, outBottom, outLeft, outRight, outTop, _i, _len, _ref1, _ref2;
      if (draw == null) {
        draw = true;
      }
      if (translate == null) {
        translate = d3.event.translate;
      }
      if (scale == null) {
        scale = d3.event.scale;
      }
      translate = [translate[0] / scale, translate[1] / scale];
      _ref1 = [{}, {}, {}], mins = _ref1[0], maxs = _ref1[1], means = _ref1[2];
      _ref2 = ["x", "y", "z"];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        d = _ref2[_i];
        list = (function() {
          var _j, _len1, _ref3, _results;
          _ref3 = this.structure.nodeList;
          _results = [];
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            n = _ref3[_j];
            _results.push(n[d]);
          }
          return _results;
        }).call(this);
        mins[d] = min.apply(null, list);
        maxs[d] = max.apply(null, list);
      }
      outLeft = mins.x + translate[0] < -this.translate[0];
      outBottom = mins.y + translate[1] < -this.translate[1];
      outRight = maxs.x + translate[0] > 6 / this.scale * (this.width / this.scale - this.translate[0]);
      outTop = maxs.y + translate[1] > 6 / this.scale * (this.height / this.scale - this.translate[1]);
      if (!(outLeft || outRight || outBottom || outTop)) {
        this.rect.attr("x", -translate[0]).attr("y", -translate[1]).attr("width", this.width / scale).attr("height", this.height / scale);
        this.scale = scale;
        this.translate = translate;
        this.blank.attr("transform", "scale(" + scale + ") translate(" + translate + ")");
        if (draw) {
          this.resize();
        }
      }
      this.zoomer.translate([this.translate[0] * this.scale, this.translate[1] * this.scale]);
      return this.zoomer.scale(this.scale);
    };

    Sketch.prototype.updateDrawing = function() {
      var easel;
      easel = this.pad.easel;
      this.links = this.links.data(this.structure.beamList);
      this.links.enter().insert("line", ".node").attr("class", "link").on("mousedown", function(d) {
        return easel.mouseDown(easel, "beam", d3.mouse(this), d);
      }).on("mousemove", function(d) {
        return easel.mouseMove(easel, "beam", d3.mouse(this), d);
      }).on("mouseup", function(d) {
        return easel.mouseUp(easel, "beam", d3.mouse(this), d);
      });
      this.links.exit().transition().attr("r", 0).remove();
      this.forces = this.forces.data(this.structure.nodeList);
      this.forces.enter().insert("line").attr("class", "force").attr("stroke-width", 0).attr("marker-end", "url(#brtriangle)").on("mousedown", function(d) {
        return easel.mouseDown(easel, "force", d3.mouse(this), d);
      }).on("mousemove", function(d) {
        return easel.mouseMove(easel, "force", d3.mouse(this), d);
      }).on("mouseup", function(d) {
        return easel.mouseUp(easel, "force", d3.mouse(this), d);
      });
      this.forces.exit().remove();
      this.grads = this.grads.data(this.structure.nodeList);
      this.grads.enter().insert("line").attr("class", "grad").attr("stroke-width", 0).attr("marker-end", "url(#ptriangle)").on("mousedown", function(d) {
        return easel.mouseDown(easel, "grad", d3.mouse(this), d);
      }).on("mousemove", function(d) {
        return easel.mouseMove(easel, "grad", d3.mouse(this), d);
      }).on("mouseup", function(d) {
        return easel.mouseUp(easel, "grad", d3.mouse(this), d);
      });
      this.grads.exit().remove();
      this.nodes = this.nodes.data(this.structure.nodeList);
      this.nodes.enter().insert("circle").attr("class", "node").attr("r", this.nodeSize / this.scale / 2).on("mousedown", function(d) {
        return easel.mouseDown(easel, "node", d3.mouse(this), d);
      }).on("mousemove", function(d) {
        return easel.mouseMove(easel, "node", d3.mouse(this), d);
      }).on("mouseup", function(d) {
        return easel.mouseUp(easel, "node", d3.mouse(this), d);
      }).transition().duration(750).ease("elastic").attr("r", this.nodeSize / this.scale);
      this.nodes.exit().transition().attr("r", 0).remove();
      return this.slowDraw();
    };

    Sketch.prototype.slowDraw = function() {
      var w,
        _this = this;
      this.structure.solve();
      w = this.structure.nodeList.length / this.structure.lp.obj;
      this.dragline.attr("stroke-width", 10 / this.scale).attr("stroke-dasharray", 10 / this.scale + "," + 10 / this.scale);
      this.links.attr("x1", function(d) {
        return d.source.x;
      }).attr("x2", function(d) {
        return d.target.x;
      }).attr("y1", function(d) {
        return d.source.y;
      }).attr("y2", function(d) {
        return d.target.y;
      }).attr("stroke-dasharray", function(d) {
        if (d.F) {
          return null;
        } else {
          return 10 / _this.scale + "," + 10 / _this.scale;
        }
      }).classed("compression", function(d) {
        return d.f < 0;
      }).classed("tension", function(d) {
        return d.f > 0;
      }).classed("selected", function(d) {
        return _this.selectedLinks.indexOf(d) + 1;
      }).transition().duration(750).ease("elastic").attr("stroke-width", function(d) {
        return 0.35 * sqrt(d.F) || 5 / _this.scale * _this.showzero;
      });
      this.nodes.attr("cx", function(d) {
        return d.x;
      }).attr("cy", function(d) {
        return d.y;
      }).classed("selected", function(d) {
        return _this.selectedNodes.indexOf(d) + 1;
      }).transition().duration(750).ease("elastic").attr("r", function(d) {
        return _this.nodeSize / _this.scale * (_this.selectedNodes.indexOf(d) + 1 ? 1.5 : 1);
      });
      this.forces.attr("x1", function(d) {
        return d.x;
      }).attr("x2", function(d) {
        return d.x + d.force.x / 6;
      }).attr("y1", function(d) {
        return d.y;
      }).attr("y2", function(d) {
        return d.y + d.force.y / 6;
      }).attr("stroke-width", function(d) {
        var f;
        if (!d.fixed.y && dist((function() {
          var _ref1, _results;
          _ref1 = d.force;
          _results = [];
          for (d in _ref1) {
            f = _ref1[d];
            _results.push(f);
          }
          return _results;
        })()) > 0) {
          return 8 / _this.scale * _this.showforce;
        } else {
          return 0;
        }
      });
      this.grads.attr("x1", function(d) {
        return d.x;
      }).attr("x2", function(d) {
        return d.x - 50 / _this.scale * d.grad.x * w;
      }).attr("y1", function(d) {
        return d.y;
      }).attr("y2", function(d) {
        return d.y - 50 / _this.scale * d.grad.y * w;
      }).attr("stroke-width", function(d) {
        var l;
        if (50 / _this.scale * dist((function() {
          var _ref1, _results;
          _ref1 = d.grad;
          _results = [];
          for (d in _ref1) {
            l = _ref1[d];
            _results.push(l);
          }
          return _results;
        })()) * w > 0.05) {
          return 10 / _this.scale * _this.showgrad;
        } else {
          return 0;
        }
      });
      if (this.onChange != null) {
        return this.onChange();
      }
    };

    Sketch.prototype.quickDraw = function() {
      var w,
        _this = this;
      this.structure.solve();
      this.resize();
      w = this.structure.nodeList.length / this.structure.lp.obj;
      this.dragline.attr("stroke-width", 10 / this.scale).attr("stroke-dasharray", 10 / this.scale + "," + 10 / this.scale);
      this.links.attr("x1", function(d) {
        return d.source.x;
      }).attr("x2", function(d) {
        return d.target.x;
      }).attr("y1", function(d) {
        return d.source.y;
      }).attr("y2", function(d) {
        return d.target.y;
      }).classed("compression", function(d) {
        return d.f < 0;
      }).classed("tension", function(d) {
        return d.f > 0;
      });
      this.nodes.attr("cx", function(d) {
        return d.x;
      }).attr("cy", function(d) {
        return d.y;
      });
      this.forces.attr("x1", function(d) {
        return d.x;
      }).attr("x2", function(d) {
        return d.x + d.force.x / 6;
      }).attr("y1", function(d) {
        return d.y;
      }).attr("y2", function(d) {
        return d.y + d.force.y / 6;
      });
      this.grads.attr("x1", function(d) {
        return d.x;
      }).attr("x2", function(d) {
        return d.x - 50 / _this.scale * d.grad.x * w;
      }).attr("y1", function(d) {
        return d.y;
      }).attr("y2", function(d) {
        return d.y - 50 / _this.scale * d.grad.y * w;
      });
      if (this.onChange != null) {
        return this.onChange();
      }
    };

    Sketch.prototype.resize = function() {
      var w,
        _this = this;
      w = this.structure.nodeList.length / this.structure.lp.obj;
      this.links.attr("stroke-dasharray", function(d) {
        if (d.F) {
          return null;
        } else {
          return 10 / _this.scale + "," + 10 / _this.scale;
        }
      }).attr("stroke-width", function(d) {
        return 0.35 * sqrt(d.F) || 5 / _this.scale * _this.showzero;
      }).classed("selected", function(d) {
        return _this.selectedLinks.indexOf(d) + 1;
      });
      this.nodes.attr("r", function(d) {
        return _this.nodeSize / _this.scale * (_this.selectedNodes.indexOf(d) + 1 ? 1.5 : 1);
      }).classed("selected", function(d) {
        return _this.selectedNodes.indexOf(d) + 1;
      });
      this.forces.attr("stroke-width", function(d) {
        var f;
        if (!d.fixed.y && dist((function() {
          var _ref1, _results;
          _ref1 = d.force;
          _results = [];
          for (d in _ref1) {
            f = _ref1[d];
            _results.push(f);
          }
          return _results;
        })()) > 0) {
          return 8 / _this.scale * _this.showforce;
        } else {
          return 0;
        }
      });
      return this.grads.attr("stroke-width", function(d) {
        var l;
        if (50 / _this.scale * dist((function() {
          var _ref1, _results;
          _ref1 = d.grad;
          _results = [];
          for (d in _ref1) {
            l = _ref1[d];
            _results.push(l);
          }
          return _results;
        })()) * w > 0.05) {
          return 10 / _this.scale * _this.showgrad;
        } else {
          return 0;
        }
      });
    };

    return Sketch;

  })();

  window.tacit.Sketch = Sketch;

}).call(this);
