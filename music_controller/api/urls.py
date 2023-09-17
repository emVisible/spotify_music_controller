from django.urls import path
from .views import RoomView, CreateRoomView, GetRoom, JoinRoom, UserInRoom, LeaveRoom,UpdateRoom


urlpatterns = [
  # 返回全部Room信息
  path('room', RoomView.as_view()),
  path('get-room',GetRoom.as_view()),

  # 创建 && 更新房间
  path('create-room', CreateRoomView.as_view()),
  path('update-room', UpdateRoom.as_view()),

  # 加入 && 离开房间
  path('join-room', JoinRoom.as_view()),
  path('leave-room', LeaveRoom.as_view()),

  # 用户是否在房间
  path('user-in-room', UserInRoom.as_view()),

]