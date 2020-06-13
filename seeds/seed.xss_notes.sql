INSERT INTO noteful_notes (id, title, content, folder_id, date_published)
VALUES
  (
    911,
    'Injection post!',
    'This text contains an intentionally broken image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie); alert(''you just got pretend hacked! oh noes!'');">. The image will try to load, when it fails, <strong>it executes malicious JavaScript</strong>',
    2,
    '2029-01-22T16:28:32.615Z'
  )