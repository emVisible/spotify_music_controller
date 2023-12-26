import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Alert } from "@material-ui/lab";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Collapse,
} from "@material-ui/core";

export default class CreateRoom extends Component {
  // defaultVotes = 2;
  static defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    updateCallback: () => { },
  };
  constructor(props) {
    super(props);
    this.state = {
      guestCanPause: this.props.guestCanPause,
      votesToSkip: this.props.votesToSkip,
      successMessage: "",
      errorMessage: "",
    };
    this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
    this.handleVotesChange = this.handleVotesChange.bind(this);
    this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
    this.handleUpdateButtonPresssed =
      this.handleUpdateButtonPresssed.bind(this);
  }
  // 投票跳过的数量
  handleVotesChange(e) {
    this.setState({
      votesToSkip: e.target.value,
    });
  }

  // 设置游客是否可以暂停
  handleGuestCanPauseChange(e) {
    this.setState({
      guestCanPause: e.target.value === "true" ? true : false,
    });
  }

  // 调用API 创建房间
  handleRoomButtonPressed() {
    const requestOption = {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
      }),
    };
    fetch("/api/create-room", requestOption)
      .then((res) => res.json())
      .then((data) => this.props.history.push("/room/" + data.code));
  }

  // 更新信息
  handleUpdateButtonPresssed() {
    const requestOption = {
      method: "PATCH",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
        code: this.props.roomCode,
      }),
    };
    fetch("/api/update-room", requestOption).then((res) => {
      if (res.ok) {
        this.setState({
          successMessage: "Room updated successfully!",
        });
      } else {
        this.setState({
          errorMessage: "Error updateding room...",
        });
      }
      this.props.updateCallback();
    });
  }
  renderCreateButtons() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={this.handleRoomButtonPressed}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  }
  renderUpdateButtons() {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={this.handleUpdateButtonPresssed}
        >
          Update Room
        </Button>
      </Grid>
    );
  }
  render() {
    const title = this.props.update ? "Update Room" : "Create A Room";
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Collapse in={this.state.errorMessage || this.state.successMessage}>
            {this.state.successMessage != ""
              ? (
                <Alert severity="success" onClose={() => {
                  this.setState({ successMessage: "" })
                }}>{this.state.successMessage}</Alert>
              )
              : (
                <Alert severity="error" onClose={() => {
                  this.setState({ errorMessage: "" })
                }}>{this.state.errorMessage}</Alert>
              )}
          </Collapse>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography component="h6" variant="h4">
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl component="fieldset">
            <FormHelperText>
              <div align="center">Guest Control of Playback State</div>
            </FormHelperText>
            <RadioGroup
              row
              defaultValue={this.props.guestCanPause.toString()}
              onChange={this.handleGuestCanPauseChange}
            >
              <FormControlLabel
                value="true"
                control={<Radio color="primary" />}
                label="Play/Pause"
                labelPlacement="bottom"
              />
              <FormControlLabel
                value="false"
                control={<Radio color="secondary" />}
                label="No Control"
                labelPlacement="bottom"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
            <TextField
              required={true}
              type="number"
              defaultValue={this.state.votesToSkip}
              onChange={this.handleVotesChange}
              inputProps={{
                min: 1,
                style: {
                  textAlign: "center",
                },
              }}
            />
            <FormHelperText>
              <div align="center"> Votes required to Skip Song</div>
            </FormHelperText>
          </FormControl>
        </Grid>
        {this.props.update
          ? this.renderUpdateButtons()
          : this.renderCreateButtons()}
      </Grid>
    );
  }
}
