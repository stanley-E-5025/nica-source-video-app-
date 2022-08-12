import * as React from "react";
import { UseContext } from "../../../src/context/context.provider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

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
      uid: ",",
      likes: [],
    },
  ]);

  const { user, loading } = UseContext();

  async function UpdateUser(ID: string) {
    if (!loading) {
      const options = {
        method: "PATCH",
        url: `http://localhost:3000/api/users/${ID}`,
        headers: { "Content-Type": "application/json" },

        data: {
          my_videos: true,
        },
      };
      return await axios.request(options).then(() => {
        GetVideos();
      });
    }
  }
  async function PublishVideo(ID: string) {
    if (!loading) {
      const options = {
        method: "PATCH",
        url: `http://localhost:3000/api/videos/${ID}`,
        headers: { "Content-Type": "application/json" },

        data: {
          published: true,
        },
      };
      return await axios.request(options).then(() => {
        GetVideos();
      });
    }
  }

  async function UnPublishVideo(ID: string) {
    if (!loading) {
      const options = {
        method: "PATCH",
        url: `http://localhost:3000/api/videos/${ID}`,
        headers: { "Content-Type": "application/json" },

        data: {
          published: false,
        },
      };
      return await axios.request(options).then(() => {
        GetVideos();
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
        console.log(videos.length);
      });
    }
  }

  React.useEffect(() => {
    GetVideos();
  }, [loading]);

  return (
    <>
      <div className="video_tool_card">
        <Typography>My Published videos</Typography>
        {videos.map((data) => {
          return (
            <div key={data.id}>
              {data.uid === user.uid && data.published && (
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
                            <span> {data.title}</span>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  </List>

                  <Stack direction="row" spacing={2}>
                    <Button
                      onClick={() => {
                        UnPublishVideo(data.id);
                      }}
                      variant="outlined"
                      color="error"
                    >
                      Unpublish
                    </Button>
                  </Stack>

                  <Divider variant="middle" />
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="video_tool_card">
        <Typography>My Unpublished videos</Typography>

        {videos.map((data) => {
          return (
            <div key={data.id}>
              {data.uid === user.uid && !data.published && (
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
                            <span> {data.title}</span>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  </List>

                  <Stack direction="row" spacing={2}>
                    <Button
                      onClick={() => {
                        PublishVideo(data.id);
                      }}
                      variant="outlined"
                    >
                      Publish
                    </Button>
                  </Stack>

                  <Divider variant="middle" />
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
