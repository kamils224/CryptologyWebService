﻿//#region Caesar cipher
var CaesarCipherInit = function (config) {


    var encryptInit = function() {

        $('#encryptButton').click(function() {

            var model = {
                message: $('#inputEncrypt').val(),
                key: $('#keyEncrypt').val(),
                alphabetType: $('#alphabetEncrypt').val()
            }

            $.ajax({
                type: 'POST',
                url: config.urls.encryptUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function(data) {

                    $('#outputEncrypt').val(data);
                },
                error: function(response) {
                    alert(response.responseJSON.message);
                }
            });
        });
    }
    var decryptInit = function() {
            $('#decryptButton').click(function () {

                var model = {
                    message: $('#inputDecrypt').val(),
                    key: $('#keyDecrypt').val(),
                    alphabetType: $('#alphabetDecrypt').val()
                }

                $.ajax({
                    type: 'POST',
                    url: config.urls.decryptUrl,
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(model),
                    success: function (data) {

                        $('#outputDecrypt').val(data);
                    },
                    error: function (response) {
                        alert(response.responseJSON.message);
                    }
                });

            });
        }

    var init = function() {
        encryptInit();
        decryptInit();
    }

    return {
        init: init
    }

}

var CaesarVisualizationInit = function (config) {

    function removeTable() {
        $('#alphabetsTable th').remove();
        $('#alphabetsTable td').remove();
        $('#alphabetsTable tr').remove();
        $('#alphabetsTable tbody').remove();

        $('#cipherOutput th').remove();
        $('#cipherOutput td').remove();
        $('#cipherOutput tr').remove();
        $('#cipherOutput tbody').remove();
    }
   

    var visualizationInit = function () {

        $('#startButton').click(function () {

            var model = {
                message: $('#inputCipher').val(),
                key: $('#keyVisualization').val(),
                alphabetType: $('#alphabetVisualization').val()
            }

            $.ajax({
                type: 'POST',
                url: config.urls.visualizationUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    var output = data[2];
                    removeTable();
                    $('#stepNumber').val("1");

                    $('#outputCipher').val("");
                    var alphabetArray = [];
                    var alphabet = data[0];
                    for (i = 0; i < alphabet.length; i++) {
                        alphabetArray[i] = alphabet[i];
                    }
                    var cipherArray = [];
                    var cipher = data[1];
                    for (i = 0; i < cipher.length; i++) {
                        cipherArray[i] = cipher[i];
                    }

                    var $table = $('#alphabetsTable');
                    var $tbody = $('<tbody></tbody>');

                    $table.append($tbody);
                   
                    var $tr = $('<tr />');
                    $tr.append($('<th />').html('Alfabet'));
                    $.each(alphabetArray, function (ignored, alfabet) {
                        $tr.append($('<td />').html(alfabet));
                    });
                    $tbody.append($tr);

                    $tr = $('<tr />');
                    $tr.append($('<th />').html('Szyfr'));
                    $.each(cipherArray, function (ignored, szyfr) {
                        $tr.append($('<td />').html(szyfr));
                    });
                    $tbody.append($tr);

                    var $tableData = $('#cipherOutput');
                    var $tbodyData = $('<tbody></tbody>');
                    $tableData.append($tbodyData);
                    $trData = $('<tr />');
                    $trData.append($('<th style="border-color:white;font-weight:300;font-size:20px;text-align:right"/>').html('Szyfrogram:'));
                    for (i = 0; i < output.length; i++) {
                        $trData.append($('<td style="border-color:white;padding:0px;font-size:20px;font-weight:bold;"/>').html(""));
                    }
                    $tbodyData.append($trData);
                    
                    if ($('#inputCipher').val() != "") {
                        $('#nextButton').attr('disabled', false);
                        $('#startButton').attr('disabled', true);
                    }
                  
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });
        });


        $('#nextButton').click(function () {

            var model = {
                message: $('#inputCipher').val(),
                key: $('#keyVisualization').val(),
                alphabetType: $('#alphabetVisualization').val()
            }

            $.ajax({
                type: 'POST',
                url: config.urls.visualizationUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    var input = data[3];
                    var output = data[2];
                    var alphabet = data[0];

                    var currentStep = parseInt($('#stepNumber').val());

                    var cellValue = input[currentStep-1];
 
                    var table = document.getElementById("alphabetsTable");
                    var rows = table.getElementsByTagName("tr");
                    var cellsLength = rows[0].cells.length;

                    for (var z = 1; z < cellsLength; z++) {
                            rows[0].cells[z].style.backgroundColor = 'white';
                            rows[1].cells[z].style.backgroundColor = 'white';
                        }

                   
                    for (var z = 1; z < cellsLength; z++) {
                        if (rows[0].cells[z].innerHTML == cellValue)
                        {
                            rows[0].cells[z].style.backgroundColor = '#b6ff00';
                            rows[1].cells[z].style.backgroundColor = '#33b5e5';
                        }
                       
                    }

                    var cipherOutput = document.getElementById("cipherOutput");
                    var rowsOutput = cipherOutput.getElementsByTagName("tr");
                    var cellsLength = rowsOutput[0].cells.length;
                    for (var z = 0; z < cellsLength; z++) {
                        if (z == currentStep) {
                            rowsOutput[0].cells[z].innerHTML = output[currentStep-1];
                            rowsOutput[0].cells[z].style.color = '#33b5e5';
                        }
                        else {
                            rowsOutput[0].cells[z].style.color = 'black';
                        }
                    }

                    currentStep += 1;
                    $('#stepNumber').val(currentStep);

                    if (currentStep > output.length) {
                        $('#nextButton').attr('disabled', true);
                        $('#startButton').attr('disabled', false);
                    }
           
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });
        });

        $("#alphabetVisualization").on('change',
            function () {
                $('#startButton').attr('disabled', false);
                removeTable();
                $('#nextButton').attr('disabled', true);
            });

        $("#keyVisualization").on('change',
            function () {
                $('#startButton').attr('disabled', false);
                removeTable();
                $('#nextButton').attr('disabled', true);
            });

        $("#inputCipher").on('input', function () {
                $('#startButton').attr('disabled', false);
                $('#nextButton').attr('disabled', true);
                removeTable();
            });

    }
  
    var init = function () {
       visualizationInit();
    }

    return {
        init: init
    }

}
//#endregion

