<template>
  <div>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="支付方式">
        <el-select size="small" v-model="queryForm.payType" width="370px" filterable clearable>
          <el-option key="微信" label="微信" value="微信" />
          <el-option key="支付宝" label="支付宝" value="支付宝" />
          <el-option key="银行卡" label="银行卡" value="银行卡" />
        </el-select>
      </el-form-item>
      <el-form-item label="景区评价">
        <el-input size="small" v-model="queryForm.remark" width="370px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="queryData">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column prop="scenicName" label="预约景区" align="center" />
      <el-table-column prop="userName" label="预约用户" align="center" />
      <el-table-column prop="buyNum" label="预约人数" align="center" />
      <el-table-column prop="playDate" label="游玩日期" align="center" />
      <el-table-column prop="price" label="订单单价" align="center" />
      <el-table-column label="订单总价" align="center">
        <template slot-scope="scope">
          {{ scope.row.price * scope.row.buyNum }}
        </template>
      </el-table-column>
      <el-table-column prop="payType" label="支付方式" align="center" />
      <el-table-column prop="remark" label="景区评价" align="center" />
      <el-table-column prop="remarkScore" label="景区评分" align="center" />
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="queryForm" @callFather="updatePageparam"></Pagination>
    <!-- 编辑表单 -->
    <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="editDialogFlag" :title="editTitle" width="600px">
      <el-form ref="editForm" inline :model="editForm" :rules="rules" size="small" label-width="120px">
        <el-form-item label="预约景区" prop="scenicId">
          <el-select v-model="editForm.scenicId" filterable clearable style="width: 400px">
            <el-option
              v-for="item in scenicSpotList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
          </el-select>
        </el-form-item>
        <el-form-item label="预约用户" prop="userId">
          <el-select v-model="editForm.userId" filterable clearable style="width: 400px">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
          </el-select>
        </el-form-item>
        <el-form-item label="预约人数" prop="buyNum">
          <el-input-number size="small" v-model="editForm.buyNum" style="width: 400px"></el-input-number>
        </el-form-item>
        <el-form-item label="游玩日期" prop="playDate">
          <el-date-picker size="small" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="editForm.playDate" style="width: 400px"></el-date-picker>
        </el-form-item>
        <el-form-item label="订单总价" prop="price">
          <el-input size="small" v-model="editForm.price" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="payType">
          <el-select v-model="editForm.payType" filterable clearable style="width: 400px">
            <el-option key="微信" label="微信" value="微信" />
            <el-option key="支付宝" label="支付宝" value="支付宝" />
            <el-option key="银行卡" label="银行卡" value="银行卡" />
          </el-select>
        </el-form-item>
        <el-form-item label="景区评价" prop="remark">
          <el-input size="small" v-model="editForm.remark" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="景区评分" prop="remarkScore">
          <el-input-number size="small" v-model="editForm.remarkScore" style="width: 400px"></el-input-number>
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
import crudScenicOrder from '@/api/scenicOrder'
import crudScenicSpot from '@/api/scenicSpot'
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
        scenicId: null,
        userId: null,
        buyNum: null,
        playDate: null,
        price: null,
        payType: null,
        remark: null,
        remarkScore: null,
      },
      editForm: {
        scenicId: null,
        userId: null,
        buyNum: null,
        playDate: null,
        price: null,
        payType: null,
        remark: null,
        remarkScore: null,
      },
      scenicSpotList: [],
      userList: [],
      editDialogFlag: false,
      editTitle: null,
      editLoading: false,
      listData: [],
      rules: {
        scenicId: [
          { required: true, message: '预约景区不能为空', trigger: 'change' }
        ],
        userId: [
          { required: true, message: '预约用户不能为空', trigger: 'change' }
        ],
        buyNum: [
          { required: true, message: '预约人数不能为空', trigger: 'change' }
        ],
        playDate: [
          { required: true, message: '游玩日期不能为空', trigger: 'change' }
        ],
        price: [
          { required: true, message: '订单总价不能为空', trigger: 'change' }
        ],
        payType: [
          { required: true, message: '支付方式不能为空', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '景区评价不能为空', trigger: 'change' }
        ],
        remarkScore: [
          { required: true, message: '景区评分不能为空', trigger: 'change' }
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
    crudScenicSpot.query({pageSize: 10000}).then(res => {
      this.scenicSpotList = res.entityList
    })
    crudUser.query({pageSize: 10000}).then(res => {
      this.userList = res.entityList
    })
  },

  methods: {
    queryData() {
      this.loading = true
      crudScenicOrder.query(this.queryForm).then(res => {
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
      this.editTitle = '新增景区预约记录'
      this.editForm = {}
      this.editDialogFlag = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    toEdit(row) {
      this.editTitle = '编辑景区预约记录'
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
          crudScenicOrder.edit(this.editForm).then(res => {
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
      this.$confirm('确定删除【' + row.name + '】景区预约记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudScenicOrder.del(row.id).then(res => {
          Notification.success('删除成功')
          this.editDialogFlag = false
          this.queryData()
        }).catch(e => {})
      }).catch(e => {})
    },
  }
}
</script>
