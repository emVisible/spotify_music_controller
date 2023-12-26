# spotify音乐室
Django + React + material UI + spotify API构建的多人在线音乐室项目

- 基于投票的暂停 / 跳过 / 播放歌曲
- 第三方spotify API
- 基于轮询的歌曲信息获取
- OOP编程
- webpack打包 + django静态资源load链接前后端文件



## 项目启动

```
API_KEY配置
登录spotify, 将music_controller/spotify/credentials.py中的CLIENT_ID和CLIENT_SECRET更换为自己的数据
```

```
切换目录
$ cd ./music_controller

启动django
$ python manage.py runserver

* 需要先开启spotify的音乐播放, 后台轮询才可获取信息
```

```
切换目录
$ cd ./music_controller/frontend

安装依赖
$ yarn

启动react
$ yarn dev
```

如需添加新的app, 记得在music_controller/music_controller/settings.py中添加对应格式到INTALLED_APPS列表中

如需修改静态资源目录, 在settings中底部的STATIC_URL中修改，前端对应的HTML path也需要更改
