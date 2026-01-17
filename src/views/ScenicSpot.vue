<template>
  <div>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="景区名称">
        <el-input size="small" v-model="queryForm.name" width="370px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="queryData">搜索</el-button>
        <el-button size="small" type="success" icon="el-icon-plus" @click="toAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column prop="name" label="景区名称" align="center" />
      <el-table-column prop="imgUrl" label="景区图片" align="center">
        <template slot-scope="scope">
          <img :src="'http://localhost:8080/api/files/' + scope.row.imgUrl" style="width: 50px; height: 50px"/>
        </template>
      </el-table-column>
      <el-table-column prop="location" label="具体位置" align="center" />
      <el-table-column prop="establishDate" label="建立日期" align="center" />
      <el-table-column prop="price" label="门票价格" align="center" />
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
    <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="editDialogFlag" :title="editTitle" width="800px">
      <el-form ref="editForm" inline :model="editForm" :rules="rules" size="small" label-width="120px">
        <el-form-item label="景区名称" prop="name">
          <el-input size="small" v-model="editForm.name" style="width: 600px"></el-input>
        </el-form-item>
        <el-form-item label="景区图片" prop="imgUrl">
          <el-upload
              class="avatar-uploader"
              action="http://localhost:8080/api/upload-img"
              :show-file-list="false"
              :on-success="imgUrlUpload"
          >
            <img v-if="editForm.imgUrl" :src="'http://localhost:8080/api/files/' + editForm.imgUrl" class="avatar"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="具体位置" prop="location">
          <el-input size="small" v-model="editForm.location" style="width: 600px"></el-input>
        </el-form-item>
        <el-form-item label="建立日期" prop="establishDate">
          <el-date-picker size="small" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="editForm.establishDate" style="width: 600px"></el-date-picker>
        </el-form-item>
        <el-form-item label="门票价格" prop="price">
          <el-input-number :precision="2" size="small" v-model="editForm.price" style="width: 600px"></el-input-number>
        </el-form-item>
        <el-form-item label="景区介绍" prop="introduction">
          <vue-editor size="small" v-model="editForm.introduction" style="width: 600px; height: 600px"></vue-editor>
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
import crudScenicSpot from '@/api/scenicSpot'
import { VueEditor } from "vue2-editor";
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
        imgUrl: null,
        introduction: null,
        location: null,
        establishDate: null,
        price: null,
        video: null,
      },
      editForm: {
        name: null,
        imgUrl: null,
        introduction: null,
        location: null,
        establishDate: null,
        price: null,
        video: null,
      },
      editDialogFlag: false,
      editTitle: null,
      editLoading: false,
      listData: [],
      rules: {
        name: [
          { required: true, message: '景区名称不能为空', trigger: 'change' }
        ],
        imgUrl: [
          { required: true, message: '景区图片不能为空', trigger: 'change' }
        ],
        introduction: [
          { required: true, message: '景区介绍不能为空', trigger: 'change' }
        ],
        location: [
          { required: true, message: '具体位置不能为空', trigger: 'change' }
        ],
        establishDate: [
          { required: true, message: '建立日期不能为空', trigger: 'change' }
        ],
        price: [
          { required: true, message: '门票价格不能为空', trigger: 'change' }
        ],
        video: [
          { required: true, message: '介绍视频不能为空', trigger: 'change' }
        ],
      }
    }
  },
  // 注册组件
  components: {
    Pagination,
    VueEditor
  },
  created() {
    this.queryData()
  },

  methods: {
    queryData() {
      this.loading = true
      crudScenicSpot.query(this.queryForm).then(res => {
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
      this.editTitle = '新增景区信息'
      this.editForm = {}
      this.editDialogFlag = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    toEdit(row) {
      this.editTitle = '编辑景区信息'
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
          crudScenicSpot.edit(this.editForm).then(res => {
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
      this.$confirm('确定删除【' + row.name + '】景区信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudScenicSpot.del(row.id).then(res => {
          Notification.success('删除成功')
          this.editDialogFlag = false
          this.queryData()
        }).catch(e => {})
      }).catch(e => {})
    },
    imgUrlUpload(res) {
      this.$set(this.editForm, 'imgUrl', res.data)
    },
    openVideo(row) {
      window.open(row.video)
    },
  }
}
</script>
<style scoped>
.avatar {
  display: inline-block;
  width: 200px;
  height: 200px;
  float: right;
}
::v-deep img{
  max-width:100%;
}
</style>
