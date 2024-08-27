var localPath = specialFolders.userScripts;
include(localPath + '/packages/RR_SelectPresets/RR_SelectPresets.js');

function LoadRRToolbar() {
    // Define the full path for the preset icons
    var iconPathPrefix = localPath + "/packages/RR_SelectPresets/Img/";

    // Array to store the actions and buttons
    var presetActions = [];
    var presetButtons = [];

    // Define the actions and buttons for presets 1 to 10
    for (var i = 1; i <= 10; i++) {
        var actionId = "SelectPreset_" + (i < 10 ? '0' : '') + i;
        var actionText = "Select" + (i < 10 ? '0' : '') + i;

        // Define the action object
        var presetAction = {
            id: actionId,
            text: actionText,
            icon: iconPathPrefix + "Sel" + i + ".png", // Full path for icons from Sel1.png to Sel10.png
            checkable: false,
            isEnabled: true,
            isChecked: false,
            onTrigger: (function(index) {
                return function() {
                    SelectPreset(index);
                };
            })(i)
        };

        // Add the action to the ScriptManager
        ScriptManager.addAction(presetAction);
        presetActions.push(presetAction);

        // Define the button for the toolbar
        var presetButton = {
            text: presetAction.text,
            icon: presetAction.icon,
            checkable: presetAction.checkable,
            action: presetAction.id // Reference to the action defined above
        };
        presetButtons.push(presetButton);
    }

    // Define the action object for SetPrefSelectPreset
    var setPrefAction = {
        id: "SetPrefSelectPreset",
        text: "SetPrefSelectPreset",
        icon: iconPathPrefix + "ChangePreset.png", // Full path for the ChangePreset.png icon
        checkable: false,
        isEnabled: true,
        isChecked: false,
        onTrigger: function() {
            return function() {
                SetPrefSelectPreset();
            };
        }()
    };

    // Add the action to the ScriptManager
    ScriptManager.addAction(setPrefAction);
    presetActions.push(setPrefAction);

    // Define the button for SetPrefSelectPreset on the toolbar
    var setPrefButton = {
        text: setPrefAction.text,
        icon: setPrefAction.icon,
        checkable: setPrefAction.checkable,
        action: setPrefAction.id // Reference to the action defined above
    };
    presetButtons.push(setPrefButton);

    // Define the toolbar RRToolbar
    var RRToolbar = new ScriptToolbarDef({
        id: "rr_select_presets",
        text: "RR Select Presets",
        customizable: true
    });
    RRToolbar.floatable = true; // Optional: makes the toolbar floatable

    // Add the buttons to the toolbar
    for (var j = 0; j < presetButtons.length; j++) {
        RRToolbar.addButton(presetButtons[j]);
    }

    // Add the toolbar to the ScriptManager
    ScriptManager.addToolbar(RRToolbar);
}

function configure(packageFolder, packageName) {
    LoadRRToolbar();
}

exports.configure = configure;
