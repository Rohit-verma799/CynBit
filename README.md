# Cynbit Technologies website (MERN)

React + Vite serves the public site, Express provides the API, and MongoDB stores contact inquiries and chat history. The assistant uses NVIDIA's OpenAI-compatible API. The NVIDIA key stays in the server-only root `.env` file and is never sent to the client.

## Run locally

1. Install dependencies: `npm install`
2. Configure `.env` with `MONGODB_URI`, `NVIDIA_API_KEY`, and `NVIDIA_MODEL` (copy `.env.example` as a starting point). Keep `.env` private.
3. Start MongoDB locally or provide a MongoDB connection string.
4. Start the React and Express development servers: `npm run dev`
5. Open `http://localhost:5173`. The API is at `http://localhost:4000/api/health`.

For production, run `npm run build`, set `NODE_ENV=production`, then `npm start`. Express serves the built React client and API from the same origin.
