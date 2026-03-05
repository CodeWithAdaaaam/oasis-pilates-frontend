"use client";
import { useState } from 'react';

type FAQItem = { question: string; answer: string };

export default function FAQList({ items }: { items: FAQItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <FAQItem key={i} {...item} />
      ))}
    </div>
  );
}

function FAQItem({ question, answer }: FAQItem) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-cream/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
        aria-expanded={isOpen}
      >
        <span className={`font-serif text-lg transition-colors ${isOpen ? 'text-cream' : 'text-cream/80 group-hover:text-cream'}`}>
          {question}
        </span>
        <span
          className="material-symbols-outlined transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          keyboard_arrow_down
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
        <p className="text-cream/70 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}