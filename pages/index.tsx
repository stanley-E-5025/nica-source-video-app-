import { useState, useEffect } from "react";
import type { NextPage } from "next";
import swal from "sweetalert";
import { auth } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { UseContext } from "../src/context/context.provider";
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

  if (!loading && user !== null) {
    window.location.replace("/");
  }

  function handleInputs(e: React.ChangeEvent<HTMLInputElement>) {
    setAccount({
      ...account,
      [e.target.name]: e.target.value,
    });
  }

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    setAccount({
      ...account,
      [e.target.name]: e.target.value,
    });
  }
  function CreateUser(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, account.email, account.password)
      .then(async (data) => {
        console.log(data.user.uid);
        const options = {
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_DOMAIN}/api/users`,
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
        return await axios.request(options).then(function (response) {
          if (response) swal("Good job!", "welcome", "success");
          window.location.reload();
          setShow(!show);
        });
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
        window.location.reload();
      })
      .catch((e) => {
        swal("Someting went wrong", e.code, "error");
      });
  }

  async function Validate() {
    const user = await auth.currentUser;
    if (user) {
      window.location.replace("/dashboard");
    }
  }
  useEffect(() => {
    Validate();
  }, [SignIn, CreateUser]);
  return (
    <>
      {!loading && !user && (
        <div className="sign_up_page_container ">
          {!show && (
            <>
              <form className="sign_up_form_container" onSubmit={CreateUser}>
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

                <select name="role" onChange={handleSelect}>
                  <option value="student">Studen</option>
                  <option value="teacher">Teacher</option>
                </select>
                <button>Sign Up</button>
              </form>

              <button
                className="form_option"
                onClick={() => {
                  setShow(!show);
                }}
              >
                Have an account?
              </button>
            </>
          )}

          {show && (
            <>
              <form className="sign_up_form_container" onSubmit={SignIn}>
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
              </form>

              <button
                className="form_option"
                onClick={() => {
                  setShow(!show);
                }}
              >
                {"Let's create an account!"}
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
