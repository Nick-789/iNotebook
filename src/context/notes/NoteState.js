import { useState } from "react";
import noteContext from "./notecontext";
// require('dotenv').config({path:__dirname+'../../../.env'});

const NoteState = (props) => {
  
  const initialnotes = []
  const [notes, setNotes] = useState(initialnotes);
  // const LINK = process.env.REACT_APP_LINK;
  //Get all notes
  const getNotes = async () => {
    //To do api call
    try {
      // console.log("In fetchNotes");
      // console.log(process.env.REACT_APP_LINK);
      // console.log(localStorage.getItem('token'));
      const response = await fetch(`http://localhost:4000/api/notes/fetchallnotes`, {
        method: "GET",
         headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
  
        },
      });
      // console.log("After fetch notes")
      // eslint-disable-next-line
      // console.log(json);
      const json = await response.json();
      // console.log(json);
      setNotes(json);
  
    } catch (error) {
      // console.log("In fetchNotes error");
      console.log(error.message,"Hey In fetch");
    }
    
  }
 

  // Add a note
  const addNote = async (title, description, tag) => {
    //To do api call
    // eslint-disable-next-line 
    const response = await fetch(`http://localhost:4000/api/notes/addnote`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token'),
      },

      body: JSON.stringify({ title, description, tag }),
    }).then(function (response) {
      const note =  response.json();

    setNotes(notes.concat(note))
    })
    
    
  }


  // Delete a note
  const deleteNote = async (id) => {
    const response = await fetch(`http://localhost:4000/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')

      },
    });
    // eslint-disable-next-line
    const json = await response.json();
    console.log(json);
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes);
  }

  //Update a note

  const editNote = async (id, title, description, tag) => {
    // eslint-disable-next-line 
    const response = await fetch(`http://localhost:4000/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')

      },

      body: JSON.stringify({title, description, tag}),
    });
    // const json = await response.json();
    let newNotes = JSON.parse(JSON.stringify(notes))
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes.title = title;
        newNotes.description = description;
        newNotes.tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  }
  
  return (
    <noteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </noteContext.Provider>
  )
         
}  
export default NoteState; 