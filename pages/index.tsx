import { useState, useEffect } from "react";
import type { NextPage } from "next";
import swal from "sweetalert";
import { auth } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import axios from "axios";

import { useAuthState } from "react-firebase-hooks/auth";

const Home: NextPage = () => {
  const [account, setAccount] = useState({
    email: "",
    password: "",
    name: "",
    role: "student",
  });
  const [show, setShow] = useState(false);

  const [user, loading] = useAuthState(auth);

  function handleInputs(e: React.ChangeEvent<HTMLInputElement>) {
    setAccount({
      ...account,
      [e.target.name]: e.target.value,
    });
  }

  async function CreateUser(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    await createUserWithEmailAndPassword(auth, account.email, account.password)
      .then(async (data) => {
        if (data.user) {
          const options = {
            method: "POST",
            url: `
              https://nica-source-api.herokuapp.com/api/users`,
            headers: { "Content-Type": "application/json" },
            data: {
              username: account.name,
              email: data.user.email,
              picture: "",
              role: account.role,
              uid: data.user.uid,
              subs: [],
              liked_videos: [],
              my_videos: [],
            },
          };
          return await axios
            .request(options)
            .then(function () {
              setShow(!show);
            })
            .finally(() => {
              swal("Good job!", "welcome", "success");
              window.location.replace("/dashboard");
            });
        }
      })
      .catch((e) => {
        swal("Someting went wrong", e.code, "error");
      });
  }

  function SignIn(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    signInWithEmailAndPassword(auth, account.email, account.password)
      .then((data) => {
        if (data) swal("Welcome", "", "success");
        window.location.replace("/dashboard");
      })
      .catch((e) => {
        swal("Someting went wrong", e.code, "error");
      });
  }

  return (
    <>
      {!loading && !user && (
        <div className="sign_up_page_container ">
          {!show && (
            <>
              <form className="form_container" onSubmit={CreateUser}>
                <span>Sign Up</span>
                <input
                  name="name"
                  placeholder="username"
                  onChange={handleInputs}
                />
                <input
                  name="email"
                  placeholder="email"
                  type="email"
                  onChange={handleInputs}
                />
                <input
                  name="password"
                  type="password"
                  placeholder="password"
                  onChange={handleInputs}
                />
                <button>Create Account</button>

                <span
                  onClick={() => {
                    setShow(!show);
                  }}
                >
                  <p>Have an account?</p>
                </span>
              </form>
            </>
          )}

          {show && (
            <>
              <form className="form_container" onSubmit={SignIn}>
                <span>Log In</span>
                <input
                  name="email"
                  placeholder="email"
                  type="email"
                  onChange={handleInputs}
                />
                <input
                  name="password"
                  type="password"
                  placeholder="password"
                  onChange={handleInputs}
                />
                <button>Sign In</button>

                <span
                  onClick={() => {
                    setShow(!show);
                  }}
                >
                  <p>Create an account</p>
                </span>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
