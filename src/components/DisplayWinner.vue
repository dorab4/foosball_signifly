<template>
    <el-dialog title="Foosball winner" :visible="showTournamentWinner" >
        <img src="../assets/trophy.svg" >
        <h4>{{teams[0].name}}</h4>
        <p>{{members}}</p>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" >New Tournament</el-button>
    </span>
  </el-dialog>
   
</template>

<script>
import EventBus from '../event-bus';

export default {
    data() {
      return {
        showTournamentWinner: false,
      }
    },

    props: {
        teams: Object
    },

    computed: {
        members() {
            return this.teams[0].members.toString().split(',').join(' and ')
        }
    },

    mounted() {
        EventBus.$on('openWinnerDialog', () => {
            this.showTournamentWinner = true;
        })
    },

}
           
</script>

<style scoped>

img{
    width: 200px;
}

</style>