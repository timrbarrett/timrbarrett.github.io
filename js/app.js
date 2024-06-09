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

var ulisp_head = '';
var ulisp_body = '';

function connectionToggle() {
    if (connected) {
        disconnect();
    } else {
        connect();
    }
    document.getElementById('terminal').focus();
}

/**************************************************************************************************************
 *  Yellow button definitions 
 **************************************************************************************************************/

function connect() {
    if (!navigator.bluetooth) {
        console.log('WebBluetooth API is not available.\r\n' +
            'Please make sure the Web Bluetooth flag is enabled.');
        window.term_.io.println('WebBluetooth API is not available on your browser.\r\n' +
            'Please make sure the Web Bluetooth flag is enabled.');
        return;
    }
    console.log('Requesting Bluetooth Device...'); // 1
    navigator.bluetooth.requestDevice({
        //filters: [{services: []}]
        optionalServices: [bleNusServiceUUID],
        acceptAllDevices: true
    })
        .then(device => {
            bleDevice = device;
            console.log('Found ' + device.name); //2
            console.log('Connecting to GATT Server...');
            bleDevice.addEventListener('gattserverdisconnected', onDisconnected);
            return device.gatt.connect();
        })
        .then(server => {
            console.log('Locate NUS service'); // 3
            return server.getPrimaryService(bleNusServiceUUID);
        }).then(service => {
            nusService = service;
            console.log('Found NUS service: ' + service.uuid); // 4
        })
        .then(() => {
            console.log('Locate RX characteristic'); //5
            return nusService.getCharacteristic(bleNusCharRXUUID);
        })
        .then(characteristic => {
            rxCharacteristic = characteristic;
            console.log('Found RX characteristic'); //6
        })
        .then(() => {
            console.log('Locate TX characteristic'); //7
            return nusService.getCharacteristic(bleNusCharTXUUID);
        })
        .then(characteristic => {
            txCharacteristic = characteristic;
            console.log('Found TX characteristic'); //8
        })
        .then(() => {
            console.log('Enable notifications'); //9
            return txCharacteristic.startNotifications();
        })
        .then(() => {
            console.log('Notifications started'); //10
            txCharacteristic.addEventListener('characteristicvaluechanged',
                handleNotifications);
            connected = true;
            window.term_.io.println('\r\n' + bleDevice.name + ' Connected.');
            //nusSendString('\r');
            setConnButtonState(true);

            // reveal only the relevant buttons
            var connectionGroup = document.getElementById("mode-panel");
            $(connectionGroup).find('button').each(function () {

                var buttonText = $(this).text();

                var activeDuringConnection = ['Relax', 'Train', 'GaitTA',
                    //'250x2u', '250x2b', '125x4u', '125x4b', 
                    'Initialise', 'ch1',
                    'All Params', 'calves']
                if (activeDuringConnection.indexOf(buttonText) !== -1) {
                    console.log(buttonText + ' in'); $(this).show();
                } else {
                    console.log(buttonText + ' out'); $(this).hide();
                }
            });
        })
        .catch(error => {
            console.log('' + error);
            window.term_.io.println('' + error);
            if (bleDevice && bleDevice.gatt.connected) {
                bleDevice.gatt.disconnect();
            }
        });
}

function relaxPressed() {

    defineSetVal();
    defineFndelta();

    if (connected) {

        // Hypothesis: c1re 0 has to be after c1fr change for 500x1 to be loaded and effective.
        nusSendString(
            "(set-val 'c1mx 51) " +
            "(set-val 'c1fi 255) " +
            "(set-val 'c1fr 10) " +
            "(set-val 'c1hb 1) " +
            "(set-val 'c1re 1) " +
            "(set-val 'c1pu 500) \n"
        );

        showOnly("adjustment-panel", ['appTypeplus1Button', 'appTypeminus1Button', 'appTypeplus10Button', 'appTypeminus10Button']);
        showOnly("presentation-panel", ['c1mx', 'c1fr', 'c1hb', 'c1re', 'c1pu', 'c1of', 'devthr']);

    }

    c1mxPressed();

}

