function Select(toolbar) {

	this.toolbar = toolbar;

    this.name = "Select Tool";
    this.cursor = = "assets/resources/cursor-images/grab.png";

    this.undo = function() {
        return null;
    };

    this.makeCurrent = function() {
        this.toolbar.easel.currentTool = this;
    };

    // Write event handlers here
}