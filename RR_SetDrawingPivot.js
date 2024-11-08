var localPath = specialFolders.userScripts;
include(localPath + '/OpenHarmony/openHarmony.js');


function loadSetPivotUI() {

    var localPath = specialFolders.userScripts;
    var uiFile = localPath + '/RR/RR_SetPivotDrawing.ui';
    var ui = UiLoader.load(uiFile);

    ui.show();
    ui.activateWindow();
    ui.move(900, 175);

    // Checkboxes
    var checkSubstitutionDrawings = ui.substitutionGroupBox.checkSubstitutionDrawings;
    var checkShapes = ui.substitutionGroupBox.checkShapes;
    var checkStrokes = ui.substitutionGroupBox.checkStrokes;
    //$.log(checkSubstitutionDrawings.checked);
    var checkUnderlay = ui.artLayersGroupBox.checkUnderlay;
    var checkLineArt = ui.artLayersGroupBox.checkLineArt;
    var checkColorArt = ui.artLayersGroupBox.checkColorArt;
    var checkOverlay = ui.artLayersGroupBox.checkOverlay;

    // Buttons for directions
    var btnNorth = ui.pivotSettingsGroupBox.btnNorth;
    var btnSouth = ui.pivotSettingsGroupBox.btnSouth;
    var btnEast = ui.pivotSettingsGroupBox.btnEast;
    var btnWest = ui.pivotSettingsGroupBox.btnWest;
    var btnNorthWest = ui.pivotSettingsGroupBox.btnNorthWest;
    var btnNorthEast = ui.pivotSettingsGroupBox.btnNorthEast;
    var btnSouthWest = ui.pivotSettingsGroupBox.btnSouthWest;
    var btnSouthEast = ui.pivotSettingsGroupBox.btnSouthEast;
    var btnCenter = ui.pivotSettingsGroupBox.btnCenter;

    function setPivot(direction) {
        var selectedNodes = $.scn.selectedNodes;
        if (selectedNodes.length === 0) {
            $.log("No nodes selected.");
            return;
        }

        // Obtém o estado atual dos checkboxes
        var checkUnderlay = ui.artLayersGroupBox.checkUnderlay.checked;
        var checkLineArt = ui.artLayersGroupBox.checkLineArt.checked;
        var checkColorArt = ui.artLayersGroupBox.checkColorArt.checked;
        var checkOverlay = ui.artLayersGroupBox.checkOverlay.checked;
        var checkStrokes = ui.substitutionGroupBox.checkStrokes.checked;
        var checkShapes = ui.substitutionGroupBox.checkShapes.checked;

        // Verifica se nenhum dos dois checkboxes foi selecionado
        if (!checkStrokes && !checkShapes) {
            $.alert("Please select either 'Strokes' or 'Shapes' to proceed.");
            return;
        }

        selectedNodes.forEach(function (node) {
            if (node.type !== "READ") {
                $.log("Node is not a valid 'READ' node.");
                return;
            }

            var drawingSubstitutions = node.element.drawings;
            if (drawingSubstitutions.length === 0) {
                $.log("No drawing substitutions found.");
                return;
            }

            var originalValue = node.attributes.drawing.element.getValue($.scn.currentFrame);

            function processDrawing(drawingNode) {
                var myDrawing = drawingNode.getDrawingAtFrame($.scn.currentFrame);
                if (!myDrawing) {
                    $.log("No valid drawing found.");
                    return;
                }

                var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

                // Processando strokes
                if (checkStrokes) {
                    var strokes = [];
                    if (checkUnderlay && myDrawing.underlay) strokes = strokes.concat(myDrawing.underlay.strokes);
                    if (checkLineArt && myDrawing.lineArt) strokes = strokes.concat(myDrawing.lineArt.strokes);
                    if (checkColorArt && myDrawing.colorArt) strokes = strokes.concat(myDrawing.colorArt.strokes);
                    if (checkOverlay && myDrawing.overlay) strokes = strokes.concat(myDrawing.overlay.strokes);

                    if (strokes.length > 0) {
                        strokes.forEach(function (stroke) {
                            stroke.path.forEach(function (point) {
                                if (point.x < minX) minX = point.x;
                                if (point.x > maxX) maxX = point.x;
                                if (point.y < minY) minY = point.y;
                                if (point.y > maxY) maxY = point.y;
                            });
                        });
                    }
                }

                // Processando shapes (contornos)
                if (checkShapes) {
                    var shapes = [];
                    if (checkUnderlay && myDrawing.underlay) shapes = shapes.concat(myDrawing.underlay.contours);
                    if (checkLineArt && myDrawing.lineArt) shapes = shapes.concat(myDrawing.lineArt.contours);
                    if (checkColorArt && myDrawing.colorArt) shapes = shapes.concat(myDrawing.colorArt.contours);
                    if (checkOverlay && myDrawing.overlay) shapes = shapes.concat(myDrawing.overlay.contours);

                    if (shapes.length > 0) {
                        shapes.forEach(function (contour) {
                            contour.points.forEach(function (point) {
                                if (point.x < minX) minX = point.x;
                                if (point.x > maxX) maxX = point.x;
                                if (point.y < minY) minY = point.y;
                                if (point.y > maxY) maxY = point.y;
                            });
                        });
                    }
                }

                // Calculando o centro dos extremos
                var centerX = (minX + maxX) / 2;
                var centerY = (minY + maxY) / 2;

                var extremeX = centerX;
                var extremeY = centerY;

                // Definindo o pivô com base na direção
                switch (direction) {
                    case 'south':
                        extremeY = minY;
                        extremeX = centerX;
                        break;
                    case 'north':
                        extremeY = maxY;
                        extremeX = centerX;
                        break;
                    case 'east':
                        extremeX = maxX;
                        extremeY = centerY;
                        break;
                    case 'west':
                        extremeX = minX;
                        extremeY = centerY;
                        break;
                    case 'southeast':
                        extremeX = maxX;
                        extremeY = minY;
                        break;
                    case 'southwest':
                        extremeX = minX;
                        extremeY = minY;
                        break;
                    case 'northeast':
                        extremeX = maxX;
                        extremeY = maxY;
                        break;
                    case 'northwest':
                        extremeX = minX;
                        extremeY = maxY;
                        break;
                    case 'center':
                        extremeX = centerX;
                        extremeY = centerY;
                        break;
                    default:
                        $.log("Invalid direction specified.");
                        return;
                }

                if (extremeX !== null && extremeY !== null) {
                    var extremePoint = new $.oPoint(extremeX, extremeY);
                    myDrawing.pivot = extremePoint;
                    $.log("Pivot set to: x=" + extremePoint.x + ", y=" + extremePoint.y);
                } else {
                    $.log("No valid points found to set pivot.");
                }
            }

            if (checkSubstitutionDrawings.checked) {
                // Processa todas as substituições
                drawingSubstitutions.forEach(function (drawingSub) {
                    node.attributes.drawing.element.setValue(drawingSub, $.scn.currentFrame);
                    processDrawing(node);
                });
            } else {
                // Processa apenas a substituição original
                processDrawing(node);

                // Restaurar o valor original após o processamento

            }
            if (originalValue !== null) {
                    node.attributes.drawing.element.setValue(originalValue, $.scn.currentFrame);
            }
        });
    }

    function setPivotNorth() { setPivot('north'); }
    function setPivotSouth() { setPivot('south'); }
    function setPivotEast() { setPivot('east'); }
    function setPivotWest() { setPivot('west'); }
    function setPivotNorthwest() { setPivot('northwest'); }
    function setPivotNortheast() { setPivot('northeast'); }
    function setPivotSouthwest() { setPivot('southwest'); }
    function setPivotSoutheast() { setPivot('southeast'); }
    function setPivotCenter() { setPivot('center'); }

    btnNorth.clicked.connect(setPivotNorth);
    btnSouth.clicked.connect(setPivotSouth);
    btnEast.clicked.connect(setPivotEast);
    btnWest.clicked.connect(setPivotWest);
    btnNorthWest.clicked.connect(setPivotNorthwest);
    btnNorthEast.clicked.connect(setPivotNortheast);
    btnSouthWest.clicked.connect(setPivotSouthwest);
    btnSouthEast.clicked.connect(setPivotSoutheast);
    btnCenter.clicked.connect(setPivotCenter);




    var btnPrevious = ui.navigationGroupBox.btnPrevious;
    var btnNext = ui.navigationGroupBox.btnNext;

    var currentPointIndex = 0;
    var pointsArray = [];

    function initializePointsArray() {
        pointsArray = [];

        // Captura o estado atual dos checkboxes
        var checkUnderlay = ui.artLayersGroupBox.checkUnderlay.checked;
        var checkLineArt = ui.artLayersGroupBox.checkLineArt.checked;
        var checkColorArt = ui.artLayersGroupBox.checkColorArt.checked;
        var checkOverlay = ui.artLayersGroupBox.checkOverlay.checked;
        var checkStrokes = ui.substitutionGroupBox.checkStrokes.checked;
        var checkShapes = ui.substitutionGroupBox.checkShapes.checked;

        // Verifica se pelo menos uma das caixas de seleção de pontos está marcada
        if (!checkStrokes && !checkShapes) {
            $.alert("You need to select either Strokes or Shapes.");
            return;
        }

        // Obtém os nós atualmente selecionados
        var selectedNodes = $.scn.selectedNodes;
        if (selectedNodes.length === 0) {
            $.log("No nodes selected.");
            return;
        }

        selectedNodes.forEach(function (node) {
            if (node.type !== "READ") {
                $.log("Node is not a valid 'READ' node.");
                return;
            }

            // Obtém o desenho atual para o frame atual
            var myDrawing = node.getDrawingAtFrame($.scn.currentFrame);
            if (!myDrawing) {
                $.log("No valid drawing found.");
                return;
            }

            // Adiciona pontos dos strokes apenas se a opção estiver marcada
            if (checkStrokes) {
                var strokes = [];
                if (checkUnderlay && myDrawing.underlay) strokes = strokes.concat(myDrawing.underlay.strokes);
                if (checkLineArt && myDrawing.lineArt) strokes = strokes.concat(myDrawing.lineArt.strokes);
                if (checkColorArt && myDrawing.colorArt) strokes = strokes.concat(myDrawing.colorArt.strokes);
                if (checkOverlay && myDrawing.overlay) strokes = strokes.concat(myDrawing.overlay.strokes);

                strokes.forEach(function (stroke) {
                    stroke.points.forEach(function (point) {
                        pointsArray.push(point);
                    });
                });
            }

            // Adiciona pontos dos shapes (contornos) apenas se a opção estiver marcada
            if (checkShapes) {
                var shapes = [];
                if (checkUnderlay && myDrawing.underlay) shapes = shapes.concat(myDrawing.underlay.contours);
                if (checkLineArt && myDrawing.lineArt) shapes = shapes.concat(myDrawing.lineArt.contours);
                if (checkColorArt && myDrawing.colorArt) shapes = shapes.concat(myDrawing.colorArt.contours);
                if (checkOverlay && myDrawing.overlay) shapes = shapes.concat(myDrawing.overlay.contours);

                shapes.forEach(function (contour) {
                    contour.points.forEach(function (point) {
                        pointsArray.push(point);
                    });
                });
            }
        });

        if (pointsArray.length === 0) {
            $.log("No points found.");
        }
    }

    function updatePivotToCurrentPoint() {
        if (pointsArray.length === 0) {
            $.log("No points to set pivot.");
            return;
        }

        var point = pointsArray[currentPointIndex];
        var newPivotPoint = new $.oPoint(point.x, point.y);

        var selectedNodes = $.scn.selectedNodes;
        selectedNodes.forEach(function (node) {
            if (node.type === "READ") {
                var myDrawing = node.getDrawingAtFrame($.scn.currentFrame);
                if (myDrawing) {
                    myDrawing.pivot = newPivotPoint;
                    $.log("Pivot set to point: x=" + newPivotPoint.x + ", y=" + newPivotPoint.y);
                }
            }
        });
    }

    function setPivotNextPoint() {
    checkSubstitutionDrawings.checked = false;
        initializePointsArray();

        if (pointsArray.length > 0) {
            currentPointIndex = (currentPointIndex + 1) % pointsArray.length;
            updatePivotToCurrentPoint();
        }
    }

    function setPivotPreviousPoint() {
    checkSubstitutionDrawings.checked = false;
        initializePointsArray();

        if (pointsArray.length > 0) {
            currentPointIndex = (currentPointIndex - 1 + pointsArray.length) % pointsArray.length; // Retrocede para o ponto anterior (loop circular)
            updatePivotToCurrentPoint();
        }
    }

    btnNext.clicked.connect(setPivotNextPoint);
    btnPrevious.clicked.connect(setPivotPreviousPoint);





}