function gaitTAPressed() {

    defineSetVal();
    defineFndelta();

    if (connected) {

        nusSendString(
            "(defun set-val3(channel phase type activation) " +
            "    (progn " +
            "        (etlmock channel phase type activation) " +
            "        (etlcreate channel) " +
            "        (etloutput channel 0) " +
            "    ) " +
            ")"
        );
        nusSendString(
            "(etlclear devfun) "
        );

        nusSendString(
            "(set-val3 devfun 0.00 c1fi 4) " + // 0 
            "(set-val3 devfun 0.05 c1fi 3) " +
            "(set-val3 devfun 0.10 c1fi 7) " +
            "(set-val3 devfun 0.15 c1fi 75) " +
            "(set-val3 devfun 0.20 c1fi 112) "

        );

        nusSendString(
            "(set-val3 devfun 0.25 c1fi 98) " +
            "(set-val3 devfun 0.30 c1fi 73) " +
            "(set-val3 devfun 0.35 c1fi 45) " +
            "(set-val3 devfun 0.40 c1fi 32) " +
            "(set-val3 devfun 0.45 c1fi 40) "
        );

        nusSendString(
            "(set-val3 devfun 0.50 c1fi 71) " +
            "(set-val3 devfun 0.55 c1fi 142) " +
            "(set-val3 devfun 0.60 c1fi 245) " +
            "(set-val3 devfun 0.65 c1fi 255) " +
            "(set-val3 devfun 0.70 c1fi 134) "
        );

        nusSendString(
            "(set-val3 devfun 0.75 c1fi 45) " +
            "(set-val3 devfun 0.80 c1fi 3) " +
            "(set-val3 devfun 0.85 c1fi 3) " +
            "(set-val3 devfun 0.90 c1fi 5) " +
            "(set-val3 devfun 0.95 c1fi 5) "
        );


        /*
         *        (b-a)(x - min)
            f(x) = --------------  + a
                    max - min
         * */


        nusSendString(
            "(set-val3 c2fu 0.00 c2fi 0) " + // 0 
            "(set-val3 c2fu 0.05 c2fi 0) " +
            "(set-val3 c2fu 0.10 c2fi 0) " +
            "(set-val3 c2fu 0.15 c2fi 0) " +
            "(set-val3 c2fu 0.20 c2fi 1) "
        );

        nusSendString(
            "(set-val3 c2fu 0.25 c2fi 1) " +
            "(set-val3 c2fu 0.30 c2fi 3) " +
            "(set-val3 c2fu 0.35 c2fi 7) " +
            "(set-val3 c2fu 0.40 c2fi 123) " +
            "(set-val3 c2fu 0.45 c2fi 255) "
        );

        nusSendString(
            "(set-val3 c2fu 0.50 c2fi 253) " +
            "(set-val3 c2fu 0.55 c2fi 218) " +
            "(set-val3 c2fu 0.60 c2fi 160) " +
            "(set-val3 c2fu 0.65 c2fi 58) " +
            "(set-val3 c2fu 0.70 c2fi 4) "
        );

        nusSendString(
            "(set-val3 c2fu 0.75 c2fi 0) " +
            "(set-val3 c2fu 0.80 c2fi 0) " +
            "(set-val3 c2fu 0.85 c2fi 0) " +
            "(set-val3 c2fu 0.90 c2fi 0) " +
            "(set-val3 c2fu 0.95 c2fi 0) "
        );

        // setup waveform 5
        nusSendString(
            "(set-val 'c1of 0) " +
            //"(etloutput c1of 0) " +
            "(set-val 'c1fn 4) " +

            "(set-val 'c1wl 8000) " +

            "(set-val 'c1re 3)"
        );

        // setup waveform 6
        nusSendString(
            "(set-val 'c1mx 100) " +
            "(set-val 'c1hb 1) " +
            "(set-val 'c1pu 200) " +
            "(set-val 'c1fr 30)"
        );

        // initialise 7
        nusSendString(
            "(set-val 'devthr 6100) " + // problem!
            "(set-val 'c1pc 1) " +
            //"(set-val 'c1of 0) " +
            //"(etloutput c1of 0) " +
            "(set-val 'c1fn 4) " +
            "(set-val 'c1wl 120) " +
            "(cpp 1 3 1) "
        );
        
        // Hypothesis: c1re 0 has to be after c1fr change for 500x1 to be loaded and effective.
        nusSendString(
            "(set-val 'c1mx 105) " +
            "(set-val 'c1fi 255) " +
            "(set-val 'c1hb 3) " +
            "(set-val 'c1fr 30) " +

            "(set-val 'c1wl 32000) " +
            //"(set-val 'c1of 0) " +
            //"(etloutput c1of 0) " +
            "(set-val 'c1pu 140) " +
            "(set-val 'c1re 4) " +

            "(set-val 'c1fn 4)"
        );

        // Hypothesis: c1re 0 has to be after c1fr change for 500x1 to be loaded and effective.
        nusSendString(
            "(set-val 'c2of 0) " +
            "(set-val 'c2fn 4) " +
            "(set-val 'c2hb 3) " +
            "(set-val 'c2fr 30) " +
            "(set-val 'c2wl 32000) " +
            "(set-val 'c2pu 250) " +
            "(set-val 'c2re 2) " +
            "(set-val 'c2mx 100)"
        );

    }

    showOnly("presentation-panel", ['c1mx', 'c1fr', 'c1hb', 'c1re', 'c1pu', 'c1of', 'dvwl', 'devthr']);
    c1mxPressed();

}
function initialisePressed() {

    defineSetVal();
    defineFndelta();

    if (connected) {

        var device_tests = false;

        var channel1_tests = true;
        var channel2_tests = true;
        var output_errors = true;

        var pprintall_output = false;
        var any_testing = true;

        if (any_testing) {

            // aeq v1.1

            /*
             * discovered if in the transfer is goes over 255 chars it silently stops working.
             * 
             * exp is plain text
             * got is quoted text that gets evaluated
             * 
             * t2 is the label for the test usually the etl-type involved
             * test the type of test being attempted
             * exp is the expected result
             * got is what actually got returned by the test execution
             * 
             */
            nusSendString(
                "(defun aeq(t2 test exp got) " +
                //" ( progn ( princ exp ) ( princ got ) ) " +
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

            /*
             * this allows 10 to pass a compare to 10.0
             */
            /*
            nusSendString(
                "(defvar fuzz-factor 0.001) ");
    
            nusSendString(
                "(defun approx-equal (x y) " + // 1
                "  (< (/ " + // 2
                "        (abs(- x y)) " + // 0
                "        (max (abs x) (abs y)) " + // 0
                "     ) " + // -1
                "  fuzz-factor) " + // -1
                ") " // -1
            );
            */
            nusSendString(
                " (defun xeq (a b) " +
                "   (cond " +
                " ( (and(integerp a)(floatp b)) (= a b) ) " +
                " ((eq 1 1) (eq a b )) " +
                " ) " +
                " ) "
            );

            // teq v1.1
            nusSendString(
                "(defun teq(a b) " +
                " (cond " +
                "   ((and(stringp a)(stringp b))(string= a b)) " +
                "   ((and(atom a)(atom b))(xeq a b)) " + // fl-n-int-
                "   ((null a) nil)((null b) nil) " +
                "   ( t (and(listp a)(listp b))(and " +
                "      (teq(car a)(car b)) " +
                "      (teq(cdr a)(cdr b)) " +
                "))) ) "
            );

            // test-1to5 v1.0
            /*
             * If you need to use the pound symbol in a string that is enclosed in backticks (```) 
             * for template literals, you can use the ${} syntax to insert the symbol:
             */
            nusSendString(
                "(defun tests1to5 (type) " +
                "   (progn " +
                "        (princ type) " +
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
                //"    (etlclear (eval type))" +
                "    (etlcreate(eval type)) " +
                "    (aeq type 'etlcreate 1 " +
                "        '(etlcount (eval type)) " +
                "    ) " +
                //" (princ (etloutput(eval type) 0)) " +
                //" (princ (etloutput(eval type) 1)) " +
                ")"
            );

            // tst-ou v1.0
            nusSendString(
                "(defun tst-ou ( type ) " +

                " (aeq type 'tst-ou  (list type (eval type)) " +
                " ' (etloutput (eval type) 0 ) " +
                "        ) " +
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
                //"    (mapc princ error-log) " +
                //"    (princ ${'#'}\Newline) " +
                //"    (princ errs) " +
                //"     (princ ${'#'}\Newline)() " +
                ") "
            );
        }
        // regression test the basics of etl-types



        if (device_tests) {

            //nusSendString("(etl-test '(devros) ) ");
            //nusSendString("(etl-test '(devthr) ) ");
            //nusSendString("(etl-test '(devgtt) ) ");
            //nusSendString("(etl-test '(devris) ) ");
            //nusSendString("(etl-test '(devutc dvwl) ) ");

            def_ch_tests();
            nusSendString("(ch-tests-a dvwl)");
            nusSendString("(ch-tests-b dvwl)");
            undef_ch_tests();

        }

        if (channel1_tests) {

            // put these in alphabetical order
            //nusSendString("(etl-test '( c1fi c1fn c1fr ) ) ");
            nusSendString("(etl-test '( c1fi ) )");
            nusSendString("(etl-test '( c1fn ) )");
            nusSendString("(etl-test '( c1fr ) ) ");
            nusSendString(" (etlmock c1fr 100) ");
                nusSendString(" (etlcreate c1fr) " );

            nusSendString("(etl-test '( c1hb c1in c1mx ) ) ");
            nusSendString("(etl-test '( c1of c1op ) )");

            nusSendString("(etl-test '( c1re c1tp ) )");
            nusSendString("(etl-test '( c1pu ) )");
            nusSendString("(etl-test '( c1pc ) )");

        }

        if (channel2_tests) {

            nusSendString("(etl-test '( c2fi c2fn c2fr ) )");
            nusSendString("(etl-test '( c2hb c2in c2mx ) )");
            nusSendString("(etl-test '( c2of c2op ) )");
            nusSendString("(etl-test '( c2pu ) )");
            nusSendString("(etl-test '( c2re c2tp c2wl ) )");

        }

        nusSendString("(princ (etloutput dvwl 0 )) ");

        if (output_errors) {
            nusSendString("(princ errs )");
            nusSendString("(mapc princ error-log) ");
        }

        if (pprintall_output) {
            nusSendString("(pprintall )");
            //nusSendString("(pprint 'dvwl )");
            //nusSendString("(pprint 'dvwl )");
            //nusSendString("(pprint 'c1mx )");
        }

        nusSendString(

            "(defvar app-val c2tp) " 
        );
    }
    showOnly("adjustment-panel", ['appTypeplus1Button', 'appTypeminus1Button', 'appTypeplus10Button', 'appTypeminus10Button']);
    showOnly("presentation-panel", ['etlcl', 'etlco', 'etlcr', 'etlmo', 'etlou', 'acctests', 'c1mx', 'c1pu', 'c1of']);

}

function def_ch_tests() {

    // test single devris message is ignored
    nusSendString("(defun ch-tests-a (ch-type) ");
    nusSendString("(progn ");
    nusSendString("(etlclear ch-type) ");
    nusSendString("(etlclear devris) ");
    nusSendString("(etlmock devris 1000) ");
    nusSendString("(etlcreate devris) ");
    nusSendString("(aeq 'receive-devris-a 'one-devris-message-should-have-zero-c?wl-created 0 (etlcount ch-type) ) ");
    nusSendString(") ) ");

    // test dvwl gets set to the difference between gen 0 and gen 1 devris
    nusSendString("(defun ch-tests-b (ch-type) ");
    nusSendString("(progn ");
    nusSendString("  (set-val 'devris 7500)");
    nusSendString("  (set-val 'devris 8000)");
    nusSendString("  (princ (etloutput ch-type 0)) ");
    //nusSendString("(aeq 'receive-devris-b 'two-devris-messages-should-create-c?wl-with-abs-diff 500 (cadr(etloutput ch-type 0)) ) ");
    nusSendString(") ) ");

}

function undef_ch_tests() {
    nusSendString("(makunbound 'ch-tests-a) ");
    nusSendString("(makunbound 'ch-tests-b) ");
}
function allPressed() {
    if (connected) {
        nusSendString(
            "(pprintall) "
        );
    }
}
function calvesPressed() {

    defineSetVal();
    defineFndelta();

    if (connected) {

        nusSendString(
            "(defun set-val3(channel phase type activation) " +
            "    (progn " +
            "        (etlmock channel phase type activation) " +
            "        (etlcreate channel) " +
            "        (etloutput channel 0) " +
            "    ) " +
            ")"
        );
        nusSendString(
            "(etlclear devfun) "
        );

        nusSendString(
            "(set-val3 devfun 0.00 c1fi 238) " + // 0 
            "(set-val3 devfun 0.05 c1fi 254) " +
            "(set-val3 devfun 0.10 c1fi 256) " +
            "(set-val3 devfun 0.15 c1fi 169) " +
            "(set-val3 devfun 0.20 c1fi 38) "

        );

        nusSendString(
            "(set-val3 devfun 0.25 c1fi 1) " +
            "(set-val3 devfun 0.30 c1fi 0) " +
            "(set-val3 devfun 0.35 c1fi 0) " +
            "(set-val3 devfun 0.40 c1fi 0) " +
            "(set-val3 devfun 0.45 c1fi 0) "
        );

        nusSendString(
            "(set-val3 devfun 0.50 c1fi 0) " +
            "(set-val3 devfun 0.55 c1fi 1) " +
            "(set-val3 devfun 0.60 c1fi 9) " +
            "(set-val3 devfun 0.65 c1fi 30) " +
            "(set-val3 devfun 0.70 c1fi 57) "
        );

        nusSendString(
            "(set-val3 devfun 0.75 c1fi 85) " +
            "(set-val3 devfun 0.80 c1fi 121) " +
            "(set-val3 devfun 0.85 c1fi 163) " +
            "(set-val3 devfun 0.90 c1fi 204) " +
            "(set-val3 devfun 0.95 c1fi 227) "
        );


        /*
         *        (b-a)(x - min)
            f(x) = --------------  + a
                    max - min
         * */


        nusSendString(
            "(set-val3 c2fu 0.00 c2fi 0) " + // 0 
            "(set-val3 c2fu 0.05 c2fi 1) " +
            "(set-val3 c2fu 0.10 c2fi 9) " +
            "(set-val3 c2fu 0.15 c2fi 30) " +
            "(set-val3 c2fu 0.20 c2fi 57) "
        );

        nusSendString(
            "(set-val3 c2fu 0.25 c2fi 85) " +
            "(set-val3 c2fu 0.30 c2fi 121) " +
            "(set-val3 c2fu 0.35 c2fi 163) " +
            "(set-val3 c2fu 0.40 c2fi 204) " +
            "(set-val3 c2fu 0.45 c2fi 227) "
        );

        nusSendString(
            "(set-val3 c2fu 0.50 c2fi 238) " +
            "(set-val3 c2fu 0.55 c2fi 254) " +
            "(set-val3 c2fu 0.60 c2fi 256) " +
            "(set-val3 c2fu 0.65 c2fi 169) " +
            "(set-val3 c2fu 0.70 c2fi 38) "
        );

        nusSendString(
            "(set-val3 c2fu 0.75 c2fi 1) " +
            "(set-val3 c2fu 0.80 c2fi 0) " +
            "(set-val3 c2fu 0.85 c2fi 0) " +
            "(set-val3 c2fu 0.90 c2fi 0) " +
            "(set-val3 c2fu 0.95 c2fi 0) "
        );

        // setup waveform 5
        nusSendString(
            "(set-val 'c1of 0) " +
            //"(etloutput c1of 0) " +
            "(set-val 'c1fn 4) " +

            "(set-val 'c1wl 8000) " +

            "(set-val 'c1re 3)"
        );

        // setup waveform 6
        nusSendString(
            "(set-val 'c1mx 100) " +
            "(set-val 'c1hb 1) " +
            "(set-val 'c1pu 200) " +
            "(set-val 'c1fr 100)"
        );

        // initialise 7
        nusSendString(
            "(set-val 'devthr 3240) " + // problem!
            "(set-val 'c1pc 1) " +
            //"(set-val 'c1of 0) " +
            //"(etloutput c1of 0) " +
            "(set-val 'c1fn 4) " +
            "(set-val 'c1wl 120) " +
            "(cpp 1 3 1) "
        );
        
        // Hypothesis: c1re 0 has to be after c1fr change for 500x1 to be loaded and effective.
        nusSendString(
            "(set-val 'c1mx 105) " +
            "(set-val 'c1fi 255) " +
            "(set-val 'c1hb 3) " +
            "(set-val 'c1fr 200) " +

            "(set-val 'c1wl 32000) " +
            //"(set-val 'c1of 0) " +
            //"(etloutput c1of 0) " +
            "(set-val 'c1pu 140) " +
            "(set-val 'c1re 4) " +

            "(set-val 'c1fn 4)"
        );

        // Hypothesis: c1re 0 has to be after c1fr change for 500x1 to be loaded and effective.
        nusSendString(
            "(set-val 'c2of 0) " +
            "(set-val 'c2fn 4) " +
            "(set-val 'c2hb 3) " +
            "(set-val 'c2fr 200) " +
            "(set-val 'c2wl 32000) " +
            "(set-val 'c2pu 250) " +
            "(set-val 'c2re 2) " +
            "(set-val 'c2mx 100)"
        );

    }

    showOnly("presentation-panel", ['c1mx', 'c1fr', 'c1hb', 'c1re', 'c1pu', 'c1of', 'dvwl', 'devthr']);
    c1mxPressed();

}

function ch1Pressed() {
    defineSetVal();
    defineFndelta();

    if (connected) {

        /*
            c1wl of 16384 denotes 1hz
            having c1fr 100 denotes 100hz
            having 0.09 allows 9 pulses to be sent
            having 0.00 allows 0 pulses to be sent

        */

        nusSendString(
            "(defun set-val3(channel phase type activation) " +
            "    (progn " +
            "        (etlmock channel phase type activation) " +
            "        (etlcreate channel) " +
            "        (etloutput channel 0) " +
            "    ) " +
            ")"
        );
        nusSendString(
            "(etlclear devfun) "
        );

        /*
            if a full phase is 0.2seconds
            how long is 0.09 seconds in terms of a full phase
            0.09/0.2 = 0.45
        */ 
        nusSendString(
                "(defvar app-val) " +
                "(set-val 'c1wl 163840) " +
                "(set-val 'c1fr 30) " +
                "(set-val 'c1pu 100) " +
    
                "(set-val 'c1mx 70) " +
                "(set-val 'c1hb 1) " +
                "(set-val 'c1mx 0)"
        );
        nusSendString(
            "(set-val3 devfun 0.00 c1fi 175) " + // 0 
            "(set-val3 devfun 0.0125 c1fi 0) " +
            "(set-val3 devfun 0.10 c1fi 191) " + // 0 
            "(set-val3 devfun 0.1125 c1fi 0) " +
            "(set-val3 devfun 0.20 c1fi 207) " + // 0 
            "(set-val3 devfun 0.2125 c1fi 0) " 
        );
        nusSendString(
            "(set-val3 devfun 0.30 c1fi 223) " + // 0 
            "(set-val3 devfun 0.3125 c1fi 0) " +
            "(set-val3 devfun 0.40 c1fi 239) " + // 0 
            "(set-val3 devfun 0.4125 c1fi 0) " +
            "(set-val3 devfun 0.50 c1fi 255) " + // 0 
            "(set-val3 devfun 0.5125 c1fi 0) "
        );
        nusSendString(
            "(set-val3 devfun 0.70 c1fi 225) " + // 0 
            "(set-val3 devfun 0.90 c1fi 0) "
        );
        nusSendString(
            "(set-val 'c1of -0.4) " +
            "(set-val 'c1fn 4) " +
            "(set-val 'c1re 1)"
        );

        nusSendString(
            "(defvar app-val) " +
            "(set-val 'c2wl 163840) " +
            "(set-val 'c2fr 30) " +
            "(set-val 'c2pu 100) " +

            "(set-val 'c2mx 70) " +
            "(set-val 'c2hb 1) " +
            "(set-val 'c2mx 0)"
        );
        nusSendString(
            "(set-val3 c2fu 0.00 c2fi 175) " + // 0 
            "(set-val3 c2fu 0.0125 c2fi 0) " +
            "(set-val3 c2fu 0.10 c2fi 191) " + // 0 
            "(set-val3 c2fu 0.1125 c2fi 0) " +
            "(set-val3 c2fu 0.20 c2fi 207) " + // 0 
            "(set-val3 c2fu 0.2125 c12i 0) " 
        );
        nusSendString(
            "(set-val3 c2fu 0.30 c2fi 223) " + // 0 
            "(set-val3 c2fu 0.3125 c2fi 0) " +
            "(set-val3 c2fu 0.40 c2fi 239) " + // 0 
            "(set-val3 c2fu 0.4125 c2fi 0) " +
            "(set-val3 c2fu 0.50 c2fi 255) " + // 0 
            "(set-val3 c2fu 0.5125 c2fi 0) "
        );
        nusSendString(
            "(set-val3 c2fu 0.70 c2fi 225) " + // 0 
            "(set-val3 c2fu 0.90 c2fi 0) "
        );
        nusSendString(
            "(set-val 'c2of -0.4) " +
            "(set-val 'c2fn 4) " +
            "(set-val 'c2re 1)"
        );
    }

    showOnly("adjustment-panel", ['appTypepluspoint1Button', 'appTypeminuspoint1Button', 'appTypeplus10Button', 'appTypeminus10Button']);
    showOnly("presentation-panel", ['c1mx', 'c1pu', 'c1of', 'c2mx']);
}

function etlcoPressed() {
    if (connected) {
        nusSendString(
            "(with-output-to-string (str) (princ (car (etloutput app-val 0)) str) " + // start with etl-type as "c1xx"
            "(princ \" etlcount \" str)" + // then the descriptor
            "(princ(etlcount app-val) str)) " // then the result
        )
    }
}
function etlclPressed() {
    if (connected) {
        // result "c1of etlcount 1"
        nusSendString(
            "(etlclear app-val) " +
            "(with-output-to-string (str)" +
            //"  (princ(car(etloutput app-val 0)) str) " + // start with etl-type as "c1xx"
            // can't grab the descriptor as there are no records
            "  (princ \" etlclear then etlcount means count is \" str)" + // then the descriptor
            "  (princ(etlcount app-val) str)" +
            " ) " // then the result
        );
    }
}
function etlcrPressed() {
    if (connected) {
        // result "c1of etlcount 1"
        nusSendString(
            "(etlcreate app-val) " +
            "(with-output-to-string (str)" +
            "  (princ(car(etloutput app-val 0)) str) " + // start with etl-type as "c1xx"
            "  (princ \" etlcreate \" str)" + // then the descriptor
            "  (princ(etloutput app-val 0) str)" +
            " ) " // then the result
        );
    }
}
function etlmoPressed() {
    if (connected) {
        // result "c1of etlcount 1"
        nusSendString(
            "(etlmock app-val app-val) " +
            "(with-output-to-string (str)" +
            // can't grab the descriptor as there are no records
            // line may fail if there are no records
            "  (princ(car(etloutput app-val 0)) str) " + // start with etl-type as "c1xx"
            "  (princ \" etlmock \" str)" + // then the descriptor
            "  (princ app-val str)" +
            " ) " // then the result
        );
    }
}
function etlouPressed() {
    if (connected) {
        // result "c1of etlcount 1"
        nusSendString(
            "(etlmock app-val app-val) " +
            "(with-output-to-string (str)" +
            // can't grab the descriptor as there are no records
            // line may fail if there are no records
            "  (princ(car(etloutput app-val 0)) str) " + // start with etl-type as "c1xx"
            "  (princ \" etloutput \" str)" + // then the descriptor
            "  (princ (etloutput app-val 0) str)" +
            " ) " // then the result
        );
    }
}

function acctestsPressed() {
    if (connected) {

        // - [ ] every centihzpulse that three acc values are stored => dvac
        // - [] clear dvac
        nusSendString(" ( defvar app-val 1 ) "); // 1=devacc
        //nusSendString("(cpp 1 3 1) ");
        //etlclPressed(); 

        // - [] confirm dvac count is zero
        //etlcoPressed(); // results in "Error: can't take car: -1"

        // - [] mock 10 10 10
        //nusSendString(" ( etlmock devacc 10 10 10 ) ");
        // - [] create a centihzpulse
        nusSendString(" ( etlcreate devchp ) ");
        // this triggers etlcr and create_centiHzPulse() in jtag viewer.
        // - [] confirm dvac count is one
        //nusSendString(" ( etlcount devacc ) ");
        // - [] confirm values are 10 10 10
        //nusSendString(" ( etloutput devacc 0 ) ");
    }
}
/***********************************************************************************************************************************************
 * Superceeded Green button definitions  
 ***********************************************************************************************************************************************/
function incc1mxPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1mx 8)\n");
    }
}

