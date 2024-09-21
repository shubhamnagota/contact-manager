"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Users, Edit, Download } from 'lucide-react';

const IntroductionPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="max-w-3xl text-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Welcome to Contact Manager
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Easily manage, edit, and organize your contacts with our powerful and user-friendly application.
        </p>
        <Button onClick={onGetStarted} size="lg" className="mb-8">
          Get Started
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <FeatureCard
            icon={<Upload className="h-8 w-8" />}
            title="Import Contacts"
            description="Quickly import your contacts from VCF files."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Manage Contacts"
            description="View, search, and organize your contacts efficiently."
          />
          <FeatureCard
            icon={<Edit className="h-8 w-8" />}
            title="Edit Information"
            description="Easily update contact details and make bulk changes."
          />
          <FeatureCard
            icon={<Download className="h-8 w-8" />}
            title="Export Contacts"
            description="Export your contacts to VCF format for backup or sharing."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default IntroductionPage;