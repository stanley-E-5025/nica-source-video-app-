import * as React from "react";
import { UseContext } from "../../src/context/context.provider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import axios from "axios";

import { auth } from "../../firebase-config";

import { useAuthState } from "react-firebase-hooks/auth";
export default function Videos() {
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

  const [UserList, setUserList] = React.useState([
    {
      id: "",
      username: "",
      email: "",
      picture: "",
      role: "",
      uid: "",
      subs: [],
      liked_videos: [],
      my_videos: [],
    },
  ]);
  const [user, loading] = useAuthState(auth);

  async function GetUser() {
    if (!loading) {
      const options = {
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/api/users/`,
        headers: { "Content-Type": "application/json" },
      };
      return await axios.request(options).then((response) => {
        if (response.data) {
          setUserData(response.data);
          setUserList(response.data);
        }
      });
    }
  }

  async function GetVideos() {
    if (!loading) {
      const options = {
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/api/videos/`,
        headers: { "Content-Type": "application/json" },
      };
      return await axios.request(options).then((response) => {
        setVideos(response.data);
      });
    }
  }

  async function SaveLikes(data: any, uid: string) {
    if (!loading) {
      const options = {
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/api/users/${uid}`,
        headers: { "Content-Type": "application/json" },
        data: { liked_videos: data, my_videos: [videos.length] },
      };

      axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }

  async function LikeVideos(id: string, data: any, user: string) {
    if (!loading) {
      const options = {
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/api/videos/${id}`,
        headers: { "Content-Type": "application/json" },

        data: {
          likes: [...data.likes, user],
        },
      };
      const toSave = [...data.likes, user];
      return await axios.request(options).then(() => {
        SaveLikes(toSave, id);
        GetVideos();
      });
    }
  }

  async function SuscribeToCreator(id: string, data: any) {
    if (!loading) {
      const options = {
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/api/users/${id}`,
        headers: { "Content-Type": "application/json" },
        data: {
          subs: [...data, id],
        },
      };

      axios
        .request(options)
        .then(function () {
          GetUser();
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }

  React.useEffect(() => {
    GetVideos();
  }, [loading]);

  React.useEffect(() => {
    GetUser();
  }, [loading]);
  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button
          onClick={() => {
            window.location.replace("/dashboard");
          }}
          variant="outlined"
          color="error"
        >
          Go back to dashboard
        </Button>
      </Stack>
      {!loading && user && (
        <>
          <div className="video_tool_card">
            <Typography>Creators</Typography>

            {UserList.map((data) => {
              return (
                <div key={data.id}>
                  {data.uid !== user.uid && (
                    <div className="profile_text_inf">
                      <List
                        sx={{
                          width: "100%",
                          maxWidth: 360,
                          bgcolor: "background.paper",
                        }}
                      >
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar alt="Cindy Baker" src="" />
                          </ListItemAvatar>
                          <ListItemText
                            primary={data.username}
                            secondary={
                              <React.Fragment>
                                <span className="user_text">
                                  <span>{data.email}</span>
                                  <span> {data.role}</span>
                                  <span>
                                    my_videos: {data.my_videos.length}
                                  </span>
                                  <span>subs: {data.subs.length}</span>
                                  <span>id: {data.id}</span>
                                </span>
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                      </List>
                      <Stack direction="column" spacing={2}>
                        <Button
                          onClick={() => {
                            SuscribeToCreator(data.id, data.subs);
                          }}
                          variant="outlined"
                          color="error"
                        >
                          suscribe
                        </Button>
                      </Stack>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="video_tool_card">
            <Typography>Video List</Typography>

            {videos.map((data) => {
              return (
                <div key={data.id}>
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                    }}
                  >
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={data.title}
                        secondary={
                          <React.Fragment>
                            <span>{data.url}</span>
                            <span> {data.details}</span>
                            <span> {data.creation_date}</span>

                            <span> {data.uid}</span>
                          </React.Fragment>
                        }
                      />
                    </ListItem>

                    <Typography>Likes: {data.likes.length}</Typography>

                    <Stack direction="row" spacing={2}>
                      <Button
                        onClick={() => {
                          LikeVideos(data.id, data, user.uid);
                        }}
                        variant="outlined"
                        disableElevation
                      >
                        Like
                      </Button>
                    </Stack>
                  </List>

                  <Divider variant="middle" />
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