//#region Affine cipher
var AffineCipherInit = function (config) {

    var encryptInit = function () {

        $('#encryptButton').click(function () {

            var model = {
                message: $('#inputEncrypt').val(),
                keyA: $('#keyEncryptA option:selected').val(),
                keyB: $('#keyEncryptB option:selected').val(),
                alphabetType: $('#alphabetEncrypt option:selected').val()
            }

            console.log(model);

            $.ajax({
                type: 'POST',
                url: config.urls.encryptUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    $('#outputEncrypt').val(data);
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });
        });
    }
    var decryptInit = function () {
        $('#decryptButton').click(function () {

            var model = {
                message: $('#inputDecrypt').val(),
                keyA: $('#keyDecryptA option:selected').val(),
                keyB: $('#keyDecryptB option:selected').val(),
                alphabetType: $('#alphabetDecrypt option:selected').val()
            }

            $.ajax({
                type: 'POST',
                url: config.urls.decryptUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    $('#outputDecrypt').val(data);
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });

        });
    }

    var init = function () {
        encryptInit();
        decryptInit();
    }

    return {
        init: init
    }
}
var AffineVisualizationInit = function (config) {

    function removeTable() {
        $('#alphabetsTable th').remove();
        $('#alphabetsTable td').remove();
        $('#alphabetsTable tr').remove();
        $('#alphabetsTable tbody').remove();
    }

    var visualizationInit = function () {

        $('#startButton').click(function () {

            var model = {
                message: $('#inputCipher').val(),
                keyA: $('#keyCipherA').val(),
                keyB: $('#keyCipherB').val(),
                alphabetType: $('#alphabetVisualization').val()
            }

            $.ajax({
                type: 'POST',
                url: config.urls.visualizationUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    removeTable();
                    $('#stepNumber').val("1");
                    $('#outputCipher').val("");
                    var alphabetArray = [];
                    var alphabet = data[0];
                    for (i = 0; i < alphabet.length; i++) {
                        alphabetArray[i] = alphabet[i];
                    }
                  
                    var $table = $('#alphabetsTable');
                    var $tbody = $('<tbody></tbody>');

                    $table.append($tbody);

                    var $tr = $('<tr />');
                    $tr.append($('<th />').html('Znak'));
                    $.each(alphabetArray, function (ignored, alfabet) {
                        $tr.append($('<td />').html(alfabet));
                    });
                    $tbody.append($tr);

                    $tr = $('<tr />');
                    $tr.append($('<th />').html('Pozycja'));
                    for (i = 0; i < alphabet.length; i++) {
                        $tr.append($('<td />').html(i));
                    }
                    $tbody.append($tr);

                    $('#calculations').attr('hidden', true);
                    if ($('#inputCipher').val() != "") {
                        $('#nextButton').attr('disabled', false);
                        $('#startButton').attr('disabled', true);
                    }

                    if ($('#alphabetVisualization').val() == 0 || $('#alphabetVisualization').val() == 1 || $('#alphabetVisualization').val() == 2 || $('#alphabetVisualization').val() == 3) {
                        document.getElementById("marginTable").style.marginLeft = "16px";
                    }
                    else if ($('#alphabetVisualization').val() == 4 || $('#alphabetVisualization').val() == 5) {
                        document.getElementById("marginTable").style.marginLeft = "-100px";
                        var table = document.getElementById("alphabetsTable");
                        var rows = table.getElementsByTagName("tr");
                        var cellsLength = rows[0].cells.length;
                        for (var z = 1; z < cellsLength; z++) {
                            rows[0].cells[z].style.padding = "0.5px";
                            rows[1].cells[z].style.padding = "0.5px";
                        }
                    }


                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });
        });


        $('#nextButton').click(function () {

            var model = {
                message: $('#inputCipher').val(),
                keyA: $('#keyCipherA').val(),
                keyB: $('#keyCipherB').val(),
                alphabetType: $('#alphabetVisualization').val()
            }

            $.ajax({
                type: 'POST',
                url: config.urls.visualizationUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    var input = data[2];
                    var output = data[1];
                    var alphabet = data[0];
                    var keyA = $('#keyCipherA').val();
                    var keyB = $('#keyCipherB').val();
      
                    var currentStep = parseInt($('#stepNumber').val());

                    var currentLetter = input[currentStep-1];
                    var outputLetter = output[currentStep - 1];
                    var currentLetterValue; 
                    var outputLetterValue;

                    var table = document.getElementById("alphabetsTable");
                    var rows = table.getElementsByTagName("tr");
                    var cellsLength = rows[0].cells.length;

                    for (var z = 1; z < cellsLength; z++) {
                        rows[0].cells[z].style.backgroundColor = 'white';
                        rows[1].cells[z].style.backgroundColor = 'white';
                    }


                    for (var z = 1; z < cellsLength; z++) {
                        if (rows[0].cells[z].innerHTML == currentLetter) {
                            rows[0].cells[z].style.backgroundColor = '#b6ff00';
                            rows[1].cells[z].style.backgroundColor = '#b6ff00';
                            currentLetterValue = rows[1].cells[z].innerHTML;   
                        }
                    }

                    for (var z = 1; z < cellsLength; z++) {
                        if (rows[0].cells[z].innerHTML == outputLetter) {
                            rows[0].cells[z].style.backgroundColor = '#33b5e5';
                            rows[1].cells[z].style.backgroundColor = '#33b5e5';
                            outputLetterValue = rows[1].cells[z].innerHTML;
                        }
                    }

                    $('#keyA').val(keyA);
                    $('#keyB').val(keyB);
                    $('#inputLetter').val(currentLetterValue);
                    $('#alphabetLength').val(cellsLength-1);
                    $('#outputLetter').val(outputLetterValue);

                   
                    var currentOutput = $('#outputCipher').val();
                    var newOutput = currentOutput + outputLetter;
                    $('#outputCipher').val(newOutput);
                    currentStep += 1;
                    $('#stepNumber').val(currentStep);

                    $('#calculations').attr('hidden', false);
                    if (currentStep > output.length) {
                        $('#nextButton').attr('disabled', true);
                        $('#startButton').attr('disabled', false);
                    }

                   



                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });
        });



        $("#alphabetVisualization").on('change',
            function () {
                $('#outputCipher').val("");
                $('#startButton').attr('disabled', false);
                removeTable();
                $('#nextButton').attr('disabled', true);
                $('#calculations').attr('hidden', true);
                if ($('#inputCipher').val() == "") {
                    $('#startButton').attr('disabled', true);
                }
            });

        $("#keyCipherA").on('change',
            function () {
                $('#outputCipher').val("");
                $('#startButton').attr('disabled', false);
                removeTable();
                $('#nextButton').attr('disabled', true);
                $('#calculations').attr('hidden', true);
                if ($('#inputCipher').val() == "") {
                    $('#startButton').attr('disabled', true);
                }
            });

        $("#keyCipherB").on('change',
            function () {
                $('#outputCipher').val("");
                $('#startButton').attr('disabled', false);
                removeTable();
                $('#nextButton').attr('disabled', true);
                $('#calculations').attr('hidden', true);
                if ($('#inputCipher').val() == "") {
                    $('#startButton').attr('disabled', true);
                }
            });


        $("#inputCipher").on('input', function () {
            $('#outputCipher').val("");
            $('#startButton').attr('disabled', false);
         
                var table = document.getElementById("alphabetsTable");
            var rows = table.getElementsByTagName("tr");
            console.log(rows);
            if (rows == null) {
                var cellsLength = rows[0].cells.length;

                for (var z = 1; z < cellsLength; z++) {
                    rows[0].cells[z].style.backgroundColor = 'white';
                    rows[1].cells[z].style.backgroundColor = 'white';

                }

            }
           

            $('#nextButton').attr('disabled', true);
            $('#calculations').attr('hidden', true);
            if ($('#inputCipher').val() == "") {
                $('#startButton').attr('disabled', true);
            }
        });

    }

    var init = function () {
        visualizationInit();
    }

    return {
        init: init
    }

}
//#endregion

