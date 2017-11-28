const express = require('express');
const router = express.Router();
const db = require('../models/db')//连接数据库
const User = require('../models/User')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/create',function (req,res,next) {
    // console.log(req.body)
    var newUser = new User();
    newUser.username = req.body.username;
    newUser.name = req.body.name;
    newUser.password = req.body.password;
    newUser.tel = req.body.tel;
    newUser.email = req.body.email;
    newUser.is_active = req.body.is_active;
    //判断一下，如果数据库存在相同的username，让用户重新填写
    User.findOne({"username":req.body.username},function (err,user) {
        if(user){
            return res.json({
                status:'1',
                message:'用户名已经存在，请重新填写！'
            })
        }else{
            newUser.save().then(data=>{
                res.json({
                    status:'0',
                    message:'success'
                })
            }).catch(err=>{
                res.json({
                    status:'1',
                    message:'err'
                })

            })
        }
    })
})
//获取所有的用户列表
router.get('/getUsers',function (req,res,next) {
    var page = parseInt(req.query.page);
    // console.log(page)
    var pageSize = parseInt(req.query.pageSize);
    // console.dir(req.query.pageSize)
    var skip = parseInt((page - 1) * pageSize);
    User.find({}).sort({'create_time':-1}).skip(skip).limit(pageSize).exec().then(users=>{
        if(users){
            User.count({},function (err,count) {
                return res.json({
                    status:'0',
                    userList:users,
                    count:count
                })
            })
        }
    }).catch(err=>{
        return res.json({
            status:'1',
            message:''
        })
    })
})
//删除一个用户
router.post('/delOne/:id',function (req,res,next) {
    var id = req.params.id;
    // console.log(id)
    User.findOne({"_id":id}).then(del=>{
        del.remove(id)
        return res.json({
            status:'0',
            message:'删除成功！'
        })
    }).catch(err=>{
        res.json({
            status:'1',
            message:'删除失败！'
        })
    })
})
//编辑一个用户
router.post('/updateUser',function (req,res,next) {
    User.findOne({'_id':req.body._id}).then(edit=>{
        edit.name = req.body.name;
        edit.tel = req.body.tel;
        edit.email = req.body.email;
        edit.is_active = req.body.is_active;
        edit.save().then(data=>{
            return res.json({
                status:'0',
                message:'修改成功!'
            })
        }).catch(err=>{
            return res.json({
                status:"1",
                message:'修改错误!'
            })
        })
    })
})
router.post('/deletes',function (req,res,next){
    let Data = req.body
    // console.log(Data)
    Data.forEach((data)=>{
        User.remove({'_id':data._id}).then(()=>{
            res.json({
                status: '0',
            })
        })
    })
})
module.exports = router;