function decc1mxPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1mx -8)\n");
    }
}
function incxc1mxPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1mx 1)\n");
    }
}

function decxc1mxPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1mx -1)\n");
    }
}

// channel two

function incc2mxPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c2mx 8)\n");
    }
}

function decc2mxPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c2mx -8)\n");
    }
}
function incxc2mxPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c2mx 1)\n");
    }
}

function decxc2mxPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c2mx -1)\n");
    }
}
function incc1fiPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1fi 8)\n");
    }
}

function decc1fiPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1fi -8)\n");
    }
}
function incxc1fiPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1fi 1)\n");
    }
}

function decxc1fiPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1fi -1)\n");
    }
}

function incc1puPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1pu 8)\n");
    }
}

function decc1puPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1pu -8)\n");
    }
}

function incc1rePressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1re 1)\n");
    }
}

function decc1rePressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1re -1)\n");
    }
}

function incc1tvPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1tv 1000)\n");
    }
}
function decc1tvPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1tv -1000)\n");
    }
}

function decc1frPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1fr -1000)\n");
    }
}

function incc1frPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1fr 1000)\n");
    }
}

function decdvwlPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'dvwl -1000)\n");
    }
}

function incdvwlPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'dvwl 1000)\n");
    }
}

function decc1ofPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1of -.1)\n");
    }
}

