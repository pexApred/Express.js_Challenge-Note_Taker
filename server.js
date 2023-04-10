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
app.get('/api/notes', (req, res) => 
    res.json(db)
);

// GET a single note
app.get('/api/notes/:title', (req, res) => {
    if (req.params.title) {
      const noteTitle = req.params.title;
      for (let i = 0; i < notes.length; i++) {
        const currentNote = notes[i];
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

// Wildcard route to direct users to a home page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);