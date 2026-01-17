<template>
  <div>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="投诉原因">
        <el-input size="small" v-model="queryForm.reason" width="370px"></el-input>
      </el-form-item>
      <el-form-item label="投诉内容">
        <el-input size="small" v-model="queryForm.content" width="370px"></el-input>
      </el-form-item>
      <el-form-item label="处理进度">
        <el-select size="small" v-model="queryForm.status" width="370px" filterable clearable>
          <el-option key="未处理" label="未处理" value="未处理" />
          <el-option key="已处理" label="已处理" value="已处理" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="queryData">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column prop="reason" label="投诉原因" align="center">
        <template slot-scope="scope">
          <span style="color: blue; cursor: pointer" @click="toView(scope.row)">{{scope.row.reason}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="投诉用户" align="center" />
      <el-table-column prop="status" label="处理进度" align="center" />
      <el-table-column prop="handleResult" label="处理结果" align="center" />
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === '未处理'" size="mini" type="primary" @click="toEdit(scope.row)"><i class="el-icon-edit" />处理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="queryForm" @callFather="updatePageparam"></Pagination>
    <!-- 编辑表单 -->
    <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="editDialogFlag" :title="editTitle" width="600px">
      <el-form ref="editForm" inline :model="editForm" :rules="rules" size="small" label-width="120px">
        <el-form-item label="投诉原因" prop="reason">
          <el-input size="small" v-model="editForm.reason" style="width: 400px" readonly></el-input>
        </el-form-item>
        <el-form-item label="投诉内容" prop="content">
          <el-input type="textarea" rows="5" size="small" v-model="editForm.content" style="width: 400px" readonly></el-input>
        </el-form-item>
        <el-form-item label="处理结果" prop="handleResult">
          <el-input size="small" v-model="editForm.handleResult" style="width: 400px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="editDialogFlag = false">取消</el-button>
        <el-button :loading="editLoading" type="primary" @click="edit">确认</el-button>
      </div>
    </el-dialog>
    <!-- 查看表单 -->
    <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="viewDialogFlag" :title="editForm.reason" center width="600px">
      {{ editForm.content }}
    </el-dialog>
  </div>
</template>

<script>
import crudReport from '@/api/report'
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
        reason: null,
        content: null,
        userId: null,
        status: null,
        handleResult: null,
      },
      editForm: {
        reason: null,
        content: null,
        userId: null,
        status: null,
        handleResult: null,
      },
      userList: [],
      editDialogFlag: false,
      editTitle: null,
      editLoading: false,
      listData: [],
      viewDialogFlag: false,
      rules: {
        reason: [
          { required: true, message: '投诉原因不能为空', trigger: 'change' }
        ],
        content: [
          { required: true, message: '投诉内容不能为空', trigger: 'change' }
        ],
        userId: [
          { required: true, message: '投诉用户不能为空', trigger: 'change' }
        ],
        status: [
          { required: true, message: '处理进度不能为空', trigger: 'change' }
        ],
        handleResult: [
          { required: true, message: '处理结果不能为空', trigger: 'change' }
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
    crudUser.query({pageSize: 10000}).then(res => {
      this.userList = res.entityList
    })
  },

  methods: {
    queryData() {
      this.loading = true
      crudReport.query(this.queryForm).then(res => {
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
      this.editTitle = '新增投诉记录'
      this.editForm = {}
      this.editDialogFlag = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    toEdit(row) {
      this.editTitle = '编辑投诉记录'
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
          this.editForm.status = '已处理'
          crudReport.edit(this.editForm).then(res => {
            Notification.success('处理成功')
            this.editLoading = false
            this.editDialogFlag = false
            this.queryData()
          }).catch(e => {
            this.editLoading = false
          })
        }
      })
    },
    toView(row) {
      this.editForm = row
      this.viewDialogFlag = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    toDelete(row) {
      this.$confirm('确定删除【' + row.name + '】投诉记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudReport.del(row.id).then(res => {
          Notification.success('删除成功')
          this.editDialogFlag = false
          this.queryData()
        }).catch(e => {})
      }).catch(e => {})
    },
  }
}
</script>
