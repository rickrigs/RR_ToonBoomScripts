var localPath = specialFolders.userScripts;
include(localPath + '/OpenHarmony/openHarmony.js');

function logAllKeyframes() {
    var allColumns = $.scn.columns;

    allColumns.forEach(function(column) {
        var keyFrames = column.getKeyframes();
        var frameValues = {};
        var repeatedFrames = [];

        keyFrames.forEach(function(keyFrame) {
            var frameNumber = keyFrame.frameNumber;
            var frameValue = column.getValue(frameNumber);

            if (frameValues[frameValue] === undefined) {
                frameValues[frameValue] = frameNumber;
            } else {
                repeatedFrames.push(frameNumber);
            }
        });

        keyFrames.forEach(function(keyFrame) {
            var frameNumber = keyFrame.frameNumber;
            var frameValue = column.getValue(frameNumber);

            if (repeatedFrames.indexOf(frameNumber) !== -1) {
                keyFrame.isKeyframe = false;
            }

            $.log("Frame " + frameNumber + ": " + frameValue + " - isKeyframe: " + keyFrame.isKeyframe);
        });
    });
}
