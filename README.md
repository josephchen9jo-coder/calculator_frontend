# Calculator Frontend

This is the front-end page for the front-end and back-end separated calculator. It handles user interaction and information display.

## Overview

- Provides calculator buttons and expression input.
- Calls the back end through HTTP/JSON APIs to perform calculations.
- Displays calculation results and error messages returned by the back end.
- Displays calculation history read from the back-end database and supports deleting records.

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript (Fetch API)

## Runtime Environment

Any modern browser (Chrome, Edge, etc.).

## Installation

No installation required; the front end is pure static files.

## Running

1. Make sure the back end is running first (see the back-end README).
2. Open `index.html` in a browser, or serve this directory with any static server.

## Configuration

- The back-end address is configured in the `API_BASE` constant at the top of `app.js`.
- Update `API_BASE` to the deployed back-end URL after deployment.

## Front-end/Back-end Connection

The front end calls the back-end HTTP APIs through `fetch`:

- Calculate: `POST /api/calculate`
- Query history: `GET /api/history`
- Delete history: `DELETE /api/history/{id}`
- Clear history: `DELETE /api/history`