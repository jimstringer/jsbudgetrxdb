import React from "react";

interface YearSelectProps {
  setYear: React.Dispatch<React.SetStateAction<number>>;
  year: number;
}

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

export const YearSelect = (props: YearSelectProps) => {
  return (
    <div>
      <select
        className=""
        value={props.year}
        onChange={(e) => props.setYear(parseInt(e.target.value))}
      >
        {Array.from({ length: 10 }, (_, index) => (
          <option key={index} value={currentYear - (index - 1)}>
            {currentYear - (index - 1)}
          </option>
        ))}
      </select>
    </div>
  );
};
