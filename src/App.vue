<template>
  <div id="app">
    <TheHeader />
    <el-row :gutter="40">
      <el-col :sm="12">
      <ScoreBoard :teams='teams' />
      <CreateTeam :users='users'/>
      </el-col>
      <MatchesBoard :matches='upcomingMatches' :completed='false'/>
      <MatchesBoard :matches='recentMatches' :completed='true'/>
      <SubmitResult :teams='teams' />
    </el-row>
  </div>
</template>
<script>

import TheHeader from './components/layout/TheHeader'
import ScoreBoard from './components/ScoreBoard'
import MatchesBoard from './components/MatchesBoard'
import CreateTeam from './components/CreateTeam'
import SubmitResult from './components/SubmitResult'
import EventBus from './event-bus';
import db from './components/firebaseInit'

export default {
  name: 'app',
  components: {
    TheHeader,
    ScoreBoard,
    MatchesBoard,
    CreateTeam,
    SubmitResult
  },

  data() {
    return{
      teams: [],
      users: [],
      upcomingMatches: [],
      recentMatches: [],
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

    EventBus.$on('newResultSubmitted', (updated_match, edit) => {
      if(!edit) {
      this.recentMatches.push(updated_match)
      this.upcomingMatches = this.upcomingMatches.filter((upcoming_match)=>upcoming_match.id!=updated_match.id)
      }
      this.teams.sort((a, b) => (a.points < b.points) ? 1 : -1)
    })
  },

  methods: {

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

    // MATCHES
    db.collection('matches').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const match = {
            'id': doc.id,
            'team1': doc.data().team1,
            'team2': doc.data().team2,
            'completed': doc.data().completed
          }
          match.completed ? this.recentMatches.push(match) : this.upcomingMatches.push(match) 
        })
      })

      // USERS
      db.collection('users').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const user = {
            'name': doc.data().name,
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

<style>
@import url('https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,400;0,700;1,400;1,700&display=swap');

#app {
  font-family: 'Karla', 'Helvetica', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 20px 10%;
}

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app > .el-row .el-col{
  margin-top:15px;
  margin-bottom: 5px;
}

.el-col {
    border-radius: 4px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
