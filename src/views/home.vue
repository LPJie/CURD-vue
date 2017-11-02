<template>
<div>
  <!--//首页的内容-->
  <el-container>
    <el-header>
      <h1>Vue + node + Element CURD项目</h1>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="24" style="text-align: right">
          <div style="margin-top: 20px">
            <el-button type="primary" size="mini" icon="el-icon-circle-plus" @click="addDialog=true">添加</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="delDialog=true">删除</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table :data="result" tooltip-effect="dark" style="width: 100%" >
            <el-table-column type="selection" width="55" sorttable>

            </el-table-column>
            <el-table-column prop="username" label="用户名" width="120" sorttable>

            </el-table-column>
            <el-table-column prop="name" label="姓名" width="80" sorttable>

            </el-table-column>
            <el-table-column prop="address" label="地址" sorttable>

            </el-table-column>
            <el-table-column prop="tel" label="电话" sorttable>

            </el-table-column>
            <el-table-column prop="email" label="邮箱" sorttable>

            </el-table-column>
            <el-table-column prop="create_date" label="注册日期" sorttable>

            </el-table-column>
            <el-table-column prop="is_active" label="状态" width="75">
              <template slot-scope="scope">
                <el-tag type="success" size="mini">{{scope.row.is_active}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button type="success" size="mini">编辑</el-button>
                  <el-button type="danger" size="mini">删除</el-button>
                </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  <!--//弹出框-->
  <el-dialog title="添加新用户" :visible.sync="addDialog">
    <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="addForm.username" autoComplete="off"></el-input>
      </el-form-item>
      <el-form-item label="姓 名" prop="name">
        <el-input type="text" v-model="addForm.name" autoComplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密 码" prop="password">
        <el-input type="text" v-model="addForm.password" autoComplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="repeat_password">
        <el-input type="text" v-model="addForm.repeat_password" autoComplete="off"></el-input>
      </el-form-item>
      <el-form-item label="电 话" prop="tel">
        <el-input type="type" v-model.number="addForm.tel" autoComplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮 箱" prop="email">
        <el-input type="text" v-model="addForm.email" autoComplete="off"></el-input>
      </el-form-item>
      <el-form-item label="是否启用" prop="is_active">
        <el-switch v-model="addForm.is_active"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
        <el-button @click="resetForm('addForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog title="删除" :visible.sync="delDialog" width="30%">
      <span><b>你确定删除所选用户？</b></span>
      <span slot="footer" class="dialog-footer">
         <el-button type="danger">确定</el-button>
         <el-button @click="delForm()">取消</el-button>
      </span>
  </el-dialog>
</div>
</template>
<script>
  import axios from 'axios'
  export default{
      name:'Home',
      data (){
          var checkPass = (rule,value,callback)=> {
              if(value == ''){
                  callback(new Error('密码不能为空！'))
              }else if(value !== this.addForm.password){
                callback(new Error('两次密码不一致！'));
              }else{
                callback();
              }
          }
        return{
            //用于收集新增用户的对象
          addForm:{
            username:'',//用户名
            name:'',//姓名
            password:'',//密码
            repeat_password:'',//确认密码
            tel:'',//电话
            email:'',//邮箱
            is_active:false//状态
          },
            //添加的对话框
          addDialog:false,
          //编辑的对话框
          delDialog:false,
            result:[
              {
                username:'zhangsan',
                name:"张三",
                address:'郑州市报国大厦',
                tel:14213454564,
                email:'125@qq.com',
                create_date:'2017/10/1',
                is_active:'激活'
              },
              {
                username:'lisi',
                name:"李四",
                address:'郑州市报国大厦',
                tel:1154545456,
                email:'123@qq.com',
                create_date:'2017/11/1',
                is_active:'激活'
              },
              {
                username:'wangwu',
                name:"王五",
                address:'郑州市报国大厦',
                tel:11545454546,
                email:'124@qq.com',
                create_date:'2017/11/6',
                is_active:'激活'
              }
            ],
          addRules:{
            username:[
              {required:true,message:'请输入用户名！',trigger:'blur'},
              {min:3,max:12,message:'请输入合法的字符,长度3-12位！',trigger:'blur'}
            ],
            name:[
              {required:true,message:'请输入姓名！',trigger:'blur'},
              {min:2,max:5,message:'请输入合法的名字!',trigger:'blur'}
            ],
            password:[
              {required:true,message:'请输入密码!',trigger:'blur'},
              {min:6,max:12,message:'请输入正确的密码!',trigger:'blur'}
            ],
            repeat_password:[
              {validator:checkPass,trigger:'blur'}
//              {required:true,message:'请再次输入密码！',trigger:'blur'},
//              {min:6,max:12,message:'请再次输入正确的密码！',trigger:'blur'}
            ],
            tel:[
              {required:true,type:'number',message:'请填写手机号码！',trigger:'blur'},
            ],
            email:[
              {required:true,type:'email',message:'请输入正确的邮箱',trigger:'blur'},
            ]
          }
        }
      },
    methods:{
          //表单提交
      submitForm:function (formName) {
        this.$refs[formName].validate((valid)=>{
            if(valid){
                //提交
//              alert('提交成功！');
              axios.post('./users/create',this.addForm).then(function (response) {
                console.log(response)
              }).catch(function (err) {
                console.log(err)
              })
            }else{
                return false;
            }
        })
      },
      resetForm:function(formName){
          //将弹出框关闭
          this.addDialog = false;
          //将弹出框清空
          this.$refs[formName].resetFields()
      },
      delForm:function () {
        this.delDialog = false;
      }
    }
  }
</script>
<style>
  h1 {
    text-align: center;
  }
</style>
