import { Button, Grid, Typography, } from '@material-ui/core'
import React, { Component } from 'react'
import CreateRoomPage from './CreateRoomPage'
import MusicPlayer from './MusicPlayer'

export default class Room extends Component {
  constructor(props) {
    super(props)
    this.roomCode = this.props.match.params.roomCode
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      showSettings: false,
      spotifyAuthenticated: false,
      song: {}
    }
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this)
    this.updateShowSettings = this.updateShowSettings.bind(this)
    this.renderSettings = this.renderSettings.bind(this)
    this.getRoomDetails = this.getRoomDetails.bind(this)
    this.renderSettingsButton = this.renderSettingsButton.bind(this)
    this.authenticateSpotify = this.authenticateSpotify.bind(this)
    this.getCurrentSong = this.getCurrentSong.bind(this)
    // 调用api, 获取房间信息
    this.getRoomDetails()
  }

  // DOM挂载后开始轮询
  componentDidMount(){
    this.interval = setInterval(this.getCurrentSong, 1000)
  }

  // 组件卸载前关闭轮询
  componentWillUnmount(){
    clearInterval(this.interval)
  }

  // 验证
  authenticateSpotify() {
    fetch('/spotify/is-authenticated')
      .then(res => res.json())
      .then(data => {
        this.setState({ spotifyAuthenticated: data.status })
        if (!data.status) {
          fetch('/spotify/get-auth-url')
            .then(res => res.json())
            .then(data => {
              window.location.replace(data.url)
            })
        }
      })
  }

  // 获取当前歌曲
  getCurrentSong() {
    fetch('/spotify/current-song')
      .then(res => {
        if (!res.ok){
          return {}
        } else {
          return res.json()
        }
      })
      .then (data => {
        this.setState({
          song:data
        })
      })
  }


  // 获取房间信息
  getRoomDetails() {
    fetch('/api/get-room' + '?code=' + this.roomCode)
      .then(res => {
        if (!res.ok){
          this.props.leaveRoomCallback()
          this.props.history.push("/")
        }
        return res.json()
      })
      .then(data => {
        console.log(data)
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host
        })
        if (this.state.isHost) {
          this.authenticateSpotify()
        }
      })
  }

  // 离开房间
  leaveButtonPressed() {
    const requestOption = {
      method: 'POST',
      headers: { 'Content-Type': "application/json" }
    }
    fetch('/api/leave-room', requestOption)
      .then(_res => {
        // 回调: pop当前房间room code
        this.props.leaveRoomCallback()
        this.props.history.push('/')
      })
  }

  // 更新isShow
  updateShowSettings(value) {
    this.setState({
      showSettings: value
    })
  }

  // 渲染房间设置
  renderSettings() {
    return (
      <Grid container spacing={1} >
        <Grid item xs={12} align="center">
          <CreateRoomPage update={true}
            votesToSkip={this.state.votesToSkip}
            guestCanPause={this.state.guestCanPause}
            roomCode={this.roomCode}
            updateCallback={this.getRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button variant='contained' color="secondary" onClick={() => {
            this.updateShowSettings(false)
          }}>
            Close
          </Button>

        </Grid>
      </Grid>
    )
  }
  renderSettingsButton() {
    return (
      <Grid item xs={12} align="center">
        <Button variant='contained' color="primary" onClick={() => {
          this.updateShowSettings(true)
        }}>
          Settings
        </Button>
      </Grid>
    )
  }
  render() {
    if (this.state.showSettings) {
      return (
        this.renderSettings()
      )
    }
      return (
        <Grid container spacing={1}>
          <Grid item xs={12} align="center">
            <Typography variant='h3' component='h3'>
              Code:{this.roomCode}
            </Typography>
          </Grid>
          <MusicPlayer {...this.state.song}/>
          {
            this.state.isHost
              ? this.renderSettingsButton()
              : null
          }
          <Grid item xs={12} align="center">
            <Button color="secondary" variant="contained" onClick={this.leaveButtonPressed}>
              Leave Room
            </Button>
          </Grid>
        </Grid>
      )
  }
}

