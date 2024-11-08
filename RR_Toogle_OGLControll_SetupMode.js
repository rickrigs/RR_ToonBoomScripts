var localPath = specialFolders.userScripts;
include(localPath + '/OpenHarmony-0.10.18/openHarmony.js');

function toggleSetupMode() {
  var nodes = node.getNodes(["OglController"]);
  var trueCount = 0;

  nodes.forEach(function(n) {
    var attr = node.getAttr(n, 1, "setup");
    if (attr.boolValue()) {
      trueCount++;
    }
  });

  var newValue = trueCount < nodes.length / 2;

  nodes.forEach(function(n) {
    var attr = node.getAttr(n, 1, "setup");
    attr.setValue(newValue);
  });
}
