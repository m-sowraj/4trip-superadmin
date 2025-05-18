import React from "react";

const sections = [
  {
    title: "Interpretation",
    content: (
      <>
        <p>In this Privacy Policy, the terms:</p>
        <ul className="list-disc ml-6 mt-2">
          <li>
            <b>"You", "Your", or "User"</b> refer to the end user accessing the
            website or using our services.
          </li>
          <li>
            <b>"We", "Us", or "Our"</b> refer to ORBITRA TECHNOLOGIES LLP, its
            affiliates, and partners.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Legal Compliance",
    content: (
      <ul className="list-disc ml-6">
        <li>Section 43A of The Information Technology Act, 2000</li>
        <li>
          Regulation 4 of The Information Technology (Reasonable Security
          Practices And Procedures And Sensitive Personal Information) Rules,
          2011 (the "SPI Rules")
        </li>
        <li>
          Regulation 3(1) of The Information Technology (Intermediaries
          Guidelines) Rules, 2011
        </li>
      </ul>
    ),
  },
  {
    title: "What is Personal Information?",
    content: (
      <>
        <p>
          "Personal Information" is defined under the SPI Rules as any
          information that relates to a natural person, which, either directly
          or indirectly, in combination with other information available or
          likely to be available with a body corporate, is capable of
          identifying such a natural person.
        </p>
        <p className="mt-2">
          Information freely available in the public domain or accessible under
          laws like the Right to Information Act, 2005, is not considered
          sensitive personal data or information.
        </p>
        <p className="mt-2 font-semibold">
          Sensitive personal data or information includes, but is not limited
          to:
        </p>
        <ul className="list-disc ml-6">
          <li>Passwords</li>
          <li>
            Financial information (e.g., bank accounts, credit/debit card
            details)
          </li>
          <li>Physical, physiological, and mental health conditions</li>
          <li>Sexual orientation</li>
          <li>Medical records and history</li>
          <li>Biometric information</li>
          <li>Information provided under lawful contract</li>
          <li>Visitor details provided during registration</li>
          <li>Call data records</li>
        </ul>
      </>
    ),
  },
  {
    title: "Information We Collect",
    content: (
      <ul className="list-disc ml-6">
        <li>
          Personal Information: Name, address, contact number, and other data
          necessary for service delivery
        </li>
        <li>Optional Data: Some features may require additional details</li>
        <li>
          Device Information: Hardware model, operating system, unique device
          identifiers
        </li>
      </ul>
    ),
  },
  {
    title: "Usage of Collected Information",
    content: (
      <ul className="list-disc ml-6">
        <li>Provide relevant features and services</li>
        <li>Improve and personalize user experience</li>
        <li>Understand market trends</li>
        <li>
          Information will only be used as outlined in this Privacy Policy
          unless additional consent is obtained. Content shared on public forums
          may be read and used by others.
        </li>
      </ul>
    ),
  },
  {
    title: "Sharing of Personal Information",
    content: (
      <ul className="list-disc ml-6">
        <li>To provide service access</li>
        <li>To comply with legal requirements</li>
        <li>To prevent fraud</li>
        <li>During business transactions like mergers or acquisitions</li>
        <li>
          Third parties are required to maintain confidentiality under strict
          agreements.
        </li>
      </ul>
    ),
  },
  {
    title: "Securing Your Information",
    content: (
      <ul className="list-disc ml-6">
        <li>Regular reviews of data processing practices</li>
        <li>Strict confidentiality agreements for employees and agents</li>
        <li>Potential legal action for non-compliance</li>
      </ul>
    ),
  },
  {
    title: "Your Choices",
    content: (
      <ul className="list-disc ml-6">
        <li>Opt-out of communications</li>
        <li>Delete your account</li>
      </ul>
    ),
  },
  {
    title: "Consent",
    content: (
      <p>
        By using our website and providing personal information, you consent to
        the collection, use, and sharing of your data as described in this
        Privacy Policy. Content posted in public areas may be visible to other
        users.
      </p>
    ),
  },
  {
    title: "Electronic Record",
    content: (
      <p>
        This document is an electronic record in accordance with applicable
        Information Technology laws and does not require physical
        authentication. ORBITRA TECHNOLOGIES LLP may update this Privacy Policy
        periodically.
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
          Privacy Policy
        </h1>
        <h2 className="text-lg text-center text-gray-700 mb-8 font-semibold">
          of ORBITRA TECHNOLOGIES LLP
        </h2>
        <p className="text-base text-gray-700 mb-8 text-center">
          This Privacy Policy is meant to help you understand what information
          we collect, why we collect it, and how you can manage your
          information.
        </p>
        <nav className="flex flex-wrap justify-center gap-2 mb-10">
          {sections.map((section, idx) => (
            <a
              key={section.title}
              href={`#section-${idx}`}
              className="px-3 py-1 rounded text-indigo-700 hover:underline text-sm font-medium"
            >
              {section.title}
            </a>
          ))}
        </nav>
        <div className="space-y-10">
          {sections.map((section, idx) => (
            <section key={section.title} id={`section-${idx}`}>
              <h3 className="text-xl font-semibold text-indigo-800 mb-2">
                {section.title}
              </h3>
              <div className="text-gray-800 text-base leading-relaxed">
                {section.content}
              </div>
              {idx !== sections.length - 1 && (
                <div className="my-6 border-t border-gray-200"></div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
