"use client";

import { useState } from "react";
import aboutData from "../../../../../../data/about.json";
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

const data = aboutData

const About = () => {
  return (
    <main className="mx-auto px-2 md:px-4 py-8 space-y-10">
      {/* HERO */}
      <section className="flex flex-col">
        <h1 className="text-4xl font-bold mb-5">{data.title}</h1>
        <p className="text-xl text-gray-700 mb-2">{data.tagline}</p>
        <p className="text-gray-600 text-base">
          {data.introduction}
        </p>
      </section>

      {/* SECTIONS */}
      {data.sections.map((section) => (
        <section key={section.id} className="space-y-2">
          <h2 className="text-2xl font-semibold">
            {section.heading}
          </h2>

          {section.content && (
            <p className="text-gray-700">
              {section.content}
            </p>
          )}

          {/* HIGHLIGHTS */}
          {section.highlights && (
            <ul className="grid list-disc list-inside">
              {section.highlights.map((item, idx) => (
                <li key={idx} className="text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          )}

          {/* STEPS */}
          {section.steps && (
            <div className="space-y-2">
              {section.steps.map((step) => (
                <div
                  key={step.step}
                  className="p-4"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    Step {step.step}: {step.title}
                  </h3>

                  <div className="grid gap-4 px-2">
                    <div>
                      <h4 className="font-medium mb-1">
                        What you do
                      </h4>
                      <ul className="list-disc list-inside text-gray-700">
                        {step.whatYouDo.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-1">
                        What happens behind the scenes
                      </h4>
                      <ul className="list-disc list-inside text-gray-700">
                        {step.behindTheScenes.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-1">
                        Outcome
                      </h4>
                      <p className="text-gray-700">
                        {step.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SUBSECTIONS */}
          {section.subsections && (
            <div className="space-y-4">
              {section.subsections.map((sub, idx) => (
                <div key={idx} className="px-6 py-2">
                  <h3 className="font-semibold mb-2">
                    {sub.title}
                  </h3>
                  <ul className="list-disc list-inside px-2 text-gray-700">
                    {sub.points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* POINTS */}
          {section.points && (
            <ul className="list-disc px-2 list-inside text-gray-700">
              {section.points.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          )}

          {/* CLOSING */}
          {section.closing && (
            <p className="font-medium mt-3 text-gray-800">
              {section.closing}
            </p>
          )}

          {/* ACTIONS */}
          {section.actions && (
            <div className="flex flex-wrap gap-4">
              {section.actions.map((action, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-blue-50 rounded-[10px] text-[#49A5EF]"
                >
                  {action}
                </span>
              ))}
            </div>
          )}
        </section>
      ))}
    </main>
  );
}

export default About