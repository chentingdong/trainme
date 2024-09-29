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
        <h1 className="text-white text-4xl md:text-6xl font-bold text-center px-4">
          Push Your Limits, Achieve Your Best – Every Step of the Way!
        </h1>
      </div>
    </div>
  );
};

export default Page;
