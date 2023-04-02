'use strict';

const bleNusServiceUUID  = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const bleNusCharRXUUID   = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const bleNusCharTXUUID   = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
const MTU = 20;

var bleDevice;
var bleServer;
var nusService;
var rxCharacteristic;
var txCharacteristic;

var connected = false;

function connectionToggle() {
    if (connected) {
        disconnect();
    } else {
        connect();
    }
    document.getElementById('terminal').focus();
}

function initialisePressed() {
    if (connected) {
        //nusSendString("(room)\n");
        /*nusSendString("(defun fndelt(type delta) ");
        nusSendString(  "(progn ");
        nusSendString(      "(etlmock(eval type) ");
        nusSendString(          "(incf(car(cdr(etloutput(eval type) 0))) ");
        nusSendString(              "delta ");
        nusSendString(          ") ");
        nusSendString(      ") ");
        nusSendString(  "(etlcreate(eval type)) ");
        nusSendString(")) \n");*/

        nusSendString(
            "(defun fndelta(type delta) " +
            "   (progn " +
            "       (etlmock(eval type) " +
            "           (incf(car(cdr(etloutput(eval type) 0))) " +
            "               delta " +
            "           ) " +
            "       ) " +
            "       (etlcreate(eval type)) " +
            "       (etloutput(eval type) 0) " +
            "   )" +
            ") \n");

        // to include a double quote character in a string in js
        // one needs to escape the double quotes
        // https://stackoverflow.com/questions/10055773/double-quote-in-javascript-string
        nusSendString(
            "(defun set-val(type value) " +
            "    (progn " +
            "        (etlmock(eval type) value) " +
            "        (etlcreate(eval type)) " +
            //"        (princ type)(princ \" \")(princ value)(princ \" \") " +
            "        (etloutput(eval type) 0) " +
            "    ) " +
            ")"
        );

        nusSendString(
            "(set-val 'c1mx 255) " +
            "(set-val 'c1fi 127) " +
            "(set-val 'c1hb 1) " +
            "(set-val 'c1fr 200)"
        );


        // aeq v1.1
        /*
         * discovered if in the transfer is goes over 255 chars it silently stops working.
         */
        nusSendString(
            "(defun aeq(t2 test exp got) " +
            "   (unless " +
            "       (teq exp (eval got)) " +
            "       (progn " +
            "           (push(list t2 test exp(eval got)) error-log) " +
            "           (incf errs) " +
            "           '(print-error t2 test exp got) " +
            "           (princ t2) " +
            "      ) " +
            "  ) " +
            ") "
        );

        // teq v1.1
        nusSendString(
            "(defun teq(a b) " +
            " (cond " +
            "   ((and(stringp a)(stringp b))(string = a b)) " +
            "   ((and(atom a)(atom b))(eq a b)) " +
            "   ((null a) nil)((null b) nil) " +
            "   ((and(listp a)(listp b))(and " +
            "      (teq(car a)(car b)) " +
            "      (teq(cdr a)(cdr b)) " +
            "t()))) ) "
        );

        // test-1to5 v1.0
        /*
         * If you need to use the pound symbol in a string that is enclosed in backticks (```) 
         * for template literals, you can use the ${} syntax to insert the symbol:
         */
        nusSendString(
            "(defun tests1to5 (type) " +
            "   (progn " +
            //"        (princ \${'#'}\Newline) " + // need to escape the hash symbol
            "        (tst-co type) " +
            "        (tst-cl type) " +
            "        (tst-mo type) " +
            "        (tst-cr type) " +
            "        (tst-ou type) " +
            "        (tst-cl type) " +
            "    )" +
            ")"
        );

        
        // tst-co v1.0
        nusSendString(
            "(defun tst-co(type) " +
            "   (etlclear(eval type)) " +
            "   (aeq type 'etlcount 0 '(etlcount(eval type))) " +
            ") "
        );

        // tst-cl v1.0
        nusSendString(
            "(defun tst-cl(type) " +
            "    (etlclear(eval type)) " +
            "    (aeq type 'etlclear 0 '(etlcount(eval type))) " +
            ")"
        );

        // tst-mo v1.0
        nusSendString(
            "(defun tst-mo(type) " +
            "    (etlmock(eval type)(eval type)) " +
            "    (aeq type 'etlmock 0 '(etlcount(eval type))) " +
            ")"
        );

        // tst-cr v1.0
        nusSendString(
            "(defun tst-cr(type) " +
            "    (etlcreate(eval type)) " +
            "    (aeq type 'etlcreate 1 " +
            "        '(etlcount (eval type)) " +
            "    ) " +
            ")"
        );

        // tst-ou v1.0
        nusSendString(
            "(defun tst-ou ( type ) " +
            "    (unless " +
            "        (teq(list type(eval type))(etloutput(eval type) 0)) " +
            "        (progn " +
            "            (princ(list type(eval type))) " +
            "            (princ(etloutput(eval type) 0)) " +
            "        ) " +
            "    ) " +
            ")" 
        );

        // tst-tst-1 v1.0
        nusSendString(
            "(defun tst-1 (type) " +
            "    (if (> (etloutput(eval type) 0) -1) " +
            "       (princ 'fail) " +
            "       (princ 'pass) " +
            "   ) " +
            ")"
        );

        // test logs
        nusSendString(
            "(defvar errs 0) " +
            "(defvar error-log()) " +
            "(defvar pass-log()) "
        );
        
        // # in ulisp must be entered as ${'#'} in js
        // etl-tst v1.0
        nusSendString(
             "(defun etl-test(type-list) " +
             "    (mapc tests1to5 type-list) " +
             //"    (princ ${'#'}\Newline) " +
             "    (mapc princ error-log) " +
             //"    (princ ${'#'}\Newline) " +
             "    (princ errs) " +
             //"     (princ ${'#'}\Newline)() " +
             ") "
        );

        // regression test the basics of etl-types

        // 1 to 3 are triple types

        // 4 to 8 
        nusSendString( "(etl-test '(devros ) )" );
        nusSendString(
            "(etl-test '( devthr ) )"
        );
        nusSendString(
            "(etl-test '(devgtt ) )"
        );
        nusSendString(
            "(etl-test '(devris ) )"
        );
        nusSendString(
            "(etl-test '(devutc ) )"
        );
        

        // 9 to 13
        nusSendString("(etl-test '( c1mx ) )" );
        nusSendString("(etl-test '( c1pu ) )");
        nusSendString("(etl-test '( c1fr ) )");
        nusSendString("(etl-test '( c1fi ) )");
        nusSendString("(etl-test '( c1hb ) )");

        // 14 to 17
        nusSendString("(etl-test '( c1wl ) )");
        nusSendString("(etl-test '( c1pc ) )");
        //nusSendString("(etl-test '( c1vp ) )");
        //nusSendString("(etl-test '( c1vp ) )");

        // 18 to 21
        nusSendString("(etl-test '( c1op ) )");
        nusSendString("(etl-test '( c1of ) )");
        nusSendString("(etl-test '( c1tp ) )");
        nusSendString("(etl-test '( c1si ) )");

        nusSendString("(etl-test '( c1re ) )");
        nusSendString("(etl-test '( c1tv ) )");

        /*
         
        // tst-mo v1.0
        nusSendString(
        );

        */

        nusSendString(
            "(set-val 'c1mx 127) " +
            "(set-val 'c1fi 255) " +
            "(set-val 'c1hb 1) " +
            "(set-val 'c1fr 10) " +
            "(set-val 'c1wl 10000) " +
            "(set-val 'c1of 0) " +
            "(set-val 'c1pu 100)"
        );
    }
}
            //"(set-val 'c1fn 4) " +
