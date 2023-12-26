import { Button, Grid, TextField, Typography, } from '@material-ui/core'
import React, { Component } from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'


export default class RoomJoinPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomCode: "",
      error: ""
    }
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this)
    this.roomButtonPressed = this.roomButtonPressed.bind(this)
  }
  render() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h6">
            Join A Room
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <TextField
            error={this.state.error}
            label="Code"
            placeholder="Enter a room Code"
            value={this.state.roomCode}
            helperText={this.state.roomCode}
            variant="outlined"
            onChange={this.handleTextFieldChange}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button variant="contained" color="primary" onClick={this.roomButtonPressed} >
            Enter Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button variant="contained" color="secondary" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    )
  }

  // 表单输入监听
  handleTextFieldChange(e) {
    this.setState({
      roomCode: e.target.value
    })
  }

  // 加入房间
  roomButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        code: this.state.roomCode
      })
    }
    // 调用join-room api, 加入房间
    fetch('/api/join-room', requestOptions)
      .then(res => {
        if (res.ok) {
          console.log(res)
          // 添加到router history中
          this.props.history.push(`/room/${this.state.roomCode}/`)
        } else {
          this.setState({
            error: "Room not found"
          })
        }
      }).catch(error => {
        console.log(error)
      })
  }
}