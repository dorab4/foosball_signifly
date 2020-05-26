<template>
     <el-col :md="12">
      <h3>PLAYERS</h3>
      <el-table
        :data="users"
        stripe
        height="350px"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="Name"
          width="120">
        </el-table-column>
        <el-table-column
          prop="email"
          label="Email">
        </el-table-column>
         <el-table-column
            align="right">
            <template slot="header" >
                <el-button
                size="medium"
                type='primary'
                icon="el-icon-plus"
                @click="openAddNewPlayerDialog">New player</el-button>
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
    users:Array,
  },

  methods: {
      openAddNewPlayerDialog() {
          EventBus.$emit('openAddNewPlayerDialog')
      }
  }
}
</script>

<style >


</style>