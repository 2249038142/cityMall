const Router = require('koa-router')
let router = new Router()
const mongoose = require('mongoose')
router.get('/', async(ctx) => {
    ctx.body = "这是用户操作首页"
})
router.post('/register', async(ctx) => {
    console.log(ctx.request.body)
        //ctx.body = ctx.request.body
    const User = mongoose.model('User')
    let newUser = new User(ctx.request.body)
    await newUser.save().then(() => {
        ctx.body = {
            code: 200,
            message: '注册成功'
        }
    }).catch(error => {
        ctx.body = {
            code: 500,
            message: error
        }
    })
})
router.post('/login', async(ctx) => {
    //得到前端传递过来的数据
    let loginUser = ctx.request.body
    console.log(loginUser)
    let userName = loginUser.userName
    let password = loginUser.password
        //引入User的model
    const User = mongoose.model('User')
        //查找用户名是否存在，如果存在开始比对密码
    await User.findOne({ userName: userName }).exec().then(async(result) => {
        console.log(result)
        if (result) {
            //console.log(User)
            //当用户名存在时，开始比对密码
            let newUser = new User() //因为是实例方法，所以要new出对象，才能调用
            await newUser.comparePassword(password, result.passWord)
                .then((isMatch) => {
                    //返回比对结果
                    ctx.body = { code: 200, message: isMatch }
                })
                .catch(error => {
                    //出现异常，返回异常
                    console.log(error)
                    ctx.body = { code: 500, message: error }
                })
        } else {
            ctx.body = { code: 500, message: '用户名不存在' }
        }

    }).catch(error => {
        console.log(error)
        ctx.body = { code: 500, message: error }
    })
})
module.exports = router