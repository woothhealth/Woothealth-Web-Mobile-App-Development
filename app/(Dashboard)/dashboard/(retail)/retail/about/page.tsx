"use client";

import { useState } from "react";
import faqData from "../../../../../../data/about.json";
import React from "react";

type Step = {
  step: number;
  title: string;
  whatYouDo: string[];
  behindTheScenes: string[];
  outcome: string;
};

type Section = {
  id: number;
  heading: string;
  content?: string;
  highlights?: string[];
  steps?: Step[];
  subsections?: {
    title: string;
    points: string[];
  }[];
  points?: string[];
  closing?: string;
  actions?: string[];
};

type Props = {
  data: {
    title: string;
    tagline: string;
    introduction: string;
    sections: Section[];
  };
};

const About = ({ data }: Props) => {
  
  return (

    <div>About div</div>
    // <main className="max-w-7xl mx-auto px-4 py-12 space-y-16">
    //   {/* HERO */}
    //   <section>
    //     <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
    //     <p className="text-xl text-gray-700 mb-4">{data.tagline}</p>
    //     <p className="text-gray-600 max-w-3xl">
    //       {data.introduction}
    //     </p>
    //   </section>

    //   {/* SECTIONS */}
    //   {data.sections.map((section) => (
    //     <section key={section.id} className="space-y-6">
    //       <h2 className="text-2xl font-semibold">
    //         {section.heading}
    //       </h2>

    //       {section.content && (
    //         <p className="text-gray-700 max-w-3xl">
    //           {section.content}
    //         </p>
    //       )}

    //       {/* HIGHLIGHTS */}
    //       {section.highlights && (
    //         <ul className="grid sm:grid-cols-2 gap-4 list-disc list-inside">
    //           {section.highlights.map((item, idx) => (
    //             <li key={idx} className="text-gray-700">
    //               {item}
    //             </li>
    //           ))}
    //         </ul>
    //       )}

    //       {/* STEPS */}
    //       {section.steps && (
    //         <div className="space-y-8">
    //           {section.steps.map((step) => (
    //             <div
    //               key={step.step}
    //               className="border rounded-xl p-6"
    //             >
    //               <h3 className="text-xl font-semibold mb-4">
    //                 Step {step.step}: {step.title}
    //               </h3>

    //               <div className="grid md:grid-cols-3 gap-6">
    //                 <div>
    //                   <h4 className="font-medium mb-2">
    //                     What you do
    //                   </h4>
    //                   <ul className="list-disc list-inside text-gray-700">
    //                     {step.whatYouDo.map((item, idx) => (
    //                       <li key={idx}>{item}</li>
    //                     ))}
    //                   </ul>
    //                 </div>

    //                 <div>
    //                   <h4 className="font-medium mb-2">
    //                     What happens behind the scenes
    //                   </h4>
    //                   <ul className="list-disc list-inside text-gray-700">
    //                     {step.behindTheScenes.map((item, idx) => (
    //                       <li key={idx}>{item}</li>
    //                     ))}
    //                   </ul>
    //                 </div>

    //                 <div>
    //                   <h4 className="font-medium mb-2">
    //                     Outcome
    //                   </h4>
    //                   <p className="text-gray-700">
    //                     {step.outcome}
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       )}

    //       {/* SUBSECTIONS */}
    //       {section.subsections && (
    //         <div className="grid md:grid-cols-2 gap-6">
    //           {section.subsections.map((sub, idx) => (
    //             <div key={idx} className="border rounded-xl p-6">
    //               <h3 className="font-semibold mb-3">
    //                 {sub.title}
    //               </h3>
    //               <ul className="list-disc list-inside text-gray-700">
    //                 {sub.points.map((point, i) => (
    //                   <li key={i}>{point}</li>
    //                 ))}
    //               </ul>
    //             </div>
    //           ))}
    //         </div>
    //       )}

    //       {/* POINTS */}
    //       {section.points && (
    //         <ul className="list-disc list-inside text-gray-700">
    //           {section.points.map((point, idx) => (
    //             <li key={idx}>{point}</li>
    //           ))}
    //         </ul>
    //       )}

    //       {/* CLOSING */}
    //       {section.closing && (
    //         <p className="font-medium text-gray-800">
    //           {section.closing}
    //         </p>
    //       )}

    //       {/* ACTIONS */}
    //       {section.actions && (
    //         <div className="flex flex-wrap gap-4">
    //           {section.actions.map((action, idx) => (
    //             <span
    //               key={idx}
    //               className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700"
    //             >
    //               {action}
    //             </span>
    //           ))}
    //         </div>
    //       )}
    //     </section>
    //   ))}
    // </main>
  );
}

export default About