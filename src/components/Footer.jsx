// Footer component for HealthMate Frontend
// App credits and footer information

import React from 'react';
import { Heart, Github, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* App Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                HealthMate
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Sehat ka Smart Dost - Your AI-powered health companion for managing medical reports and tracking vitals.
            </p>
            <p className="text-sm text-gray-500">
              Version 1.0.0
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• AI-powered medical report analysis</li>
              <li>• Bilingual summaries (English + Roman Urdu)</li>
              <li>• Vitals tracking and monitoring</li>
              <li>• Family health management</li>
              <li>• Health timeline and dashboard</li>
              <li>• Secure cloud storage</li>
            </ul>
          </div>

          {/* Contact & Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Contact & Support
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>support@healthmate.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Github className="w-4 h-4" />
                <span>github.com/healthmate</span>
              </div>
            </div>
            <div className="pt-4">
              <p className="text-xs text-gray-500">
                Built with ❤️ for better healthcare
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              © 2025 HealthMate - Sehat ka Smart Dost. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Disclaimer</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-yellow-800">!</span>
              </div>
            </div>
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Medical Disclaimer:</p>
              <p>
                HealthMate provides AI-powered analysis for informational purposes only. 
                Always consult with qualified healthcare professionals for medical advice, 
                diagnosis, or treatment. Do not rely solely on AI analysis for medical decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


