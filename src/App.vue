<template>
  <div id="app">
    <TheHeader />
    <transition name="fade">
      <el-row :gutter="40" v-if="showTournamentData">
        <PlayersBoard :users='users'/>
        <AddNewPlayer :users='users'/>
        <TeamsBoard  :teams='teams' />
        <CreateTeam :users='users'/>
      </el-row>
    </transition>
    <el-button @click="startTournament" v-if="showTournamentData" class="start-tournament" type='success'>Start Tournament</el-button>
      <el-row :gutter="40"  v-if="!showTournamentData" >
        <el-col :md="12">
        <ScoreBoard :teams='teams' />
        </el-col>
         <el-col :md="12">
        <MatchesBoard :matches='upcomingMatches' :completed='false'/>
        <MatchesBoard :matches='recentMatches' :completed='true'/>
         </el-col>
        <SubmitResult :teams='teams' />
      </el-row>
      <el-button @click="endTournament" v-if='!showTournamentData'>End Tournament</el-button>
      <DisplayWinner :teams='teams'/>
</div>
</template>
<script>

import TheHeader from './components/layout/TheHeader'
import ScoreBoard from './components/ScoreBoard'
import MatchesBoard from './components/MatchesBoard'
import CreateTeam from './components/CreateTeam'
import SubmitResult from './components/SubmitResult'
import TeamsBoard from './components/TeamsBoard'
import PlayersBoard from './components/PlayersBoard'
import AddNewPlayer from './components/AddNewPlayer'
import DisplayWinner from './components/DisplayWinner'
import EventBus from './event-bus';
import db from './components/firebaseInit'

export default {
  name: 'app',
  components: {
    TheHeader,
    ScoreBoard,
    MatchesBoard,
    CreateTeam,
    SubmitResult,
    PlayersBoard,
    TeamsBoard,
    AddNewPlayer,
    DisplayWinner
  },

  data() {
    return{
      teams: [],
      users: [],
      upcomingMatches: [],
      recentMatches: [],
      showTournamentData: true
    }
  },

  created() {
    this.getData()
    
    EventBus.$on('newTeamCreated', (team) => {
      this.teams.push(team)
      console.log(team, this.teams)
      team.members.forEach((member)=>{
      this.users = this.users.filter((user)=>user.name!=member)
      })

    })

    EventBus.$on('newPlayerAdded', (user) => {
      this.users.push(user)
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

    startTournament(){
      this.showTournamentData = false
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
          this.upcomingMatches.push(match)
        }
      }
    },

    endTournament() {
      // clean data
      // display winner
       EventBus.$emit('openWinnerDialog')
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active{
  transition: transform .5s;
}
.slide-enter,
.slide-leave-active{
  transform: translateY(20px);
}

.el-button.start-tournament{
  background-color: #E2151E;
  border: 1px solid #E2151E ;
  margin: 20px 0;
}

.el-button.start-tournament:hover {
  background-color: rgb(212, 39, 47);
    border: 1px solid rgb(212, 39, 47) ;

}

</style>
