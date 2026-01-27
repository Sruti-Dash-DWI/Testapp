import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IoMailOutline } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import PrimaryBackground from "../components/PrimaryBackground";
import { toast } from "react-toastify"; 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to decode JWT
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

function Login() {
  const navigate = useNavigate();

  const LoginSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email")
      // .matches(/@gmail.com$/, "Email must contain @gmail.com")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

 
  const navigateByRole = (role) => {
    switch (role) {
      case "ADMIN":
        navigate("/sa/projects");
        break;
      case "OWNER":
        navigate("/projects");
        break;
      case "DEVELOPER":
        navigate("/developer/projects");
        break;
      case "TESTER":
        navigate("/tester/projects");
        break;
      case "MANAGER":
        navigate("/pm/projects");
        break;
      case "SCRUM_MASTER":
        navigate("/sm/projects");
        break;
      default:
        navigate("/projects");
    }
  };

  // 🔹 Google Login
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;

      try {
        const response = await fetch(`${API_BASE_URL}/auth/google/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: accessToken }),
        });

        if (!response.ok) {
          throw new Error("Google login failed on the server.");
        }

        const data = await response.json();
        if (data.access && data.refresh && data.email && data.user_id) {
          localStorage.setItem('authToken', data.access);
          localStorage.setItem('refreshToken', data.refresh);
          localStorage.setItem('userEmail', data.email);
          localStorage.setItem('userId', data.user_id);
          if (data.role) localStorage.setItem('userRole', data.role);

          // ✅ Toast success
          toast.success(`Welcome back, ${data.email}!`);

          navigateByRole(data.role);
        } else {
          throw new Error("Auth tokens or user info missing in response after Google login.");
        }

      } catch (error) {
        toast.error("Error during Google login: " + error.message);
      }
    },
    onError: () => {
      toast.error('Google login failed. Please try again.');
    },
  });

  return (
    <PrimaryBackground>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-300 rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-shadow">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-indigo-700 mb-2">Welcome back!</h1>
            </div>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={async (values, { resetForm, setFieldError }) => {
                try {
                  const response = await fetch(`${API_BASE_URL}/token/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                  });

                  if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessage = errorData.non_field_errors?.[0] || "Login failed. Please check your credentials.";
                    setFieldError('email', errorMessage);
                    toast.error(errorMessage);
                    throw new Error("Login failed");
                  }

                  const data = await response.json();

                  if (data.access) {
                    localStorage.setItem('authToken', data.access);
                    //localStorage.setItem('firstName', data.first_name);
                    const decodedToken = parseJwt(data.access);
                    if (decodedToken && decodedToken.user_id) {
                      localStorage.setItem('userId', decodedToken.user_id);
                      if (data.refresh) localStorage.setItem('refreshToken', data.refresh);
                      if (data.email) localStorage.setItem('userEmail', data.email);
                      if (data.role) localStorage.setItem('userRole', data.role);

                      // ✅ Toast success
                      toast.success("Login successful!");

                      resetForm();
                      navigateByRole(data.role);
                    } else {
                      throw new Error("Invalid token received from server.");
                    }
                  } else {
                    throw new Error("Auth token not found in server response.");
                  }

                } catch (error) {
                  console.error("Login Error:", error);
                  toast.error("Something went wrong. Please try again.");
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  <button
                    type="button"
                    onClick={() => handleGoogleLogin()}
                    className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
                  >
                    <img
                      src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw"
                      alt="Google"
                      className="h-5 w-5"
                    />
                    <span className="font-medium">Continue with Google</span>
                  </button>

                  <div className="relative flex items-center justify-center my-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-sm text-gray-500">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Work Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IoMailOutline className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        className="w-full pl-10 pr-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter your email"
                      />
                    </div>
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <a href="#" className="text-sm text-indigo-600 hover:underline hover:text-indigo-800">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        className="w-full pl-10 pr-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter Password"
                      />
                    </div>
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors shadow-md hover:shadow-lg disabled:bg-indigo-400"
                  >
                    {isSubmitting ? "Logging In..." : "Log In"}
                  </button>

                  <p className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-indigo-600 hover:underline hover:text-indigo-800">
                      Sign up
                    </Link>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </PrimaryBackground>
  );
}

export default Login;
