const express = require('express')
//path核心模块可以对路径进行操作
const path = require('path')
const app = express()
const router = require('./src/router/index.js')
const bodyParser = require('body-parser')
const session = require('express-session')
//path.join(__dirname,'./public/'))是将当前文件所处目录的绝对路径拼接到后面目录上，
//即将其相对路径转化成绝对路径。
app.use('/public/',express.static(path.join(__dirname,'./public/')))
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')))

app.engine('html',require('express-art-template'))
app.set('views',(path.join(__dirname,'./src/views/')))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


//在路由之前配置session中间件,使用此中间件可以使用req.session进行访问和设置session成员
app.use(session({
  secret: 'itcast',//配置加密session字符串
  resave: false,
  saveUninitialized: true
}))

app.use(router)
//全局错误处理中间件必须放在最后，即只有前面没有任何中间件匹配执行时，进入错误处理中间件
app.use((req,res) => {
  res.render('404.html')
})
app.use((err,req,res,next) => {
  res.status(500).json({
    err_code: 500,
    message: err.message
  })
})

app.listen(3000,() => {
  console.log('This project is running at 127.0.0.1:3000/ ')
})