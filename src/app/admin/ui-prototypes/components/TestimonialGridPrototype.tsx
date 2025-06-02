'use client';

import PrototypeComponentView from './PrototypeComponentView';

export default function TestimonialGridPrototype() {
  const testimonials = [
    {
      id: 1,
      content: "Implementing this design transformed our online presence. Our conversion rate increased by 45% within just two months of launch!",
      author: "Sarah Johnson",
      role: "Marketing Director",
      company: "GrowthTech Solutions",
      image: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      id: 2,
      content: "The modern, professional look of our new website has significantly improved customer trust. We've seen a 60% increase in form submissions.",
      author: "Michael Chen",
      role: "CEO",
      company: "Innovate Partners",
      image: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
      id: 3,
      content: "Our bounce rate dropped from 65% to 28% after implementing this design. The visual hierarchy really guides users to take action.",
      author: "Emily Rodriguez",
      role: "UX Director",
      company: "Digital Experience Co",
      image: "https://randomuser.me/api/portraits/women/3.jpg"
    },
    {
      id: 4,
      content: "The responsive design works flawlessly across all devices. Mobile conversions have increased by 78% since the redesign.",
      author: "David Park",
      role: "E-commerce Manager",
      company: "Retail Evolution",
      image: "https://randomuser.me/api/portraits/men/4.jpg"
    },
    {
      id: 5,
      content: "Our clients immediately notice the professional quality of our site. It's helped us close 35% more enterprise deals this quarter.",
      author: "Jennifer Wu",
      role: "Sales Director",
      company: "Enterprise Solutions",
      image: "https://randomuser.me/api/portraits/women/5.jpg"
    },
    {
      id: 6,
      content: "The clean, modern design perfectly represents our brand values. Customer feedback has been overwhelmingly positive.",
      author: "Robert Torres",
      role: "Brand Manager",
      company: "Identity Collective",
      image: "https://randomuser.me/api/portraits/men/6.jpg"
    }
  ];

  return (
    <PrototypeComponentView 
      title="Social Proof Grid" 
      description="A visually appealing testimonial section that showcases customer stories"
    >
      <div className="w-full bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">TRUSTED BY BUSINESSES</p>
            <h2 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
              What Our Clients Are Saying
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Don't just take our word for it — hear from businesses that have transformed their online presence with our designs.
            </p>
          </div>
          
          {/* Testimonial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Testimonial Content */}
                <div className="p-8">
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <svg className="h-12 w-12 text-indigo-100" fill="currentColor" viewBox="0 0 32 32">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                  </div>
                  
                  {/* Testimonial Text */}
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  {/* Divider */}
                  <div className="w-16 h-1 bg-indigo-500 rounded mb-6"></div>
                  
                  {/* Author Info */}
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{testimonial.author}</p>
                      <p className="text-gray-500 text-sm">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA Section */}
          <div className="mt-16 text-center">
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
              View All Testimonials
              <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </PrototypeComponentView>
  );
} 