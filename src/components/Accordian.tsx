// Accordion.tsx

interface AccordionProps {
  toggleAccordion: () => void;
  title: string;
  isOpen: boolean;
  data: React.ReactNode;
}

export default function Accordion(props: AccordionProps) {
  // This component is used to display an accordion with a title and data

  return (
    <div className='border rounded-md mb-1'>
      <button
        className='w-full p-4 text-left bg-gray-200 
						hover:bg-gray-300 transition duration-300'
        onClick={props.toggleAccordion}
      >
        {props.title}
        <span
          className={`float-right transform ${
            props.isOpen ? 'rotate-180' : 'rotate-0'
          } 
								transition-transform duration-300`}
        >
          &#9660;
        </span>
      </button>
      {props.isOpen && <div className='p-4 bg-white'>{props.data}</div>}
    </div>
  );
}
