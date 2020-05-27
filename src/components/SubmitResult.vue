<template>
    <el-dialog :title="edit ? 'Edit Match' : 'Match Completed'" :visible="showSubmitResultDialog">
      <p>Please enter the score</p>
      <el-form :model="match">
          <el-form-item :label='match.team1.name'>
            <el-input-number :min="0" :max="30" v-model="match.team1.score"></el-input-number>
          </el-form-item>
          <span>:</span>
          <el-form-item :label='match.team2.name'>
            <el-input-number :min="0" :max="30" v-model="match.team2.score"></el-input-number>
          </el-form-item>
          <el-button @click="showSubmitResultDialog=false">Cancel</el-button>
          <el-button type="primary" @click="submitNewResult">Submit</el-button>
      </el-form>
  </el-dialog>
</template>

<script>
import EventBus from '../event-bus';
import db from './firebaseInit'

export default {

  data() {
    return {
      showSubmitResultDialog: false,
      match: {
        team1:{
          score: 0
        },
        team2:{
          score: 0
        }
      },
      teamsList: [],
      edit: false,
    };
  },
  
  props: {
    teams:Array,
  },

  mounted() {
    EventBus.$on('openSubmitResultDialog', (match) => {
        this.showSubmitResultDialog = true
        this.match = match;
        this.edit = this.match.completed==0 ? 0 : 1
    })
  },

  methods: {

    submitNewResult(){

      // update the matches
      db.collection('matches').doc(this.match.id).update(
        {team1:this.match.team1, team2:this.match.team2, completed:true}
      )

      // create new array of teams and update the values
      this.teamsList = [...this.teams]
      let team1 = this.teamsList.filter((team) => team.id == this.match.team1.id )[0]
      let team2 = this.teamsList.filter((team) => team.id == this.match.team2.id )[0]
      
      // lets say each team gets 3 points when they win
      if(this.match.team1.score > this.match.team2.score) {
        team1.matches_won++ 
        team2.matches_lost++
        team1.points =  team1.points + 3
      }
      else{
        team2.matches_won++ 
        team1.matches_lost++
        team2.points =  team2.points + 3
      }

      // save the updated team information
      db.collection('teams').doc(this.match.team1.id).update(
        {points: team1.points, matches_won: team1.matches_won, matches_lost: team1.matches_lost})

      db.collection('teams').doc(this.match.team2.id).update(
        {points: team2.points, matches_won: team2.matches_won, matches_lost: team2.matches_lost}
      )

      this.showSubmitResultDialog = false
      EventBus.$emit('newResultSubmitted', this.match, this.edit)
    }
  }
}
</script>

<style  scoped>

.el-form{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
}

.el-input-number{
  min-width: 150px;
  width: auto;
}

</style>