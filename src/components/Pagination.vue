<!-- 分页组件 -->
<template>
  <el-pagination class="page-box" @size-change="handleSizeChange"
                 @current-change="handleCurrentChange"
                 background :current-page="childMsg.pageNum"
                 :page-sizes="[5, 8, 10, 20, 30, 40]"
                 :page-size="childMsg.pageSize"
                 layout="total, sizes, prev, pager, next, jumper"
                 :total="childMsg.total">
  </el-pagination>
</template>
<script>
export default {
  name: 'Pagination',
  props: ['childMsg'],
  data() {
    return {
      pageparm: {
        pageNum: this.childMsg.pageNum,
        pageSize: this.childMsg.pageSize
      }
    }
  },
  created() {},
  methods: {
    handleSizeChange(val) {
      this.pageparm.pageSize = val
      this.$emit('callFather', this.pageparm)
    },
    handleCurrentChange(val) {
      this.pageparm.pageNum = val
      this.$emit('callFather', this.pageparm)
    }
  }
}
</script>

<style>
.page-box {
  margin: 10px auto;
}
</style>
