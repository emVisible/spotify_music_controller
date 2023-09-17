'''
  通过inherite ModelSerializer, 创建与DB Model相关的序列化器
  定义内部Meta类, 定义序列化器的元数据
  Meta中:
    model: 相关联的数据模型
    fields: 要序列化的字段数据
'''

from rest_framework import serializers
from .models import Room

# DefaultSerializer 获取全部房间数据
class RoomSerializer(serializers.ModelSerializer):
  class Meta:
    model = Room
    fields = ('id', 'code', 'host', 'guest_can_pause', 'votes_to_skip', 'created_at')

# CreatedSerializer 返回给前端渲染需要的数据guest_can_pause以及votes_to_skip
class CreateRoomSerializer(serializers.ModelSerializer):
  class Meta:
    model = Room
    fields = ('guest_can_pause', 'votes_to_skip')

# UpdateSerializer 返回更新房间所需的信息code, guest_can_pause以及votes_to_skip
class UpdateRoomSerializer(serializers.ModelSerializer):
  # 定义字符字段并设置验证器(无验证规则 允许任何字段通过)
  code = serializers.CharField(validators=[])
  class Meta:
    model = Room
    fields = ('guest_can_pause', 'votes_to_skip', 'code')