<template>
    <div>
        <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80" label-position="left">
            <FormItem label="原密码" prop="password">
                <Input type="password" v-model="formCustom.password" clearable></Input>
            </FormItem>
            <FormItem label="新密码" prop="password2">
                <Input type="password" v-model="formCustom.password2" clearable></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formCustom')" :disabled="disabled">更改密码</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import {mapState,mapActions} from 'vuex'
    import {updatePassword} from '@/services/api'

    export default {
        name: "Password",
        data() {
            const validatePass = (rule, value, callback) => {
                if (value === '') callback(new Error('请输入原始密码'));
                callback();
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                } else if (value.length < 6 || value.length > 20) {
                    callback(new Error('密码长度不合规'));
                } else if (value == this.formCustom.password) {
                    callback(new Error('新密码不能与原密码相同'))
                } else {
                    callback();
                }
            };

            return {
                formCustom: {
                    password: '',
                    password2: '',
                },
                disabled: false,
                ruleCustom: {
                    password: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    password2: [
                        {validator: validatePassCheck}
                    ],
                }
            }
        },
        computed: {
            ...mapState(['userinfo'])
        },
        mounted() {
        },
        methods: {
            ...mapActions(['ClearToken']),
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.patchpassword();
                    } else {
                        this.$Message.error('请检查字段!');
                    }
                })
            },
            patchpassword() {
                this.formCustom['username'] = this.userinfo.username;
                this.disabled = true;
                this.patchdata()
                setTimeout(() => {
                    this.disabled = false
                }, 1000)
            },
            patchdata() {
                updatePassword(this.formCustom).then(res => {
                    console.log(res)
                    if (res.data.code === 666) {
                        this.$Message.success('更改成功请重新登录');
                        this.ClearToken()
                        setTimeout(()=>{
                            this.$router.push({name:'Login'})
                        },500)
                    } else {
                        this.$Message.error('密码验证错误请重试');
                    }
                }).catch(err => {
                    console.log(err)
                });
            }
        }
    }
</script>

<style scoped>

</style>
