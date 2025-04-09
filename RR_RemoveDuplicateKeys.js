var localPath = specialFolders.userScripts;
include(localPath + '/OpenHarmony/openHarmony.js');

function removeDuplicateKeysframes() {
    var allColumns = $.scn.columns;
    var selectedNodes = $.scn.selectedNodes; 
    var columnsToProcess = [];

    scene.beginUndoRedoAccum("Remove Duplicate Keys");

    // If Ctrl is pressed, all columns are processed. If not, only selected nodes' columns are processed.
    var isCtrlPressed = KeyModifiers.IsControlPressed();

    if (isCtrlPressed) {
        columnsToProcess = allColumns;
    } else {
        selectedNodes.forEach(function(node) {
            var nodeColumns = node.linkedColumns;
            columnsToProcess = columnsToProcess.concat(nodeColumns);
        });
    }

    columnsToProcess.forEach(function (column) {
        if (column === undefined) {
            return; // Skip undefined columns
        }

        var keyFrames = column.getKeyframes();
        var keyFrameValues = keyFrames.map(function (keyFrame) {
            return {
                frameNumber: keyFrame.frameNumber,
                value: column.getValue(keyFrame.frameNumber),
            };
        });

        keyFrameValues.forEach(function (keyFrame, index) {
            var prevKeyFrame = keyFrameValues[index - 1];
            var nextKeyFrame = keyFrameValues[index + 1];

            if (
                prevKeyFrame && nextKeyFrame &&
                keyFrame.value === prevKeyFrame.value &&
                keyFrame.value === nextKeyFrame.value
            ) {
                keyFrames[index].isKeyframe = false;
            } else if (
                !nextKeyFrame && prevKeyFrame &&
                keyFrame.value === prevKeyFrame.value
            ) {
                keyFrames[index].isKeyframe = false;
            } else {
                keyFrames[index].isKeyframe = true;
            }
        });
    });

    scene.endUndoRedoAccum();
}
