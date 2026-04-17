"use client";

import { KeyboardEvent, useState } from "react";

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ label, tags, onChange }: TagInputProps) {
  const [draft, setDraft] = useState("");

  const commitTag = () => {
    const value = draft.trim();
    if (!value || tags.includes(value)) {
      setDraft("");
      return;
    }
    onChange([...tags, value]);
    setDraft("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitTag();
    }
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((item) => item !== tag));
  };

  return (
    <div className="flex flex-col gap-2 text-sm">
      <label>{label}</label>
      <div className="flex flex-wrap items-center gap-2 rounded-[14px] border border-[rgba(30,27,22,0.1)] bg-[#fffdf9] p-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className="rounded-full bg-[#efe5dc] px-3 py-1 text-xs font-medium text-[#9e4721]"
            onClick={() => removeTag(tag)}
          >
            {tag} ×
          </button>
        ))}
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={commitTag}
          placeholder="Beceri yazıp Enter'a basın"
          className="min-w-[220px] flex-1 border-none bg-transparent py-1 text-sm text-[#1e1b16] outline-none"
        />
      </div>
    </div>
  );
}
