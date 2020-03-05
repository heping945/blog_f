const Home = () => import('@/views/Home')
const notFound = () => import('@/views/notFound');
const Header = () => import('@/views/layout/Header');
const Footer = () => import('@/views/layout/Footer');
const Info = () => import('@/views/Info');
const IndexContent = () => import('@/views/index/IndexContent');
// const PostDetail = () => import('@/views/post/PostDetail');
const PostDetail = () => import(/* webpackChunkName:'postgroup' */ '@/views/post/PostDetail');
// const PostAdd = () => import('@/views/post/PostAdd');
const PostAdd = () => import(/* webpackChunkName:'postgroup' */ '@/views/post/PostAdd');
// const PostEdit = () => import('@/views/post/PostEdit');
const PostEdit = () => import(/* webpackChunkName:'postgroup' */ '@/views/post/PostEdit');
// const SubjectIndex = () => import('@/views/subject/SubjectIndex');
const SubjectIndex = () => import(/* webpackChunkName:'subjectgroup' */'@/views/subject/SubjectIndex');
// const SubjectContent = () => import('@/views/subject/SubjectContent');
const SubjectContent = () => import(/* webpackChunkName:'subjectgroup' */'@/views/subject/SubjectContent');
// const SubjectManage = () => import('@/views/subject/SubjectManage');
const SubjectManage = () => import(/* webpackChunkName:'subjectgroup' */'@/views/subject/SubjectManage');
const ArchiveContent = () => import('@/views/archive/ArchiveContent');
const UserContent = () => import(/* webpackChunkName:'accountsgroup' */'@/views/accounts/UserContent');
const UserActivities = () => import(/* webpackChunkName:'accountsgroup' */'@/views/accounts/UserActivities');
const UserPosts = () => import(/* webpackChunkName:'accountsgroup' */'@/views/accounts/UserPosts');
const SettingsContent = () => import(/* webpackChunkName:'accountsgroup' */'@/views/settings/SettingsContent');
const Profile = () => import(/* webpackChunkName:'accountsgroup' */'@/views/settings/Profile');
const Post = () => import(/* webpackChunkName:'settingsgroup' */'@/views/settings/Post');
const Account = () => import(/* webpackChunkName:'settingsgroup' */'@/views/settings/Account');
const Password = () => import(/* webpackChunkName:'settingsgroup' */'@/views/settings/Password');
const SearchContent = () => import('@/views/search/SearchContent');
const Login = () => import('@/views/auth/Login');
const FeedBack = () => import('@/views/feedback/FeedBack');
const DljIndex = () => import(/* webpackChunkName:'dwzgroup' */'@/views/dwz/DljIndex');
const Dwztolong = () => import(/* webpackChunkName:'dwzgroup' */'@/views/dwz/Dwztolong');


export default  [
    {
        path: '/',
        component: Home,
        redirect: {name: 'index'},
        children: [
            {
                path: '/timeline',
                name: 'index',
                components: {
                    header: Header,
                    content: IndexContent,
                    footer: Footer
                },
                meta: {
                    title: '首页'
                }
            },
            {
                path: '/:info(about|guide|version|recommend)',
                name: 'info',
                components: {
                    header: Header,
                    content: Info,
                    footer: Footer
                },
                meta: {
                    title: '信息'
                }
            },
            {
                path: '/post/add',
                name: 'postadd',
                components: {
                    header: Header,
                    content: PostAdd,
                    footer: Footer
                },
                meta: {
                    requireAuth: true,
                    title: '文章创建',

                }
            },
            {
                path: '/post/:id',
                name: 'postdetail',
                components: {
                    header: Header,
                    content: PostDetail,
                    footer: Footer
                },
                meta: {
                    title: '文章详情'
                }
            },
            {
                path: '/post/:id/edit',
                name: 'PostEdit',
                components: {
                    header: Header,
                    content: PostEdit,
                    footer: Footer
                },
                meta: {
                    requireAuth: true,
                    requireAuthor: true,
                    title: '文章修改'
                }
            },
            {
                path: '/archive',
                name: 'archive',
                components: {
                    header: Header,
                    content: ArchiveContent,
                    footer: Footer
                },
                meta: {
                    title: '分类'
                }
            },
            {
                path: '/topic',
                name: 'subjectindex',
                components: {
                    header: Header,
                    content: SubjectIndex,
                    footer: Footer
                },
                meta: {
                    title: '专题'
                }
            },
            {
                path: '/topic/:title/:id',
                name: 'subjectcontent',
                components: {
                    header: Header,
                    content: SubjectContent,
                    footer: Footer
                },
                meta: {
                    title: '专题'
                }
            },
            {
                path: '/topic/manage',
                name: 'subjectmanage',
                components: {
                    header: Header,
                    content: SubjectManage,
                    footer: Footer
                },
                meta: {
                    title: '专题管理',
                    requireAuth: true,
                }
            },
            {
                path: '/search',
                name: 'search',
                components: {
                    header: Header,
                    content: SearchContent,
                    footer: Footer
                },
                meta: {
                    title: '搜索'
                },
            },
            {
                path: '/user/:username',
                components: {
                    header: Header,
                    content: UserContent,
                    footer: Footer
                },
                children: [
                    {
                        path: '/',
                        name: 'userindex',
                        components: {
                            userdetail: UserActivities,
                        },
                        meta: {
                            title: '动态',
                        }
                    },
                    {
                        path: 'posts',
                        name: 'userposts',
                        components: {
                            userdetail: UserPosts,
                        },
                        meta: {
                            title: '用户文章',
                        }
                    },
                ]
            },
            {
                path: '/settings',
                components: {
                    header: Header,
                    content: SettingsContent,
                    footer: Footer
                },
                redirect: {name: 'settprofile'},
                meta: {
                    requireAuth: true,
                    dnotscroll: true

                },
                children: [
                    {
                        path: 'profile',
                        name: 'settprofile',
                        components: {
                            settingtab: Profile,
                        },
                        meta: {
                            title: '用户信息',
                            requireAuth: true,
                        }
                    },
                    {
                        path: 'posts',
                        name: 'settposts',
                        components: {
                            settingtab: Post,
                        },
                        meta: {
                            title: '文章管理',
                            requireAuth: true,
                        }
                    },
                    {
                        path: 'account',
                        name: 'account',
                        components: {
                            settingtab: Account,
                        },
                        meta: {
                            title: '账户关联',
                            requireAuth: true,
                        }
                    },
                    {
                        path: 'password',
                        name: 'password',
                        components: {
                            settingtab: Password,
                        },
                        meta: {
                            title: '密码修改',
                            requireAuth: true,
                        }
                    },
                ]
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            title: '登录'
        }
    },
    {
        path: '/FeedBack',
        name: 'FeedBack',
        component: FeedBack,
        meta: {
            title: '反馈交流'
        }
    },
    {
        path: '/dwz',
        name: 'dwz',
        component: DljIndex,
        meta: {
            title: '短链接'
        }
    },
    {
        path: '/t/:short_id',
        name: 't',
        component: Dwztolong,
        meta: {
            title: '跳转'
        }
    },
    {
        path: "/404",
        name: "notFound",
        component: notFound
    },
    {
        path: "*", // 此处需特别注意置于最底部
        redirect: "/404"
    }
]