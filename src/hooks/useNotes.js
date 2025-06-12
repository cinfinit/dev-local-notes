import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:1347/notes";

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const res = await axios.get(API);
    setNotes(res.data);
    setLoading(false);
  };

  const addNote = async (note) => {
    const res = await axios.post(API, note);
    setNotes((prev) => [...prev, res.data]);
  };

  const deleteNote = async (id) => {
    await axios.delete(`${API}/${id}`);
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const updateNote = async (id, updatedNote) => {
    const res = await axios.put(`${API}/${id}`, updatedNote);
    setNotes((prev) => prev.map((note) => (note.id === id ? res.data : note)));
  };

  return { notes, loading, addNote, deleteNote, updateNote };
}
