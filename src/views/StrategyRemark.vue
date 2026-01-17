<template>
  <div>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="评论内容">
        <el-input size="small" v-model="queryForm.content" width="370px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="queryData">搜索</el-button>
        <el-button size="small" type="success" icon="el-icon-plus" @click="toAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column prop="strategyName" label="评论攻略" align="center" />
      <el-table-column prop="content" label="评论内容" align="center" />
      <el-table-column prop="userName" label="评论人" align="center" />
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="toEdit(scope.row)"><i class="el-icon-edit" />编辑</el-button>
          <el-button size="mini" type="danger" @click="toDelete(scope.row)"><i class="el-icon-delete" />删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="queryForm" @callFather="updatePageparam"></Pagination>
    <!-- 编辑表单 -->
    <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="editDialogFlag" :title="editTitle" width="600px">
      <el-form ref="editForm" inline :model="editForm" :rules="rules" size="small" label-width="120px">
        <el-form-item label="评论攻略" prop="strategyId">
          <el-select v-model="editForm.strategyId" filterable clearable style="width: 400px">
            <el-option
              v-for="item in strategyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
          </el-select>
        </el-form-item>
        <el-form-item label="评论内容" prop="content">
          <el-input size="small" v-model="editForm.content" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="评论人" prop="userId">
          <el-select v-model="editForm.userId" filterable clearable style="width: 400px">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="editDialogFlag = false">取消</el-button>
        <el-button :loading="editLoading" type="primary" @click="edit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import crudStrategyRemark from '@/api/strategyRemark'
import crudStrategy from '@/api/strategy'
import crudUser from '@/api/user'
import Pagination from '@/components/Pagination'
import {downloadFile} from "@/utils/download";
import {Notification} from "element-ui";
export default {
  data() {
    return {
      loading: false,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        total: null,
        strategyId: null,
        content: null,
        userId: null,
      },
      editForm: {
        strategyId: null,
        content: null,
        userId: null,
      },
      strategyList: [],
      userList: [],
      editDialogFlag: false,
      editTitle: null,
      editLoading: false,
      listData: [],
      rules: {
        strategyId: [
          { required: true, message: '评论攻略不能为空', trigger: 'change' }
        ],
        content: [
          { required: true, message: '评论内容不能为空', trigger: 'change' }
        ],
        userId: [
          { required: true, message: '评论人不能为空', trigger: 'change' }
        ],
      }
    }
  },
  // 注册组件
  components: {
    Pagination
  },
  created() {
    this.queryData()
    crudStrategy.query({pageSize: 10000}).then(res => {
      this.strategyList = res.entityList
    })
    crudUser.query({pageSize: 10000}).then(res => {
      this.userList = res.entityList
    })
  },

  methods: {
    queryData() {
      this.loading = true
      crudStrategyRemark.query(this.queryForm).then(res => {
        this.listData = res.entityList
        this.loading = false
        this.queryForm.pageNum = res.pageNum
        this.queryForm.total = res.rowCount
      })
    },
    updatePageparam(pageparm) {
      this.queryForm.pageNum = pageparm.pageNum
      this.queryForm.pageSize = pageparm.pageSize
      this.queryData()
    },
    toAdd() {
      this.editTitle = '新增攻略评论'
      this.editForm = {}
      this.editDialogFlag = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    toEdit(row) {
      this.editTitle = '编辑攻略评论'
      this.editForm = row
      this.editDialogFlag = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    edit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.editLoading = true
          crudStrategyRemark.edit(this.editForm).then(res => {
            Notification.success('编辑成功')
            this.editLoading = false
            this.editDialogFlag = false
            this.queryData()
          }).catch(e => {
            this.editLoading = false
          })
        }
      })
    },
    toDelete(row) {
      this.$confirm('确定删除【' + row.name + '】攻略评论吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudStrategyRemark.del(row.id).then(res => {
          Notification.success('删除成功')
          this.editDialogFlag = false
          this.queryData()
        }).catch(e => {})
      }).catch(e => {})
    },
  }
}
</script>