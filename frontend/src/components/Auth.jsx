import React, { useState } from "react";
import axios from "axios";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState("");

  //function to handle sign up and sign in
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isSignUp
        ? "http://localhost:4000/api/auth/signup"
        : "http://localhost:4000/api/auth/signin";
      const response = await axios.post(url, {
        username: email,
        password: password,
      });

      if (response.data.token) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setError("");
        window.location.reload();
      } else if (isSignUp) {
        window.location.reload();
        setIsSignUp(false);
        setError("Sign up successful! Please log in.");
      }
    } catch (error) {
      setError(
        error.response?.data?.msg || "Invalid credentials. Please try again."
      );
      console.error("Auth error:", error);
    }
  };

  return (
    <div className="flex w-full min-h-screen justify-center items-center bg-gray-950">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[400px] gap-3 p-10 rounded-md shadow-md bg-black/95"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email..."
          className="px-4 py-2 rounded-md text-white bg-gray-600 outline-none"
          autoComplete="false"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password..."
          className="px-4 py-2 rounded-md text-white bg-gray-600 outline-none"
        />

        <button
          className="bg-gray-800 px-4 py-2 rounded-md text-gray-600 font-medium"
          type="submit"
        >
          {isSignUp ? "Sign up" : "Login"}
        </button>
        <p
          className="text-gray-400 cursor-pointer"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </p>
        {error && <p className="text-red-600 font-medium">{error}</p>}
      </form>
    </div>
  );
};

export default Auth;
