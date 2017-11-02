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
          <el-table :data="userList" tooltip-effect="dark" style="width: 100%" >
            <el-table-column type="selection" width="55">

            </el-table-column>
            <el-table-column prop="username" label="用户名" width="120">

            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120" sortable>

            </el-table-column>
            <el-table-column prop="tel" label="电话">

            </el-table-column>
            <el-table-column prop="email" label="邮箱">

            </el-table-column>
            <el-table-column prop="create_time" label="注册日期" sortable>

            </el-table-column>
            <el-table-column prop="is_active" label="状态" width="75">
              <template slot-scope="scope">
                <el-tag type="success" size="mini" :type="scope.row.is_active ==true? 'success':'danger'">
                  {{scope.row.is_active|formatter}}
                </el-tag>
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
      <!--//分页-->
      <el-row>
        <el-col :span="24">
          <div class="block">
            <el-pagination
              layout="prev, pager, next"
              :total="total"
              :pageSize="5"
              @current-change="pageChange"
            >
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  <!--//弹出框-->
  <el-dialog title="添加新用户" :visible.sync="addDialog" @close="resetForm('addForm')">
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
    //组件渲染完毕之后调用getUsers，来获取所有的用户信息
    mounted:function(){
      this.getUsers();
    },
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
          userList:[],
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
          },
          total:0,
        }
      },
    methods:{
          //表单提交
      submitForm:function (formName) {
        this.$refs[formName].validate((valid)=>{
            if(valid){
                //提交
//              alert('提交成功！');
              axios.post('./users/create',this.addForm)
                .then((response)=>{
                    var res = response.data;
                    if(res.status == '0'){
                        //返回成功的信息
                      this.$message.success('新增用户成功！')
                      this.resetForm('addForm');
                      this.getUsers();
                    }else{
                        //返回了错误提示消息的时候
                      this.$message.error(res.message);
                    }
              }).catch((err)=>{
                console.log(err)
              })
            }else{
                return false;
            }
        })
      },
      //添加的弹出框
      resetForm:function(formName){
          //将弹出框关闭
          this.addDialog = false;
          //将弹出框清空
          this.$refs[formName].resetFields()
      },
      //获取数据
      getUsers:function (page) {
        axios.get('/users/getUsers',{
            //分页
            params:{
              page:page || 1,//当前页数
              pageSize:5 //每五条分一页
            }
        }).then(response=>{
            var res = response.data;
            this.userList = res.userList;
            this.total = res.count;
//            console.log(this.total)
        }).catch(err=>{
            console.log(err)
        })
      },
      //分页
      pageChange:function (value) {
        this.getUsers(value)
      },
      //删除的弹出框
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
  .block {
    margin-top: 30px;
    margin-right: 50px;
    float: right;
  }
</style>
