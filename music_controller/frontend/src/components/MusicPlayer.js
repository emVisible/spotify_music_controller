import { Grid, IconButton, LinearProgress, Typography } from "@material-ui/core";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import React, { Component } from "react";



export default class MusicPlayer extends Component {
  constructor(props) {
    super(props)
  }
  skipSong() {
    const requestOption = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
    fetch('/spotify/skip', requestOption)
  }
  pauseSong() {
    const requestOption = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }
    fetch('/spotify/pause', requestOption)
  }
  playSong() {
    const requestOption = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }
    fetch('/spotify/play', requestOption)
  }

  render() {
    const songProgress = (this.props.time / this.props.duration) * 100
    return (
      <Grid>
        <Grid container alignItems="center">
          <Grid item align="center" xs={4}>
            <img src={this.props.image_url} height="100%" width="100%"></img>
          </Grid>
          <Grid item align="center" xs={8}>
            <Typography component='h5' variant="h5">
              {this.props.title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {this.props.artist}
            </Typography>
            <div>
              <IconButton onClick={() => { this.props.is_playing ? this.pauseSong() : this.playSong() }}>
                {this.props.is_playing ? (<PauseIcon />) : (<PlayArrowIcon />)}
              </IconButton>
              <IconButton onClick={() => this.skipSong()}>
                {this.props.votes / this.props.votes_required}
                <SkipNextIcon />
              </IconButton>
            </div>
          </Grid>

        </Grid>
        <LinearProgress variant="determinate" value={songProgress}></LinearProgress>
      </Grid>
    )
  }
}
