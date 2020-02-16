import api from './http'


//登录
export const login = params => {
  return api.post(`login/`, params)
};
//注册
export const register = parmas => {
  return api.post(`users/`, parmas)
};


//获取分类信息
export const getCategory = params => {
  if ('slug' in params) {
    return api.get(`/categories/` + params.slug + '/');
  } else {
    return api.get(`/categories/`, params);
  }
};

//获取首页文章信息
export const getIndexPost = params => {
  return api.get(`/posts/`, {params: params})
};


//获取文章详情
export const getPostDetail = params => {
  return api.get(`/posts/` + params.id, params)
};
//创建文章
export const createPost = params => {
  return api.post('/posts/', params)
};
//更新文章
export const updatePost = params => {
  return api.put('/posts/' + params.id + '/', params)
};
//删除文章
export const deletePost = params => {
  return api.delete('/posts/' + params.id + '/', params)
};


// 获取 分类列表
export const getcategorylist = params => {
  return api.get('/categories/', params)
};
// 获取 标签列表
export const gettaglist = params => {
  return api.get('/tags/', params)
};

// 创建 新标签
export const createTag = params => {
  return api.post(`/tags/`, params)
};

// 图片上传  （单次图片）
export const postimgupload = params => {
  return api.post('/postimg/', params, {headers: {'Content-Type': 'multipart/form-data'},})
};


// 获取用户信息

export const getuserdetail = params => {
  return api.get('/users/' + params.username, params,)
};


//收藏
export const addFav = params => {
  return api.post('/userfavs/', params)
};

//取消收藏
export const delFav = postId => {
  return api.delete(`/userfavs/` + postId + '/')
};

export const getAllFavs = () => {
  return api.get(`/userfavs/`)
};

//判断是否收藏
export const getFav = postId => {
  return api.get(`/userfavs/` + postId + '/')
};


// 搜索

export const search = params=>{
  return api.get('/'+params.type+'/',{params:params.keyword})
}

// 投票
export const addVote = params => {
  return api.post('/uservote/', params)
};

export const getAllVote = () => {
  return api.get(`/uservote/`)
};

//更新
export const updateVote = params => {
  return api.put('/uservote/' + params.id + '/', params)
};


//获得评论列表
export const getComment = params =>{
   return api.get(`/comments/`, {params: params})
};

//创建评论

export const createComment = params => {
  return api.post('/comments/', params)
};


//删除评论
export const deleteComment = params => {
  return api.delete('/comments/' + params.id + '/', params)
};

//专题

//获得专题列表
export const getSubject = params =>{
     return api.get(`/topics/`, {params: params})
};

//获得专题详情
export const getSubjectDetail = params =>{
     return api.get(`/topics/` + params.urltag , params)
};


//获得某个专题章节目录

export const getChapterSummary = params =>{
     return api.get(`/chapters/`, {params: params})
};


// 章节详情

export const getChapter = params => {
  return api.get(`/chapters/` + params.id, params)
};

// 更新章节（patch更新顺序或者title因为md文件设置的必须）

export const updateChapter = params => {
  return api.patch(`/chapters/` + params.id+'/', params)
};

//反馈建议留言
export const createMessage = params => {
  return api.post(`/messages/` , params)
};


//获得关于信息

export  const  getinfo = params =>{
  return api.get(`/info/`+ params.id+'/', params)
}


//长网址转短网址
export const createShorturl = params =>{
    return api.post(`/dwz/` , params)
}
//短网址转长网址

export const getLongurl = params => {
  return api.get(`/dwz/` + params.arg, params)
};


// 获得个人资料
export const getProfile = params => {
  return api.get(`/users/` + params.username+'/', params)
};

// 更新资料profile
export const updateProfile = params => {
  return api.patch(`/users/` + params.username+'/', params)
};
