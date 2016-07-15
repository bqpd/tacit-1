window.tacit ?= {}

class dummyEasel
    constructor: (@versions, @i) -> null

    mouseDown: (easel, eventType, mouseLoc, object) ->
        if window.triggers.load?
            window.triggers.load()
        structure = new tacit.Structure(@versions.history[@i].sketch.structure)
        @versions.project.easel.pad.load(structure)
        @versions.project.easel.pad.sketch.feapad = window.feapadpad
        console.log @versions.project.easel.pad.sketch.feapad?
        @versions.project.easel.pad.sketch.updateDrawing()
        @versions.project.easel.pad.sketch.fea()
        @versions.project.onChange()
        window.log += "\n# loaded structure\n" + structure.strucstr
        return false

    allowPan: -> false
    mouseUp: (easel, eventType, mouseLoc, object) -> false
    mouseMove: (easel, eventType, mouseLoc, object) -> false

class Versions
    constructor: (@project, @htmlLoc) ->
        @history = []
        @newVersion()

    newVersion: (structure) ->
        if not structure?
            structure = new tacit.Structure(@project.easel.pad.sketch.structure)
        else
            console.log "yo"
        @project.easel.pad.sketch.fea()
        versionObj = d3.select(@htmlLoc).append("div").attr("id", "ver"+@history.length).classed("ver", true)
        easel = new dummyEasel(this, @history.length)
        versionObj.append("div").attr("id", "versvg"+@history.length).classed("versvg", true)
        easel.weightDisplay = versionObj.append("div").classed("verwd", true)[0][0]
        pad = new tacit.Pad(easel, "#versvg"+@history.length, 50, 50, structure)
        pad.load(structure, genhelper=false)
        pad.sketch.nodeSize = 0
        pad.sketch.showforce = false
        pad.sketch.updateDrawing()
        @history.push(pad)
        pad.sketch.fea()
        saved = Math.round(pad.sketch.structure.lp.obj/100)
        if saved <= $("#bestweight").text().substr(1)
            $("#bestweight").text("$"+saved)
            $("#bestcontainer").css("display", "")
            if window.triggers.beat?
                window.triggers.beat()

    save: (structure) ->
        if window.triggers.save?
            window.triggers.save()
        if @project.actionQueue.length > 1 or structure?
            @newVersion(structure)
        window.log += "\n# saved"

window.tacit.Versions = Versions
