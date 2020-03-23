const express = require('express')
const md5 = require('blueimp-md5')
const router = express.Router()
//导入数据模型
const User = require('../DBModels/user')

router.get('/',(req,res,next) => {
  res.render('index.html', {
    user: req.session.user
  })
})

router.get('/login',(req,res,next) => {
  res.render('login.html')
})

router.post('/login',(req,res,next) => {
  const body = req.body
  User.findOne({
    email: body.email,
    password: md5(md5(body.password))
  },(err,user) => {
    if(err) {
      return next(err_code)
    }
    if(!user) {
      return res.status(200).json({
        err_code: 1,
        message: "Email or password is invalid"
      })
    }
    //登录成功，记录登录状态
    req.session.user = user 
    res.status(200).json({
      err_code: 0,
      message: 'ok'
    })
  })
})

router.get('/register',(req,res,next) => {
  res.render('register.html')
})


//提交表单数据到数据库
router.post('/register',(req,res,next) => {
  User.findOne({
    $or: [
      {email: req.body.email},
      {nickname : req.body.nickname}
     ]
    },(err,data) => {
    if(err) {
      return next(err_code)
    }
    if(data) {
      //说明查询到同名/同email的用户
      return res.status(200).json({
        err_code: 1,
        message: '邮箱或昵称已经存在'
      })
    }
    //对密码进行加密
    req.body.password = md5(md5(req.body.password))
    new User(req.body).save((err,user) => {
      if(err) {
        return next(err_code)
      }
      req.session.user = user
      res.status(200).json({
        err_code: 0,
        message: 'ok'
      })
    })
  })
})

router.get('/logout',(req,res,next) => {
  req.session.user = null,
  res.redirect('login')
})

module.exports = router
