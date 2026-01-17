<template>
  <div class="login-wrap">
    <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="registerDialogFlag" title="欢迎注册" width="600px">
      <el-form ref="editForm" inline :model="editForm" :rules="registerRules" size="small" label-width="120px">
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
        <el-form-item label="登录账号" prop="account">
          <el-input size="small" v-model="editForm.account" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input size="small" v-model="editForm.password" style="width: 400px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="registerDialogFlag = false">取消</el-button>
        <el-button :loading="registerLoading" type="primary" @click="register">确认</el-button>
      </div>
    </el-dialog>
    <el-form label-position="left" :model="loginForm" :rules="rules" ref="loginForm" label-width="0px" class="demo-loginForm login-container">
      <h3 class="title">在线旅游购票网站</h3>
      <el-form-item prop="account">
        <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:45%; float: left" @click="submitForm('loginForm')" :loading="logining">登录</el-button>
        <el-button type="primary" style="width:45%; float: right" @click="registerDialogFlag = true">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import crudUser, {edit} from '@/api/user'
import {Notification} from "element-ui";
export default {
  name: 'login',
  data() {
    return {
      //定义loading默认为false
      logining: false,
      loginForm: {
        //account和password默认为空
        account: '',
        password: '',
      },
      loginType: 'admin',
      //rules前端验证
      rules: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
      registerRules: {
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
        account: [
          { required: true, message: '登录账号不能为空', trigger: 'change' }
        ],
        password: [
          { required: true, message: '登录密码不能为空', trigger: 'change' }
        ],
      },
      editForm: {
        name: null,
        sex: null,
        account: null,
        password: null,
      },
      registerDialogFlag: false,
      registerLoading: false
    }
  },
  // 里面的函数只有调用才会执行
  methods: {
    // 用户登录
    submitForm() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          crudUser.login(this.loginForm).then(res => {
            let token = res.key
            let role = res.value
            localStorage.setItem("token", token)
            this.$router.push({ path: role === '管理员' ? '/user': '/front' })
          }).catch(e => {})
        }
      })
    },
    register() {
      this.editForm.role = '用户'
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.registerLoading = true
          crudUser.edit(this.editForm).then(res => {
            Notification.success('注册成功，请登录')
            this.registerLoading = false
            this.registerDialogFlag = false
          }).catch(e => {
            this.registerLoading = false
          })
        }
      })
    },
  }
}
</script>

<style scoped>
.login-wrap {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding-top: 10%;
  background-image: url("../assets/img/bg.png");
  /* background-color: #112346; */
  background-repeat: no-repeat;
  background-position: center right;
  background-size: 100%;
}
.login-container {
  border-radius: 10px;
  margin: 0px auto;
  width: 350px;
  padding: 30px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  text-align: left;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
}
.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
.remember {
  margin: 0px 0px 35px 0px;
}
.code-box {
  text-align: right;
}
.codeimg {
  height: 40px;
}
</style>
