import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import GridBackground from "../components/GridBackground";
import * as Yup from "yup";
import { IoPersonOutline, IoMailOutline, IoBusinessOutline, IoGlobeOutline } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import PrimaryBackground from "../components/PrimaryBackground";
function Signup() {
  const navigate = useNavigate();

  const SignupSchema = Yup.object({
    first_name: Yup.string()
      .required("First name is required")
      .matches(/^[a-zA-Z]+$/, "First name must contain only letters"),
    last_name: Yup.string()
      .required("Last name is required")
      .matches(/^[a-zA-Z]+$/, "Last name must contain only letters"),
    organization_name: Yup.string()
      .required("Organization name is required"),
    organization_domain: Yup.string()
      .required("Organization domain is required"),
    email: Yup.string()
      .email("Invalid email")
      // Removed the @gmail.com restriction
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[!@#$%^&*]/, "Password must contain at least one special character")
      .matches(/^\S*$/, "Password should not contain spaces")
      .required("Password is required"),
  });

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

          alert(`Welcome! You are now logged in.`);
          navigate('/projects');
        } else {
          throw new Error("Auth tokens or user info missing in response after Google login.");
        }



      } catch (error) {
        alert("Error during Google login: " + error.message);
      }
    },
    onError: () => {
      alert('Google login failed. Please try again.');
    },
  });


  return (
    <GridBackground>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-300 rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-shadow">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-indigo-700 mb-2">
                Get more done, Faster
              </h1>
            </div>

          <Formik
            initialValues={{ first_name: "", last_name: "", email: "", password: "" }}
            validationSchema={SignupSchema}
            onSubmit={async (values, { resetForm, setFieldError }) => { 
              try {
                const response = await fetch(`${API_BASE_URL}/signup/admin/`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                });

                if (!response.ok) {
                  const errorData = await response.json();
                  if (errorData.email) {
                    setFieldError('email', errorData.email[0]);
                  } else if (errorData.non_field_errors) {
                    alert("Signup failed: " + errorData.non_field_errors[0]);
                  } else {
                    throw new Error("Signup failed. Please check your details.");
                  }
                  return; 
                }

               
                
                alert(`Signup successful for ${values.first_name}! Please log in.`);
                resetForm();

               
                navigate('/login');
                
              } catch (error) {
                alert("Error during manual signup: " + error.message);
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
                  <span className="flex-shrink mx-4 text-sm text-gray-500">
                    or
                  </span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <div className="w-full sm:w-1/2">
                      <label
                        htmlFor="first_name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center h-full">
                          <IoPersonOutline className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          id="first_name"
                          name="first_name"
                          type="text"
                          className="w-full pl-10 pr-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter first name"
                        />
                      </div>
                      <ErrorMessage
                        name="first_name"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                  <div className="w-full sm:w-1/2 mt-5 sm:mt-0">
                    <label
                      htmlFor="last_name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center h-full">
                        <IoPersonOutline className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        id="last_name"
                        name="last_name"
                        type="text"
                        className="w-full pl-10 pr-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter last name"
                      />
                    </div>
                    <ErrorMessage
                      name="last_name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Work Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center h-full">
                      <IoMailOutline className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className="w-full pl-10 pr-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Choose Password
                      </label>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center h-full">
                        <CiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        className="w-full pl-10 pr-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Minimum 8 characters"
                      />
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors shadow-md hover:shadow-lg disabled:bg-indigo-400"
                  >
                    {isSubmitting ? "Signing Up..." : "Sign Up free"}
                  </button>
                  <p className="text-center text-sm text-black">
                    By clicking the button above you agree to our{" "}
                    <a
                      href="#"
                      className="font-medium text-indigo-600 hover:underline hover:text-indigo-800"
                    >
                      Terms of Service
                    </a>
                    {/* </p>
                <p className="text-center text-sm text-black"> */}
                    <br></br>
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:underline hover:text-indigo-800">
                      Log in
                    </Link>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </GridBackground>
  );
}

export default Signup;