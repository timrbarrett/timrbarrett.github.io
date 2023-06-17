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

    defineSetVal();
    defineFndelta();

    if (connected) {

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
        nusSendString("(etl-test '(devros) ) ");

        // why is symbol table full?
        /*nusSendString("(test1to5 '(devros) ) ");
        nusSendString("(tst-co type) ");
        nusSendString("(tst-cl type) ");
        nusSendString("(tst-mo type) ");
        nusSendString("(tst-cr type) ");
        nusSendString("(tst-ou type) ");
        nusSendString("(tst-cl type) ");*/

        nusSendString(
            "(etl-test '( devthr ) ) "
        );
        nusSendString(
            "(etl-test '(devgtt ) ) "
        );
        nusSendString(
            "(etl-test '(devris ) ) "
        );
        nusSendString(
            "(etl-test '(devutc ) ) "
        );
        

        // 9 to 13
        nusSendString("(etl-test '( c1mx ) ) " );
        nusSendString("(etl-test '( c1pu ) ) ");
        nusSendString("(etl-test '( c1fr ) ) ");
        nusSendString("(etl-test '( c1fi ) ) ");
        nusSendString("(etl-test '( c1hb ) ) ");

        // 14 to 17
        nusSendString("(etl-test '( c1wl ) )");
        nusSendString("(etl-test '( c1pc ) )");


        // 18 to 21
        nusSendString("(etl-test '( c1op ) )");
        nusSendString("(etl-test '( c1of ) )");
        nusSendString("(etl-test '( c1tp ) )");
        //nusSendString("(etl-test '( c1si ) )");

        nusSendString("(etl-test '( c1re ) )");
        //nusSendString("(etl-test '( c1tv ) )");
        nusSendString("(etl-test '( c1in ) )"); // why does this respond withh (c1in 24)(nil 0)

        nusSendString("(etl-test '( c2mx ) )");
        nusSendString("(etl-test '( c2fi ) )");
        nusSendString("(etl-test '( c2fr ) )");

        /*  Values are established
            evidence (pprintall) excerpt is 
            (defvar c2fi '26)
            (defvar c2mx '25)
        */
        /*  11:38 but *something* is off etloutput somehow, and perhaps etlmock and etlcreate
            (c1re 21)(c1re 21)0=0
            >
            (c1in 24)(c1in 24)0=0
            >
            (c2mx 25)(nil 0)0=0
            >
            (c2fi 26)(nil 0)0=0
            >

            Fixed it
            11:57
            (c2mx 25)(c2mx 25)0=0
            >
            (c2fi 26)(c2fi 26)0=0
>
         */
    }
}
            //"(set-val 'c1fn 4) " +
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

function decc1wlPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1wl -1000)\n");
    }
}

function incc1wlPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'c1wl 1000)\n");
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
        nusSendString("(fndelta 'devthr -100)\n");
        nusSendString("(etloutput devthr 0) ");
    }
}

function incdevthrPressed() {
    defineFndelta();
    if (connected) {
        nusSendString("(fndelta 'devthr 100)\n");
        nusSendString("(etloutput devthr 0) ");
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
            "(set-val 'c1hb 1) " +
            "(set-val 'c1re 1) " +
            "(set-val 'c1fr 10) " +
            "(set-val 'c1wl 10000) " +
            "(set-val 'c1of 0) " +
            "(set-val 'c1tv 1600) " +
            "(set-val 'c1pu 500) "
        );
    } 
}
function relaxPressed() {

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
            "(set-val 'c1re 0) " +
            "(set-val 'c1fn 0)"
        );
    }

    revealButtons("adjustment-panel", ['Inc c1mx', 'Dec c1mx', 'Inc xc1mx', 'Dec xc1mx',
                                       'Inc c1fi', 'Dec c1fi', 'Inc xc1fi', 'Dec xc1fi'    ]);
    
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
function allPressed() {
    revealButtons("adjustment-panel", ['Inc c1mx', 'Dec c1mx', 'Inc xc1mx', 'Dec xc1mx',
        'Inc c1pu', 'Dec c1pu', 'Inc c1re', 'Dec c1re', 'Inc c1tv', 'Dec c1tv',
        'Inc c1fr', 'Dec c1fr', 'Inc c1wl', 'Dec c1wl', 'Inc c1pc', 'Dec c1pc',
        'Set c1hb=1', 'Set c1hb=2', 'IMU On', 'IMU Off',
        'Inc c1of', 'Dec c1of', 'Inc xc1of', 'Dec xc1of',
        'Inc c1fi', 'Dec c1fi', 'Inc xc1fi', 'Dec xc1fi', 'Set opt0', 'Set opt1',
        'c1oftest'    ]);
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
    if (connected) {

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

function gaitTAPressed() {

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
            "(set-val3  0.00 c1fi 4) " + // 0 
            "(set-val3  0.05 c1fi 3) " +
            "(set-val3  0.10 c1fi 7) " +
            "(set-val3  0.15 c1fi 75) " +
            "(set-val3  0.20 c1fi 112) "
        );

        nusSendString(
            "(set-val3  0.25 c1fi 98) " +
            "(set-val3  0.30 c1fi 75) " +
            "(set-val3  0.35 c1fi 45) " +
            "(set-val3  0.40 c1fi 32) " +
            "(set-val3  0.45 c1fi 40) "
        );

        nusSendString(
            "(set-val3  0.50 c1fi 71) " +
            "(set-val3  0.55 c1fi 142) " +
            "(set-val3  0.60 c1fi 245) " +
            "(set-val3  0.65 c1fi 255) " +
            "(set-val3  0.70 c1fi 134) "
        );

        nusSendString(
            "(set-val3  0.75 c1fi 45) " +
            "(set-val3  0.80 c1fi 3) " +
            "(set-val3  0.85 c1fi 3) " +
            "(set-val3  0.90 c1fi 5) " +
            "(set-val3  0.95 c1fi 5) " 
        );

        // setup waveform 5
        nusSendString(
            "(set-val 'c1of 0) " +
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
            "(set-val 'devthr 16330) " +
            "(set-val 'c1pc 1) " +
            "(set-val 'c1of 0) " +
            "(set-val 'c1fn 4) " +
            "(set-val 'c1wl 120) " +
            "(cpp 1 3 1) "
        );
        // +"(cpp 1 3 1) "
        // Hypothesis: c1re 0 has to be after c1fr change for 500x1 to be loaded and effective.
        nusSendString(
            "(set-val 'c1mx 127) " +
            "(set-val 'c1fi 255) " +
            "(set-val 'c1hb 1) " +
            "(set-val 'c1fr 10) " +
            "(set-val 'c1wl 320000) " +
            "(set-val 'c1of 0) " +
            "(set-val 'c1tv 1600) " +
            "(set-val 'c1pu 500) " +
            "(set-val 'c1re 7) " +
            "(set-val 'c1fn 4)"
        );

        
    }

    revealButtons("adjustment-panel", ['Inc c1mx', 'Dec c1mx', 'Inc xc1mx', 'Dec xc1mx',
        'Inc c1of', 'Dec c1of', 'Inc xc1of', 'Dec xc1of',]);

}