function incc1ofPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1of .1)\n");
    }
}
function incxc1ofPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1of 0.01)\n");
    }
}

function decxc1ofPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1of -0.01)\n");
    }
}
function decdevthrPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'devthr -10)\n");
        nusSendString("(etloutput devthr 0) ");
    }
}

function incdevthrPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'devthr 10)\n");
        nusSendString("(etloutput devthr 0) ");
        nusSendString("(dotimes (x 25) "+
           " (princ (etloutput devmea (- 25 x)))) ");
    }
}
function setoptto0Pressed() {

    if (connected) {
        nusSendString("(cpp 1 29 0) ");
    }
}

function setoptto1Pressed() {

    if (connected) {
        nusSendString("(cpp 1 29 1) ");
    }
}
//setoptto0Pressed
function setc1hbto1Pressed() {

    defineSetVal();
    defineFndelta();

    if (connected) {
        
        nusSendString("(set-val 'c1hb 1)\n");
        nusSendString("(etloutput c1hb 0) ");
    }
}

function setc1hbto2Pressed() {

    defineSetVal();
    defineFndelta();

    if (connected) {
        
        nusSendString("(set-val 'c1hb 2)\n");
        nusSendString("(etloutput c1hb 0) ");
    }
}

function imuOnPressed() {
    if (connected) {
        nusSendString("(cpp 1 3 1) ");
    }
}
function imuOffPressed() {
    if (connected) {
        nusSendString("(cpp 1 3 0) ");
    }
}
function setupPressed() {

    defineSetVal();
    defineFndelta();

    if (connected) {

        nusSendString(
            "(set-val 'c1mx 51) " +
            "(set-val 'c1fi 255) " +
            "(set-val 'c1pu 500) " +
            "(set-val 'c1fr 10) " +
            "(set-val 'c1hb 1) " +
            "(set-val 'c1re 1) " +
            "(set-val 'dvwl 10000) " +
            "(set-val 'c1of 0) " +
            "(set-val 'c1tv 1600) " +
            "(set-val 'c1pu 500) "
        );
    } 
}

