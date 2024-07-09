import React, { useState } from 'react';


const NoteState = (props) => {
    const [notes, setNotes] = useState([]);

    // Function to add a new note
    const addNote = (title, description, tag) => {
        const newNote = { title, description, tag, id: notes.length + 1 };
        setNotes([...notes, newNote]);
    };

    return (
        <noteContext.Provider value={{ notes, addNote }}>
            {props.children}
        </noteContext.Provider>
    );
};

export default NoteState;
