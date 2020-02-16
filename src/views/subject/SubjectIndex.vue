<template>
  <div class="p-container commonpositiontop">
    <Row>
      <Col :xs="24" :sm="24" :md="24" :lg="18">
        <div class="subjectindex">
          <Card>
            <List>
              <ListItem v-for="item in subjecttopic" :key="item.id" @click.native="tosubject(item)">
                <ListItemMeta :title="item.title" :description="item.desc"/>
                <template slot="action" v-if="item.reproduce">
                  <li>
                    <Icon type="ios-undo-outline" color="orange"/>
                  </li>
                </template>
              </ListItem>
            </List>
          </Card>
        </div>

      </Col>
      <Col :xs="0" :sm="0" :md="0" :lg="6">
        <SideBarRight></SideBarRight>
      </Col>
    </Row>
    <SuspensionPanel></SuspensionPanel>

  </div>
</template>

<script>
  import {getSubject} from '@/services/api'

  const SideBarRight = () => import('@/components/utils/SideBarRight')
  const SuspensionPanel = () => import('@/components/utils/SuspensionPanel')

  export default {
    name: "SubjectIndex",
    components: {
      SideBarRight,
      SuspensionPanel
    },
    data() {
      return {
        subjecttopic: []
      }
    },
    created() {
      this.initsubjectdata()
    },
    methods: {
      tosubject(i) {
        this.$router.push({name: 'subjectcontent', params: {title: i.urltag, id: i.get_first_id}})
      },
      initsubjectdata() {
        getSubject().then(res => {
          this.subjecttopic = res.data.results
        }).catch(err => {
          console.log(err.response)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @media (min-width: 992px) {
    .subjectindex {
      padding-right: 20px;
    }
  }

  .ivu-list-item {
    cursor: pointer;
  }
</style>
