import React from 'react';
import { Card, Button } from 'flowbite-react';
import { SiCoffeescript } from "react-icons/si";

const PricingPage = () => {
  const plans = [
    {
      title: "Free",
      description: "Enjoy basic features at no cost:",
      features: [
        "Sync up to 3 months of Strava data",
        "Access to core AI training insights",
        "Basic activity tracking and analysis",
      ],
      note: "Good for most use cases, but limited to 3 months of data.",
      price: "$0",
      buttonText: "Enjoy",
      buttonClass: "btn-primary",
      icon: <SiCoffeescript className="w-4 h-4 mr-2" />,
      disabled: false,
      buttonLink: "/settings",
    },
    {
      title: "Basic",
      description: "Buy me a cup of coffee while we setup your Basic features.",
      features: [
        "Sync all historical data for comprehensive analysis",
        "Enhance AI personalization with complete activity history",
        "Sync all your history data for comprehensive analysis",
      ],
      note: "One-time donation to keep this site running and improve your experience.",
      price: "$5",
      priceNote: "/one-time",
      buttonText: "Buy me a coffee",
      buttonLink: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK,
      buttonClass: "btn-coffee",
      icon: <SiCoffeescript className="w-4 h-4 mr-2" />,
      disabled: true,
    },
    {
      title: "Premium",
      description: "Subscribe to unlock premium features.",
      features: [
        "Access to all Basic features",
        "Personalize training plans based on your choices of books or articles",
        "Early access to beta features",
        "Priority for new feature requests",
      ],
      price: "$10",
      priceNote: "/month",
      buttonText: "Subscribe",
      buttonClass: "btn-primary",
      disabled: true,
    },
    {
      title: "Design Partner",
      description: "Become a design partner and shape the future of the app:",
      features: [
        "Access to all premium features",
        "Priority for new feature requests",
        "Early access to beta features",
        "Direct communication channel with the development team",
        "Build your coaching career with your athletes/team.",
      ],
      note: "Help us innovate and tailor the app to your needs.",
      price: "$25",
      priceNote: "/month",
      buttonText: "Contact Us",
      buttonLink: "#", // Replace with actual link when available
      buttonClass: "btn-partner",
      disabled: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">Choose Your Plan</h1>
      <div className="grid md:grid-cols-4 gap-4 justify-center">
        {plans.map((plan, index) => (
          <Card key={index} className="shadow-lg rounded-lg p-6 dark:bg-gray-800 flex flex-col justify-between h-full">
            <div className="mb-4">
              <h5 className="text-xl font-semibold tracking-tight text-gray-800 dark:text-white">
                {plan.title}
              </h5>
            </div>
            <div className="card-body flex-grow">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {plan.description}
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4">
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              {plan.note && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {plan.note}
                </p>
              )}
            </div>
            <div className="card-footer flex flex-col items-center">
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
                {plan.price} {plan.priceNote && <span className="text-lg font-normal text-gray-500">{plan.priceNote}</span>}
              </p>
              <Button
                className={`w-full btn ${plan.buttonClass} ${plan.disabled ? "btn-disabled" : ""}`}
                href={plan.disabled ? "#" : plan.buttonLink}
                disabled={plan.disabled}
              >
                {plan.icon}
                {plan.buttonText}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
