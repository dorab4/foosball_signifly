<template>
    <div class="create-player-div">
        <el-dialog title="Create a new player" :visible="showCreateNewPlayerDialog" >
            <el-form :model="user">
                <el-form-item label="Name">
                    <el-input required v-model="user.name"></el-input>
                </el-form-item>
                <el-form-item label="Email">
                    <el-input required v-model="user.email"></el-input>
                </el-form-item> 
            </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showCreateNewPlayerDialog=false">Cancel</el-button>
            <el-button @click="addNewPlayer" type="primary" >Add player</el-button>
        </span>
  </el-dialog>
</div>
   
</template>

<script>
import db from './firebaseInit'
import EventBus from '../event-bus';

export default {
    data() {
      return {
        showCreateNewPlayerDialog: false,
        user: {
          name: '',
          email: '',
        },
      }
    },

    props: {
        users:Array
    },

    mounted() {
        EventBus.$on('openAddNewPlayerDialog', () => {
            this.showCreateNewPlayerDialog = true;
        })
    },

    methods: {

        addNewPlayer() {
            const user = {
                name: this.user.name,
                email: this.user.email,
            }
            db.collection("users").add(user);
            this.showCreateNewPlayerDialog = false
            this.user = {name:'', email: ''}
            EventBus.$emit('newPlayerAdded', user)
        },
    }
}
           
</script>

<style scoped>

</style>