import React from "react";

const Page = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('/image.webp')`,
        padding: "-30px",
        margin: "-50px",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <h1 className="text-white font-extrabold text-center px-4 text-xl md:text-2xl lg:text-3xl leading-wide tracking-wide drop-shadow-lg">
          <span className="text-indigo-300">AI-powered Virtual Coach</span>
          <br />
          <br />
          <span>master with plan, race with heart.</span>
          <br />
        </h1>
      </div>
    </div>
  );
};

export default Page;
