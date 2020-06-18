const path = require('path');
const express = require('express');
const xss = require('xss');

const NotesService = require('./notes-service');
const notesRouter = express.Router();
const jsonParser = express.json();

const sanitizeNote = note =>({
  id: note.id,
  title: xss(note.title),
  content: xss(note.content),
  folder_id: note.folder_id,
  date_published: note.date_published
})

notesRouter
  .route('/api/notes')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    NotesService.getAllNotes(knexInstance)
      .then(notes => {
        res.json(notes.map(sanitizeNote))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { title, content, folder_id, date_published } = req.body
    const newNote = { title, content, folder_id, date_published}

    for (const [key,value] of Object.entries(newNote))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body`}
        })

    NotesService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(note => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.id}`))
          .json(sanitizeNote(note))
      })
      .catch(next)
  })

notesRouter
  .route('api/notes/:note_id')
  .all((req, res, next) => {
    NotesService.getById(
      req.app.get('db'),
      req.params.note_id
    )
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: `Note doesn't exist`}
          })
        }
        res.note = note
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(sanitizeNote(res.note))
  })
  .delete((req, res, next) => {
    NotesService.deleteNote(
      req.app.get('db'),
      req.params.note_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { title, content, folder_id, date_published } = req.body;
    const noteToUpdate = { title, content, folder_id, date_published }

    const numberOfValues = Object.values(noteToUpdate)
    if(numberOfValues === 0){
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'title', 'content', 'folder_id', or 'date_published'`
        }
      })
    }

    NotesService.updateNote(
      req.app.get('db'),
      req.params.note_id,
      noteToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

  module.exports = notesRouter