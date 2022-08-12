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

  const [UserData, setUserData] = React.useState([
    {
      id: null,
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

  const { user, loading } = UseContext();

  async function GetUser() {
    if (!loading) {
      const options = {
        method: "GET",
        url: `http://localhost:3000/api/users/`,
        headers: { "Content-Type": "application/json" },
      };
      return await axios.request(options).then((response) => {
        if (response.data) setUserData(response.data);
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

  async function SaveLikes(data: any, uid: string) {
    if (!loading) {
      console.log(uid);
      const options = {
        method: "PATCH",
        url: `http://localhost:3000/api/users/${UserData.id}`,
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
        url: `http://localhost:3000/api/videos/${id}`,
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

            {UserData.map((data) => {
              return (
                <>
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
                                  <span>likes: {data.liked_videos.length}</span>
                                  <span>id: {data.id}</span>
                                </span>
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                      </List>
                      <Stack direction="column" spacing={2}>
                        <Button
                          onClick={() => {}}
                          variant="outlined"
                          color="error"
                        >
                          suscribe
                        </Button>
                      </Stack>
                    </div> 
                  )}
                </>
              );
            })}
          </div>
          <div className="video_tool_card">
            <Typography>Video List</Typography>

            {videos.map((data) => {
              return (
                <>
                  <div key={data.id}>
                    <>
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
                    </>
                  </div>
                </>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
