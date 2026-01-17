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
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="queryData">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column prop="hotelName" label="预约酒店" align="center" />
      <el-table-column prop="houseName" label="预约房型" align="center" />
      <el-table-column prop="userName" label="预约用户" align="center" />
      <el-table-column prop="startDate" label="入住日期" align="center" />
      <el-table-column prop="leaveDate" label="离开日期" align="center" />
      <el-table-column prop="price" label="订单总价" align="center" />
      <el-table-column prop="payType" label="支付方式" align="center" />
      <el-table-column prop="remark" label="酒店评价" align="center" />
      <el-table-column prop="remarkScore" label="酒店评分" align="center" />
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="queryForm" @callFather="updatePageparam"></Pagination>
    <!-- 编辑表单 -->
    <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="editDialogFlag" :title="editTitle" width="600px">
      <el-form ref="editForm" inline :model="editForm" :rules="rules" size="small" label-width="120px">
        <el-form-item label="预约酒店" prop="hotelId">
          <el-select v-model="editForm.hotelId" filterable clearable style="width: 400px">
            <el-option
              v-for="item in hotelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
          </el-select>
        </el-form-item>
        <el-form-item label="预约房型" prop="houseId">
          <el-select v-model="editForm.houseId" filterable clearable style="width: 400px">
            <el-option
              v-for="item in hotelHouseList"
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
        <el-form-item label="入住日期" prop="startDate">
          <el-date-picker size="small" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="editForm.startDate" style="width: 400px"></el-date-picker>
        </el-form-item>
        <el-form-item label="离开日期" prop="leaveDate">
          <el-date-picker size="small" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="editForm.leaveDate" style="width: 400px"></el-date-picker>
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
        <el-form-item label="酒店评价" prop="remark">
          <el-input size="small" v-model="editForm.remark" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="酒店评分" prop="remarkScore">
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
import crudHotelOrder from '@/api/hotelOrder'
import crudHotel from '@/api/hotel'
import crudHotelHouse from '@/api/hotelHouse'
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
        hotelId: null,
        houseId: null,
        userId: null,
        startDate: null,
        leaveDate: null,
        price: null,
        payType: null,
        remark: null,
        remarkScore: null,
      },
      editForm: {
        hotelId: null,
        houseId: null,
        userId: null,
        startDate: null,
        leaveDate: null,
        price: null,
        payType: null,
        remark: null,
        remarkScore: null,
      },
      hotelList: [],
      hotelHouseList: [],
      userList: [],
      editDialogFlag: false,
      editTitle: null,
      editLoading: false,
      listData: [],
      rules: {
        hotelId: [
          { required: true, message: '预约酒店不能为空', trigger: 'change' }
        ],
        houseId: [
          { required: true, message: '预约房型不能为空', trigger: 'change' }
        ],
        userId: [
          { required: true, message: '预约用户不能为空', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '入住日期不能为空', trigger: 'change' }
        ],
        leaveDate: [
          { required: true, message: '离开日期不能为空', trigger: 'change' }
        ],
        price: [
          { required: true, message: '订单总价不能为空', trigger: 'change' }
        ],
        payType: [
          { required: true, message: '支付方式不能为空', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '酒店评价不能为空', trigger: 'change' }
        ],
        remarkScore: [
          { required: true, message: '酒店评分不能为空', trigger: 'change' }
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
    crudHotel.query({pageSize: 10000}).then(res => {
      this.hotelList = res.entityList
    })
    crudHotelHouse.query({pageSize: 10000}).then(res => {
      this.hotelHouseList = res.entityList
    })
    crudUser.query({pageSize: 10000}).then(res => {
      this.userList = res.entityList
    })
  },

  methods: {
    queryData() {
      this.loading = true
      crudHotelOrder.query(this.queryForm).then(res => {
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
      this.editTitle = '新增酒店预约记录'
      this.editForm = {}
      this.editDialogFlag = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    toEdit(row) {
      this.editTitle = '编辑酒店预约记录'
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
          crudHotelOrder.edit(this.editForm).then(res => {
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
      this.$confirm('确定删除【' + row.name + '】酒店预约记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudHotelOrder.del(row.id).then(res => {
          Notification.success('删除成功')
          this.editDialogFlag = false
          this.queryData()
        }).catch(e => {})
      }).catch(e => {})
    },
  }
}
</script>
