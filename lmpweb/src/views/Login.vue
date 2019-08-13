<template>
  <div class="loginPage">
    <div class="logo">
      <img src="../assets/images/login/lofo.png">
    </div>
    <div class="loginText">
      <p>Litchi Managerment Platform login</p>
      <p>荔枝管理平台登录</p>
    </div>
    <el-form ref="form" :model="user" :rules="rules" :show-message="false">
      <div class="loginBox">

        <div class="title" >登录</div>

        <el-form-item  prop="username">
          <div class="loginCell">
            <input type="text" placeholder="用户名" class="user" v-model="user.username"/>
            <span class="errorTip" v-if="invalidFields['username']">{{invalidFields['username'][0].message}}</span>
        </div>
        </el-form-item>

        <el-form-item  prop="password">
          <div class="loginCell">
            <input type="password" placeholder="密码" class="password" v-model="user.password" autocomplete="off"  />
            <span class="errorTip" v-if="invalidFields['password']">{{invalidFields['password'][0].message}}</span>
          </div>
        </el-form-item>

        <el-form-item  prop="code">
          <div class="loginCell flex">
              <div class="flexItem">
                <input type="text" placeholder="验证码" v-model="user.code"  @keyup.enter="submitForm()"/>
              </div>
            <div @click="createCode">
              <identify :identifyCode="code" ></identify>
            </div>

          </div>
          <div class="errorTip" v-if="invalidFields['code']">{{invalidFields['code'][0].message}}</div>
        </el-form-item>

        <el-button :loading="loginLoading" type="primary" class="loginBtn"  @click="submitForm" @blur="focussubmit = false" v-focus="focussubmit">登录</el-button>

      </div>
    </el-form>
  </div>
</template>

<script>
  import Api from '../commom/api.js'
  import identify from '../components/identify.vue'
  let Base64 = require('js-base64').Base64;
export default {
  name: 'login',
  data() {
    var checkCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
      } else if ( value !== this.code ) {
        callback(new Error('验证码错误'));
      } else {
        callback();
      }
    };
    return {
      identifyCode: "",
      invalidFields: {},
      code:'',
      loginLoading:false,
      focusname:false,
      focuspassword:false,
      focuscode:false,
      focussubmit:false,
      user: {
        scope : 'ui',
        grant_type : 'password',
        username: '',
        password: '',
        code: '',
        client_secret: 'litchiStudio',
        client_id: 'browser',
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],
        code: [
          {validator: checkCode, trigger: 'blur'}
        ]
      }
    }
  },
  components: {identify},
  created(){
    this.createCode()
  },
  directives: {
    focus: {
      update: function (el, {value}) {
        if (value) {
          el.focus()
        }
      }
    }
  },
  methods:{
    // 验证码
    createCode(){
      this.code=''
      //验证码的长度
      var codeLength = 4;
      //随机数
      var random = new Array(0,1,2,3,4,5,6,7,8,9);
      for(var i = 0; i < codeLength; i++) {
        //取得随机数的索引（0~35）
        var index = Math.floor(Math.random()*10);
        //根据索引取得随机数加到code上
        this.code += random[index];
      }
    },
    // 回填
    userLogin(){
        let userLogin = localStorage.getItem('userLogin')
        if (this.checked) {
          if (userLogin) {
        userLogin = JSON.parse(localStorage.getItem('userLogin'))
        this.user.username = userLogin.username
        this.user.password = userLogin.password
        this.checked = true
            }
        }
        else{
          this.user.username =''
          this.user.password =''
        }

    },
    seeTable(){
      if(this.checked==false){
         this.user.username =''
          this.user.password =''
      }
    },
    //登录
    submitForm() {
      this.$refs.form.validate((valid, invalidFields) => {
        this.invalidFields = invalidFields
        if (valid) {
          if(this.checked==true){
        let userLogin = { username: this.user.username, password: this.user.password,checked: true}
        localStorage.setItem('userLogin', JSON.stringify(userLogin))
      }
          const redirect = this.$route.query.redirect
          this.loginLoading=true
          let config={
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization' : 'Basic YnJvd3Nlcjo='
            }
          }
          Api.login.post(this.user,config).then(res=> {
            localStorage.setItem('token',res.data.access_token)
            Api.userInfo.get().then(res=> {
              this.loginLoading=false
              let authorities= res.data.result.purviews.split(",");
              localStorage.setItem('user',JSON.stringify(res.data.result))
              localStorage.setItem('authorities',JSON.stringify(authorities))
              this.$router.push({name: 'index'})

            }).catch(err=>{
              this.loginLoading=false
              this.createCode()
            })
          }).catch(err=>{
            this.loginLoading=false
            this.createCode()
          })

        }
      })
    },
  }
};
</script>
<style lang="less" scoped>
  .loginPage{
      position: absolute;
      width: 100%;
      height: 100%;
      min-height: 900px;
      background: url('../assets/images/login/1.jpg') no-repeat center;
      background-size: cover;
      .login-down{
        float: right;
        display: block;
        color: #ffffff;
        margin-right: 28px;
        margin-top: 20px;
        img{
          width: 80px;
          height: 80px;
        }
      }
      .logo{
        position: absolute;
        left: 0px;
        top:0px;
        width: 213px;
        height: 127px;
        img{
          width: 213px;
          height: 127px;
        }
      }
      .loginBox{
        position: absolute;
        width: 495px;
        height: 573px;
        background:#FFFFFF;
        border-radius:12px;
        top:50%;
        left: 50%;
        margin-left: -247.5px;
        margin-top: -286.5px;
        box-sizing: border-box;
        padding: 0 66px;
        .errorTip{
          display: inline;
          font-size: 12px;
          color: #DA706C;
        }
        .title{
          width:60px;
          margin: 55px auto 30px;
          line-height: 1;
          padding-bottom: 8px;
          font-size: 27px;
          font-weight:bold;
          color:rgba(91,91,91,1);
          text-align: center;
          border-bottom: 2px solid #4D3E9A;
        }
        .loginCell{
          width: 360px;
          height: 36px;
          margin: 25px auto 0;
          line-height: 36px;
          padding-bottom: 14px;
          border-bottom: 1px solid #9D9D9E;
          input{
            color: #9D9D9E;
            font-size: 17px;
            height: 20px;
            line-height: 20px;
          }
          .user{
            width: 100%;
            background: url('../assets/images/login/yhm.png') no-repeat center right;
          }
          .password{
            width: 100%;
            background: url('../assets/images/login/mima.png') no-repeat center right;
          }
          .yzm{
            font-size: 17px;
            color: #9D9D9E;
            cursor: pointer;
          }

        }
        .loginBtn{
          width:363px;
          height:44px;
          background:#DA706C;
          margin: 57px auto 0;
          font-size:21px;
          font-weight:bold;
          color:rgba(255,255,255,1);
          text-align: center;
          border-radius: 20px;
          border: none;
        }
      }
      .loginText{
        position: absolute;
        left: 57px;
        top:46.11%;
        p{
          font-size: 35px;
          color: #FFFFFF;
          font-weight:400;
          line-height: 1;
          &:last-child{
            margin-top: 13px;
          }
        }
      }
  }
</style>
