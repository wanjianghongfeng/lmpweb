<template>
  <div class="zhsq-container">
      <div class="zhsq-aside">
        <el-menu
          class="zhsq-menu"
          :unique-opened="true"
          :router="true"
          :collapse="isCollapse"
          background-color="#384671"
          text-color="#FFFFFF"
          active-text-color="#409EFF"
          :default-active="active"
        >
          <el-menu-item class="title">
            <img src="../assets/images/commom/a.png">
            <span slot="title" >管理平台</span>
          </el-menu-item>

          <div v-for="item in this.treeListData">
          <el-submenu :index="String(item.id)" v-show="item.remark">
            <template slot="title"> 
              <img src="require(item.icon)">
              <span slot="title">{{item.name}}</span>
            </template>
           <el-menu-item  v-for="arr in item.chil" :index="arr.pageUrl" v-show="arr.remark">
            <template slot="title"> 
              <img :src="item.icon">
              <span slot="title">{{arr.name}}</span>
            </template>
          </el-menu-item>
          <!-- 三级菜单 -->
            <el-submenu v-for="arr in item.chil" :index="String(arr.id)" v-show="arr.pid">
            <template slot="title"> 
              <img src="require(arr.icon)">
              <span slot="title">{{arr.name}}</span>
            </template>
           <el-menu-item  v-for="third in arr.chil" :index="third.pageUrl">
            <template slot="title"> 
              <img :src="third.icon">
              <span slot="title">{{third.name}}</span>
            </template>
          </el-menu-item>
          </el-submenu>
          </el-submenu>
           <!-- 如果有只有一个子菜单显示这个 -->
          <el-menu-item :index="item.pageUrl" v-show="item.pid" @click.native="largeScreenjump(item.id)">
            <template slot="title"> 
              <img :src="item.icon">
              <span slot="title" style="fontSize:16px">{{item.name}}</span>
            </template>
          </el-menu-item>
          </div>

        </el-menu>
      </div>
      <div class="zhsq-body">
        <div class="zhsq-head">
          <div class="head-main">
            <ul class="clearfix head-info">
              <li class="userName">Hello {{userName}}</li>
              <li class="fullscreen-icon">
                <img src="../assets/images/commom/b.png">
              </li>
              <li>
                <el-dropdown  trigger="click" @command="handleCommand">
                  <img src="../assets/images/commom/d.png" class="dropdown">
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="pwd">修改密码</el-dropdown-item>
                    <el-dropdown-item command="logout">注销</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </li>
            </ul>
          </div>
        </div>
        <div class="zhsq-content">
          <div class="zhsq-bg"></div>
          <div class="zhsq-fluid">
            <router-view ></router-view>
          </div>
        </div>
        <div class="zhsq-footer">LitchiStudio</div>
      </div>
    <!--修改密码-->
      <el-dialog title="修改密码" :visible.sync="dialogFormVisible"   :modal-append-to-body='false' width="30%">
        <el-form ref="form" :model="model" :rules="rules" :show-message="false">
          <el-form-item prop="oldPwd" label="旧密码">
            <el-input type="password" v-model="model.oldPwd" value=""></el-input>
          </el-form-item>
          <el-form-item prop="newPwd" label="新密码">
            <el-input type="password" v-model="model.newPwd" value=""></el-input>
          </el-form-item>
          <el-form-item prop="confirmPwd" label="重复密码">
            <el-input type="password" v-model="model.confirmPwd" value=""></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<style lang="less">

  .zhsq-container{
    width: 100%;
    height: 100%;
    .zhsq-aside{
      .el-menu-item.is-active {
        background-color: rgb(45, 56, 90) !important;
      }
      position: fixed;
      width: 250px;
      height: 100%;
      left: 0;
      top:0;
      overflow:auto;
      background: #384671;
      transition: all .3s;
      -webkit-transition: all .3s;
      .title{
        height: 88px;
        line-height: 88px;
        font-size: 24px;
        background: rgba(45,56,90) !important;
      }
      .title:hover{
        background: rgba(45,56,90) !important;
      }
      .el-menu{
        border: none !important;
      }
      .el-submenu .el-menu-item{
        padding-left: 60px !important;
      }
      .el-submenu__title{
        font-size: 16px;
      }
      .el-menu-item img ,.el-submenu img{
        padding-right: 20px;
      }
      .el-menu-item.is-active {
        color: #fff;
      }
    }
    .zhsq-body{
      position: fixed;
      width: calc(100% - 250px);
      height: 100%;
      left:250px;
      .zhsq-content{
        position: absolute;
        top:88px;
        width: 100%;
        height: calc(100% - 144px);
        z-index: 1;
        background: #FFFFFF;
        overflow: auto;
        .zhsq-bg{
          position: absolute;
          top:0;
          left: 0;
          width: 100%;
          height: 287px;
          background:linear-gradient(90deg,rgba(219,112,108,1),rgba(77,62,154,1));
          z-index:1;
        }
        .zhsq-fluid{
          position: relative;
          width: 100%;
          height: calc(100% - 2px);
          box-sizing:border-box ;
          padding: 0 40px;
          z-index: 99;
        }
      }
      .zhsq-head{
        width: 100%;
        height: 88px;
        background:linear-gradient(90deg,rgba(219,112,108,1),rgba(77,62,154,1));
        z-index: 2;
        .head-main{
            text-align: right;
            padding-right: 40px;
            height: 88px;
            padding-top: 30px;
          .head-info>li{
            display: inline-block;
            color: #D76F6D;
            font-size: 18px;
            margin-left: 20px;
            cursor: pointer;
          }
          .head-info>li>img{
            vertical-align: middle;
            margin-top: -2px;
          }
          .head-info img.dropdown{
            vertical-align: middle;
            margin-top: -3px;
          }
        }
      }
      .zhsq-footer{
        position: absolute;
        width: 100%;
        height: 56px;
        line-height: 56px;
        bottom:0px;
        text-align: center;
        color:#999999;
        font-size: 16px;
      }
    }
  }

