var localPath = specialFolders.userScripts;
include(localPath + '/OpenHarmony/openHarmony.js');

var pref = $.getPreferences();

function SetPrefSelectPreset() {

    function setupAllPreferences() {

        function ensurePreferences(prefix) {
            for (var i = 1; i <= 10; i++) {
                var prefName = prefix + i;

                var value = preferences.getString(prefName, "VerifyString");

                if (value == "VerifyString") {
                    pref.create(prefName, "value");
                } else {}
            }
        }

        ensurePreferences("PrefSelection_");
        ensurePreferences("SubSel_");
    }
    setupAllPreferences();

    var selNode = $.scn.selectedNodes;
    var selNodeString = selNode.toString();
    MessageLog.trace(selNodeString);

    // Create the sub-selection
    var sel = selection.selectedNodes();
    var subSels = new Array(sel.length);
    for (var i = 0; i < sel.length; i++) {
        var n = sel[i];
        var subSel = selection.subSelectionForNode(n);
        subSels[i] = subSel;
    }
    var subSelsString = JSON.stringify(subSels); // Convert the array to a JSON string
    MessageLog.trace(subSelsString);

    // Create the dialog
    var dialog = new QDialog();
    dialog.windowTitle = "Select Preference";

    // Function to create buttons
    function createButton(i) {
        var button = new QPushButton("Save in Pref " + i, dialog);
        button.setGeometry(10, 30 * i, 200, 30); // Set button position and size
        button.clicked.connect(function() {
            var prefKey = "PrefSelection_" + i;
            var subPrefKey = "SubSel_" + i;
            preferences.setString(prefKey, selNodeString);
            preferences.setString(subPrefKey, subSelsString);
            MessageLog.trace("Saved in: " + prefKey + " and " + selNodeString);
            MessageLog.trace("Saved in: " + subPrefKey + " and " + subSelsString);
            dialog.accept(); // Close the dialog after saving
        });
        button.show(); // Show the button
    }

    // Create and add buttons to the dialog
    for (var i = 1; i <= 10; i++) {
        createButton(i);
    }

    // Show the dialog
    dialog.exec();
}

function SelectPreset(PrefValue) {
    var nodeToSel = preferences.getString("PrefSelection_" + PrefValue, "value");
    var nodeSubToSel = preferences.getString("SubSel_" + PrefValue, "value");

    var nodeArray = nodeToSel.split(',');

    var nodeSubArray = nodeSubToSel
        .replace(/^\[\[|\]\]$/g, '') // Remove outer brackets
        .split('],[') // Split subarrays
        .map(function(subArray) {
            // Convert each subarray from string to an array of integers
            return subArray.split(',').map(Number);
        });

    // Clear current selection
    selection.clearSelection();

    // Iterate over nodes and their sub-selections
    for (var i = 0; i < nodeArray.length; i++) {
        var node = nodeArray[i];
        var subSel = nodeSubArray[i];

        // Add the node to the selection
        //MessageLog.trace("Adding node to selection: " + node);
        selection.addNodeToSelection(node);

        // Add the sub-selection for the node
        //MessageLog.trace("Adding sub-selection for node: " + node + " with sub-selection: " + subSel);
        selection.addSubSelectionForNode(node, subSel);

        // Verify if the function was called successfully
        //MessageLog.trace("Sub-selection added for node: " + node);
    }

    var timer = new QTimer();
    timer.singleShot = true;
    timer.interval = 0;

    var callback = function() {
        Action.perform("onActionCenterOnSelection()", "timelineView");
    };

    timer.timeout.connect(callback);
    timer.start();
}

function SelectPreset_01() { SelectPreset(1); }
function SelectPreset_02() { SelectPreset(2); }
function SelectPreset_03() { SelectPreset(3); }
function SelectPreset_04() { SelectPreset(4); }
function SelectPreset_05() { SelectPreset(5); }
function SelectPreset_06() { SelectPreset(6); }
function SelectPreset_07() { SelectPreset(7); }
function SelectPreset_08() { SelectPreset(8); }
function SelectPreset_09() { SelectPreset(9); }
function SelectPreset_10() { SelectPreset(10); }
