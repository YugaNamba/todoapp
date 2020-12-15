<template>
  <v-container>
    <v-row>
      <h1>TodoList</h1>
    </v-row>
    <v-row>
      <v-form v-model="valid">
        <v-col cols="4" md="4">
          <v-text-field
            v-model="newTodo.name"
            :rules="nameRules"
            :counter="10"
            label="todoname"
            required
          ></v-text-field>
        </v-col>
            <!-- <v-col cols="12" md="4">
              <v-text-field
                v-model="newTodo.limit"
                :rules="nameRules"
                :counter="10"
                label="limit"
                required
              ></v-text-field>
            </v-col> -->
        <v-col cols="2" md="8">
            <v-time-picker
            v-model="newTodo.time"
            :allowed-minutes="allowedStep"
            class="mt-4"
            format="24hr"
          ></v-time-picker>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="newTodo.limit" single-line>
            <template v-slot:append-outer>
              <calender v-model="value"/>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-btn
            color="warning"
            @click="addTodo()"
          >
            add
          </v-btn>
        </v-col>
      </v-form>

      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>done</th>
              <th class="text-left">
                todo
              </th>
              <th class="text-left">
                limit
              </th>
              <th class="text-left">
                limittime
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="todo in todos"
              :key="todo.name"
            >
              <v-checkbox :checked="todo.done" @change ="toggle(todo)"></v-checkbox>
              <!-- <input
                type="checkbox"
                :checked = "todo.done"
                @change ="toggle(todo)"> -->
              <td>{{ todo.name }}</td>
              <td>{{ todo.limit }}</td>
              <td>{{ todo.time }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-row>
  </v-container>
</template>

<script>
import calender from "@/components/calender"
import { mapGetters } from 'vuex'

export default {
  data(){
    return{
      newTodo: {
        name:null,
        limit:null,
        time:null,
        done:false
      },
      valid: false,
      nameRules: [
        v => !!v || '入力してください',
      ],
      value:null
    }
  },
  computed:{
        ...mapGetters({
      todos: 'todos/todos'
    })
  },
  components: {
    calender
  },
  methods:{
    addTodo(){
      this.$store.dispatch('todos/addTodo', this.newTodo)
      console.log('addTodo', this.newTodo)
      this.newTodo = {
        name:null,
        limit:null,
        time:null,
      }
    },
      toggle(todo){
      this.$store.dispatch('todos/toggle', todo)
      },
      allowedHours: v => v % 2,
      allowedMinutes: v => v >= 10 && v <= 50,
      allowedStep: m => m % 10 === 0,
  },
  created(){
      this.$store.dispatch('todos/init')
  }
}
</script>