
/* version 1 
 * 
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

*/

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World 2!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// JavaScript source code
// Global variable to store the definitions
let definitions = [];

// Function to load definitions from def.json
function loadDefinitions() {
    fetch('def.json')
        .then(response => response.json())
        .then(data => {
            definitions = data;
            attachButtonClickHandlers();
        })
        .catch(error => console.error('Error loading definitions:', error));
}

// Function to attach click handlers to buttons
function attachButtonClickHandlers() {
    definitions.forEach(definition => {
        const button = document.getElementById(definition.id);

        button.addEventListener('click', () => {
            displayText(definition.text);
        });

        button.addEventListener('mousedown', () => {
            const timer = setTimeout(() => {
                editDefinition(definition);
            }, 1000); // Long press threshold (1 second)

            button.addEventListener('mouseup', () => {
                clearTimeout(timer);
            });
        });
    });
}

// Function to display the text in the displayText area
function displayText(text) {
    const display = document.getElementById('displayText');
    display.value = text;
}

// Function to edit a definition
function editDefinition(definition) {
    const newText = prompt('Enter new text:', definition.text);
    if (newText !== null) {
        definition.text = newText;
        saveDefinitions();
    }
}

// Function to save definitions back to def.json
function saveDefinitions() {
    const jsonData = JSON.stringify(definitions, null, 2);
    fetch('def.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
        .catch(error => console.error('Error saving definitions:', error));
}

// Load definitions when the page is loaded
window.addEventListener('load', loadDefinitions);