//#region Beacon cipher
var BaconCipherInit = function (config) {

    var encryptInit = function () {

        $('#encryptButton').click(function () {

            var model = {
                message: $('#inputEncrypt').val()
            }

            $.ajax({
                type: 'POST',
                url: config.urls.encryptUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    $('#outputEncrypt').val(data);
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });
        });
    }
    var decryptInit = function () {
        $('#decryptButton').click(function () {

            var model = {
                message: $('#inputDecrypt').val()
            }

            $.ajax({
                type: 'POST',
                url: config.urls.decryptUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    $('#outputDecrypt').val(data);
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });

        });
    }

    var init = function () {
        encryptInit();
        decryptInit();
    }

    return {
        init: init
    }
}

var BaconVisualizationInit = function (config) {

    function clearHighlightsCell()
    {
        $('#part-1 tr td').each(function () {           
            $(this).css('background-color', 'white');
        });
        $('#part-2 tr td').each(function () {
           $(this).css('background-color', 'white');
        });
        $('#part-3 tr td').each(function () {
           $(this).css('background-color', 'white');
        });
        $('#part-4 tr td').each(function () {
           $(this).css('background-color', 'white');
        });
        $('#part-5 tr td').each(function () {
           $(this).css('background-color', 'white');
        });
        $('#part-6 tr td').each(function () {
           $(this).css('background-color', 'white');
        }); 
    }

    var visualizationInit = function () {

        $('#nextButton').click(function () {

            var model = {
                message: $('#inputCipher').val()
            }

            $.ajax({
                type: 'POST',
                url: config.urls.encryptUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {
                    var inputLength = ($('#inputCipher').val()).length;
                    var outputLength = ($('#outputCipher').val()).length;  

                    var input = $('#inputCipher').val();
                    var withoutSpaces='';
                    for (i = 0; i < inputLength; i++) {
                        if (input[i] != ' ') {
                            withoutSpaces = withoutSpaces+ input[i];
                        }
                    }
                    withoutSpaces = withoutSpaces.toUpperCase();                 
                    inputLength = withoutSpaces.length;
                   
                    clearHighlightsCell();

                        var letterData = data[outputLength] + data[outputLength+1] + data[outputLength+2] + data[outputLength+3] + data[outputLength+4];
                        var newdata = $('#outputCipher').val() + letterData;
                    $('#outputCipher').val(newdata);

                    if (outputLength+5 == inputLength*5) {
                        $('#nextButton').attr('disabled', true);
                        $('#startButton').attr('disabled', false);
                    }

                    var cellNumber = (outputLength) / 5;
                    var cellValue = withoutSpaces[cellNumber];
 
                    $('#part-1 tr td').each(function () {
                        if ($(this).text() == cellValue) {
                            $(this).next().css('background-color', '#33b5e5');
                            $(this).css('background-color', '#b6ff00');
                        }
                    }); 
                    $('#part-2 tr td').each(function () {
                        if ($(this).text() == cellValue) {
                            $(this).next().css('background-color', '#33b5e5');
                            $(this).css('background-color', '#b6ff00');
                        }
                    }); 
                    $('#part-3 tr td').each(function () {
                        if ($(this).text() == cellValue) {
                            $(this).next().css('background-color', '#33b5e5');
                            $(this).css('background-color', '#b6ff00');
                        }
                    }); 
                    $('#part-4 tr td').each(function () {
                        if ($(this).text() == cellValue) {
                            $(this).next().css('background-color', '#33b5e5');
                            $(this).css('background-color', '#b6ff00');
                        }
                    }); 
                    $('#part-5 tr td').each(function () {
                        if ($(this).text() == cellValue) {
                            $(this).next().css('background-color', '#33b5e5');
                            $(this).css('background-color', '#b6ff00');
                        }
                    }); 
                    $('#part-6 tr td').each(function () {
                        if ($(this).text() == cellValue) {
                            $(this).next().css('background-color', '#33b5e5');
                            $(this).css('background-color', '#b6ff00');
                        }
                    }); 
                   
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });
        });
 
        $('#startButton').click(function () {
            $('#outputCipher').val('');
            if ($('#inputCipher').val() == '') {
                $('#nextButton').attr('disabled', true);
            } else {
                $('#nextButton').attr('disabled', false);
            }        
            $('#startButton').attr('disabled', true);
            clearHighlightsCell();
        });

        $("#inputCipher").on('input', function () {
                $('#nextButton').attr('disabled', true);
                $('#startButton').attr('disabled', false);
                clearHighlightsCell();
                $('#outputCipher').val('');
        });
    }

    var init = function () {
        visualizationInit();
    }

    return {
        init: init
    }
}

//#endregion

//#region ColumnarTrensposition cipher
var ColumnarTranspositionCipherInit = function (config) {

    var encryptInit = function () {

        $('#encryptButton').click(function () {

            var model = {
                message: $('#inputEncrypt').val(),
                key: $("#keyEncrypt").val()
        }

            $.ajax({
                type: 'POST',
                url: config.urls.encryptUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    $('#outputEncrypt').val(data);
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });
        });
    }
    var decryptInit = function () {
        $('#decryptButton').click(function () {

            var model = {
                message: $('#inputDecrypt').val(),
                key: $("#keyDecrypt").val()
            }

            $.ajax({
                type: 'POST',
                url: config.urls.decryptUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    $('#outputDecrypt').val(data);
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });

        });
    }

    var init = function () {
        encryptInit();
        decryptInit();
    }

    return {
        init: init
    }
}


var ColumnarTranspositionVisualizationInit = function (config) {

    function removeTables() {
        $('#sortedKey td').remove();
        $('#sortedKey tr').remove();
        $('#sortedKey tbody').remove();

        $('#numeredKey td').remove();
        $('#numeredKey tr').remove();
        $('#numeredKey tbody').remove();

        $('#encryptMatrix td').remove();
        $('#encryptMatrix tr').remove();
        $('#encryptMatrix tbody').remove();

        $('#cipherOutput th').remove();
        $('#cipherOutput td').remove();
        $('#cipherOutput tr').remove();
        $('#cipherOutput tbody').remove();
    }

    var visualizationInit = function () {

        $('#startButton').click(function () {


            var model = {
                message: $('#inputCipher').val(),
                key: $("#keyVisualization").val()
            }

            $.ajax({
                type: 'POST',
                url: config.urls.visualizationUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    removeTables();

                    $('#stepNumber').val("1");
                
                    _sortedKey = data[0];
                    _numeredKeyString = data[1];
                    _output = data[2];
                    _input = data[3];
                    _key = data[4];

                    var _numeredKey = [];
                    var _numeredKey = _numeredKeyString.split(','); 


                    var $table_sortedKey = $('#sortedKey');
                    var $tbody_sortedKey = $('<tbody></tbody>');

                    $table_sortedKey.append($tbody_sortedKey);

                    var $tr = $('<tr />');
                    for (i = 0; i < _sortedKey.length; i++) {
                        $tr.append($('<td style="width:30px"/>').html(_sortedKey[i]));
                    }
                    $tbody_sortedKey.append($tr);

                    $tr = $('<tr />');
                    for (i = 1; i < _sortedKey.length + 1; i++) {
                        $tr.append($('<td style="width:30px"/>').html(i));
                    }
                    $tbody_sortedKey.append($tr);

                    var $table_numeredKey = $('#numeredKey');
                    var $tbody_numeredKey = $('<tbody></tbody>');

                    $table_numeredKey.append($tbody_numeredKey);

                    $tr = $('<tr />');
                    for (i = 0; i < _key.length; i++) {
                        $tr.append($('<td style="width:30px"/>').html(_key[i]));
                    }
                    $tbody_numeredKey.append($tr);

                    $tr = $('<tr />');
                    for (i = 0; i < _numeredKey.length; i++) {
                        $tr.append($('<td style="width:30px"/>').html(_numeredKey[i]));
                    }
                    $tbody_numeredKey.append($tr);


                    ////matrix tests
                    var rowsMatrix = Math.ceil(_input.length / _key.length);

                    var $table_encryptMatrix = $('#encryptMatrix');
                    var $tbody_encryptMatrix = $('<tbody></tbody>');

                    $table_encryptMatrix.append($tbody_encryptMatrix);       

                    var messageCounter = 0;
                    for (i = 0; i < rowsMatrix; i++)
                    {
                        var $tr = $('<tr />');
                        for (j = 0; j < _key.length; j++)
                        {
                            if (messageCounter < _input.length) {
                                $tr.append($('<td style="width:30px"/>').html(_input[messageCounter]));
                            }
                              messageCounter++;
                            if (messageCounter > _input.length)
                                    {
                                $tr.append($('<td style="width:30px" />').html("X"));
                                    }
                        }
                        $tbody_encryptMatrix.append($tr);
                    }

                    var $tableData = $('#cipherOutput');
                    var $tbodyData = $('<tbody></tbody>');
                    $tableData.append($tbodyData);
                    $trData = $('<tr />');
                    $trData.append($('<th style="border-color:white;font-weight:300;font-size:20px;text-align:right"/>').html('Szyfrogram:'));
                    for (i = 0; i < _key.length; i++) {
                        $trData.append($('<td style="border-color:white;padding:0px;font-size:20px;font-weight:bold;"/>').html(""));
                    }
                    $tbodyData.append($trData);

                    if (_input != "") {
                        $('#labelEncryptMatrix').attr('hidden', false);
                        $('#nextButton').attr('disabled', false);
                    }
                    $('#labelSortedKey').attr('hidden', false);
                                  
                    $('#startButton').attr('disabled', true);

                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });
        });

        $('#nextButton').click(function () {

            var model = {
                message: $('#inputCipher').val(),
                key: $('#keyVisualization').val(),
            }

            $.ajax({
                type: 'POST',
                url: config.urls.visualizationUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    _sortedKey = data[0];
                    _numeredKeyString = data[1];
                    _output = data[2];
                    _input = data[3];
                    _key = data[4];
              

                    var currentStep = parseInt($('#stepNumber').val());
                    var columnNumber;
                    var tableKey = document.getElementById("numeredKey");
                    var rowsKey = tableKey.getElementsByTagName("tr");

            
                    for (var z = 0; z < _key.length; z++) {
                        if (rowsKey[1].cells[z].innerHTML == currentStep) {
                            columnNumber = z;
                            rowsKey[1].cells[z].style.backgroundColor = 'white';
                        }
                    }

                        var tableMatrix = document.getElementById("encryptMatrix");
                        var rowsMatrix = tableMatrix.getElementsByTagName("tr");  
                        
         
                    var columnValue="";
                    for (i = 0; i < rowsMatrix.length; i++) {
                            for (j = 0; j < _key.length; j++) {
                                if (j == columnNumber) {
                                    columnValue += rowsMatrix[i].cells[columnNumber].innerHTML;
                                    rowsMatrix[i].cells[columnNumber].style.backgroundColor = '#33b5e5';
                                    rowsKey[1].cells[columnNumber].style.backgroundColor = '#8fd1ea';
                                } else {
                                    rowsMatrix[i].cells[j].style.backgroundColor = 'white';
                                }                              
                            }     
                    }

                    var cipherOutput = document.getElementById("cipherOutput");
                    var rowsOutput = cipherOutput.getElementsByTagName("tr");
                    var cellsLength = rowsOutput[0].cells.length;
                    for (var z = 0; z < cellsLength; z++) {
                        if (z == currentStep) {
                            rowsOutput[0].cells[z].innerHTML = columnValue;
                            rowsOutput[0].cells[z].style.color = '#33b5e5';
                        }
                        else {
                            rowsOutput[0].cells[z].style.color = 'black';
                        }
                    }
                       
                    currentStep += 1;
                    $('#stepNumber').val(currentStep);

                    if (currentStep > _key.length) {
                        $('#nextButton').attr('disabled', true);
                        $('#startButton').attr('disabled', false);
                    }
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });
        });

        $("#keyVisualization").on('input',
            function () {
                $('#startButton').attr('disabled', false);
                $('#nextButton').attr('disabled', true);

                removeTables();

                $('#labelSortedKey').attr('hidden', true);
                $('#labelEncryptMatrix').attr('hidden', true);
                if ($('#keyVisualization').val() == "") {
                    $('#startButton').attr('disabled', true);
                }

            });

        $("#inputCipher").on('input', function () {
            $('#startButton').attr('disabled', false);
            $('#nextButton').attr('disabled', true);

            removeTables();

            $('#labelSortedKey').attr('hidden', true);
            $('#labelEncryptMatrix').attr('hidden', true);

            if ($('#keyVisualization').val() == "") {
                $('#startButton').attr('disabled', true);
            }
        });
    }

    var init = function () {
        visualizationInit();
    }

    return {
        init: init
    }

}
//#endregion

//#region Fence cipher
var FenceCipherInit = function(config) {
    var encryptInit = function () {

        $('#encryptButton').click(function () {

            var model = {
                message: $('#inputEncrypt').val(),
                key: $("#keyEncrypt").val()
            }

            $.ajax({
                type: 'POST',
                url: config.urls.encryptUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    $('#outputEncrypt').val(data);
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });
        });
    }
    var decryptInit = function () {
        $('#decryptButton').click(function () {

            var model = {
                message: $('#inputDecrypt').val(),
                key: $("#keyDecrypt").val()
            }

            $.ajax({
                type: 'POST',
                url: config.urls.decryptUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    $('#outputDecrypt').val(data);
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });

        });
    }

    var init = function () {
        encryptInit();
        decryptInit();
    }

    return {
        init: init
    }
}

var FenceVisualizationInit = function (config) {

    function removeTable() {
        $('#fenceTable th').remove();
        $('#fenceTable td').remove();
        $('#fenceTable tr').remove();
        $('#fenceTable tbody').remove();

        $('#cipherOutput th').remove();
        $('#cipherOutput td').remove();
        $('#cipherOutput tr').remove();
        $('#cipherOutput tbody').remove();
    }

    var visualizationInit = function () {
       
        $('#startButton').click(function () {

            var model = {
                message: $('#inputCipher').val(),
                key: $('#keyVisualization').val(),
            }

            $.ajax({
                type: 'POST',
                url: config.urls.visualizationUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    var _input = data[1];
                    var _output = data[0];
                    var _table = data[2];
                    var _key = $('#keyVisualization').val();

                    removeTable();
                    $('#outputCipher').val("");
                    $('#stepNumber').val("1");

                    var $table = $('#fenceTable');
                    var $tbody = $('<tbody></tbody>');

                    $table.append($tbody);

                    var index = 0;
                    for (i = 0; i < _key; i++)
                    {
                        var $tr = $('<tr />');
                        for (j = 0; j < _input.length; j++)
                         {
                            $tr.append($('<td style="width:30px;height:30px"/>').html(_table[index]));
                            index++;
                        }
                        $tbody.append($tr);
                    }

                    var $tableData = $('#cipherOutput');
                    var $tbodyData = $('<tbody></tbody>');
                    $tableData.append($tbodyData);
                    $trData = $('<tr />');
                    $trData.append($('<th style="border-color:white;font-weight:300;font-size:20px;text-align:right"/>').html('Szyfrogram:'));
                    for (i = 0; i < _output.length; i++) {
                        $trData.append($('<td style="border-color:white;padding:0px;font-size:20px;font-weight:bold;"/>').html(""));
                    }
                    $tbodyData.append($trData);


                    if ($('#inputCipher').val() != "") {
                        $('#nextButton').attr('disabled', false);
                        $('#startButton').attr('disabled', true);
                    }
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });
        });


        $('#nextButton').click(function () {

            var model = {
                message: $('#inputCipher').val(),
                key: $('#keyVisualization').val(),
            }

            $.ajax({
                type: 'POST',
                url: config.urls.visualizationUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {
                    var currentStep = parseInt($('#stepNumber').val());
                    var _output = data[0];
                    var table = document.getElementById("fenceTable");
                    var rows = table.getElementsByTagName("tr");
                    var columns = rows[0].getElementsByTagName("td");
                    

                    var counter = 0;
                    for (i = 0; i < rows.length; i++)
                    {
                        for (z = 0; z < columns.length; z++) 
                        {
                            if (rows[i].cells[z].innerHTML != "")
                            {    
                                counter++;
                                if (counter == currentStep) {
                                    rows[i].cells[z].style.backgroundColor = '#33b5e5';
                                }
                                else {
                                    rows[i].cells[z].style.backgroundColor = 'white';
                                } 
                            }
                        }
                    }

                    var cipherOutput = document.getElementById("cipherOutput");
                    var rowsOutput = cipherOutput.getElementsByTagName("tr");
                    var cellsLength = rowsOutput[0].cells.length;
                    for (var z = 0; z < cellsLength; z++) {
                        if (z == currentStep) {
                            rowsOutput[0].cells[z].innerHTML = _output[currentStep - 1];
                            rowsOutput[0].cells[z].style.color = '#33b5e5';
                        }
                        else {
                            rowsOutput[0].cells[z].style.color = 'black';
                        }
                    }
                  
                    currentStep += 1;
                    $('#stepNumber').val(currentStep);

                    if (currentStep > _output.length) {
                        $('#nextButton').attr('disabled', true);
                        $('#startButton').attr('disabled', false);
                    }
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });
        });



        $("#keyVisualization").on('change',
            function () {
                $('#outputCipher').val("");
                $('#startButton').attr('disabled', false);
                removeTable();
                $('#nextButton').attr('disabled', true);
                if ($('#inputCipher').val() == "") {
                    $('#startButton').attr('disabled', true);
                }
            });

        $("#inputCipher").on('input', function () {
            $('#outputCipher').val("");
            $('#startButton').attr('disabled', false);
            removeTable();
            $('#outputCipher').val("");
            $('#nextButton').attr('disabled', true);
            if ($('#inputCipher').val() == "") {
                $('#startButton').attr('disabled', true);
            }
        });

    }

    var init = function () {
        visualizationInit();
    }

    return {
        init: init
    }

}
//#endregion

//#region Playfair cipher
var PlayfairCipherInit = function (config) {
    var encryptInit = function () {

        $('#encryptButton').click(function () {

            var model = {
                message: $('#inputEncrypt').val(),
                key: $("#keyEncrypt").val()
            }

            $.ajax({
                type: 'POST',
                url: config.urls.encryptUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    $('#outputEncrypt').val(data);
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });
        });
    }
    var decryptInit = function () {
        $('#decryptButton').click(function () {

            var model = {
                message: $('#inputDecrypt').val(),
                key: $("#keyDecrypt").val()
            }

            $.ajax({
                type: 'POST',
                url: config.urls.decryptUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    $('#outputDecrypt').val(data);
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });

        });
    }

    var init = function () {
        encryptInit();
        decryptInit();
    }

    return {
        init: init
    }
}

var PlayfairVisualizationInit = function (config) {

    function removeTables() {
        $('#playfairTable th').remove();
        $('#playfairTable td').remove();
        $('#playfairTable tr').remove();
        $('#playfairTable tbody').remove();

        $('#inputDigrams th').remove();
        $('#inputDigrams td').remove();
        $('#inputDigrams tr').remove();
        $('#inputDigrams tbody').remove();

        $('#cipherOutput th').remove();
        $('#cipherOutput td').remove();
        $('#cipherOutput tr').remove();
        $('#cipherOutput tbody').remove();
    }

    var visualizationInit = function () {

        $('#startButton').click(function () {


            var model = {
                message: $('#inputCipher').val(),
                key: $("#keyVisualization").val()
            }

            $.ajax({
                type: 'POST',
                url: config.urls.visualizationUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    var _input = data[1];
                    var _output = data[0];
                    var _table = data[2];
                    var _digrams = data[3];

                    $('#lettersPositions').attr('hidden', true);
                    removeTables();
                    $('#stepNumber').val("1");
                    $('#indexNumber').val("1");

                    var $table = $('#playfairTable');
                    var $tbody = $('<tbody></tbody>');

                    $table.append($tbody);

                    var index = 0;
                    for (i = 0; i < 5; i++) {
                        var $tr = $('<tr />');
                        for (j = 0; j < 5; j++) {
                            $tr.append($('<td style="width:30px;height:30px;font-weight:bold;"/>').html(_table[index]));
                            index++;
                        }
                        $tbody.append($tr);
                    }
                    var $tableDigrams = $('#inputDigrams');
                    var $tbodyDigrams = $('<tbody></tbody>');
                    $tableDigrams.append($tbodyDigrams);
                    var $trDigrams = $('<tr />');
                    for (i = 0; i < _digrams.length; i++) {            
                        $trDigrams.append($('<td style="border-color:white;padding:0px;font-size:20px;font-weight:bold;"/>').html(_digrams[i]));
                        if ((i + 1) % 2 == 0) {
                            $trDigrams.append($('<td style="width:10px;border-color:white""/>').html(""));
                        }

                    }
                    $tbodyDigrams.append($trDigrams);

                    var $tableData = $('#cipherOutput');
                    var $tbodyData = $('<tbody></tbody>');
                    $tableData.append($tbodyData);
                    $trData = $('<tr />');
                    $trData.append($('<th style="border-color:white;font-weight:300;font-size:20px;text-align:right"/>').html('Szyfrogram:'));
                    for (i = 0; i < _output.length; i++) {
                        $trData.append($('<td style="border-color:white;padding:0px;font-size:20px;font-weight:bold;"/>').html(""));
                    }
                    $tbodyData.append($trData);



                    if ($('#inputCipher').val() != "") {
                        $('#nextButton').attr('disabled', false);
                        $('#startButton').attr('disabled', true);
                    }
                    $('#labelDigrams').attr('hidden', false);
                    $('#inputDigrams').attr('hidden', false);
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });
        });

        $('#nextButton').click(function () {

            var model = {
                message: $('#inputCipher').val(),
                key: $('#keyVisualization').val(),
            }

            $.ajax({
                type: 'POST',
                url: config.urls.visualizationUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    var _input = data[1];
                    var _output = data[0];
                    var _table = data[2];
                    var _digrams = data[3];

                    var currentStep = parseInt($('#stepNumber').val());
                    var index = parseInt($('#indexNumber').val());

                    var tableDigrams = document.getElementById("inputDigrams");
                    var rowsDigrams = tableDigrams.getElementsByTagName("tr");
                    var cellsLength = rowsDigrams[0].cells.length;
                    for (var z = 0; z < cellsLength; z++) {
                        if (z == index) {
                            rowsDigrams[0].cells[index - 1].style.color = '#33b5e5';
                            rowsDigrams[0].cells[index].style.color = 'deeppink';
                        }
                        else {
                            rowsDigrams[0].cells[z].style.color = 'black';
                        }
                    }
                    var table = document.getElementById("playfairTable");
                    var rows = table.getElementsByTagName("tr");

                    var j_0;
                    var j_1=-1;
                    var i_0;
                    var i_1=-1;
                    var firstLetter = _output[currentStep-1];
                    var secondLetter = _output[currentStep];
                    for (i = 0; i < 5; i++) {
                        for (j = 0; j < 5; j++) {
                            if (rows[i].cells[j].innerHTML == _digrams[currentStep - 1]) {
                                rows[i].cells[j].style.color = '#33b5e5';
                                rows[i].cells[j].style.backgroundColor = 'white';
                                i_0 = i;
                                j_0 = j;
                                if (rows[i].cells[j].innerHTML == firstLetter) {
                                    rows[i].cells[j].style.backgroundColor = '#33b5e5';
                                }
                                if (rows[i].cells[j].innerHTML == secondLetter) {
                                    rows[i].cells[j].style.backgroundColor = 'deeppink';
                                }
                            }
                            else if (rows[i].cells[j].innerHTML == _digrams[currentStep]) {
                                rows[i].cells[j].style.color = 'deeppink';
                                rows[i].cells[j].style.backgroundColor = 'white';
                                i_1 = i;
                                j_1 = j;
                                if (rows[i].cells[j].innerHTML == firstLetter) {
                                    rows[i].cells[j].style.backgroundColor = '#33b5e5';
                                }
                                if (rows[i].cells[j].innerHTML == secondLetter) {
                                    rows[i].cells[j].style.backgroundColor = 'deeppink';
                                }            
                            }
                            else if (rows[i].cells[j].innerHTML == firstLetter) {
                                rows[i].cells[j].style.backgroundColor = '#33b5e5';
                                if (rows[i].cells[j].innerHTML != _digrams[currentStep] || rows[i].cells[j].innerHTML != _digrams[currentStep - 1]) {
                                    rows[i].cells[j].style.color = 'black';
                                }
                            }
                            else if (rows[i].cells[j].innerHTML == secondLetter) {
                                rows[i].cells[j].style.backgroundColor = 'deeppink';
                                if (rows[i].cells[j].innerHTML != _digrams[currentStep] || rows[i].cells[j].innerHTML != _digrams[currentStep - 1]) {
                                    rows[i].cells[j].style.color = 'black';
                                }
                            }
                            else {
                                rows[i].cells[j].style.backgroundColor = 'white';
                                rows[i].cells[j].style.color = 'black';
                            }
                        }
                    }

                    $('#lettersPositions').attr('hidden', false);
                    var TextBox = document.getElementById("lettersPositions");
                    if (i_0 == i_1) {
                        TextBox.innerHTML = "<b> Obie litery w tym samym wierszu. </b>";
                    }
                    else if (j_0 == j_1) {
                        TextBox.innerHTML = "<b> Obie litery w tej samej kolumnie. </b>";
                    }
                    else if (j_1 == -1) {
                        TextBox.innerHTML = "<b> Obie litery w tym samym wiersz i tej samej kolumnie. </b>";
                    } else {
                        TextBox.innerHTML = "<b> Każda z liter w innym wierszu i innej kolumnie. </b>";
                    }

                    var cipherOutput = document.getElementById("cipherOutput");
                    var rowsOutput = cipherOutput.getElementsByTagName("tr");
                    var cellsLength = rowsOutput[0].cells.length;
                    for (var z = 0; z < cellsLength; z++) {
                        if (z == currentStep+1) {
                            rowsOutput[0].cells[z-1].innerHTML = firstLetter;
                            rowsOutput[0].cells[z-1].style.color = '#33b5e5';
                            rowsOutput[0].cells[z].innerHTML = secondLetter;
                            rowsOutput[0].cells[z].style.color = 'deeppink';
                        }
                        else {
                            rowsOutput[0].cells[z].style.color = 'black';
                        } 
                    }

                    currentStep += 2;
                    $('#stepNumber').val(currentStep);
                    index += 3;
                    $('#indexNumber').val(index);
                    if (currentStep > _input.length) {
                        $('#nextButton').attr('disabled', true);
                        $('#startButton').attr('disabled', false);
                    }
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });
        });

        $("#keyVisualization").on('input',
            function () {
                $('#startButton').attr('disabled', false);
                $('#nextButton').attr('disabled', true);
                $('#lettersPositions').attr('hidden', true);
                removeTables();
                $('#labelDigrams').attr('hidden', true);
                $('#inputDigrams').attr('hidden', true);
                if ($('#keyVisualization').val() == "" || $('#inputCipher').val() == "") {
                    $('#startButton').attr('disabled', true);
                }

            });

        $("#inputCipher").on('input', function () {
            $('#startButton').attr('disabled', false);
            $('#nextButton').attr('disabled', true);
            $('#lettersPositions').attr('hidden', true);
            removeTables();
            $('#labelDigrams').attr('hidden', true);
            $('#inputDigrams').attr('hidden', true);
            if ($('#keyVisualization').val() == "" || $('#inputCipher').val() == "") {
                $('#startButton').attr('disabled', true);
            }
        });
    }

    var init = function () {
        visualizationInit();
    }

    return {
        init: init
    }

}
//#endregion

//#region Route cipher
var RouteCipherInit = function (config) {
    var encryptInit = function () {

        $('#encryptButton').click(function () {

            var key = parseInt($("#keyEncrypt option:selected").val());
            var mode = parseInt($("#encryptMode option:selected").val());

            var model = {
                message: $('#inputEncrypt').val(),
                key: key,
                mode: mode
            }

            $.ajax({
                type: 'POST',
                url: config.urls.encryptUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    $('#outputEncrypt').val(data);
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });
        });
    }
    var decryptInit = function () {
        $('#decryptButton').click(function () {

            var key = parseInt($("#keyDecrypt option:selected").val());
            var mode = parseInt($("#decryptMode option:selected").val());
            console.log(key);
            var model = {
                message: $('#inputDecrypt').val(),
                key: key,
                mode: mode
            }

            $.ajax({
                type: 'POST',
                url: config.urls.decryptUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    $('#outputDecrypt').val(data);
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });

        });
    }

    var init = function () {
        encryptInit();
        decryptInit();
    }

    return {
        init: init
    }
}
//#endregion

//#region Vigenere cipher
var VigenereCipherInit = function (config) {
    var encryptInit = function () {

        $('#encryptButton').click(function () {

            var model = {
                message: $('#inputEncrypt').val(),
                key: $("#keyEncrypt").val(),
                alphabetType: $('#alphabetEncrypt option:selected').val()
            }

            $.ajax({
                type: 'POST',
                url: config.urls.encryptUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    $('#outputEncrypt').val(data);
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });
        });
    }
    var decryptInit = function () {
        $('#decryptButton').click(function () {

            var model = {
                message: $('#inputDecrypt').val(),
                key: $("#keyDecrypt").val(),
                alphabetType: $('#alphabetDecrypt option:selected').val()
            }

            $.ajax({
                type: 'POST',
                url: config.urls.decryptUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    $('#outputDecrypt').val(data);
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });

        });
    }

    var init = function () {
        encryptInit();
        decryptInit();
    }

    return {
        init: init
    }
}

var VigenereVisualizationInit = function (config) {

    function removeTable() {
        $('#tabulaRecta th').remove();
        $('#tabulaRecta td').remove();
        $('#tabulaRecta tr').remove();
        $('#tabulaRecta tbody').remove();

        $('#cipherData th').remove();
        $('#cipherData td').remove();
        $('#cipherData tr').remove();
        $('#cipherData tbody').remove();

    }

    var visualizationInit = function () {

        $('#startButton').click(function () {

            var model = {
                message: $('#inputCipher').val(),
                key: $("#keyVisualization").val(),
                alphabetType: $('#alphabetVisualization option:selected').val()
            }

            $.ajax({
                type: 'POST',
                url: config.urls.visualizationUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {
                    var _output = data[1];
                    var _input = data[2];
                    var _key = data[3];
                    removeTable();
                    $('#stepNumber').val("1");
                    $('#outputCipher').val("");
                    var alphabetArray = [];
                    var alphabet = data[0];
                    for (i = 0; i < alphabet.length; i++) {
                        alphabetArray[i] = alphabet[i];
                    }

                    var $table = $('#tabulaRecta');
                    var $tbody = $('<tbody></tbody>');

                    $table.append($tbody);

                    var $tr = $('<tr />');
                    $tr.append($('<th style="border-top-color:white;border-left-color:white;font-weight:bold;" />').html(' '));
                    $.each(alphabetArray, function (ignored, alfabet) {
                        $tr.append($('<td style="border-top-color:white;font-weight:900;"/>').html(alfabet));
                    });
                    $tbody.append($tr);
                    
                    for (i = 0; i < alphabet.length; i++) {
                        $tr = $('<tr />');
                        $tr.append($('<th  style="border-left-color:white;font-weight:900;"/>').html(alphabetArray[i]));
                        for (j = i; j < alphabet.length; j++) {
                            $tr.append($('<td />').html(alphabetArray[j]));
                        }
                        for (z = 0; z < i; z++) {
                            $tr.append($('<td />').html(alphabetArray[z]));
                        }
                        $tbody.append($tr);
                    }

                    var $tableData = $('#cipherData');
                    var $tbodyData = $('<tbody></tbody>');

                    $tableData.append($tbodyData);

                    var $trData = $('<tr />');
                    $trData.append($('<th style="border-color:white;font-weight:300;font-size:20px;text-align:right"/>').html('Tekst jawny:'));
                    for (i = 0; i < _input.length; i++) {
                        $trData.append($('<td style="border-color:white;padding:0px;font-size:20px;font-weight:bold;" />').html(_input[i]));
                    }
                    $tbodyData.append($trData);

                    $trData = $('<tr />');
                    $trData.append($('<th style="border-color:white;font-weight:300;font-size:20px;text-align:right"/>').html('Klucz:'));
                    for (i = 0; i < _input.length; i++) {
                        $trData.append($('<td style="border-color:white;padding:0px;font-size:20px;font-weight:bold;"/>').html(_key[i]));
                    }
                    $tbodyData.append($trData);

                    $trData = $('<tr />');
                    $trData.append($('<th style="border-color:white;font-weight:300;font-size:20px;text-align:right"/>').html('Szyfrogram:'));
                    for (i = 0; i < _input.length; i++) {
                        $trData.append($('<td style="border-color:white;padding:0px;font-size:20px;font-weight:bold;"/>').html(""));
                    }
                    $tbodyData.append($trData);
               
                    if ($('#inputCipher').val() != "") {
                        $('#nextButton').attr('disabled', false);
                        $('#startButton').attr('disabled', true);
                    }

                    if ($('#alphabetVisualization').val() == 0 || $('#alphabetVisualization').val() == 1 || $('#alphabetVisualization').val() == 2 || $('#alphabetVisualization').val() == 3) {
                        document.getElementById("marginTable").style.marginLeft = "16px";
                    }
                    else if ($('#alphabetVisualization').val() == 4) {
                        document.getElementById("marginTable").style.marginLeft = "-250px";

                    }
                    else if ($('#alphabetVisualization').val() == 5) {
                        document.getElementById("marginTable").style.marginLeft = "-300px";

                    }
                    $('#labelTabulaRecta').attr('hidden', false);
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });
        });


        $('#nextButton').click(function () {

            var model = {
                message: $('#inputCipher').val(),
                key: $('#keyVisualization').val(),
                alphabetType: $('#alphabetVisualization option:selected').val()
            }

            $.ajax({
                type: 'POST',
                url: config.urls.visualizationUrl,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {
                    var currentStep = parseInt($('#stepNumber').val());
                    var _output = data[1];

                    var inputLetter;
                    var cipherLetter;


                    var cipherData = document.getElementById("cipherData");
                    var rowsData = cipherData.getElementsByTagName("tr");
                    var cellsLength = rowsData[0].cells.length;
                    for (var z = 0; z < cellsLength; z++) {
                        if (z == currentStep) {
                            rowsData[0].cells[z].style.color = 'green';
                            inputLetter = rowsData[0].cells[z].innerHTML;
                            rowsData[1].cells[z].style.color = 'deeppink';
                            cipherLetter = rowsData[1].cells[z].innerHTML;
                        }
                        else {
                            rowsData[0].cells[z].style.color = 'black';
                            rowsData[1].cells[z].style.color = 'black';
                        }
                        if (z == currentStep) {
                            rowsData[2].cells[currentStep].innerHTML = _output[currentStep - 1];
                            rowsData[2].cells[currentStep].style.color = '#33b5e5';
                        } else {
                            rowsData[2].cells[z].style.color = 'black';
                        }
                       
                    }
                    

                    var input_i;
                    var cipher_j;
                    var table = document.getElementById("tabulaRecta");
                    var rows = table.getElementsByTagName("tr");
                    var cellsLength = rows[0].cells.length;
                    for (i = 0; i < cellsLength; i++) {
                        for (j = 0; j < cellsLength ; j++) {
                            if (rows[i].cells[0].innerHTML == inputLetter) {
                                rows[i].cells[0].style.backgroundColor = 'green';
                                input_i = i;
                                if (j != 0) {
                                    rows[i].cells[j].style.backgroundColor = 'white';
                                }
                            }
                            else if (rows[0].cells[j].innerHTML == cipherLetter) {
                                rows[0].cells[j].style.backgroundColor = 'deeppink';
                                cipher_j = j;
                                if (i != 0) {
                                    rows[i].cells[j].style.backgroundColor = 'white';
                                }
 
                            }
                            else
                            {
                                rows[i].cells[j].style.color = 'black';
                                rows[i].cells[j].style.backgroundColor = 'white';
                            }
                        }
                    }
                    for (i = 1; i < cellsLength; i++) {
                        if (i < input_i) {
                            rows[i].cells[cipher_j].style.color = 'deeppink';
                        } else
                        {
                            rows[i].cells[cipher_j].style.color = 'black';
                        }                  
                    }
                    for (j = 1; j < cellsLength; j++) {
                        if (j < cipher_j) {
                            rows[input_i].cells[j].style.color = 'green';
                        } else {
                            rows[input_i].cells[j].style.color = 'black';
                        }
                      
                    }
                    rows[input_i].cells[cipher_j].style.backgroundColor = '#33b5e5';

                    currentStep += 1;
                    $('#stepNumber').val(currentStep);

                    if (currentStep > _output.length) {
                        $('#nextButton').attr('disabled', true);
                        $('#startButton').attr('disabled', false);
                    }
                },
                error: function (response) {
                    alert(response.responseJSON.message);
                }
            });
        });

        $("#alphabetVisualization").on('change',
            function () {
                $('#outputCipher').val("");
                $('#startButton').attr('disabled', false);
                removeTable();
                $('#nextButton').attr('disabled', true);
                $('#labelTabulaRecta').attr('hidden', true);
            });

        $("#keyVisualization").on('input',
            function () {
                $('#outputCipher').val("");
                $('#startButton').attr('disabled', false);
                removeTable();
                $('#nextButton').attr('disabled', true);
                if ($('#inputCipher').val() == "") {
                    $('#startButton').attr('disabled', true);
                }
                $('#labelTabulaRecta').attr('hidden', true);
            });

        $("#inputCipher").on('input', function () {
            $('#outputCipher').val("");
            $('#startButton').attr('disabled', false);
            removeTable();
            $('#outputCipher').val("");
            $('#nextButton').attr('disabled', true);
            if ($('#inputCipher').val() == "" || $('#keyVisualization').val() == "") {
                $('#startButton').attr('disabled', true);
            }
            $('#labelTabulaRecta').attr('hidden', true);
        });

    }

    var init = function () {
        visualizationInit();
    }

    return {
        init: init
    }

}
//#endregion
