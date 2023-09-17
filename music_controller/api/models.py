from django.db import models
import string
import random

'''
  创建Room的ID
'''
def generate_unique_code():
  length = 6
  while True:
    code = ''.join(random.choices(string.ascii_uppercase,k=length))
    if Room.objects.filter(code=code).count() == 0:
      break
  return code

'''
  Room model
'''
class Room(models.Model):
  # 设置default为generate_unique_code, 创建时自动生成唯一标识value
  code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
  # 只能有一个房间管理员
  host = models.CharField(max_length=50, unique=True)
  guest_can_pause = models.BooleanField(null=False, default=False)
  # default 设为正数
  votes_to_skip = models.IntegerField(null=False, default=1)
  # 自动添加创建时间
  created_at = models.DateTimeField(auto_now_add=True)
  current_song = models.CharField(max_length=50, null=True)
