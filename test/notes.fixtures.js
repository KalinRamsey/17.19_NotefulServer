function makeNotesArray() {
  return [
    {
      id: 1,
      title: 'First Note',
      content: 'First note content',
      folder_id: 1,
      date_published: '2100-05-22T16:28:32.615Z'
    },
    {
      id: 2,
      title: 'Second Note',
      content: 'Second note content',
      folder_id: 1,
      date_published: '2100-05-22T16:28:32.615Z'
    },
    {
      id: 3,
      title: 'Third Note',
      content: 'Third note content',
      folder_id: 2,
      date_published: '2100-05-22T16:28:32.615Z'
    },
    {
      id: 4,
      title: 'Fourth Note',
      content: 'Fourth note content',
      folder_id: 1,
      date_published: '1919-12-22T16:28:32.615Z'
    },
    {
      id: 5,
      title: 'Fifth Note',
      content: 'Fifth note content',
      folder_id: 2,
      date_published: '1919-12-22T16:28:32.615Z'
    },
  ]
}

function makeMaliciousNote() {
  const maliciousNote = {
    id: 911,
    title: 'Evil note <script>alert("xss");</script>',
    content: 'Evil note content <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">',
    folder_id: 1,
    date_published: new Date().toISOString()
  }
  const expectedNote = {
    ...maliciousNote,
    title: 'Evil note &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: 'Evil note content <img src="https://url.to.file.which/does-not.exist">'
  }

  return {
    maliciousNote,
    expectedNote
  }
}

module.exports = {
  makeNotesArray,
  makeMaliciousNote
}