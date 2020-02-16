<template>
    <div id="feedback">
        <Card style="width: 90%;min-height: 500px;max-width: 600px" :shadow="true">
            <p slot="title">
                <Icon type="md-happy"></Icon>
                反馈建议
            </p>
            <Select v-model="selectedtype" style="width:100%;margin-bottom: 20px" placeholder="请选择留言类型，非常感谢您的意见,将尽快反馈">
                <Option v-for="item in messagetype" :value="item.id" :key="item.id">{{ item.typevalue }}</Option>
            </Select>
            <Input v-model.trim="subj" placeholder="请输入标题..." style="margin-bottom: 20px" :maxlength="32"/>
            <Input v-model.trim="mesv" type="textarea" :autosize="{minRows: 6,maxRows: 12}" placeholder="请输入建议反馈..."
                   style="margin-bottom: 30px" :maxlength="256"/>
            <Button type="success" long icon="md-checkmark-circle-outline" @click="sendmes">SUBMIT</Button>
        </Card>
    </div>
</template>

<script>
    import {createMessage} from '@/services/api'
    import {mapState} from 'vuex'

    export default {
        name: "FeedBack",
        data() {
            return {
                messagetype: [
                    {id: 1, typevalue: '留言'},
                    {id: 2, typevalue: 'bug提交'},
                    {id: 3, typevalue: '反馈'},
                ],
                selectedtype: null,
                mesv: '',
                subj: ''
            }
        },
        computed: {
            ...mapState({
                userinfo: 'userinfo',
            })
        },
        methods: {
            sendmes() {
                if (this.userinfo.username) {
                    if (this.selectedtype && this.mesv && this.subj) {
                        createMessage(
                            {
                                "message_type": this.selectedtype,
                                "subject": this.subj,
                                "content": this.mesv
                            }
                        ).then(res => {
                            this.$Message.success('您的反馈已收到，将尽快处理，谢谢←_←')
                        }).catch(err => {
                            console.log(err)
                        })
                    } else {
                        this.$Message.warning('无效输入，请检查')
                    }
                } else {
                    //没有登录的话，1：全局提醒，2：时间1s后到登录页面，并且加query：backurl
                    this.$Message.warning('请先登录')
                    setTimeout(() => {
                        this.$router.push({name: 'Login', query: {backurl: '/feedback'}})
                    }, 1000)
                }
            }
        }
    }
</script>

<style scoped>

    #feedback {
        background: #f6f5f7;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-family: 'Montserrat', sans-serif;
        position: relative;
        top: 20vh;
    }

</style>
