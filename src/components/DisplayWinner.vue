<template>
    <el-dialog title="Foosball winner" :visible="showTournamentWinner" >
        <img src="../assets/trophy.svg" >
        <h4>{{winner.name}}</h4>
        <p>{{members}}</p>
    <span slot="footer" class="dialog-footer">
        <router-link class='el-button el-button--success' to="/">Start new tournament</router-link>
    </span>
  </el-dialog>
   
</template>

<script>
import EventBus from '../event-bus';

export default {
    data() {
      return {
        showTournamentWinner: false,
        winner: {
            members:[]
        }
      }
    },

    computed: {
        members() {
            return this.winner.members.toString().split(',').join(' and ')
        }
    },

    mounted() {
        EventBus.$on('openWinnerDialog', (winner) => {
            this.showTournamentWinner = true;
            this.winner = winner;
        })
    },
}
           
</script>

<style scoped>

img{
    width: 200px;
}

a{
    text-decoration: none;
}

</style>