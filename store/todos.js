import firebase from '~/plugins/firebase.js'
import { firestoreAction } from 'vuexfire'

const db = firebase.firestore()
const todoRef = db.collection('todos')

export const state = () => ({
    todos:[]
})

export const actions = {
    init: firestoreAction(({ bindFirestoreRef }) => {
        bindFirestoreRef('todos', todoRef)
    }),
    addTodo: firestoreAction((context, newTodo) => {
        todoRef.add(newTodo);
    }),
    toggle: firestoreAction((context, todo) => {
        todoRef.doc(todo.id).update({
            done: !todo.done
        })
        console.log('toggle!!', todo.id)
    })
}

export const getters  = {
    todos: state => state.todos
}
