import { useNavigate } from "react-router-dom";
import { Users, Heart, Sparkles, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TeamMember {
  name: string;
  role: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Akhil Nandhakumar",
    role: "Electrical Team Lead, Mechanical Team",
  },
  {
    name: "Allyson Lay",
    role: "Electrical Team",
  },
  {
    name: "Dalen Smith",
    role: "Backend Software Team Lead, Electrical Team",
  },
  {
    name: "Elizabeth Yancey",
    role: "Mechanical Team",
  },
  {
    name: "Emma Shin",
    role: "Mechanical Team",
  },
  {
    name: "Harmeet Singh",
    role: "Frontend Software Team, Electrical Team",
  },
  {
    name: "Ival Momoh",
    role: "Front End Software Team",
  },
  {
    name: "Jay Kim",
    role: "Front End Software Team Lead",
  },
  {
    name: "Richard Tokiyeda",
    role: "Mechanical Team Lead",
  },
  {
    name: "Victoria Sun",
    role: "Backend Software Team, Electrical Team",
  },
];

const values = [
  {
    icon: Heart,
    title: "Personalization",
    description: "Every skin tone is unique, and so should be your foundation.",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description: "Combining cutting-edge technology with beauty expertise.",
  },
  {
    icon: Award,
    title: "Quality",
    description: "Premium ingredients and precise formulations you can trust.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a diverse community that celebrates all beauty.",
  },
];

const AboutSection = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-gradient-to-b from-background via-secondary/20 to-background">
      {/* Story Section */}
      <section className="py-16 px-4" id="about">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-card rounded-3xl p-8 md:p-12 shadow-[var(--shadow-elegant)] border border-border/50 overflow-hidden">
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl -z-0"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-primary via-primary to-accent-foreground bg-clip-text text-transparent">
                About Foundation Fix
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Foundation Fix was born from a simple frustration: finding the perfect
                  foundation shade shouldn't be this hard. After countless hours spent in
                  stores trying to match undertones and textures, our founder realized
                  there had to be a better way.
                </p>
                <p>
                  We combined expertise in cosmetic chemistry, IoT engineering, and user
                  experience design to create a revolutionary system that puts the power
                  of customization in your hands. No more settling for "close enough" —
                  now you can create your perfect match.
                </p>
                <p>
                  Today, Foundation Fix is helping thousands of people discover their
                  ideal foundation formula, celebrating the beautiful diversity of skin
                  tones around the world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-secondary/20 to-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Our Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card 
                  key={value.title}
                  className="relative h-full border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[var(--shadow-medium)] hover:-translate-y-1 bg-card/50 backdrop-blur-sm overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardContent className="pt-6 text-center relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary to-accent-foreground bg-clip-text text-transparent">
              Meet the Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind Foundation Fix, working to revolutionize
              your beauty routine.
            </p>
          </div>

          {/* Team Grid - Centered with justify-center */}
          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card 
                key={member.name}
                className="relative w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-[var(--shadow-medium)] hover:-translate-y-2 bg-card/80 backdrop-blur-sm overflow-hidden group"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardContent className="p-8 text-center relative z-10">
                  {/* Name with gradient on hover */}
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent-foreground group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {member.name}
                  </h3>
                  
                  {/* Role with improved styling */}
                  <p className="text-sm text-primary font-medium whitespace-pre-line leading-relaxed">
                    {member.role}
                  </p>
                </CardContent>

                {/* Bottom border accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-r from-primary via-primary to-accent rounded-3xl p-12 md:p-16 text-white shadow-[var(--shadow-elegant)] overflow-hidden group">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Decorative circles */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Join Our Journey
              </h2>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Be part of the foundation revolution. Create your perfect match today.
              </p>
              <Button 
                onClick={() => navigate("/device")}
                className="bg-white text-primary px-10 py-6 rounded-full font-semibold text-lg hover:bg-white/95 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/25"
                size="lg"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutSection;