<template>
  <div class="login-wrapper">
    <!-- 背景装饰 -->
    <div class="login-background">
      <div class="bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
      <div class="welcome-text">
        <h1>欢迎来到旅游购票平台</h1>
        <p>开启您的精彩旅程</p>
      </div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <div class="card-header">
        <div class="logo">
          <i class="el-icon-tickets"></i>
          <span>旅游购票网站</span>
        </div>
        <h2>欢迎登录</h2>
        <p>请输入您的账号密码进行登录</p>
      </div>

      <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="rules"
          class="login-form"
          @keyup.enter.native="submitForm"
      >
        <div class="form-group">
          <label class="form-label">账号</label>
          <el-form-item prop="account">
            <el-input
                v-model="loginForm.account"
                placeholder="请输入您的账号"
                size="large"
                prefix-icon="el-icon-user"
            >
            </el-input>
          </el-form-item>
        </div>

        <div class="form-group">
          <label class="form-label">密码</label>
          <el-form-item prop="password">
            <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入您的密码"
                size="large"
                prefix-icon="el-icon-lock"
                show-password
            >
            </el-input>
          </el-form-item>
        </div>
        <el-button
            type="primary"
            size="large"
            :loading="logining"
            @click="submitForm"
            class="login-btn"
        >
          {{ logining ? '登录中...' : '登录' }}
        </el-button>

        <div class="register-section">
          <span>还没有账号？</span>
          <el-button
              type="text"
              @click="registerDialogFlag = true"
              class="register-btn"
          >
            立即注册
          </el-button>
        </div>
      </el-form>
    </div>

    <!-- 注册对话框 -->
    <el-dialog
        :visible.sync="registerDialogFlag"
        title="创建账号"
        width="500px"
        class="register-dialog"
        :close-on-click-modal="false"
        :append-to-body="true"
    >
      <el-form
          ref="registerForm"
          :model="registerForm"
          :rules="registerRules"
          label-position="top"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input
                  v-model="registerForm.name"
                  placeholder="请输入姓名"
                  prefix-icon="el-icon-user"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="registerForm.sex" placeholder="请选择性别" style="width:100%">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="出生日期" prop="birthDate">
          <el-date-picker
              v-model="registerForm.birthDate"
              type="date"
              placeholder="选择出生日期"
              style="width:100%"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
          />
        </el-form-item>

        <el-form-item label="联系方式" prop="phone">
          <el-input
              v-model="registerForm.phone"
              placeholder="请输入手机号码"
              prefix-icon="el-icon-phone"
          >
            <template slot="prepend">+86</template>
          </el-input>
        </el-form-item>

        <el-form-item label="登录账号" prop="account">
          <el-input
              v-model="registerForm.account"
              placeholder="请输入登录账号"
              prefix-icon="el-icon-user"
          />
        </el-form-item>

        <el-form-item label="登录密码" prop="password">
          <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入登录密码"
              prefix-icon="el-icon-lock"
              show-password
          />
        </el-form-item>

        <div class="password-tips">
          <el-alert
              title="密码要求：至少8个字符，包含字母和数字"
              type="info"
              :closable="false"
              show-icon
          />
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="registerDialogFlag = false">取消</el-button>
        <el-button
            type="primary"
            :loading="registerLoading"
            @click="handleRegister"
            class="register-submit-btn"
        >
          注册账号
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import crudUser, { edit } from '@/api/user'
import { Notification } from "element-ui"

export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能少于6位'))
      } else {
        callback()
      }
    }

    return {
      logining: false,
      rememberMe: false,
      loginForm: {
        account: '',
        password: '',
      },
      registerForm: {
        name: '',
        sex: '',
        birthDate: '',
        phone: '',
        account: '',
        password: '',
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 4, message: '账号长度不能少于4位', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ],
      },
      registerRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        birthDate: [
          { required: true, message: '请选择出生日期', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          { min: 4, message: '账号长度不能少于4位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
        ],
      },
      registerDialogFlag: false,
      registerLoading: false
    }
  },
  mounted() {
    // 尝试从本地存储读取记住的账号
    const savedAccount = localStorage.getItem('rememberedAccount')
    if (savedAccount) {
      this.loginForm.account = savedAccount
      this.rememberMe = true
    }
  },
  methods: {
    submitForm() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.logining = true

          // 如果勾选了记住我，保存账号
          if (this.rememberMe) {
            localStorage.setItem('rememberedAccount', this.loginForm.account)
          } else {
            localStorage.removeItem('rememberedAccount')
          }

          crudUser.login(this.loginForm).then(res => {
            this.logining = false
            let token = res.key
            let role = res.value
            localStorage.setItem("token", token)

            Notification.success({
              title: '登录成功',
              message: '欢迎回来！',
              duration: 2000
            })

            this.$router.push({ path: role === '管理员' ? '/user': '/front' })
          }).catch(e => {
            this.logining = false
            Notification.error({
              title: '登录失败',
              message: '账号或密码错误',
              duration: 3000
            })
          })
        }
      })
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.registerLoading = true
          this.registerForm.role = '用户'

          crudUser.edit(this.registerForm).then(res => {
            Notification.success({
              title: '注册成功',
              message: '账号已创建，请使用新账号登录',
              duration: 3000
            })

            this.registerLoading = false
            this.registerDialogFlag = false
            this.resetRegisterForm()
          }).catch(e => {
            this.registerLoading = false
            Notification.error({
              title: '注册失败',
              message: e.message || '注册失败，请重试',
              duration: 3000
            })
          })
        }
      })
    },
    resetRegisterForm() {
      this.registerForm = {
        name: '',
        sex: '',
        birthDate: '',
        phone: '',
        account: '',
        password: '',
      }
    },
    showForgotPassword() {
      this.$message.info('请联系管理员重置密码')
    },
    socialLogin(type) {
      const platforms = {
        wechat: '微信',
        qq: 'QQ',
        weibo: '微博'
      }
      this.$message.info(`${platforms[type]}登录功能正在开发中`)
    }
  }
}
</script>

<style lang="scss" scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.login-background {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: white;

  .welcome-text {
    text-align: center;
    z-index: 1;

    h1 {
      font-size: 42px;
      margin-bottom: 16px;
      font-weight: 600;
      text-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }

    p {
      font-size: 20px;
      opacity: 0.9;
    }
  }

  .bg-shapes {
    position: absolute;
    width: 100%;
    height: 100%;

    .shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);

      &.shape-1 {
        width: 300px;
        height: 300px;
        top: 10%;
        left: 10%;
      }

      &.shape-2 {
        width: 200px;
        height: 200px;
        bottom: 20%;
        right: 15%;
      }

      &.shape-3 {
        width: 150px;
        height: 150px;
        bottom: 10%;
        left: 20%;
      }
    }
  }
}

.login-card {
  width: 450px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin: 40px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  z-index: 2;
  align-self: center;

  .card-header {
    text-align: center;
    margin-bottom: 40px;

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 24px;
      font-weight: bold;
      color: #409EFF;
      margin-bottom: 20px;

      i {
        font-size: 32px;
      }
    }

    h2 {
      font-size: 28px;
      color: #303133;
      margin-bottom: 10px;
      font-weight: 600;
    }

    p {
      color: #909399;
      font-size: 14px;
    }
  }
}

.login-form {
  .form-group {
    margin-bottom: 24px;

    .form-label {
      display: block;
      margin-bottom: 8px;
      color: #606266;
      font-weight: 500;
      font-size: 14px;
    }

    ::v-deep .el-input__inner {
      height: 48px;
      border-radius: 10px;
      font-size: 16px;

      &:focus {
        border-color: #409EFF;
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
      }
    }
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  .forgot-password {
    color: #409EFF;
    text-decoration: none;
    font-size: 14px;

    &:hover {
      text-decoration: underline;
    }
  }
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10px;
  background: linear-gradient(135deg, #409EFF 0%, #337ecc 100%);
  border: none;
  margin-bottom: 24px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(64, 158, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

.register-section {
  text-align: center;
  padding: 20px 0;
  border-top: 1px solid #EBEEF5;
  color: #909399;

  .register-btn {
    color: #409EFF;
    font-weight: 500;
    font-size: 14px;

    &:hover {
      color: #66b1ff;
    }
  }
}

.social-login {
  margin-top: 30px;

  .divider {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #DCDFE6;
    }

    span {
      padding: 0 15px;
      color: #909399;
      font-size: 14px;
    }
  }

  .social-icons {
    display: flex;
    justify-content: center;
    gap: 20px;

    .social-icon {
      width: 44px;
      height: 44px;
      font-size: 20px;
      border: none;

      &.wechat {
        background: #07C160;
        color: white;

        &:hover {
          background: #06ad56;
        }
      }

      &.qq {
        background: #12B7F5;
        color: white;

        &:hover {
          background: #0da5dc;
        }
      }

      &.weibo {
        background: #E6162D;
        color: white;

        &:hover {
          background: #cf1429;
        }
      }
    }
  }
}

.register-dialog {
  ::v-deep .el-dialog {
    border-radius: 15px;
    overflow: hidden;

    &__header {
      background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
      padding: 20px;

      .el-dialog__title {
        color: white;
        font-size: 20px;
        font-weight: 600;
      }

      .el-dialog__close {
        color: white;
      }
    }

    &__body {
      padding: 30px;
    }
  }
}

.password-tips {
  margin-top: 20px;

  ::v-deep .el-alert {
    border-radius: 8px;
  }
}

.register-submit-btn {
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .login-wrapper {
    flex-direction: column;
  }

  .login-background {
    padding: 20px;

    .welcome-text {
      h1 {
        font-size: 32px;
      }

      p {
        font-size: 16px;
      }
    }
  }

  .login-card {
    width: 90%;
    margin: -60px auto 40px;
    padding: 30px 20px;
  }
}
</style>
