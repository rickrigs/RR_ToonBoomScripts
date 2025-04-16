var localPath = specialFolders.userScripts;
include(localPath + '/OpenHarmony/openHarmony.js');

function removeDuplicateKeysframes() {
    var selectedNodes = $.scn.selectedNodes;
    var columnsToProcess = [];

    scene.beginUndoRedoAccum("Remove Duplicate Keys");

    var isCtrlPressed = KeyModifiers.IsControlPressed();

    if (isCtrlPressed || selectedNodes.length === 0) {
        columnsToProcess = $.scn.columns;
    } else {
        selectedNodes.forEach(function(node) {
            var nodeColumns = node.linkedColumns;
            columnsToProcess = columnsToProcess.concat(nodeColumns);
        });
    }

    function isClose(a, b, epsilon) {
        return Math.abs(a - b) <= epsilon;
    }

    var epsilon = 0.000099;

    columnsToProcess.forEach(function (column) {
        if (column === undefined) return;

        var keyFrames = column.getKeyframes();
        var keyFrameValues = keyFrames.map(function (keyFrame) {
            return {
                frameNumber: keyFrame.frameNumber,
                value: column.getValue(keyFrame.frameNumber)
            };
        });

        keyFrameValues.forEach(function (keyFrame, index) {
            var prevKeyFrame = keyFrameValues[index - 1];
            var nextKeyFrame = keyFrameValues[index + 1];

            if (
                prevKeyFrame && nextKeyFrame &&
                isClose(keyFrame.value, prevKeyFrame.value, epsilon) &&
                isClose(keyFrame.value, nextKeyFrame.value, epsilon)
            ) {
                keyFrames[index].isKeyframe = false;
            } else if (
                !nextKeyFrame && prevKeyFrame &&
                isClose(keyFrame.value, prevKeyFrame.value, epsilon)
            ) {
                keyFrames[index].isKeyframe = false;
            } else {
                keyFrames[index].isKeyframe = true;
            }
        });
    });

    scene.endUndoRedoAccum();
}
