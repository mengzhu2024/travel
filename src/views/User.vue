<template>
  <div>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="姓名">
        <el-input size="small" v-model="queryForm.name" width="370px"></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-select size="small" v-model="queryForm.role" width="370px" filterable clearable>
          <el-option key="用户" label="用户" value="用户" />
          <el-option key="管理员" label="管理员" value="管理员" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="queryData">搜索</el-button>
        <el-button size="small" type="success" icon="el-icon-plus" @click="toAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="sex" label="性别" align="center" />
      <el-table-column prop="birthDate" label="出生日期" align="center" />
      <el-table-column prop="phone" label="联系方式" align="center" />
      <el-table-column prop="role" label="角色" align="center" />
      <el-table-column prop="account" label="登录账号" align="center" />
      <el-table-column prop="password" label="登录密码" align="center" />
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
        <el-form-item label="姓名" prop="name">
          <el-input size="small" v-model="editForm.name" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="editForm.sex" filterable clearable style="width: 400px">
            <el-option key="男" label="男" value="男" />
            <el-option key="女" label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthDate">
          <el-date-picker size="small" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="editForm.birthDate" style="width: 400px"></el-date-picker>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input size="small" v-model="editForm.phone" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="editForm.role" filterable clearable style="width: 400px">
            <el-option key="用户" label="用户" value="用户" />
            <el-option key="管理员" label="管理员" value="管理员" />
          </el-select>
        </el-form-item>
        <el-form-item label="登录账号" prop="account">
          <el-input size="small" v-model="editForm.account" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input size="small" v-model="editForm.password" style="width: 400px"></el-input>
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
        name: null,
        sex: null,
        birthDate: null,
        phone: null,
        role: null,
        account: null,
        password: null,
      },
      editForm: {
        name: null,
        sex: null,
        birthDate: null,
        phone: null,
        role: null,
        account: null,
        password: null,
      },
      editDialogFlag: false,
      editTitle: null,
      editLoading: false,
      listData: [],
      rules: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'change' }
        ],
        sex: [
          { required: true, message: '性别不能为空', trigger: 'change' }
        ],
        birthDate: [
          { required: true, message: '出生日期不能为空', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '联系方式不能为空', trigger: 'change' }
        ],
        role: [
          { required: true, message: '角色不能为空', trigger: 'change' }
        ],
        account: [
          { required: true, message: '登录账号不能为空', trigger: 'change' }
        ],
        password: [
          { required: true, message: '登录密码不能为空', trigger: 'change' }
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
  },

  methods: {
    queryData() {
      this.loading = true
      crudUser.query(this.queryForm).then(res => {
        this.listData = res.entityList.filter(e => e.account !== 'admin')
        this.loading = false
        this.queryForm.pageNum = res.pageNum
        this.queryForm.total = res.rowCount - 1
      })
    },
    updatePageparam(pageparm) {
      this.queryForm.pageNum = pageparm.pageNum
      this.queryForm.pageSize = pageparm.pageSize
      this.queryData()
    },
    toAdd() {
      this.editTitle = '新增系统用户'
      this.editForm = {}
      this.editDialogFlag = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    toEdit(row) {
      this.editTitle = '编辑系统用户'
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
          crudUser.edit(this.editForm).then(res => {
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
      this.$confirm('确定删除【' + row.name + '】系统用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudUser.del(row.id).then(res => {
          Notification.success('删除成功')
          this.editDialogFlag = false
          this.queryData()
        }).catch(e => {})
      }).catch(e => {})
    },
  }
}
</script>
