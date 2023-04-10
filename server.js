// const express = require('express');
const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

let db = require('./db/db.json');
const { v4:uuid } = require('uuid');
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET request for notes
app.get('/api/notes', (req, res) => {
    console.info(` Get /api/notes`);
    res.status(200).json(db)
});

// GET a single note
app.get('/api/notes/:title', (req, res) => {
    if (req.params.title) {
        console.info(`${req.method} request recieved to get a single note`);
        const noteTitle = req.params.title;
        for (let i = 0; i < db.length; i++) {
        const currentNote = db[i];
        if (currentNote.title === noteTitle) {
            res.json(currentNote);
            return;
        }
      }
      res.status(404).send('Note not found');
    } else {
        res.status(400).send('Title not provided'); 
    }
});

// POST request to add a Note
app.post(`/api/notes`, (req, res) => {
    // Log that a POST request was recieved
    console.info(`${req.method} request recieved to add a note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all required properties are present
    if (title && text) {
        const id = uuid();
        // Variable for the object we will save
        const newNote = {
            title,
            text,
            id,
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json('Error reading database');
                return;
            }
            const notes = JSON.parse(data);

            notes.push(newNote);
            db.push(newNote);

            fs.writeFile('./db/db.json', JSON.stringify(notes), 'utf8', err => {
                if (err) {
                    console.error(err);
                    res.status(500).json('Error writing to database');
                    return;
                }
            })
        
        const response = {
            status: 'success',
            body: newNote,
        };
        console.log(response);
        res.status(201).json(response);
        });
    } else {
        res.status(400).json('Title and text are required');
    }
});

// DELETE Request to remove a note
app.delete('/api/notes/:id', (req, res) => {
    console.info(`${req.method} request received to delete a note`);

    const notes = JSON.parse(fs.readFileSync('./db/db.json'));

    const updatedNotes = notes.filter(note => note.id != req.params.id);
    
    fs.writeFileSync('./db/db.json', JSON.stringify(updatedNotes));
    res.json(updatedNotes);
});

// Wildcard route to direct users to a home page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);