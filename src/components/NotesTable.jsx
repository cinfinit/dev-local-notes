import React, { useState } from "react";
import { useNotes } from "../hooks/useNotes";

const styles = {
  container: {
    border: "1px solid #2C3E50",
    marginTop: 20,
    backgroundColor: "#1B1F23",
    color: "#ECF0F1",
    fontFamily: "monospace",
    borderRadius: 6,
    overflow: "hidden",
  },
  header: {
    padding: "12px 16px",
    backgroundColor: "#1B1F23",
    borderBottom: "1px solid #2C3E50",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: 0.5,
    color: "#ECF0F1",
  },
  controls: {
    padding: "10px 16px",
    background: "#2C3E50",
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
  input: {
    padding: "6px 10px",
    borderRadius: 4,
    border: "1px solid #34495E",
    backgroundColor: "#1B1F23",
    color: "#ECF0F1",
    fontFamily: "monospace",
    fontSize: 14,
    flex: 1,
  },
  button: {
    padding: "6px 12px",
    border: "none",
    borderRadius: 4,
    backgroundColor: "#ECF0F1",
    color: "#2C3E50",
    cursor: "pointer",
    fontWeight: "bold",
  },
  layout: {
    display: "flex",
    height: 300,
  },
  timeline: {
    width: "40%",
    backgroundColor: "#1B1F23",
    borderRight: "1px solid #2C3E50",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  filterInput: {
    padding: "8px 10px",
    margin: "8px",
    borderRadius: 4,
    backgroundColor: "#2C3E50",
    color: "#ECF0F1",
    border: "1px solid #34495E",
    fontFamily: "monospace",
    fontSize: 13,
  },
  timelineItem: (selected) => ({
    padding: "10px 14px",
    background: selected ? "#2C3E50" : "transparent",
    color: selected ? "#ECF0F1" : "#9AAAB8",
    cursor: "pointer",
    borderBottom: "1px solid #2C3E50",
    fontSize: 14,
  }),
  detailPanel: {
    width: "60%",
    padding: 16,
    overflowY: "auto",
    backgroundColor: "#1B1F23",
  },
  pre: {
    backgroundColor: "#2C3E50",
    color: "#ECF0F1",
    padding: 10,
    borderRadius: 4,
    fontSize: 13,
    overflowX: "auto",
    whiteSpace: "pre-wrap",
  },
};

export default function NotesTable() {
  const { notes, loading, addNote, deleteNote, updateNote } = useNotes();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("");

  const [editingTitle, setEditingTitle] = useState(null);
  const [editingContent, setEditingContent] = useState(null);

  const handleAdd = () => {
    if (!title.trim()) return;
    addNote({ title, content });
    setTitle("");
    setContent("");
  };

  const filteredNotes = notes.filter((note) =>
    `${note.title} ${note.content}`.toLowerCase().includes(filter.toLowerCase())
  );

  const selectedNote = notes.find((n) => n.id === selectedId);

  const cancelOrSaveTitle = () => {
    if (!editingTitle?.value.trim()) {
      setEditingTitle(null); // cancel
      return;
    }
    if (editingTitle.value !== selectedNote.title) {
      updateNote(editingTitle.id, { title: editingTitle.value });
    }
    setEditingTitle(null);
  };

  const cancelOrSaveContent = () => {
    if (!editingContent?.value.trim()) {
      setEditingContent(null); // cancel
      return;
    }
    if (editingContent.value !== selectedNote.content) {
      updateNote(editingContent.id, { content: editingContent.value });
    }
    setEditingContent(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.heading}>📒 Dev Local Notes</h3>
        <span style={{ fontSize: 12, fontStyle: "italic", color: "#9AAAB8" }}>
          @cinfinit
        </span>
      </div>

      <div style={styles.controls}>
        <input
          style={styles.input}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button style={styles.button} onClick={handleAdd}>
          ➕ Add
        </button>
      </div>

      <div style={styles.layout}>
        <div style={styles.timeline}>
          <input
            style={styles.filterInput}
            placeholder="🔍"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          {loading ? (
            <p style={{ padding: 16 }}>Loading notes...</p>
          ) : filteredNotes.length === 0 ? (
            <p style={{ padding: 16, color: "#9AAAB8" }}>No matching notes</p>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedId(note.id)}
                style={styles.timelineItem(note.id === selectedId)}
              >
                <div style={{ fontSize: 13 }}>{note.title}</div>
              </div>
            ))
          )}
        </div>

        <div style={styles.detailPanel}>
          {selectedNote ? (
            <>
              {editingTitle?.id === selectedNote.id ? (
                <input
                  autoFocus
                  style={{ ...styles.input, marginBottom: 10 }}
                  value={editingTitle.value}
                  onChange={(e) =>
                    setEditingTitle({
                      ...editingTitle,
                      value: e.target.value,
                    })
                  }
                  onBlur={cancelOrSaveTitle}
                  onKeyDown={(e) => e.key === "Enter" && cancelOrSaveTitle()}
                />
              ) : (
                <h4
                  style={styles.heading}
                  onDoubleClick={() =>
                    setEditingTitle({
                      id: selectedNote.id,
                      value: selectedNote.title,
                    })
                  }
                >
                  {selectedNote.title}
                </h4>
              )}

              {editingContent?.id === selectedNote.id ? (
                <textarea
                  autoFocus
                  style={{
                    ...styles.pre,
                    ...styles.input,
                    width: "95%",
                    fontFamily: "monospace",
                    resize: "vertical",
                  }}
                  value={editingContent.value}
                  onChange={(e) =>
                    setEditingContent({
                      ...editingContent,
                      value: e.target.value,
                    })
                  }
                  onBlur={cancelOrSaveContent}
                  onKeyDown={(e) =>
                    e.key === "Enter" && e.shiftKey && cancelOrSaveContent()
                  }
                />
              ) : (
                <pre
                  style={styles.pre}
                  onDoubleClick={() =>
                    setEditingContent({
                      id: selectedNote.id,
                      value: selectedNote.content,
                    })
                  }
                >
                  {selectedNote.content}
                </pre>
              )}

              <button
                style={{ ...styles.button, marginTop: 10 }}
                onClick={() => {
                  deleteNote(selectedNote.id);
                  setSelectedId(null);
                }}
              >
                🗑 Delete
              </button>
            </>
          ) : (
            <p style={{ color: "#9AAAB8" }}>Select a note to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}
