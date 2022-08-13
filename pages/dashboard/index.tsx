import * as React from "react";
import { UseContext, LogOut } from "../../src/context/context.provider";
import axios from "axios";
import Videos from "../../src/components/video-creator";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { auth } from "../../firebase-config";

import { useAuthState } from "react-firebase-hooks/auth";

export default function Dashboard() {
  const [videos, setVideos] = React.useState([
    {
      id: "",
      url: "",
      details: "",
      title: "",
      published: false,
      creation_date: "",
      uid: "",
      likes: [],
    },
  ]);

  const [UserData, setUserData] = React.useState({
    id: null,
    username: "",
    email: "",
    picture: "",
    role: "",
    uid: "",
    subs: [],
    liked_videos: [],
    my_videos: [],
  });

  const [user, loading] = useAuthState(auth);

  if (!loading && !user) {
    window.location.replace("/");
  }

  async function GetUser() {
    if (!loading) {
      const options = {
        method: "GET",
        url: `http://localhost:3000/api/users/${user?.uid}`,
        headers: { "Content-Type": "application/json" },
      };
      return await axios.request(options).then((response) => {
        if (response.data) setUserData(response.data);

        if (UserData.id !== null) UpdateUser(response.data.id);
      });
    }
  }

  async function GetVideos() {
    if (!loading) {
      const options = {
        method: "GET",
        url: `http://localhost:3000/api/videos/`,
        headers: { "Content-Type": "application/json" },
      };
      return await axios.request(options).then((response) => {
        setVideos(response.data);
      });
    }
  }

  async function UpdateUser(id: string) {
    if (!loading) {
      if (videos !== []) {
        let count: string[] = [];
        videos.map((items) => {
          items.uid === user?.uid ? count.push(items.uid) : false;
        });
        console.log(count);
        const options = {
          method: "PATCH",
          url: `http://localhost:3000/api/users/${id}`,
          headers: { "Content-Type": "application/json" },
          data: {
            my_videos: count,
          },
        };
        return await axios.request(options).then((response) => {
          console.log(response);
        });
      }
    }
  }

  React.useEffect(() => {
    GetUser();
  }, [loading]);

  React.useEffect(() => {
    GetVideos();
  }, [loading]);

  return (
    <>
      {!loading && user && (
        <div className="dashboard_container">
          <div className="profile_text_inf">
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="Cindy Baker" src="" />
                </ListItemAvatar>
                <ListItemText
                  primary={UserData.username}
                  secondary={
                    <React.Fragment>
                      <span className="user_text">
                        <span>{UserData.email}</span>
                        <span> {UserData.role}</span>
                        <span>my_videos: {UserData.my_videos.length}</span>
                        <span>subs: {UserData.subs.length}</span>
                        <span>likes: {UserData.liked_videos.length}</span>
                        <span>id: {UserData.id}</span>
                      </span>
                    </React.Fragment>
                  }
                />
              </ListItem>
            </List>
            <Stack direction="column" spacing={2}>
              <Button
                onClick={() => {
                  window.location.replace("/videos");
                }}
                color="secondary"
              >
                Create & Edit{" "}
              </Button>
              <Button
                onClick={() => {
                  window.location.replace("/creators");
                }}
                color="secondary"
              >
                Explore videos & creators
              </Button>
              <Button
                onClick={() => {
                  LogOut();
                }}
                variant="outlined"
                color="error"
              >
                Log Out
              </Button>
            </Stack>
          </div>

          <div className="profile_text_inf">
            <Videos />
          </div>
        </div>
      )}
    </>
  );
}
