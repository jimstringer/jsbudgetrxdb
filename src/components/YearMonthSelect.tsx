import React from 'react';

interface YearMonthSelectProps {
  setYear: React.Dispatch<React.SetStateAction<number>>;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
  year: number;
  month: number;
}

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

export const YearMonthSelect = (props: YearMonthSelectProps) => {
  return (
    <div className="mb-2 flex">
      <select
        className="mr-4 rounded-md border-2 border-gray-300"
        value={props.year}
        onChange={(e) => props.setYear(parseInt(e.target.value))}
      >
        {Array.from({ length: 10 }, (_, index) => (
          <option key={index} value={currentYear - (index - 1)}>
            {currentYear - (index - 1)}
          </option>
        ))}
      </select>
      <select
        className="rounded-md border-2 border-gray-300"
        value={props.month}
        onChange={(e) => props.setMonth(parseInt(e.target.value))}
      >
        {Array.from({ length: 12 }, (_, index) => (
          <option key={index} value={index + 1}>
            {new Date(0, index).toLocaleString('default', {
              month: 'long',
            })}
          </option>
        ))}
      </select>
    </div>
  );
};