function incc1mxPressed() {
    if (connected) {
        nusSendString("(fndelta 'c1mx 8)\n");
    }
}

function decc1mxPressed() {
    if (connected) {
        nusSendString("(fndelta 'c1mx -8)\n");
    }
}

function incc1puPressed() {
    if (connected) {
        nusSendString("(fndelta 'c1pu 8)\n");
    }
}

function decc1puPressed() {
    if (connected) {
        nusSendString("(fndelta 'c1pu -8)\n");
    }
}

function incc1rePressed() {
    if (connected) {
        nusSendString("(fndelta 'c1re 1)\n");
    }
}

function decc1rePressed() {
    if (connected) {
        nusSendString("(fndelta 'c1re -1)\n");
    }
}

function setupPressed() {
    if (connect) {
        nusSendString(
            "(defun set-val(type value) " +
            "    (progn " +
            "        (etlmock(eval type) value) " +
            "        (etlcreate(eval type)) " +
            //"        (princ type)(princ \" \")(princ value)(princ \" \") " +
            "        (etloutput(eval type) 0) " +
            "    ) " +
            ")"
        );

        nusSendString(
            "(set-val 'c1mx 255) " +
            "(set-val 'c1fi 127) " +
            "(set-val 'c1hb 1) " +
            "(set-val 'c1fr 200)"
        );
    } 
}
// Sets button to either Connect or Disconnect
function setConnButtonState(enabled) {
    if (enabled) {
        document.getElementById("clientConnectButton").innerHTML = "Disconnect";
    } else {
        document.getElementById("clientConnectButton").innerHTML = "Connect";
    }
}

