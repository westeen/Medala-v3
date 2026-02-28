import { Shield, FileCheck, Lock, CheckCircle, Server, Globe } from 'lucide-react';

export function Privacy() {
  const securityFeatures = [
    {
      icon: FileCheck,
      title: 'Synthetic Data Only',
      description: 'This demonstration platform uses synthetic data. No real patient health information (PHI) is stored or processed.',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      icon: Lock,
      title: 'No PHI Stored',
      description: 'The system architecture is designed to never store personally identifiable health information in the demonstration environment.',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
    {
      icon: Shield,
      title: 'End-to-End Encryption',
      description: 'Production architecture includes AES-256 encryption at rest and TLS 1.3 for data in transit.',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-500',
    },
    {
      icon: CheckCircle,
      title: 'Role-Based Access Model',
      description: 'Granular permission system ensures healthcare providers only access relevant patient information based on their role.',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      icon: Server,
      title: 'Azure Compliant Infrastructure',
      description: 'Built on Microsoft Azure with compliance certifications including SOC 2 Type II, ISO 27001, and healthcare-specific standards.',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
    },
    {
      icon: Globe,
      title: 'GDPR & HIPAA Ready',
      description: 'System design follows GDPR and HIPAA compliance requirements, ready for healthcare deployment with proper configuration.',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-500',
    },
  ];

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl mb-2">Privacy & Security Design</h1>
        <p className="text-gray-600">Enterprise-grade security architecture for healthcare data</p>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 md:p-8 mb-6 md:mb-8 text-white">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-3">Healthcare-Grade Security</h2>
            <p className="text-emerald-50 leading-relaxed">
              MEDALA is built with enterprise security standards, designed for healthcare environments where data protection and patient privacy are paramount.
            </p>
          </div>
        </div>
      </div>

      {/* Security Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {securityFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}