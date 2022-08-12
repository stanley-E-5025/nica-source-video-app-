import * as React from "react";
import { UseContext } from "../../src/context/context.provider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

import axios from "axios";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
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

  const [VideoUpload, setVideoUpload] = React.useState({
    id: "",
    url: "",
    details: "",
    title: "",
    published: false,
    creation_date: "",
    uid: "",
  });

  const [VideoEdit, setVideoEdit] = React.useState({
    id: "",
    url: "",
    details: "",
    title: "",
    published: false,
    creation_date: "",
    uid: "",
  });
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { user, loading } = UseContext();

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setVideoUpload({
      ...VideoUpload,
      [e.target.name]: e.target.value,
    });
  }

  function handleInpuEdit(e: React.ChangeEvent<HTMLInputElement>) {
    setVideoEdit({
      ...VideoEdit,
      [e.target.name]: e.target.value,
    });
  }
  async function CreateVideos() {
    if (!loading) {
      const options = {
        method: "POST",
        url: `http://localhost:3000/api/videos`,
        headers: { "Content-Type": "application/json" },

        data: {
          url: VideoUpload.url,
          details: VideoUpload.details,
          title: VideoUpload.title,
          published: false,
          creation_date: new Date(),
          uid: user.uid,
          likes: [],
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
      });
    }
  }

  async function EditVideo(id: string) {
    handleOpen();

    if (!loading) {
      const options = {
        method: "PATCH",
        url: `http://localhost:3000/api/videos/${id}`,
        headers: { "Content-Type": "application/json" },

        data: {
          url: VideoEdit.url,
          details: VideoEdit.details,
          title: VideoEdit.title,
          published: false,
          creation_date: new Date(),
          uid: user.uid,
          likes: [],
        },
      };
      return await axios.request(options).then(() => {
        handleClose();
        GetVideos();
      });
    }
  }

  async function DeleteVideo(id: string) {
    if (!loading) {
      const options = {
        method: "DELETE",
        url: `http://localhost:3000/api/videos/${id}`,
        headers: { "Content-Type": "application/json" },
      };
      return await axios.request(options).then(() => {
        GetVideos();
      });
    }
  }
  React.useEffect(() => {
    GetVideos();
  }, [loading]);
  return (
    <>
      <div className="video_tool_card_create">
        <TextField
          onChange={handleInput}
          id="standard-basic"
          name="title"
          variant="standard"
          placeholder="title"
        />
        <TextField
          onChange={handleInput}
          id="standard-basic"
          name="url"
          variant="standard"
          placeholder="url"
        />

        <TextField
          onChange={handleInput}
          id="standard-basic"
          name="details"
          variant="standard"
          placeholder="details"
        />
        <Stack direction="row" spacing={2}>
          <Button
            onClick={() => {
              CreateVideos();
            }}
            variant="outlined"
            color="success"
          >
            Create
          </Button>

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
      </div>
      {!loading && user && (
        <div className="video_tool_card">
          <Typography>Video List</Typography>

          {videos.map((data) => {
            return (
              <>
                {data.uid === user.uid && (
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
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                        <Stack direction="row" spacing={2}>
                          <Button
                            onClick={() => {
                              handleOpen();
                            }}
                            variant="contained"
                            disableElevation
                          >
                            edit
                          </Button>

                          <Button
                            onClick={() => {
                              DeleteVideo(data.id);
                            }}
                            variant="outlined"
                            disableElevation
                          >
                            delete
                          </Button>
                        </Stack>

                        <Modal
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style}>
                            <TextField
                              onChange={handleInpuEdit}
                              id="standard-basic"
                              name="title"
                              variant="standard"
                              placeholder="title"
                            />
                            <TextField
                              onChange={handleInpuEdit}
                              id="standard-basic"
                              name="url"
                              variant="standard"
                              placeholder="url"
                            />

                            <TextField
                              onChange={handleInpuEdit}
                              id="standard-basic"
                              name="details"
                              variant="standard"
                              placeholder="details"
                            />

                            <Button
                              onClick={() => {
                                EditVideo(data.id);
                              }}
                              variant="contained"
                              disableElevation
                            >
                              edit
                            </Button>
                          </Box>
                        </Modal>
                      </List>

                      <Divider variant="middle" />
                    </>
                  </div>
                )}
              </>
            );
          })}
        </div>
      )}
    </>
  );
}