<template>
     <el-col :md="12">
      <h3>TEAMS</h3>
      <el-table
        :data="teams"
        stripe
        height="350"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="Team"
          width="100">
        </el-table-column>
        <el-table-column
          prop="members"
          label="Members"
          :formatter="formatter">
        </el-table-column>
        <el-table-column
            align="right">
            <template slot="header" >
                <el-button
                size="medium"
                type='primary'
                icon="el-icon-plus"
                @click="openCreateNewTeamDialog">New team</el-button>
            </template>
         </el-table-column>
      </el-table>
    </el-col>
</template>

<script>
import EventBus from '../event-bus';

export default {
  
  data() {
    return {
    }
  },

  props: {
    teams:Array,
  },

  methods: {
    openCreateNewTeamDialog() {
      EventBus.$emit('openCreateNewTeamDialog')
    },

    formatter(row) {
      return row.members.toString().split(',').join('\r\n')
    },
  }
}
</script>