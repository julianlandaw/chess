# Quiet Knight testing

Serve this directory over HTTP, then open `tests.html` in a browser. The suite checks puzzle IDs, FEN validity, legal starting states, every complete solution line, checkmate objectives, core move validation, FEN round-tripping, and required UI controls.

For a headless smoke test, open `index.html?selftest=1` and assert that the rendered `<body>` has `data-selftest="passed"`.