function connect() {
    if (!navigator.bluetooth) {
        console.log('WebBluetooth API is not available.\r\n' +
                    'Please make sure the Web Bluetooth flag is enabled.');
        window.term_.io.println('WebBluetooth API is not available on your browser.\r\n' +
                    'Please make sure the Web Bluetooth flag is enabled.');
        return;
    }
    console.log('Requesting Bluetooth Device...');
    navigator.bluetooth.requestDevice({
        //filters: [{services: []}]
        optionalServices: [bleNusServiceUUID],
        acceptAllDevices: true
    })
    .then(device => {
        bleDevice = device; 
        console.log('Found ' + device.name);
        console.log('Connecting to GATT Server...');
        bleDevice.addEventListener('gattserverdisconnected', onDisconnected);
        return device.gatt.connect();
    })
    .then(server => {
        console.log('Locate NUS service');
        return server.getPrimaryService(bleNusServiceUUID);
    }).then(service => {
        nusService = service;
        console.log('Found NUS service: ' + service.uuid);
    })
    .then(() => {
        console.log('Locate RX characteristic');
        return nusService.getCharacteristic(bleNusCharRXUUID);
    })
    .then(characteristic => {
        rxCharacteristic = characteristic;
        console.log('Found RX characteristic');
    })
    .then(() => {
        console.log('Locate TX characteristic');
        return nusService.getCharacteristic(bleNusCharTXUUID);
    })
    .then(characteristic => {
        txCharacteristic = characteristic;
        console.log('Found TX characteristic');
    })
    .then(() => {
        console.log('Enable notifications');
        return txCharacteristic.startNotifications();
    })
    .then(() => {
        console.log('Notifications started');
        txCharacteristic.addEventListener('characteristicvaluechanged',
                                          handleNotifications);
        connected = true;
        window.term_.io.println('\r\n' + bleDevice.name + ' Connected.');
        //nusSendString('\r');
        setConnButtonState(true);
    })
    .catch(error => {
        console.log('' + error);
        window.term_.io.println('' + error);
        if(bleDevice && bleDevice.gatt.connected)
        {
            bleDevice.gatt.disconnect();
        }
    });
}

function disconnect() {
    if (!bleDevice) {
        console.log('No Bluetooth Device connected...');
        return;
    }
    console.log('Disconnecting from Bluetooth Device...');
    if (bleDevice.gatt.connected) {
        bleDevice.gatt.disconnect();
        connected = false;
        setConnButtonState(false);
        console.log('Bluetooth Device connected: ' + bleDevice.gatt.connected);
    } else {
        console.log('> Bluetooth Device is already disconnected');
    }
}

function onDisconnected() {
    connected = false;
    window.term_.io.println('\r\n' + bleDevice.name + ' Disconnected.');
    setConnButtonState(false);
}

function handleNotifications(event) {
    console.log('notification');
    let value = event.target.value;
    // Convert raw data bytes to character values and use these to 
    // construct a string.
    let str = "";
    for (let i = 0; i < value.byteLength; i++) {
        
        if (value.getUint8(i) == 10) {
            window.term_.io.println(str);
            //window.term_.io.println(' ');
            str = "";
        } else {
            str += String.fromCharCode(value.getUint8(i));
        }
    }
    window.term_.io.println(str);
}

function nusSendString(s) {
    if(bleDevice && bleDevice.gatt.connected ) {
        console.log("send: " + s);
        let val_arr = new Uint8Array(s.length)
        for (let i = 0; i < s.length; i++) {
            let val = s[i].charCodeAt(0);
            val_arr[i] = val;
        }
        //sendNextChunk(val_arr);
        sendManyValues(val_arr);
    } else {
        window.term_.io.println('Not connected to a device yet.');
    }
}

function sendNextChunk(a) {
    let chunk = a.slice(0, MTU);
    rxCharacteristic.writeValuewithResponse(chunk)
      .then(function() {
          if (a.length > MTU) {
              sendNextChunk(a.slice(MTU));
          }
      });
}

let writeValueInProgress = false;

async function sendManyValues(chunk) {
    while (writeValueInProgress) {
        await new Promise(resolve => setTimeout(resolve, 300)); // wait for 0.5 second
    }
    writeValueInProgress = true;
    try {
        await rxCharacteristic.writeValueWithResponse(chunk);
        writeValueInProgress = false;
    } catch (error) {
        writeValueInProgress = false;
        throw error;
    }
}


function initContent(io) {
    io.println("\r\n\
Welcome to Limbstim Control V0.0.6 (18th Mar 2023)\r\n\
\r\n\
This is a Web Command Line Interface via NUS (Nordic UART Service) using Web Bluetooth.\r\n\
\r\n\
  * Live:   https://timrbarrett.github.io/index\r\n\
");
}

function setupHterm() {
    const term = new hterm.Terminal();

    term.onTerminalReady = function() {
        const io = this.io.push();
        io.onVTKeystroke = (string) => {
            nusSendString(string);
        };
        io.sendString = nusSendString;
        initContent(io);
        this.setCursorVisible(true);
        this.keyboard.characterEncoding = 'raw';
    };
    term.decorate(document.querySelector('#terminal'));
    term.installKeyboard();

    term.contextMenu.setItems([
        ['Terminal Reset', () => {term.reset(); initContent(window.term_.io);}],
        ['Terminal Clear', () => {term.clearHome();}],
        [hterm.ContextMenu.SEPARATOR],
        ['GitHub', function() {
            lib.f.openWindow('https://github.com/makerdiary/web-device-cli', '_blank');
        }],
    ]);

    // Useful for console debugging.
    window.term_ = term;
}

window.onload = function() {
    lib.init(setupHterm);
};