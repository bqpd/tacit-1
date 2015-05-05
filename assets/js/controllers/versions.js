$(document).ready(function() {

	var updateUndoBtn = function() {
		var disable = (undoredo.pointer-1 < 0)
		$("#undo-btn").attr("disabled", disable)			
	}

	var updateRedoBtn = function() {
		var disable = (undoredo.pointer+1 >= project.actionQueue.length)
		$("#redo-btn").attr("disabled", disable)			
	}

	var updateSaveBtn = function() {
		var disable = (project.actionQueue.length <= 1)
		$("#save-btn").attr("disabled", disable)		
	}

	var updateAllBtns = function() {
		updateUndoBtn();
		updateRedoBtn();
		updateSaveBtn();
	}

	$("#save-btn").click(function() {
		versions.save()
		updateAllBtns();
	})

	$("#undo-btn").click(function() {
		undoredo.undo();
		updateAllBtns();
	})

	$("#redo-btn").click(function() {
		undoredo.redo()
		updateAllBtns();
	})

	$("#PadView").on("mouseup", function() {
		var tool = project.easel.currentTool;
		if (tool && 
			tool.name === "draw" || 
			tool.name === "erase" || 
			tool.name === "move") {
			undoredo.log()
			updateAllBtns();
		}
	})

	$("#SuggestionsView").on("mouseup", function() {
		updateAllBtns();		
	})

})