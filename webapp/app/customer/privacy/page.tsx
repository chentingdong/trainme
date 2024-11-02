import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Privacy Statement and Policy</h1>
      <p className="mb-4">
        At [Your Company Name], we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this policy carefully. If you do not agree with the terms of this policy, please do not access the site.
      </p>
      <h2 className="text-2xl font-semibold mt-6">Information We Collect</h2>
      <p className="mb-4">
        We may collect information about you in a variety of ways, including:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the site or when you choose to participate in various activities related to the site, such as online chat and message boards.
        </li>
        <li>
          <strong>Derivative Data:</strong> Information our servers automatically collect when you access the site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the site.
        </li>
        <li>
          <strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the site.
        </li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-6">How We Use Your Information</h2>
      <p className="mb-4">
        We use the information we collect in the following ways:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>To facilitate account creation and logon process.</li>
        <li>To send you a confirmation email.</li>
        <li>To manage your account and provide you with customer support.</li>
        <li>To process your transactions and send you related information, including purchase confirmations and invoices.</li>
        <li>To send you marketing and promotional communications.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">Disclosure of Your Information</h2>
      <p className="mb-4">
        We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
        </li>
        <li>
          <strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">Tracking Technologies</h2>
      <p className="mb-4">
        We may use cookies, web beacons, tracking pixels, and other tracking technologies on the site to help customize the site and improve your experience. When you access the site, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the site.
      </p>

      <h2 className="text-2xl font-semibold mt-6">Third-Party Websites</h2>
      <p className="mb-4">
        The site may contain links to third-party websites and applications of interest, including advertisements and external services that are not affiliated with us. Once you leave our website, we cannot control the activities of these third parties. We encourage you to review the privacy policies of any third-party websites and applications before providing your personal information.
      </p>

      <h2 className="text-2xl font-semibold mt-6">Security of Your Information</h2>
      <p className="mb-4">
        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot guarantee its absolute security.
      </p>

      <h2 className="text-2xl font-semibold mt-6">Policy for Children</h2>
      <p className="mb-4">
        We do not knowingly solicit information from or market to children under the age of 13. If we learn that we have collected personal information from a child under age 13 without verification of parental consent, we will delete that information as quickly as possible. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.
      </p>

      <h2 className="text-2xl font-semibold mt-6">Options Regarding Your Information</h2>
      <p className="mb-4">
        You may at any time review or change the information in your account or terminate your account by:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Logging into your account settings and updating your account.</li>
        <li>Contacting us using the contact information provided below.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">Contact Us</h2>
      <p className="mb-4">
        If you have questions or comments about this Privacy Policy, please contact us at support@trainme.com
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;