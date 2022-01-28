import { useState, useEffect } from 'react'
import note_services from '../services/note'

const Note = (props) => {
    if (props.available) {
        return (
            <div>
                <p className='availableNote'>{props.name}</p>
                <button onClick={props.onClick}>{props.mrp}</button>
            </div>
        )
    }
    return (
        <div>
            <p className='unavailableNote'>{props.name}</p>
            <button onClick={props.onClick}>{props.mrp}</button>
        </div>
    )
}

const Notification = (props) => {
    if (props.message === null) {
        return null
    }
    return (
        <div>
            {props.message}
        </div>
    )
}

const Notes = () => {

    useEffect(() => {
        note_services.getAllNotes()
            .then(fetchedNotes => setAllNotes(fetchedNotes))
            .catch(err => console.log(err))
    }, [])

    const [newNote, setNewNote] = useState({ name: 'enter name here...', mrp: 'enter mrp here...' })
    const [allNotes, setAllNotes] = useState([])
    const [notification, setNotification] = useState({ message: null, type: null })
    const [notificationNumber, setNotificationNumber] = useState(0)

    const handleNameInput = (event) => {
        console.log(event.target.value)
        setNewNote({ ...newNote, name: event.target.value })
    }

    const handleMRPInput = (event) => {
        console.log(event.target.value)
        setNewNote({ ...newNote, mrp: event.target.value })
    }

    const handleFormSubmit = (event) => {
        event.preventDefault()
        console.log('handling form submission')
        const createdNote = { ...newNote, id: Math.random(), available: Math.random() < 0.5 }
        note_services.postNote(createdNote)
            .then(postedNote => {
                setNotification({ message: `new ${createdNote.name} added`, type: 'success' })
                clearTimeout(notificationNumber)
                const newTimeout = setTimeout(() => {
                    setNotification({ message: null, type: null })
                }, 5000)
                setNotificationNumber(newTimeout)
                setAllNotes(allNotes.concat(postedNote))
                setNewNote({ name: 'enter name here...', mrp: 'enter mrp here...' })
            })
    }

    const toggleAvailabilityOf = (id) => {
        const noteToUpdate = allNotes.find(note => note.id === id)
        const EditedNote = { ...noteToUpdate, available: !noteToUpdate.available }
        note_services.updateNoteAt(id, EditedNote)
            .then(updatedNote => {
                setNotification({ message: `updated ${updatedNote.name}`, type: 'success' })
                clearTimeout(notificationNumber)
                const newTimeout = setTimeout(() => {
                    setNotification({ message: null, type: null })
                }, 5000)
                setNotificationNumber(newTimeout)
                setAllNotes(allNotes.map(note => note.id === id ? updatedNote : note))
            })
    }

    return (
        <div>
            <form onSubmit={handleFormSubmit}>
                <input value={newNote.name} onChange={handleNameInput} />
                <input value={newNote.mrp} onChange={handleMRPInput} />
                <button type='submit'>Save</button>
            </form>
            <Notification message={notification.message} type={notification.type} />
            <ul>{allNotes.map(note =>
                <Note key={note.id} name={note.name} mrp={note.mrp} available={note.available} onClick={() => { toggleAvailabilityOf(note.id) }} />
            )}</ul>
        </div>
    )
}

export default Notes