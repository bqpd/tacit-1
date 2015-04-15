@tacit ?= {}

class Pad
    constructor: (@easel, @htmlLoc, @height, @width, structure=null) ->
        if not structure?
            structure = new tacit.Structure
            new structure.Beam({x: 10, y: 0}, {x: 30, y: 40})
            new structure.Beam({x: 30, y: 40}, {x: 70, y: 0})
            new structure.Beam({x: 10, y: 0}, {x: -15, y: 110})
            new structure.Beam({x: -15, y: 110}, {x: 30, y: 40})
            new structure.Beam({x: 30, y: 40}, {x: 100, y: 40})
            new structure.Beam({x: 100, y: 40}, {x: 70, y: 0})
            structure.nodeList[i].fixed[dim] = true for i in [0,2] for dim in ["x", "y"]
            structure.nodeList[i].force[dim] = -200 for i in [1,3,4] for dim in ["y"]
        @sketch = new tacit.Sketch(this, @htmlLoc, structure, @height, @width)

    load: (structure) ->
        @sketch = new tacit.Sketch(this, @htmlLoc, structure, @height, @width)

@tacit.Pad = Pad
