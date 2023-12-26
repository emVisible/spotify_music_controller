from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID,CLIENT_SECRET,REDIRECT_URI
from requests import post, put, get

# 第三方API请求地址, 需要科学上网
BASE_URL = "https://api.spotify.com/v1/me"

'''
  获取用户Token
'''
def get_user_tokens(session_id):
  user_tokens = SpotifyToken.objects.filter(user=session_id)
  if user_tokens.exists():
    return user_tokens[0]
  else:
    return None


'''
  创建 & 更新用户Token
'''
def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
  # 获取用户Token, 设置过期时间
  tokens = get_user_tokens(session_id)
  expires_in = timezone.now() + timedelta(seconds=3600)

  # 如果token已经存在, 则更新token
  if tokens:
      tokens.access_token = access_token
      tokens.refresh_token = refresh_token
      tokens.expires_in = expires_in
      tokens.token_type = token_type
      tokens.save(update_fields=['access_token',
                                  'refresh_token', 'expires_in', 'token_type'])
  # 否则, 为用户创建token
  else:
      tokens = SpotifyToken(user=session_id, access_token=access_token,
                            refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
      tokens.save()


'''
  判断token是否过期
'''
def is_spotify_authenticated(session_id) ->bool:
  # 获取Token
  tokens = get_user_tokens(session_id=session_id)

  # 判断是否过期, 如果未过期则更新Token
  if tokens:
      expiry = tokens.expires_in
      if expiry <= timezone.now():
          refresh_spotify_token(session_id)
      return True
  return False


'''
  更新Token
'''
def refresh_spotify_token(session_id):
  refresh_token = get_user_tokens(session_id).refresh_token
  # 根据spotify token-api文档填post params
  response = post('https://accounts.spotify.com/api/token', data={
    'grant_type': 'refresh_token',
    'refresh_token': refresh_token,
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET
  }).json()

  # 获取数据, 更新token
  access_token = response.get('access_token')
  token_type = response.get('token_type')
  expires_in = response.get('expires_in')
  update_or_create_user_tokens(session_id=session_id, access_token=access_token, token_type=token_type, expires_in=expires_in, refresh_token=refresh_token)



'''
  向spotify发送请求
'''
def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
  tokens = get_user_tokens(session_id=session_id)
  print(f'{tokens}')
  headers = {'Content-Type':'application/json', 'Authorization': "Bearer " + tokens.access_token}
  if post_:
    post(BASE_URL + endpoint, headers=headers)
  elif put_:
    put(BASE_URL + endpoint, headers=headers)
  response = get(BASE_URL + endpoint,{}, headers=headers)
  try:
    return response.json()
  except:
    return {'Error': 'Issue with request'}

def play_song(session_id):
  return execute_spotify_api_request(session_id=session_id, endpoint='player/play', put_=True)

def pause_song(session_id):
  return execute_spotify_api_request(session_id=session_id, endpoint='player/pause', put_=True)

def skip_song(session_id):
  return execute_spotify_api_request(session_id=session_id, endpoint='player/next', post_=True)