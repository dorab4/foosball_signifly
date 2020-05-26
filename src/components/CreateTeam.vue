<template>
    <div class="create-team-div">
        <p>Add a new team to the tournament</p>
        <el-button type="primary" @click='showCreateNewTeamDialog=true' >Create a new team</el-button>
        <el-dialog title="Create a new team" :visible="showCreateNewTeamDialog" >
            <el-form :model="group">
                <el-form-item label="Group name">
                    <el-input required v-model="group.name"></el-input>
                </el-form-item>
                <el-form-item label="Group members">
                    <el-tag
                        :key="tag"
                        v-for="tag in group.members"
                        closable
                        effect='dark'
                        size='medium'
                        type='success'
                        :disable-transitions="false"
                        @close="removeMember(tag)">
                        {{tag}}
                    </el-tag>
                    <el-table
                        stripe
                        height="250"
                        :data="users.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
                        style="width: 100%">
                        <el-table-column
                        label="Name"
                        prop="name">
                        </el-table-column>
                        <el-table-column
                        align="right">
                        <template slot="header" >
                            <el-input
                            v-model="search"
                            size="mini"
                            placeholder="Type to search"/>
                        </template>
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            @click="addMember(scope)">Add</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                    <el-alert v-if="showAlert"
                        title="You have to select at least one member"
                        type="warning">
                    </el-alert>
                </el-form-item>
            </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showCreateNewTeamDialog=false">Cancel</el-button>
            <el-button type="primary" @click="createTeam">Create team</el-button>
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
        search:'',
        showCreateNewTeamDialog: false,
        group: {
          name: '',
          members: [],
        },
        showAlert:false
      }
    },

    props: {
        users:Array
    },

    methods: {

        addMember(scope) {
            this.group.members.push(scope.row.name);
        },

        removeMember(member) {
            this.group.members.splice(this.group.members.indexOf(member), 1);
        },

        createTeam() {
            if(this.group.members.length != 0){
                const team = {
                    name: this.group.name,
                    members: this.group.members,
                    points: 0,
                    matches_lost: 0,
                    matches_won: 0
                }
                db.collection("teams").add(team);
                this.showCreateNewTeamDialog = false
                this.group = {name:'', members: []}
                EventBus.$emit('newTeamCreated', team)
            }
            else {
                this.showAlert = true;
            }
        },
    }
}
           
</script>

<style scoped>

.el-tag + .el-tag {
    margin-left: 10px;
}

.create-team-div {
    margin-top: 50px;
    text-align: center;
}

</style>