/****************************************************************************************
 * blue button definitions
 *****************************************************************************************/
function appTypepluspoint01Pressed() {
    if (connected) {
        nusSendString(
            "(fndelta app-val 0.01) " +
            "(etloutput app-val 0) "
        );
    }
}
function appTypeminuspoint01Pressed() {
    if (connected) {
        nusSendString(
            "(fndelta app-val -0.01) " +
            "(etloutput app-val 0) "
        );
    }
}
function appTypepluspoint1Pressed() {
    if (connected) {
        nusSendString(
            "(fndelta app-val 0.1) " +
            "(etloutput app-val 0) "
        );
    }
}
function appTypeminuspoint1Pressed() {
    if (connected) {
        nusSendString(
            "(fndelta app-val -0.1) " +
            "(etloutput app-val 0) "
        );
    }
}
function appTypeplus1Pressed() {
    if (connected) {
        nusSendString(
            "(fndelta app-val 1) " +
            "(etloutput app-val 0) "
        );
    }
}
function appTypeminus1Pressed() {
    if (connected) {
        nusSendString(
            "(fndelta app-val -1) " +
            "(etloutput app-val 0) "
        );
    }
}
function appTypeplus10Pressed() {
    if (connected) {
        nusSendString(
            "(fndelta app-val 10) " +
            "(etloutput app-val 0) "
        );
    }
}
function appTypeminus10Pressed() {
    if (connected) {
        nusSendString(
            "(fndelta app-val -10) " +
            "(etloutput app-val 0) "
        );
    }
}

