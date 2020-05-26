<template>
    <el-col :sm="12">
        <h3 v-if='completed'>RECENT MATCHES</h3>
        <h3 v-else>UPCOMING MATCHES</h3>
        <el-table
            :data="matches"
            style="width: 100%"
            stripe
            height="250">
            <el-table-column
              label="Teams"
              width="'30%'">
              <template slot-scope="scope">
                <span>{{ scope.row.team1.name }} vs. {{ scope.row.team2.name }}</span>
              </template>
            </el-table-column>
             <el-table-column  
              v-if="completed"
              label="Score"
              width="'30%'">
              <template slot-scope="scope">
                <span>{{scope.row.team1.score}} : {{scope.row.team2.score}}</span>
              </template>
            </el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                  <el-button
                  size="medium"
                  v-if="completed"
                  type="primary" 
                  icon="el-icon-edit" plain
                  @click="openSubmitResultDialog(scope.row)"
                  >Edit result</el-button>
                  <el-button
                  v-else
                  size="medium"
                  type="success" 
                  icon="el-icon-check" 
                  @click="openSubmitResultDialog(scope.row)"
                  >Match completed</el-button>
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
      match: {}
    }
  },

  props: {
    matches:Array,
    completed:Boolean
  },
  
  methods: {
    openSubmitResultDialog(match) {
      EventBus.$emit('openSubmitResultDialog', match)
    }
  }
}

</script>
