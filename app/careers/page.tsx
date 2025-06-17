'use client';

import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  Lightbulb,
  Heart,
  TrendingUp,
  Code,
  Brain,
  Palette,
  Shield,
  Upload,
  CheckCircle,
} from 'lucide-react';
import LandingHeader from '@/src/components/custom/LandingHeader';

export default function CareersPage() {
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    coverLetter: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setApplicationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after successful submission
    setTimeout(() => {
      setApplicationData({
        name: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        coverLetter: '',
      });
      setIsSubmitted(false);
    }, 3000);
  };

  const jobOpenings = [
    {
      id: 1,
      title: 'Senior Full Stack Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      salary: '$140k - $180k',
      description:
        'Build and scale our AI-powered certification platform using React, Node.js, and cloud technologies.',
      requirements: [
        '5+ years of full-stack development experience',
        'Proficiency in React, TypeScript, and Node.js',
        'Experience with cloud platforms (AWS/GCP)',
        'Knowledge of AI/ML integration is a plus',
      ],
      posted: '2 days ago',
    },
    {
      id: 2,
      title: 'AI/ML Engineer',
      department: 'AI Research',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      salary: '$160k - $220k',
      description:
        'Develop and improve our AI question generation algorithms and personalized learning systems.',
      requirements: [
        'PhD or MS in Computer Science, AI, or related field',
        'Experience with Python, TensorFlow/PyTorch',
        'Strong background in NLP and machine learning',
        'Published research in AI/ML conferences preferred',
      ],
      posted: '1 week ago',
    },
    {
      id: 3,
      title: 'Product Designer',
      department: 'Design',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      salary: '$120k - $150k',
      description:
        'Design intuitive and engaging user experiences for our certification training platform.',
      requirements: [
        '4+ years of product design experience',
        'Proficiency in Figma, Sketch, or similar tools',
        'Experience with design systems and user research',
        'Portfolio showcasing B2B SaaS products',
      ],
      posted: '3 days ago',
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      department: 'Infrastructure',
      location: 'Remote',
      type: 'Full-time',
      salary: '$130k - $170k',
      description:
        'Build and maintain scalable infrastructure for our growing platform and AI workloads.',
      requirements: [
        '4+ years of DevOps/Infrastructure experience',
        'Experience with Kubernetes, Docker, and CI/CD',
        'Knowledge of AWS/GCP cloud services',
        'Experience with monitoring and observability tools',
      ],
      posted: '5 days ago',
    },
    {
      id: 5,
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      salary: '$100k - $130k',
      description:
        'Drive growth and awareness for CertifAI through strategic marketing initiatives.',
      requirements: [
        '3+ years of B2B SaaS marketing experience',
        'Experience with digital marketing and growth hacking',
        'Strong analytical and communication skills',
        'Knowledge of the IT certification market preferred',
      ],
      posted: '1 week ago',
    },
    {
      id: 6,
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Full-time',
      salary: '$80k - $110k',
      description:
        'Help our users succeed in their certification journey and drive product adoption.',
      requirements: [
        '2+ years of customer success experience',
        'Strong communication and problem-solving skills',
        'Experience with SaaS platforms and user onboarding',
        'IT certification background is a plus',
      ],
      posted: '4 days ago',
    },
  ];

  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description:
        'Comprehensive health, dental, and vision insurance. Mental health support and wellness programs.',
    },
    {
      icon: TrendingUp,
      title: 'Professional Growth',
      description:
        'Learning budget, conference attendance, and certification reimbursement. Clear career progression paths.',
    },
    {
      icon: Clock,
      title: 'Work-Life Balance',
      description:
        'Flexible working hours, unlimited PTO, and remote-first culture. Family leave policies.',
    },
    {
      icon: DollarSign,
      title: 'Compensation',
      description:
        'Competitive salary, equity package, and performance bonuses. Annual compensation reviews.',
    },
    {
      icon: Users,
      title: 'Team Culture',
      description:
        'Collaborative environment, team retreats, and regular social events. Inclusive and diverse workplace.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description:
        '20% time for personal projects, hackathons, and innovation challenges. Latest tools and technologies.',
    },
  ];

  const values = [
    {
      icon: Brain,
      title: 'Continuous Learning',
      description:
        'We believe in the power of education and continuous improvement, both for our users and ourselves.',
    },
    {
      icon: Users,
      title: 'User-Centric',
      description:
        "Every decision we make is guided by how it will improve our users' certification journey.",
    },
    {
      icon: Shield,
      title: 'Quality First',
      description:
        'We maintain the highest standards in our AI algorithms, platform reliability, and user experience.',
    },
    {
      icon: Heart,
      title: 'Inclusive Culture',
      description:
        'We foster an environment where everyone can thrive, regardless of background or experience.',
    },
  ];

  const departments = [
    { icon: Code, name: 'Engineering', count: 8, color: 'bg-blue-500' },
    { icon: Brain, name: 'AI Research', count: 4, color: 'bg-purple-500' },
    { icon: Palette, name: 'Design', count: 3, color: 'bg-pink-500' },
    { icon: TrendingUp, name: 'Marketing', count: 5, color: 'bg-green-500' },
    { icon: Users, name: 'Customer Success', count: 6, color: 'bg-orange-500' },
    { icon: Shield, name: 'Security', count: 2, color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <LandingHeader showFeaturesLink={false} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Join Our Mission</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Help us revolutionize IT certification training with AI. We&apos;re building the future
            of personalized learning and looking for passionate individuals to join our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-lg">
              View Open Positions
            </Button>
            <Button variant="outline" size="lg" className="rounded-lg">
              Learn About Our Culture
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">28</div>
            <div className="text-sm text-muted-foreground">Team Members</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">6</div>
            <div className="text-sm text-muted-foreground">Departments</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">$12M</div>
            <div className="text-sm text-muted-foreground">Series A Funding</div>
          </div>
        </div>

        {/* Departments */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Our Teams</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div
                      className={`h-12 w-12 rounded-lg ${dept.color} flex items-center justify-center`}
                    >
                      <dept.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{dept.name}</h3>
                      <p className="text-sm text-muted-foreground">{dept.count} team members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            Why Work at CertifAI?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Job Openings */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Open Positions</h2>
          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                        <Badge variant="secondary">{job.department}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4">{job.description}</p>
                      <div className="mb-4">
                        <h4 className="font-medium text-foreground mb-2">Key Requirements:</h4>
                        <ul className="space-y-1">
                          {job.requirements.map((req, index) => (
                            <li
                              key={index}
                              className="text-sm text-muted-foreground flex items-start space-x-2"
                            >
                              <span className="text-primary mt-1">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className="text-xs text-muted-foreground">Posted {job.posted}</span>
                      <Button className="rounded-lg">Apply Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div className="mb-16">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Quick Application</CardTitle>
              <CardDescription>
                Don&apos;t see the perfect role? Send us your information and we&apos;ll reach out
                when something matches your skills.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Application Submitted!
                  </h3>
                  <p className="text-muted-foreground">
                    Thank you for your interest. We&apos;ll review your application and get back to
                    you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={applicationData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={applicationData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={applicationData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="position"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Position of Interest
                      </label>
                      <select
                        id="position"
                        name="position"
                        value={applicationData.position}
                        onChange={handleInputChange}
                        className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                      >
                        <option value="">Select a position</option>
                        {jobOpenings.map((job) => (
                          <option key={job.id} value={job.title}>
                            {job.title}
                          </option>
                        ))}
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="experience"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Years of Experience
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={applicationData.experience}
                      onChange={handleInputChange}
                      className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                    >
                      <option value="">Select experience level</option>
                      <option value="0-1">0-1 years</option>
                      <option value="2-3">2-3 years</option>
                      <option value="4-6">4-6 years</option>
                      <option value="7-10">7-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="coverLetter"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Cover Letter / Why CertifAI? *
                    </label>
                    <Textarea
                      id="coverLetter"
                      name="coverLetter"
                      value={applicationData.coverLetter}
                      onChange={handleInputChange}
                      placeholder="Tell us why you're interested in joining CertifAI and what you'd bring to our team..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="text-center">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full md:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
