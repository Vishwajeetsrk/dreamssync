'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Users } from 'lucide-react';

const team = [
  { name: "Anand Biniya", role: "Founder / CEO", dept: "Leadership", link: "https://www.linkedin.com/in/anandbin/", image: "/Anand.jpeg" },
  { name: "Ayush Bajpai", role: "COO", dept: "Operations", link: "https://www.linkedin.com/in/ayush-bajpai25/", image: "/Ayush.jpeg" },
  { name: "Vishwajeet", role: "Manager of CE Training", dept: "Training", link: "https://www.linkedin.com/in/vishwajeetsrk/", image: "/vishwajeet.jpeg" },
  { name: "Chaitanya Khaleja", role: "Associate Programme", dept: "Programme", link: "https://www.linkedin.com/in/chaitanya-khaleja-975502255/", image: "/Chaitanya.jpeg" },
  { name: "Nisha Das", role: "Resource Operation", dept: "Resources", link: "https://www.linkedin.com/in/nisha-das-ab9bb5246/", image: "/Nisha.jpg" },
  { name: "Suraj Kumar", role: "Accountant", dept: "Finance", link: "https://www.linkedin.com/in/suraj-kumar-38b7b527a/", image: "/Suraj.jpeg" },
  { name: "Ketan Salve", role: "Team Member", dept: "Support", link: "https://www.linkedin.com/in/ketan-salve/", image: "/ketan.png" },
];

export default function Team() {
  return (
    <div className="space-y-12 max-w-7xl mx-auto py-8">
      <header className="border-b-4 border-black pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4 flex items-center justify-center gap-4">
          <Users className="w-12 h-12" /> DreamSync Team
        </h1>
        <p className="text-xl text-muted-foreground font-medium">The passionate individuals driving career success for Indian youth.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {team.map((member, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border-4 border-black p-6 flex flex-col items-center text-center neo-box relative overflow-hidden"
          >
            {/* Dept Badge */}
            <div className="absolute top-0 right-0 bg-accent text-black font-bold text-xs px-2 py-1 border-l-4 border-b-4 border-black z-10">
              {member.dept}
            </div>

            <div className="w-24 h-24 rounded-full border-4 border-black bg-gray-200 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                {/* Simulated Avatar Image placeholder */}
              <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
            </div>
            
            <h3 className="text-2xl font-black mb-1">{member.name}</h3>
            <p className="font-bold text-primary mb-4">{member.role}</p>
            
            <a 
              href={member.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto flex items-center gap-2 p-2 border-2 border-black font-bold bg-white hover:bg-[#0A66C2] hover:text-white transition-colors"
            >
              <ExternalLink className="w-5 h-5" /> Connect Node
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