</style>

<script>
  import Api from '../commom/api.js'
  let Base64 = require('js-base64').Base64;
  import {cloneDeep,keys} from 'lodash'
  export default {
    data() {
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.model.newPwd) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        treeListData:[],
        src:"",
        organType:'',
        orgId:'',
        authorities:[],
        active:'',
        userName:'',
        model: {
          oldPwd: '',
          newPwd: '',
          confirmPwd: ''
        },
        userId:'',
        isCollapse: false,
        dialogFormVisible: false,
        loading: false,
        rules: {
          oldPwd: [{
            required: true,
            message: '请输入旧密码',
            trigger: 'blur'
          }],
          newPwd: [{
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          },{
            pattern: /^(?=.*[a-zA-Z])(?=.*[1-9])(?=.*[\W]).{8,}$/,
            trigger: 'blur',
            message: '密码以“字母+特殊字符+数字”组成组成，长度不少于8位',
          }],
          confirmPwd: [{
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          }, {
            validator: validatePass2,
            trigger: 'blur'
          }]
        },
        firstErr:null
      }
    },
    methods: {
      handleCommand(command) {
        if(command==='logout'){
          localStorage.setItem('user',null)
          localStorage.setItem('token','')
          localStorage.setItem('authorities',null)
          this.$router.push({name: 'login'})
        }
        if(command==='pwd'){
          this.dialogFormVisible=true
        }
      },
      async getRolePermissionsTreeIndex(){
        const data =await Api.getRolePermissionsTreeIndex.get({
        }).then(res=>res.data)
        
        this.treeListData=data.result
      
      for(let i=0;i<this.treeListData.length;i++){
        if(this.treeListData[i].chil){
          this.treeListData[i].remark=true
         this.treeListData[i].pid=false         
        for(let j=0;j<this.treeListData[i].chil.length;j++){
          if(this.treeListData[i].chil[j].pageUrl==""){
            this.treeListData[i].chil[j].remark=false
             this.treeListData[i].chil[j].pid=true
          }else{
            this.treeListData[i].chil[j].remark=true
            this.treeListData[i].chil[j].pid=false            
          }
        }
        }else{
        this.treeListData[i].remark=false
        this.treeListData[i].pid=true
        }
      } 
      },
      async submit() {
        await this.$refs.form.validate(async(valid, invalidFields) => {
          if (valid) {
            this.loading = true
            this.firstErr = null
            let model=cloneDeep(this.model);
            model.oldPwd=Base64.encode(model.oldPwd)
            model.newPwd=Base64.encode(model.newPwd)
            model.confirmPwd=Base64.encode(model.confirmPwd)
            await Api.changePwd.put(model,{pathParams: {userId: this.userId}})
              .then(res =>{
                this.loading = false
                this.dialogFormVisible=false
                this.$message({ message: '修改成功', type: 'success' })
              } ).catch(err => {
                this.loading = false
                throw err
              })

          } else {
            const firstKey = keys(invalidFields)[0]
            this.firstErr = invalidFields[firstKey][0]
          }
        })
      }
    },
    mounted(){
      this.userId=JSON.parse(localStorage.getItem('user')).id;
      this.userName=JSON.parse(localStorage.getItem('user')).name;
      this.organType=JSON.parse(localStorage.getItem('user')).organType;
      this.orgId=JSON.parse(localStorage.getItem('user')).organId;
      this.active=this.$route.fullPath;
      let authorities=JSON.parse(localStorage.getItem('authorities'))
    },
  }
</script>