// use: revealButtons("adjustment-panel", ['Inc c1mx', 'Dec c1mx']);
function revealButtons(divName, buttonsToReveal) {
    var connectionGroup = document.getElementById(divName);
    $(connectionGroup).find('button').each(function () {

        var buttonText = $(this).text();

        if (buttonsToReveal.indexOf(buttonText) !== -1) {
            console.log(buttonText + ' in'); $(this).show();
        } else {
            console.log(buttonText + ' out'); $(this).hide();
        }
    });

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
            "(set-val 'c1wl 320000) " +
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
            "(set-val 'c1wl 320000) " +
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
            "(set-val 'c1wl 320000) " +
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
            "(set-val3  0.00 c1re 7) " + // 0 
            "(set-val3 0.04 c1fi 160) " +
            "(set-val3  0.08 c1fi 235) " +
            "(set-val3  0.17 c1fi 250) " +
            "(set-val3  0.25 c1fi 255) " +
            "(set-val3  0.33 c1fi 250) " +
            "(set-val3  0.42 c1fi 235) " +
            "(set-val3  0.50 c1fi 160) "
        );

        nusSendString(
            "(set-val3 0.50 c1re 8) " +
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
            "(set-val 'c1wl 2666) " +
            "(set-val 'c1of 0) " +
            "(set-val 'c1fn 4) "  // this starts the op, of, tp, in cascade going


        );

        revealButtons("adjustment-panel", ['Inc c1mx', 'Dec c1mx', 'Inc xc1mx', 'Dec xc1mx',
            'Inc c1wl', 'Dec c1wl', 'Inc c1re', 'Dec c1re', 'Inc c1wl', 'Dec c1wl', 'Inc c1pc', 'Dec c1pc',
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
                'Initialise',
                'All Params']
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
    location.reload();
}

// handleInbound text from limbstim
function handleNotifications(event) {
    console.log('notification');
    let value = event.target.value;
    // Convert raw data bytes to character values and use these to 
    // construct a string.
    let str = "";
    for (let i = 0; i < value.byteLength; i++) {
        
        if (value.getUint8(i) == 10) {
            window.term_.io.println(str);
            console.log(str);

            const regex = /\((\w+)\s(\d+)\)/;
            const match = regex.exec(str);

            if (match) {
                const variableOne = match[1]; // "c1mx"
                const variableTwo = parseInt(match[2]); // 127
                console.log(variableOne, variableTwo);

                // get the button__value element by its class name
                const buttonValueElement = document.querySelector('#c1mx .button__value');

                // update the text content of the element
                buttonValueElement.textContent = variableTwo;


                // get an array of all the button elements in the button-group container
                //const buttonElements = document.querySelectorAll('#presentationPanel .button-group button');
                //console.log(buttonElements);
                // loop through each button element and update its button__value text content
                //buttonElements.forEach(buttonElement => {
                 //   if (buttonElement.id === 'c1mx') {
                 //       buttonElement.querySelector('.button__value').textContent = variableTwo;
                 //   } 
                //});
            } else {
                console.log("No match found.");
            }
            //window.term_.io.println(' ');
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