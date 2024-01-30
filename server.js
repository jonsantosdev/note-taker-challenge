const express = require('express');
const path = require('path');
const fs = require('fs');
const { readFromFile, readAndAppend, writeToFile } = require('./helpers/fsUtils');
const uuid = require('./helpers/uuid');


const app = express();
const PORT = process.env.PORT || 3001;

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

// GET: note selected on left and populated data on the right side
app.get('/:tip_id', (req, res) => {
    const noteId = req.params.note_id;
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        const result = json.filter((note) => note.note_id === noteId);
        return result.length > 0
          ? res.json(result)
          : res.json('No tip with that ID');
      });
  });

app.post('/api/notes', (req, res) => {
    
    const { title, text} = req.body;
    // console.log({ title, text});
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
app.delete('/api/notes/:note_id', (req, res) => {
    const noteId = req.params.note_id;
    console.log(noteId);
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        // Make a new array of all notes except the one with the ID provided in the URL
        const result = json.filter((note) => note.note_id !== noteId);
  
        // Save that array to the filesystem
        writeToFile('./db/db.json', result);
  
        // Respond to the DELETE request
        res.json(`Item ${noteId} has been deleted 🗑️`);
      });
  });




app.listen(PORT, () =>
    console.log('App listening at http://localhost:3001 🚀`')
);