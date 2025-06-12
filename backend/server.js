#!/usr/bin/env node
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 1347;

// ES module path fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NOTES_FILE = path.join(__dirname, "notes.json");

app.use(cors());
app.use(express.json());

const readNotes = async () => {
  const data = await fs.readFile(NOTES_FILE, "utf8");
  return JSON.parse(data);
};

const writeNotes = async (notes) => {
  await fs.writeFile(NOTES_FILE, JSON.stringify(notes, null, 2));
};

app.get("/notes", async (req, res) => {
  const notes = await readNotes();
  res.json(notes);
});

app.post("/notes", async (req, res) => {
  const notes = await readNotes();
  const newNote = { id: Date.now(), ...req.body };
  notes.push(newNote);
  await writeNotes(notes);
  res.status(201).json(newNote);
});

app.put("/notes/:id", async (req, res) => {
  const notes = await readNotes();
  const id = parseInt(req.params.id);
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) return res.status(404).send("Note not found");

  notes[index] = { ...notes[index], ...req.body };
  await writeNotes(notes);
  res.json(notes[index]);
});

app.delete("/notes/:id", async (req, res) => {
  let notes = await readNotes();
  const id = parseInt(req.params.id);
  notes = notes.filter((note) => note.id !== id);
  await writeNotes(notes);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`🗒️  Notes backend running on http://localhost:${PORT}`);
});
