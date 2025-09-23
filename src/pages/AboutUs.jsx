import React from "react";

const AboutUs = () => {
  return (
    <section id="about" className="min-h-screen bg-purple-100 flex flex-col justify-start px-6 md:px-20">
      {/* Top semicircle gradient */}
      <div className="absolute top left-1/2 transform -translate-x-1/2 w-96 h-48 rounded-b-full bg-gradient-to-b from-purple-500 to-transparent opacity-30"></div>
      {/* About Us Title - positioned at top center */}

      <div className="text-center mb-60">
        <h1 className="text-5xl md:text-6xl font-bold text-purple-800 text-about-heading mt-15 mb-8">
          About Us
        </h1>
      </div>

      <div className="grid md:grid-cols-2 items-center gap-50 max-w-5xl mx-auto">
        {/* Left Text Section */}
        <div>
          <h3 className="text-4xl font-semibold text-purple-800 mb-4">
            Who We Are
          </h3>
          <p className="text-gray-900 leading-relaxed  text-2xl">
            At Quotient, we believe productivity isn’t about doing more — it’s
            about working smarter. Our mission is to empower teams with
            intelligent tools that simplify work, foster collaboration, and turn
            ideas into impact.
          </p>
        </div>

        {/* Right Image Section */}
        <div className="relative">
          {/* dotted background behind image */}
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-[radial-gradient(circle,_#9ca3af_2px,_transparent_8px)] bg-[length:10px_10px] opacity-50"></div>
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
            alt="Team collaboration with laptop and coffee"
            className="relative z-10 w-full h-100 object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
