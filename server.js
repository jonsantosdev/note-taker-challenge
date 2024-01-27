const express = require('express');
const path = require('path');
const { readFromFile, readAndAppend } = require('../06-express-sql/day-03/00-Stu_Mini-Project/Main/helpers/fsUtils');
const uuid = require('../06-express-sql/day-02/03-Ins_POST-Fetch/helpers/uuid');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

// GET note selected and show on app

app.post('/api/notes', (req, res) => {
    
    const { title, text} = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            note_id: uuid(),
        };

        readAndAppend(newNote, './db/db.json');
        res.json('Note added succcessfully');
    }
    else {
        res.error('Error in adding note')
    }
});

// Delete a particular note
// app.delete('/api/notes', (req, res) => {


// });

app.listen(PORT, () =>
    console.log('App listening at http://localhost:3001 🚀`')
);