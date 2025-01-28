import React from "react";
import { useNavigate } from "react-router";
import Label from "../components/label";
import Button from "../components/button";
import BankImg from "../assets/icons/bank-building.png";
import HeartImg from "../assets/icons/heart.png";
import LightningImg from "../assets/icons/lightning.png";

const Welcome = () => {
  const navLinks = [
    {
      tab: "Home",
      pathname: "/",
    },
    {
      tab: "Sign up",
      pathname: "/signup",
    },
    {
      tab: "Login",
      pathname: "/login",
    },
  ];

  const navigate = useNavigate();
  return (
    <div>
      <div className="w-full">
        <nav className="w-full bg-gray-100 py-4 px-6 flex justify-start items-center">
          <Label
            label={`AWS Serverless SaaS Reference Architecture`}
            className="text-lg font-semibold"
          />
          <div className="space-x-4 text-gray-600 ml-8">
            <ul className="flex gap-x-4">
              {navLinks?.map((link, i) => {
                return (
                  <li
                    key={i}
                    className="hover:underline cursor-pointer duration-700"
                    onClick={() => navigate(link?.pathname)}
                  >
                    {link?.tab}
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="w-full flex flex-col items-center bg-gray-900 text-white text-center py-24">
          <Label
            label={`Serverless SaaS Reference Architecture`}
            className="!text-4xl font-bold !text-white"
          />
          <Label
            label={`It's so nice it blows your mind.`}
            className="mt-2 !text-lg !text-white mb-5"
          />
          <Button
            onClick={() => navigate("/signup")}
            buttonclassName={`bg-orange-500  text-white font-semibold rounded hover:bg-orange-600`}
            type="button"
          >{`Sign up now!`}</Button>
        </header>

        {/* Content Section */}
        <section className="w-full text-center py-12 px-6">
          <Label
            label={`Serverless SaaS Reference Architecture is so awesome.`}
            className="!text-2xl font-semibold"
          />
          <Label
            label={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Facere
            temporibus omnis illum, officia. Architecto voluptatibus commodi
            voluptatem perspiciatis eos possimus, eius at molestias quaerat
            magnam? Odio qui quos ipsam natus.`}
            className="mt-4 max-w-2xl mx-auto text-gray-600"
          />
        </section>
      </div>
      {/* section two  */}
      <div className="bg-gray-900 text-white">
        {/* Top Section */}
        <div className="flex justify-center space-x-8 py-12">
          <FeatureCard
            icon={LightningImg}
            text="Serverless SaaS Reference Architecture so awesome. Makes you awesome - go sign up!"
          />
          <FeatureCard
            icon={BankImg}
            text="Serverless SaaS Reference Architecture so great. Makes you even greater - go sign up now. Super cheap deal!"
          />
          <FeatureCard
            icon={HeartImg}
            text="Feel lonely? Go sign up and have a friend!"
          />
        </div>

        {/* Middle Section */}
        <div className="bg-gray-700 text-center py-12 px-6">
          <Label
            label={` Take Serverless SaaS Reference Architecture with you everywhere you
            go.`}
            className="!text-3xl text-white"
          />
          <Label
            label={`Serverless SaaS Reference Architecture is all you need. Anywhere -
            ever. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Expedita sapiente hic voluptatum quo sunt totam accusamus distinctio
            minus aliquid quis!`}
            className="mt-4 text-gray-300 max-w-2xl mx-auto"
          />
        </div>

        {/* Bottom Section */}
        <div className="bg-gray-100 text-gray-900 text-center py-12 px-6">
          <Label
            label={` “ Love Serverless SaaS Reference Architecture. So nice! So good!
            Could not live without!”`}
            className="!text-xl italic"
          />
          <Label
            label={`– Satisfied Customer`}
            className="mt-2 font-semibold"
          />
        </div>
        {/* third  */}
        <div className="bg-gray-600 text-center py-12 px-6">
          <Label
            label={`Reasons to sign up this product:`}
            className="!text-2xl font-semibold text-white"
          />
          <div className="flex justify-center space-x-12 mt-4">
            <ul className="text-left text-gray-300">
              <li>• It&apos;s the best</li>
              <li>• It&apos;s awesome</li>
              <li>• It makes you happy</li>
              <li>• It brings world peace</li>
              <li>• It&apos;s free!</li>
            </ul>
            <ul className="text-left text-gray-300">
              <li>• It&apos;s the best</li>
              <li>• It&apos;s awesome</li>
              <li>• It makes you happy</li>
              <li>• It brings world peace</li>
              <li>• It&apos;s free!</li>
            </ul>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-white flex flex-col items-center gap-y-4 text-gray-900 text-center py-12 px-6">
          <Label
            label={`Why you still reading?`}
            className="!text-2xl font-semibold"
          />
          <Button
            onClick={() => navigate("/signup")}
            buttonclassName={`bg-orange-500  text-white font-semibold rounded hover:bg-orange-600`}
            type="button"
          >{`Sign up now!`}</Button>
        </div>

        {/* Footer Section */}
        <div className="bg-gray-800 text-gray-300 text-center py-6 flex items-center flex-col">
          <div className="py-2 mb-2 flex gap-x-4">
            <Label label={`SaaS Factory`} className=" text-white" />
            <Label label={`Contact`} className=" text-white" />
            <Label label={`Mainpage`} className=" text-white" />
          </div>
          <Label
            label={`© 2022 AWS SaaS Factory. All rights reserved.`}
            className="text-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

function FeatureCard({ icon, text }) {
  return (
    <div className="bg-gray-800 p-6 flex flex-col gap-y-5 items-center rounded-lg max-w-xs">
      <img src={icon} className="h-[70px] max-h-[70px]" />
      <Label label={text} className="!text-gray-300" />
    </div>
  );
}

export default Welcome;
