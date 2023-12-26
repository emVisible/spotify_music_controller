from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Room
from .serializers import (CreateRoomSerializer, RoomSerializer,
                          UpdateRoomSerializer)


'''
  查看所有已创建的房间
'''
class RoomView(generics.ListAPIView):
  queryset = Room.objects.all()
  serializer_class = RoomSerializer


'''
  获取房间
'''
class GetRoom(APIView):
  # 初始序列化器
  serializer_class = RoomSerializer
  # 用于查找房间的参数
  lookup_url_kwarg = 'code'
  '''
    获取房间所有信息
  '''
  def get(self,request, format=None):
    # 从请求的查询参数中获取房间的唯一标识符:code信息
    code = request.GET.get(self.lookup_url_kwarg)
    if code == None:
      return Response({'Bad request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)
    '''
      查询数据库，检查是否存在具有给定唯一标识符的房间
      如果找到匹配的房间, 将其序列化为JSON格式, 并添加一个额外的键值对 is_host,用于指示当前请求的用户是否是房间的主持人
    '''
    if len(room := Room.objects.filter(code=code)) > 0:
      data = RoomSerializer(room[0]).data
      data['is_host'] = self.request.session.session_key == room[0].host
      return Response(data, status=status.HTTP_200_OK)
    return Response({'Bad Request' : 'Invalid Room Code'}, status=status.HTTP_404_NOT_FOUND)


'''
  加入房间
'''
class JoinRoom(APIView):
  lookup_url_kwarg = 'code'

  def post(self, request, format=None):
    # 确保会话存在
    if not self.request.session.exists(self.request.session.session_key):
      self.request.session.create()

    code = request.data.get(self.lookup_url_kwarg)
    # 检查是否获取到Room唯一标识符
    if code != None:
      room_result = Room.objects.filter(code=code)
      # 检查code是否有效
      if len(room_result) > 0:
        room = room_result[0]
        # 如果有效, 存储code到session中, 便于后续访问
        self.request.session['room_code'] = code
        return Response({'message':'Room Joined!'}, status=status.HTTP_200_OK)
      return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'Bad Request': 'Invalid post data, did not find a code key'}, status.HTTP_400_BAD_REQUEST)


'''
  创建房间
'''
class CreateRoomView(APIView):
  serializer_class = CreateRoomSerializer

  def post(self, request, format=None):
    # 确保会话存在
    if not self.request.session.exists(self.request.session.session_key):
      self.request.session.create()

    # 序列化
    serializer = self.serializer_class(data=request.data)

    # 设置房间信息
    if serializer.is_valid():
      guest_can_pause = serializer.data.get('guest_can_pause')
      votes_to_skip = serializer.data.get('votes_to_skip')
      host = self.request.session.session_key
      queryset = Room.objects.filter(host=host)
      if queryset.exists():
        room = queryset[0]
        room.guest_can_pause = guest_can_pause
        room.votes_to_skip = votes_to_skip
        room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
        self.request.session['room_code'] = room.code
      else:
        room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
        room.save()
        self.request.session['room_code'] = room.code

      # 返回房间状态
      return Response(RoomSerializer(room).data, status=200)
    return Response({'Bad Request': 'Invalid data'}, status=400)


'''
  判断当前用户是否在房间内
'''
class UserInRoom(APIView):
  def get(self, request, format=None):
    if not self.request.session.exists(self.request.session.session_key):
      self.request.session.create()
    data = {
      'code': self.request.session.get('room_code')
    }
    return JsonResponse(data=data, status=200)


'''
  退出房间
'''
class LeaveRoom(APIView):
  def post(self, request, format=None):
    if 'room_code' in self.request.session:
      self.request.session.pop('room_code')
      host_id = self.request.session.session_key
      room_results = Room.objects.filter(host=host_id)
      if len(room_results) > 0:
        room = room_results[0]
        room.delete()
    return Response({"Message": "Success"}, status=200)


'''
  更新房间信息
'''
class UpdateRoom(APIView):
  serializer_class = UpdateRoomSerializer
  def patch(self, request, format=None):
    if not self.request.session.exists(self.request.session.session_key):
      self.request.session.create()
    serializer = self.serializer_class(data=request.data)
    # 设置房间信息
    if serializer.is_valid():
      guest_can_pause = serializer.data.get('guest_can_pause')
      votes_to_skip = serializer.data.get('votes_to_skip')
      code = serializer.data.get('code')

      queryset = Room.objects.filter(code=code)
      if not queryset.exists():
        return Response({'Message':'Room not fount'}, status=404)
      room = queryset[0]
      user_id = self.request.session.session_key
      if room.host != user_id:
        return Response({'Message':'You are not the host of this room'}, status=403)
      room.guest_can_pause = guest_can_pause
      room.votes_to_skip = votes_to_skip
      room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
      return Response(RoomSerializer(room).data, status=200)
    return Response({'Bad Request': 'Invalid data...'}, status=400)