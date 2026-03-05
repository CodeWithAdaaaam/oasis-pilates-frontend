"use client";
import { useState } from 'react';

type FAQItemType = { question: string; answer: string };
type FAQGroup = { group: string; items: FAQItemType[] };

export default function FAQAccordion({ groups }: { groups: FAQGroup[] }) {
    return (
        <div className="space-y-12">
            {groups.map(({ group, items }) => (
                <div key={group} className="mb-12">
                    <h2 className="font-serif text-2xl mb-6 border-b border-cream/20 pb-2">
                        {group}
                    </h2>
                    <div className="space-y-4">
                        {items.map((item) => (
                            <FAQItem key={item.question} {...item} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function FAQItem({ question, answer }: FAQItemType) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-cream/10 rounded-xl bg-sage/30 overflow-hidden transition-all hover:bg-sage/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-5 px-6 flex justify-between items-center text-left focus:outline-none"
                aria-expanded={isOpen}
            >
                <span className="font-bold text-lg text-cream/90 pr-4">
                    {question}
                </span>
                <span
                    className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                >
                    keyboard_arrow_down
                </span>
            </button>
            <div
                className={`transition-all duration-300 ease-in-out px-6 overflow-hidden ${isOpen ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'
                    }`}
            >
                <p className="text-cream/70 leading-relaxed text-sm md:text-base border-t border-cream/5 pt-4">
                    {answer}
                </p>
            </div>
        </div>
    );
}
