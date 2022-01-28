import axios from "axios";

const baseURL = 'http://localhost:3001/notes'

const getAllNotes = () => {
    return axios.get(baseURL).then(res => res.data)
}

const postNote = (note) => {
    return axios.post(baseURL, note).then(res => res.data)
}

const getNoteAt = (id) => {
    return axios.get(`${baseURL}/${id}`).then(res => res.data)
}

const updateNoteAt = (id, note) => {
    return axios.patch(`${baseURL}/${id}`, note).then(res => res.data)
}

const note_services = { getAllNotes, postNote, getNoteAt, updateNoteAt }

export default note_services