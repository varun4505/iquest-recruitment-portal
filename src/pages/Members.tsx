import { useState } from 'react';
import { Link } from 'react-router-dom';
import TerminalBackground from '../components/TerminalBackground';
import MatrixRain from '../components/MatrixRain';

// Board members data
const boardMembers = [
  {
    name: "Suvandita Swaroop",
    role: "Chairperson",
    linkedin: "https://www.linkedin.com/in/suvandita-swaroop/",
    photo: "https://via.placeholder.com/150", // Replace with actual photo URL
    description: "Leveraging IQuest with her expertise and experience along strategic direction and great guidance."
  },
  {
    name: "Abhinn Verma",
    role: "General Secretary",
    linkedin: "https://www.linkedin.com/in/abhinn-verma/",
    photo: "https://via.placeholder.com/150", // Replace with actual photo URL
    description: "Managing day-to-day operations, coordinating team activities, and ensuring smooth functioning"
  },
  {
    name: "Swagata Banerjee",
    role: "Vice Chair",
    linkedin: "https://www.linkedin.com/in/swagata-banerjee/",
    photo: "https://res.cloudinary.com/dempxhimy/image/upload/v1743932143/WhatsApp_Image_2025-04-06_at_3.02.37_PM_jwizlz.jpg",
    description: "The driving force behind IQuest's seamless execution. From meticulous planning to flawless implementation."
  },
  {
    name: "Keerthana Muthupandi",
    role: "Co-Secretary",
    linkedin: "https://www.linkedin.com/in/keerthana-muthupandi/",
    photo: "https://via.placeholder.com/150", // Replace with actual photo URL
    description: "Bringing exceptional organizational skills and dedication to streamline administrative processes and team coordination."
  },
  {
    name: "Varun B",
    role: "HR Head",
    linkedin: "https://www.linkedin.com/in/varunb45/",
    photo: "https://res.cloudinary.com/dempxhimy/image/upload/v1743924044/WhatsApp_Image_2025-04-06_at_12.49.37_PM_siywtf.jpg", // Replace with actual photo URL
    description: "Fostering a dynamic team culture and nurturing talent through innovative HR strategies and engagement initiatives."
  },
  {
    name: "Sanchitha V",
    role: "Technical Head",
    linkedin: "https://www.linkedin.com/in/sanchitha-v/",
    photo: "https://via.placeholder.com/150", // Replace with actual photo URL
    description: "Spearheading technical innovation and excellence through cutting-edge projects and knowledge-sharing initiatives."
  },
  {
    name: "Bhavadharini Shankar",
    role: "Design Head",
    linkedin: "https://www.linkedin.com/in/bhavadharini-shankar/",
    photo: "https://via.placeholder.com/150", // Replace with actual photo URL
    description: "Creating stunning visual experiences and maintaining design consistency across all IQuest platforms and initiatives."
  },
  {
    name: "Mohd Rizwaan Ansari",
    role: "Management Head",
    linkedin: "https://www.linkedin.com/in/mohd-rizwaan-ansari/",
    photo: "https://via.placeholder.com/150", // Replace with actual photo URL
    description: "Optimizing organizational workflows and resource management to drive operational excellence and efficiency."
  },
  {
    name: "Soumil Patel",
    role: "Finance Head",
    linkedin: "https://www.linkedin.com/in/soumil-patel/",
    photo: "https://via.placeholder.com/150", // Replace with actual photo URL
    description: "Ensuring financial stability and growth through strategic planning and prudent resource allocation."
  },
  {
    name: "Soumil Chauhan",
    role: "Editorial Head",
    linkedin: "https://www.linkedin.com/in/soumil-chauhan/",
    photo: "https://via.placeholder.com/150", // Replace with actual photo URL
    description: "Crafting compelling narratives and maintaining editorial excellence across all communication channels."
  }
];

const Members = () => {
  return (
    <div className="pt-8">
      {/* Add matrix rain animation as background */}
      <MatrixRain className="opacity-30" />
            
      {/* Hero Section */}
      <div className="py-10 relative overflow-hidden">
        {/* Terminal background */}
        <TerminalBackground className="opacity-5" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-primary-500 mb-4 text-center glitch-title">
              <span className="typing-cursor">iQuest Board Members</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white font-medium mb-4 max-w-2xl mx-auto text-center px-4 sm:px-0">
              Meet the team leading iQuest's mission to nurture innovation and technical excellence.
            </p>
          </div>
        </div>
      </div>

      {/* Board Members Grid */}
      <div className="py-4 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {boardMembers.map((member, index) => (
              <div 
                key={member.name}
                className="terminal-card group relative overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Terminal corners */}
                <span className="terminal-corner terminal-corner-tl"></span>
                <span className="terminal-corner terminal-corner-tr"></span>
                <span className="terminal-corner terminal-corner-bl"></span>
                <span className="terminal-corner terminal-corner-br"></span>
                
                
                <div className="p-6 flex flex-col min-h-[280px] relative">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <img 
                        src={member.photo} 
                        alt={member.name}
                        className="w-28 h-28 rounded-full border-2 border-terminal-highlight object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-terminal-highlight">{member.name}</h3>
                      <p className="text-terminal-text">{member.role}</p>
                    </div>
                  </div>
                  
                  <div className="mb-12">
                    <p className="text-terminal-text text-sm">{member.description}</p>
                  </div>
                  
                  <div className="absolute bottom-6 left-6">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-terminal-highlight hover:text-terminal-accent transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members; 