function appTypeplus100Pressed() {
    if (connected) {
        nusSendString(
            "(fndelta app-val 100) " +
            "(etloutput app-val 0) "
        );
    }
}
function appTypeminus100Pressed() {
    if (connected) {
        nusSendString(
            "(fndelta app-val -100) " +
            "(etloutput app-val 0) "
        );
    }
}
function appTypeTocmxPressed() {
    if (connected) {
        nusSendString(
            "(defvar app-val c1mx) " 
        );
    }
}

function createAccString(x, y, z) {
    return 
    " (etlmock devacc " + x + " " + y + " " + z + ") " +
            " ( etlcreate devacc ) "
}
function appTypeStepPressed() {
    if (connected) {
        nusSendString(
            //" (cpp 1 3 0) " +
            //" (defvar time-now (cddr (etloutput devchn 0))) " +
            //" (princ time-now) " +
            " (etlmock devris 500) ( etlcreate devris ) " +
            " (etlmock devris 49000) ( etlcreate devris ) " +
            " "
        );
    }
}

function appTypenoStepPressed() {
    if (connected) {

        // turn off auto creation of devacc records
        nusSendString(
            "(cpp 1 3 1) ");
    }
}
/*
 * Put a subtle border around active green display button
 */
function setActiveETLType(etl) {

    var allDisplayButtons = document.getElementsByClassName('displayButton');

    for (var i = 0, size = allDisplayButtons.length; i < size; i++) {
        allDisplayButtons[i].style.border = "thick solid #27ae60"; // Nefertitus
        //console.log(i);
    }

    var buttonEtltypeElement = document.getElementById(etl).style.border = "thick solid #f1c40f"; // Sunflower Yellow
}

/******************************************************************************************************************************************************************************
 * Green buttons pressed
 ******************************************************************************************************************************************************************************/
function c1mxPressed() {
    if (connected) {
        nusSendString(
            "(defvar app-val c1mx) "
        );
    }
    setActiveETLType('c1mx');
    showOnly("adjustment-panel", ['appTypeplus1Button', 'appTypeminus1Button', 'appTypeplus10Button', 'appTypeminus10Button', 'appTypeplus100Button', 'appTypeminus100Button']);
}
function c2mxPressed() {
    if (connected) {
        nusSendString(
            "(defvar app-val c2mx) "
        );
    }
    setActiveETLType('c2mx');
    showOnly("adjustment-panel", ['appTypeplus1Button', 'appTypeminus1Button', 'appTypeplus10Button', 'appTypeminus10Button', 'appTypeplus100Button', 'appTypeminus100Button']);
}

function c1puPressed() {
    if (connected) {
        nusSendString(
            "(defvar app-val c1pu) "
        );
    }
    setActiveETLType('c1pu');
    showOnly("adjustment-panel", ['appTypeplus10Button', 'appTypeminus10Button', 'appTypeplus100Button', 'appTypeminus100Button']);
}

function c1rePressed() {
    if (connected) {
        nusSendString(
            "(defvar app-val c1re) "
        );
    }
    setActiveETLType('c1re');
    showOnly("adjustment-panel", ['appTypeplus1Button', 'appTypeminus1Button', 'appTypeplus10Button', 'appTypeminus10Button']);
}
function c1frPressed() {
    if (connected) {
        nusSendString(
            "(defvar app-val c1fr) "
        );
    }
    setActiveETLType('c1fr');
    showOnly("adjustment-panel", ['appTypeplus1Button', 'appTypeminus1Button', 'appTypeplus10Button', 'appTypeminus10Button']);
}
function c1hbPressed() {
    if (connected) {
        nusSendString(
            "(defvar app-val c1hb) "
        );
    }
    setActiveETLType('c1hb');
    showOnly("adjustment-panel", ['appTypeplus1Button', 'appTypeminus1Button']);
}
function c1ofPressed() {
    if (connected) {
        nusSendString(
            "(defvar app-val c1of) " +
            "(set-val c1of 0.0) "
        );
    }
    setActiveETLType('c1of');
    showOnly("adjustment-panel", ['appTypepluspoint01Button', 'appTypeminuspoint01Button', 'appTypepluspoint1Button', 'appTypeminuspoint1Button']);
}
function dvwlPressed() {
    if (connected) {
        nusSendString(
            "(defvar app-val dvwl) "
        );
    }
    setActiveETLType('dvwl');
    showOnly("adjustment-panel", ['appTypeplus100Button', 'appTypeminus100Button']);
}
function devthrPressed() {
    if (connected) {
        nusSendString(
            "(defvar app-val devthr) "
        );
    }
    setActiveETLType('devthr');
    showOnly("adjustment-panel", ['appTypeplus1Button', 'appTypeminus1Button', 'appTypeplus10Button', 'appTypeminus10Button', 'appTypeplus100Button', 'appTypeminus100Button', 'appTypeStepButton', 'appTypenoStepButton']);
}

function c1oftestPressed() {
    defineSetVal();
    defineTestval();
    defineR2c1s();

    if (connected) {
        nusSendString(
            "(r2c1s 'c1op 0.5 'c1of 0.0 'c1tp 0.5) " +
            "(r2c1s 'c1op 0.5 'c1of 0.2 'c1tp 0.7) " +
            "(r2c1s 'c1op 0.5 'c1of 0.25 'c1tp 0.75) " +

            // test negative c1of [0.0 to -1.0]
            "(r2c1s 'c1op 0.5 'c1of -0.5 'c1tp 0.0) " + // does net zero trip us up?
            "(r2c1s 'c1op 0.5 'c1of -0.6 'c1tp 0.9) " + // does net -ve result in +ve?
            "(r2c1s 'c1op 0.5 'c1of -0.7 'c1tp 0.8) " // consistently?
        );

        nusSendString(
             "(r2c1s 'c1op 0.0 'c1of -0.2 'c1tp 0.8) " + // start at zero, can of be -ve and result in +ve? // 

            // test c1of much greater than 1.0
            "(r2c1s 'c1op 0.9 'c1of 1.5 'c1tp 0.4) " + // 2.4 
            "(r2c1s 'c1op 0.3 'c1of 17.5 'c1tp 0.8) " + // 17.8

            // test c1of much less than -1.0
            "(r2c1s 'c1op 0.5 'c1of 0.0 'c1tp 0.5) " +
            "(r2c1s 'c1op 0.5 'c1of 0.5 'c1tp 0.0) " +
            "(r2c1s 'c1op 0.5 'c1of 0.5 'c1tp 0.0) " // 
            //*/
        );
    }
}

function defineSetVal() {
    if (connected) {
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
    }
}
function defineFndelta() {
    defineSetVal();
    if (connected) {

        /*
         *  I want to determine the current value of [etl]type
         *  compare the current value and -delta to see if we're in danger of wraparound
         */

        /*
        nusSendString(
            "(car(cdr(etloutput(eval type) 0))) "
        );
        */

        // ulisp_head and ulisp_body should now have values
        //window.term_.io.print('ulisp_head: ' + ulisp_head);
        //window.term_.io.print('ulisp_tail: ' + ulisp_tail);

        /*
         * OK I can't intercept in the way that I wanted because we only know what etl-type and delta are requested 
         * once the request has been made.
         * 
         * I need to figure out a way to do this in the ulsip definition and execution of the ulisp code.
         */

        /*
         * I'm thinking adding a let statement
         * 
         * let special form
         * Syntax: (let ((var value) … ) forms*)
         * Declares local variables, and evaluates forms with those local variables.
         * In its simplest form you can declare a list of one or more variables which will be initialised to nil, 
         * and these can then be used in the subsequent forms:
         *
         * (let (a b)
         *  (setq a 1)
         *  (setq b 2)
         *  (* a a b))
         *  
         * so for this example  (let (etl_value)
         *                          (etl_value (car(cdr(etloutput(eval type) 0))) )***)
         *                          all my prior code goes in ***
         */

        /* ulisp code before
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
            */

        /*
        nusSendString(
            "(defun fndelta(type delta) " +
                "(let(etl_value) " +
                    " (setq etl_value (car(cdr(etloutput(eval type) 0)))) " +
                    " (progn " +
                        " (etlmock(eval type) " +
                            " (incf etl_value " +
                                " delta " +
                            " ) " + // incf
                        " ) " + // mock
                        " (etlcreate(eval type)) " +
                        " (etloutput(eval type) 0) " +
                    " ) " + // progn
                " )" + // let
            ") \n"); // defun
        */

        /* 
         * 
         * OK that now works as expected in ulisp 
         * to keep this to under 256 characters I need to create two new defuns
         * one to check the value vs the delta check-delta (value delta)
         * the other to execute the change. exec-delta (type delta)
         * 
         */

        /*
         * Testing "connect" > "Relax" > c1mx defaults to 051
         * +1 > 052 correct
         * -1 > 051 correct
         * +10 > 061 correct
         * -10 > 051 correct
         * -100 > 051 correct |-100| > 051 so stop
         * +100 > 151 correct 
         * -100 > 151 fail |-100| is not > 151
         * -10 > 141 correct 
         * */
        nusSendString(
            "(defun check-delta-safe (value delta) " +
                //" (princ 'check-delta-safe ) " +
                // " (princ \" \" ) " +
                //" (princ (< delta 0))" +
                //" (princ (> (- 0 delta) value) ) " +
                //" (princ (- 0 delta) ) " +
                //" (princ value ) " +
                " ( if " +
                    " ( not ( and " +
                        " (< delta 0) " + // if delta is less than zero - ie negative be true
                        " (> (- 0 delta) value) " + // if -delta gt value be true
                    " ) ) " + // and not
                " 1 ) " + // if
            ") "); // defun
    
        nusSendString(
            "(defun fndelta(type delta) " +
                "(let(etl-value new-value) " +
                    " (setq etl-value (car(cdr(etloutput(eval type) 0))) " +
                        //" new-value (incf etl-value delta) " +
                     ") " +
            "( if (check-delta-safe etl-value delta) " +
                        " (set-val type (+ etl-value delta) ) " +
                    ") " + // if statement
                ") " + // let statement
            ") \n"); // defun fndelta

        //                        " (incf (car(cdr(etloutput(eval type) 0))) " +
        //                              " delta " +
    }
}
function defineTestval() {

    /*
    (defun test-val (e-t va)
      (cond
        ((= 0 (etlcount (eval e-t))) (if (eq va 'no-record)(list e-t 'n-r-pass)(list e-t 'n-r-fail)))
        ((not (eq va (cadr (etloutput (eval e-t) 0)))) (list (etloutput (eval e-t) 0) 'exp va))
        (t (list e-t va 'pass))
      )
    ) 

(defun test-val (etl-t va)
(cond

((= 0 (etlcount (eval etl-t))) (if (eq va 'no-record)(list etl-t 'n-r-pass)))

((not (eq va (cadr (etloutput (eval etl-t) 0)))) (list (etloutput (eval etl-t) 0) 'expected va))

(t (list etl-t va 'pass))

)
)

(defun close-enough (a b &optional (tolerance 0.0001))
  (< (abs (- a b)) tolerance))
    */

    if (connected) {
        nusSendString(
            "(defun test-val(e-t va) " +
            "  (cond " +
//            "    ( (= 0 (etlcount (eval etl-t))) (if (eq va 'no-record)(list etl-t 'n-r-pass))) " +
            "    ((not (eq va (cadr (etloutput (eval e-t) 0)))) (list (etloutput (eval e-t) 0) 'expected va)) " +
            "    (t (list e-t va 'pass)) " +
            "  ) " +
            ") "
        );
    }
}

function defineR2c1s() {

    //defineSetVal();
    //defineTestval();

    if (connected) {
        nusSendString(
            "(defun r2c1s(etl1 val1 etl2 val2 etl3 val3) " +
            " (progn " +
            "  (etlclear(eval etl1))(etlclear(eval etl2))(etlclear(eval etl3)) " +
            "  (set-val etl1 val1) " +
            "  (set-val etl2 val2) " +
            "  (test-val etl3 val3) " +
  //          "    (princ '>) " +
  //          "  (etloutput(eval etl3) 0) " +
  //          "  (princ val3) " +
            " ) " +
            ") "
        );
    }
}

// use: revealButtons("adjustment-panel", ['Inc c1mx', 'Dec c1mx']);
function revealButtons(divName, buttonsToReveal) {
    var connectionGroup = document.getElementById(divName);
    $(connectionGroup).find('button').each(function () {
        
        var elementName = $(this).text().replace(/^\s+|\s+$/gm, '');
        var elementtoshow = document.getElementById(elementName);
        if (buttonsToReveal.indexOf(elementName) !== -1) {
            console.log('[' + elementName + ']' + ' in'); elementtoshow.style.visibility = 'show';
            //show();
        } else {
            console.log('[' + elementName + ']' + ' out'); elementtoshow.style.visibility = 'hidden';
        }
    });

}

function showOnly(divname, idsToShow) {
    const container = document.getElementById(divname);
    const allButtons = container.getElementsByTagName('button');

    for (let i = 0; i < allButtons.length; i++) {
        allButtons[i].style.display = 'none';
    }

    for (let i = 0; i < idsToShow.length; i++) {
        const id = idsToShow[i];
        const element = document.getElementById(id);

        if (element) {
            //console.log('showOnly-display' + id);
            element.style.display = 'block';
        } else {
            //console.log('showOnly-hide' + id);
            element.style.display = 'none';
        }
    }
}
function m250x2uPressed() {

    defineSetVal();
    defineFndelta();

    if (connected) {

        // Hypothesis: c1re 0 has to be after c1fr change for 500x1 to be loaded and effective.
        nusSendString(
            "(set-val 'c1mx 51) " +
            "(set-val 'c1fi 255) " +
            "(set-val 'c1hb 1) " +
            "(set-val 'c1fr 10) " +
            "(set-val 'c1wl 320000) " +
            "(set-val 'c1of 0) " +
            "(set-val 'c1tv 1600) " +
            "(set-val 'c1pu 500) " +
            "(set-val 'c1re 3) " +
            "(set-val 'c1fn 0)"
        );

        revealButtons("adjustment-panel", ['Inc c1mx', 'Dec c1mx']);
    }
}

