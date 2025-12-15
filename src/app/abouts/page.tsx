'use client';

import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow bg-gray-50 flex flex-col items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-5xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">About STREAMS</h1>
          <p className="text-lg text-gray-600 mb-6">
            The Sustainable Tools for Rainwater Evaluation And Management (STREAM) is a tool for monitoring infrastructure installed for collecting, storing and measuring rainwater in urban areas. It promotes the efforts made by the population and CEEDD, together with the Terrafirma Rainwater Collective, to reduce the expansion and risk of new gullies forming in neighbourhoods located in hilly areas.
            Our goal is to help these neighbourhoods transition to sponge neighbourhoods capable of absorbing all the rainwater they intercept, and thus increase their resilience to increasingly frequent extreme events. But also to collect data on rainfall and runoff in order to study and formulate scientifically valid solutions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-2">Our Mission</h3>
              <p className="text-sm text-gray-700">
                Our mission focuses on preventing and limiting urban gullies and flooding caused by extreme events due to climate change in African megacities. Our interventions mainly focus on rainwater harvesting and infiltration at the household level.
                We are aware that:
                <ul>
                  <li>a complete system for the safe drainage of rainwater is difficult to implement on the scale of our cities, given the resources required.</li>
                  <li>our water needs will only worsen as our population grows and rainfall intensifies with climate change.</li>
                </ul>
                We empower underserved and marginalised communities to take control of their water-related future in the face of climate change. Our rainwater harvesting systems provide a source of domestic water for 9 months of the year, reducing the need to purchase and transport water, while providing a local response to catastrophic urban flooding and erosion.
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-2">Our Vision</h3>
              <p className="text-sm text-gray-700">A world where every community has reliable access to clean water through data-driven management.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}