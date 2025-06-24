import React from 'react';
import { Clock, Users, Heart } from 'lucide-react';

const WhyChooseSection = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose MediTrack Lite?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Designed with both patients and doctors in mind, our platform makes healthcare 
            accessible and efficient.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">24/7 Availability</h3>
            <p className="text-gray-600">
              Book appointments anytime, anywhere. Our platform is always accessible when you need it most.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-50 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Expert Care Team</h3>
            <p className="text-gray-600">
              Our network of verified doctors and specialists are ready to provide you with quality healthcare.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-50 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Heart className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Patient-Centered</h3>
            <p className="text-gray-600">
              Every feature is designed with your comfort and convenience in mind, making healthcare stress-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseSection;