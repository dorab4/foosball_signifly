<template>
    <div>
        <h2>CREATE TOURNAMENT</h2>
        <el-row :gutter="40">
            <PlayersBoard :users='users'/>
            <AddNewPlayer :users='users'/>
            <TeamsBoard  :teams='teams' />
            <CreateTeam :users='users'/>
            <router-link @click.native="startTournament" class='el-button el-button--success' to="/track-tournament">Start tournament <i class="el-icon-right"></i></router-link>
        </el-row>
    </div>    
</template>

<script>
import CreateTeam from '../components/CreateTeam'
import TeamsBoard from '../components/TeamsBoard'
import PlayersBoard from '../components/PlayersBoard'
import AddNewPlayer from '../components/AddNewPlayer'
import EventBus from '../event-bus';
import db from '../components/firebaseInit'

export default {
  components: {
    CreateTeam,
    PlayersBoard,
    TeamsBoard,
    AddNewPlayer,
  },

  data() {
    return{
      teams: [],
      users: [],
    }
  },

  created() {

    this.getData()
    
    EventBus.$on('newTeamCreated', (team) => {
      this.teams.push(team)
      team.members.forEach((member)=>{
      this.users = this.users.filter((user)=>user.name!=member)
      })
    })

    EventBus.$on('newPlayerAdded', (user) => {
      this.users.push(user)
    })

  },

  methods: {

    startTournament(){
      const upcomingMatches = []
      for(var i = 0; i<this.teams.length; i++){
        for(var j = i + 1; j<this.teams.length; j++){
          const match = {
            completed: false,
            team1: {
              id: this.teams[i].id,
              name: this.teams[i].name,
              score: 0
            },
            team2: {
              id: this.teams[j].id,
              name: this.teams[j].name,
              score: 0
            },
          }
          db.collection("matches").add(match).then(function(docRef){
              match.id = docRef.id
          });
          upcomingMatches.push(match)
        }
      }
      EventBus.$emit('matchesCreated', upcomingMatches)
    },


    getData(){
      // TEAMS FOR SCOREBOARD
      db.collection('teams').orderBy('points', 'desc').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const team = {
            'id': doc.id,
            'name': doc.data().name,
            'members': doc.data().members,
            'points': doc.data().points,
            'matches_won': doc.data().matches_won,
            'matches_lost': doc.data().matches_lost
          }
        this.teams.push(team)
      })
    })

      // USERS
      db.collection('users').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const user = {
            'name': doc.data().name,
            'email':doc.data().email
          }
          const members = []
          this.teams.forEach((team)=>{
            team.members.forEach((member)=>{
              members.push(member)
            })
          })
          if(!members.includes(user.name)){
            this.users.push(user)
          }
        })
      })
    }
  }
}
</script>

<style  scoped>
.el-button{
    font-size: 20px;
    margin-top: 40px;
    text-decoration: none;
    float: right;
}
.el-row{
    margin-top: 40px;
}
</style>