function m250x2bPressed() {

    defineSetVal();
    defineFndelta();

    if (connected) {

        // Hypothesis: c1re 0 has to be after c1fr change for 500x1 to be loaded and effective.
        nusSendString(
            "(set-val 'c1mx 51) " +
            "(set-val 'c1fi 255) " +
            "(set-val 'c1hb 1) " +
            "(set-val 'c1fr 10) " +
            "(set-val 'dvwl 320000) " +
            "(set-val 'c1of 0) " +
            "(set-val 'c1tv 1600) " +
            "(set-val 'c1pu 500) " +
            "(set-val 'c1re 4) " +
            "(set-val 'c1fn 0)"
        );
    }
}

function m125x4uPressed() {

    defineSetVal();
    defineFndelta();

    if (connected) {

        // Hypothesis: c1re 0 has to be after c1fr change for 500x1 to be loaded and effective.
        nusSendString(
            "(set-val 'c1mx 51) " +
            "(set-val 'c1fi 255) " +
            "(set-val 'c1hb 1) " +
            "(set-val 'c1fr 10) " +
            "(set-val 'dvwl 320000) " +
            "(set-val 'c1of 0) " +
            "(set-val 'c1tv 1600) " +
            "(set-val 'c1pu 500) " +
            "(set-val 'c1re 5) " +
            "(set-val 'c1fn 0)"
        );
    }
}

function m125x4bPressed() {

    defineSetVal();
    defineFndelta();

    if (connected) {

        // Hypothesis: c1re 0 has to be after c1fr change for 500x1 to be loaded and effective.
        nusSendString(
            "(set-val 'c1mx 51) " +
            "(set-val 'c1fi 255) " +
            "(set-val 'c1hb 1) " +
            "(set-val 'c1fr 10) " +
            "(set-val 'dvwl 320000) " +
            "(set-val 'c1of 0) " +
            "(set-val 'c1tv 1600) " +
            "(set-val 'c1pu 500) " +
            "(set-val 'c1re 6) " +
            "(set-val 'c1fn 0)"
        );
    }
}
function trainPressed() {

    defineSetVal();
    defineFndelta();

    if (connected) {

        nusSendString(
            "(defun set-val3(phase type activation) " +
            "    (progn " +
            "        (etlmock devfun phase type activation) " +
            "        (etlcreate devfun) " +
            "        (etloutput devfun 0) " +
            "    ) " +
            ")"
        );
        nusSendString(
            "(etlclear devfun) "
        );

        nusSendString(
            "(set-val3  0.00 c1hb 1) " + // 0 
            "(set-val3 0.04 c1fi 160) " +
            "(set-val3  0.08 c1fi 235) " +
            "(set-val3  0.17 c1fi 250) " +
            "(set-val3  0.25 c1fi 255) " +
            "(set-val3  0.33 c1fi 250) " +
            "(set-val3  0.42 c1fi 235) " +
            "(set-val3  0.50 c1fi 160) "
        );

        nusSendString(
            "(set-val3 0.50 c1hb 2) " +
            "(set-val3 0.54 c1fi 160) " +
            "(set-val3  0.58 c1fi 235) " +
            "(set-val3  0.67 c1fi 250) " +
            "(set-val3  0.75 c1fi 255) " +
            "(set-val3  0.83 c1fi 250) " +
            "(set-val3  0.92 c1fi 235) " +
            "(set-val3  0.96 c1fi 160) "

        );

        //      waveform
        //
        // 255     -----------
        // 127    /           \
        // 000   -             ------
        //
        //       00112233445566778899
        //       05050505050505050505
        //
          // c1tp = 19 c1in = 24

        nusSendString(
            "(set-val 'c1mx 51) " +
            "(set-val 'c1fi 255) " +
            "(set-val 'c1re 2) " +
            "(set-val 'c1fr 10) " + // this starts PWM loop going
            "(set-val 'dvwl 2666) " +
            "(set-val 'c1of 0) " +
            "(set-val 'c1fn 4) "  // this starts the op, of, tp, in cascade going


        );

        revealButtons("adjustment-panel", ['Inc c1mx', 'Dec c1mx', 'Inc xc1mx', 'Dec xc1mx',
            'Inc dvwl', 'Dec dvwl', 'Inc c1re', 'Dec c1re', 'Inc dvwl', 'Dec dvwl', 'Inc c1pc', 'Dec c1pc',
            'Set c1hb=1', 'Set c1hb=2'        ]);
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
    location.reload();
}


function interpretUlisp(str) {
    const regex = /\((\w+)\s(\d+)\)/;
    const match = regex.exec(str);

    /*
     * handle well formed ulisp expressions in the form (function function-body)
     * function will be in match[1]
     * function body, which might be many elements will be in match[2]
     */
    if (match) {
        ulisp_head = match[1]; // "c1mx"
        ulisp_body = parseInt(match[2]).toString().padStart(3, '0'); // 127
        // parseFloat(match[2]).toString().padStart(3, '0');
        console.log('receive: ' + ulisp_head, ulisp_body);

        // get the button__value element by its class name
        const buttonValueElement = document.querySelector('#' + match[1] + ' .button__value');
        // update the text content of the element
        buttonValueElement.textContent = ulisp_body;
        
    } else {
        /*
         * suppress the responses to green buttons being selected
         * and suppress the standard ulisp > response too.
         */
        if (str == '=app-val' || str == ">") {
        } else {
            console.log("No match found.");
            console.log(str);
        } 
    }
}

// handleInbound text from limbstim
function handleNotifications(event) {
    //console.log('notification');
    let value = event.target.value;
    // Convert raw data bytes to character values and use these to 
    // construct a string.
    let str = "";
    for (let i = 0; i < value.byteLength; i++) {
        
        if (value.getUint8(i) == 10) {
            window.term_.io.println(str);
            //console.log(str);

            interpretUlisp(str);

            str = "";
        } else {
            str += String.fromCharCode(value.getUint8(i));
        }
    }

    window.term_.io.print(str);

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
        await new Promise(resolve => setTimeout(resolve, 250)); // wait for 0.5 second
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

/*
let writeValuePromise = Promise.resolve();

async function sendManyValues(chunk) {
  await writeValuePromise;
  try {
    writeValuePromise = rxCharacteristic.writeValueWithResponse(chunk);
    await writeValuePromise;
  } catch (error) {
    throw error;
  }
}
*/
function initContent(io) {
    io.println("\r\n\
Welcome to Limbstim Control V0.0.7 (1st Sep 2023)\r\n\
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