import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, IconButton } from "@material-ui/core";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { Link } from "react-router-dom";


const pages = {
  JOIN: 'pages.join',
  CREATE: 'pages.create'
}

export default function Info(props) {
  const [page, setPage] = useState(pages.JOIN)

  // const joinInfo = () => "Join Page"
  // const createInfo = () => "Create Page"
  function joinInfo(){
    return "Join Page"
  }
  function createInfo(){
    return "Create Page"
  }

  useEffect(() => {
    console.log("Run");
    return () => console.log("Over")
  })

  return (
    <Grid spacing={1} container>
      <Grid item xs={12} align="center">
        <Typography component='h4' variant="h4" >
          Introduction
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant='body1'>
          {page === pages.JOIN ? joinInfo() : createInfo()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <IconButton onClick={()=>page === pages.JOIN ? setPage(pages.CREATE) : setPage(pages.JOIN)}>
          {page === pages.JOIN ? (<NavigateBeforeIcon />) : (<NavigateNextIcon />)}
        </IconButton>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color='secondary' variant="contained" to='/' component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  )
}