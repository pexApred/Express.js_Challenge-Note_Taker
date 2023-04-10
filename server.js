// const express = require('express');
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3001;

let db = require('./db/db.json');

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
        // Variable for the object we will save
        const newNote = {
            title,
            text,
            id: db.length + 1 
        };

        db.push(newNote);

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
        return;
    } else {
        res.status(500).json('Error in posting note');
    }
});

// DELETE Request to remove a note
app.delete('/api/notes/:id', (req, res) => {
    
})

// Wildcard route to direct users to a home page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);