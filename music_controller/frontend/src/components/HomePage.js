import React, { Component } from 'react';
import { Route, BrowserRouter, Routes, Link, Switch } from 'react-router-dom';
import { Button, Typography, ButtonGroup, Grid } from '@material-ui/core';
import RoomJoinPage from './RoomJoinPage'
import CreateRoomPage from './CreateRoomPage'
import Info from './Info';
import Room from './Room';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

export default class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomCode: null
    }
    this.clearRoomCode = this.clearRoomCode.bind(this)
  }

  // 通过hook获取room code
  async componentDidMount() {
    fetch('/api/user-in-room')
      .then(res => res.json())
      .then(data => {
        this.setState({
          roomCode: data.code
        })
        console.log(this.state.roomCode)
      })
  }

  
  // 渲染主页
  renderHomePage() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant='h3' component='h3'>
            House Party
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant='contained' color="primary">
            <Button color="primary" to="/join" component={Link}>
              Join A Room
            </Button>
            <Button color="default" to="/info" component={Link}>
              Info
            </Button>
            <Button color="secondary" to="/create" component={Link}>
              Create A Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    )
  }

  // 清空client room code && 在退出房间时自动调用
  clearRoomCode() {
    this.setState({
      roomCode: null
    })
  }

  // 渲染
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' render={() => {
            return this.state.roomCode
              ? (<Redirect to={`/room/${this.state.roomCode}`} />)
              : this.renderHomePage()
          }} ></Route>
          <Route path='/join' component={RoomJoinPage}></Route>
          <Route path='/info' component={Info}></Route>
          <Route path='/create' component={CreateRoomPage}></Route>
          <Route path='/room/:roomCode' render={(props) => {
            return <Room {...props} leaveRoomCallback={this.clearRoomCode}></Room>
          }}></Route>
        </Switch>
      </BrowserRouter>
    )
  }
}