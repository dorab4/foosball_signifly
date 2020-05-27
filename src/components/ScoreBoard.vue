<template>
    <div>
      <h3>SCOREBOARD</h3>
      <el-table
        :data="teams"
        stripe
        style="width: 100%"
        :row-class-name="tableRowClassName">
        <el-table-column
          prop="name"
          label="Team"
          width="180">
        </el-table-column>
        <el-table-column
          prop="points"
          label="Points">
        </el-table-column>
        <el-table-column
          prop="matches_won"
          label="Won">
        </el-table-column>
        <el-table-column
          prop="matches_lost"
          label="Lost">
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
export default {
  
  data() {
    return {
    }
  },

  props: {
    teams:Array,
  },

  methods: {
    tableRowClassName({row, rowIndex}) {
      if (rowIndex === 0 && row) {
        return 'winning-row';
      } 
    }
  }
}
</script>

<style >

.el-table .el-table__row.winning-row {
    background: #ceffce;
    font-weight: bold;
    font-size: 15px;
}

</style>