import React from "react";

function Login() {
  return (
    <React.Fragment>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          window.location.href = "/";
        }}
      >
        {" "}
        Click here
      </button>
    </React.Fragment>
  );
}

export default Login;
