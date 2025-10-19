// Button Testing Page
// This page demonstrates all button variants and sizes

import React from 'react';
import Button, { ButtonGroup, IconButton } from '../components/Button';
import { Heart, Plus, Download, Trash2, Check, AlertTriangle } from 'lucide-react';

const ButtonTest = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Button Component Testing</h1>
          
          {/* Button Variants */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Button Variants</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
            </div>
          </section>

          {/* Button Sizes */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Button Sizes</h2>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="primary" size="xl">Extra Large</Button>
            </div>
          </section>

          {/* Button States */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Button States</h2>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Normal</Button>
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="primary" loading>Loading</Button>
            </div>
          </section>

          {/* Full Width Buttons */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Full Width Buttons</h2>
            <div className="space-y-4">
              <Button variant="primary" fullWidth>Full Width Primary</Button>
              <Button variant="secondary" fullWidth>Full Width Secondary</Button>
            </div>
          </section>

          {/* Icon Buttons */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Icon Buttons</h2>
            <div className="flex flex-wrap items-center gap-4">
              <IconButton variant="primary" size="sm">
                <Heart className="w-4 h-4" />
              </IconButton>
              <IconButton variant="secondary" size="md">
                <Plus className="w-5 h-5" />
              </IconButton>
              <IconButton variant="success" size="lg">
                <Check className="w-6 h-6" />
              </IconButton>
              <IconButton variant="danger" size="md">
                <Trash2 className="w-5 h-5" />
              </IconButton>
              <IconButton variant="warning" size="md">
                <AlertTriangle className="w-5 h-5" />
              </IconButton>
            </div>
          </section>

          {/* Button Groups */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Button Groups</h2>
            <div className="space-y-4">
              <ButtonGroup>
                <Button variant="primary">Left</Button>
                <Button variant="primary">Middle</Button>
                <Button variant="primary">Right</Button>
              </ButtonGroup>
              
              <ButtonGroup>
                <Button variant="outline">Save</Button>
                <Button variant="outline">Save & Close</Button>
                <Button variant="outline">Cancel</Button>
              </ButtonGroup>
            </div>
          </section>

          {/* Buttons with Icons */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Buttons with Icons</h2>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="success">
                <Check className="w-4 h-4 mr-2" />
                Confirm
              </Button>
              <Button variant="danger">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button variant="warning">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Warning
              </Button>
            </div>
          </section>

          {/* Loading States */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Loading States</h2>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" loading>Loading Primary</Button>
              <Button variant="secondary" loading>Loading Secondary</Button>
              <Button variant="outline" loading>Loading Outline</Button>
              <Button variant="danger" loading>Loading Danger</Button>
            </div>
          </section>

          {/* Custom Styling */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Custom Styling</h2>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Gradient Button
              </Button>
              <Button variant="outline" className="border-2 border-dashed border-gray-400 hover:border-gray-600">
                Dashed Border
              </Button>
              <Button variant="primary" className="rounded-full px-8">
                Rounded Button
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ButtonTest;
