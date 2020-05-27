<template>
    <div>
        <h2>TRACK TOURNAMENT</h2>
        <el-row :gutter="40" >
            <el-col :md="12">
                <ScoreBoard :teams='teams' />
            </el-col>
            <el-col :md="12">
                <MatchesBoard :matches='upcomingMatches' :completed='false'/>
                <MatchesBoard :matches='recentMatches' :completed='true'/>
            </el-col>
            <el-button type="success" @click="endTournament">End Tournament</el-button>
            <SubmitResult :teams='teams' />
            <DisplayWinner />
        </el-row>
    </div>
</template>

<script>
import ScoreBoard from '../components/ScoreBoard'
import MatchesBoard from '../components/MatchesBoard'
import SubmitResult from '../components/SubmitResult'
import DisplayWinner from '../components/DisplayWinner'
import EventBus from '../event-bus';
import db from '../components/firebaseInit'

export default {
  components: {
    ScoreBoard,
    MatchesBoard,
    SubmitResult,
    DisplayWinner
  },

  data() {
    return{
      teams: [],
      upcomingMatches: [],
      recentMatches: [],
    }
  },

  created() {

    this.getData()
    
    EventBus.$on('newResultSubmitted', (updated_match, edit) => {
      if(!edit) {
      this.recentMatches.push(updated_match)
      this.upcomingMatches = this.upcomingMatches.filter((upcoming_match)=>upcoming_match.id!=updated_match.id)
      }
      this.teams.sort((a, b) => (a.points < b.points) ? 1 : -1)
    })
  },

  methods: {

    endTournament() {
       EventBus.$emit('openWinnerDialog', (this.teams[0]))
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

<style scoped>
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
