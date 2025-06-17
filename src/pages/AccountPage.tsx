import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import NavigationMenu from '@/components/layout/NavigationMenu';
import Sidebar from '@/components/layout/Sidebar';
import KYCStepper from '@/components/KYCStepper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User, Shield, FileText, HelpCircle, Gift, Lock } from 'lucide-react';

const profileFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
});
type ProfileFormData = z.infer<typeof profileFormSchema>;

const passwordFormSchema = z.object({
    currentPassword: z.string().min(8, "Password must be at least 8 characters"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ["confirmPassword"],
});
type PasswordFormData = z.infer<typeof passwordFormSchema>;

const kycSteps = [
  {
    id: 'personal',
    title: 'Personal Information',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">Please fill in your personal details accurately.</p>
        <Input placeholder="Full Legal Name" />
        <Input type="date" placeholder="Date of Birth" />
        <Input placeholder="Nationality" />
      </div>
    ),
  },
  {
    id: 'address',
    title: 'Address Verification',
    content: (
      <div className="space-y-4">
         <p className="text-sm text-gray-600 dark:text-gray-400">Enter your residential address.</p>
        <Input placeholder="Street Address" />
        <Input placeholder="City" />
        <Input placeholder="Postal Code" />
        <Input placeholder="Country" />
      </div>
    ),
  },
  {
    id: 'document',
    title: 'Document Upload',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">Upload a clear image of your government-issued ID.</p>
        <FormItem> {/* Use FormItem for styling consistency if inside a form */}
            <FormLabel>ID Document (e.g., Passport, Driver's License)</FormLabel>
            <Input type="file" />
        </FormItem>
         <FormItem>
            <FormLabel>Proof of Address (e.g., Utility Bill)</FormLabel>
            <Input type="file" />
        </FormItem>
      </div>
    ),
  },
  {
    id: 'review',
    title: 'Review & Submit',
    content: <p className="text-sm text-gray-600 dark:text-gray-400">Please review all your information carefully before submitting. Ensure all documents are clear and legible.</p>,
  },
];

const AccountPage = () => {
  console.log('AccountPage loaded');
  const [activeSection, setActiveSection] = useState('profile');
  const [isKycVerified, setIsKycVerified] = useState(false); // Mock KYC status
  const [is2faEnabled, setIs2faEnabled] = useState(true);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { fullName: "John Doe", email: "john.doe@example.com", phoneNumber: "+1234567890" },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    console.log("Profile updated:", data);
    // Show success toast
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    console.log("Password change requested", data);
    // Show success toast / close dialog
  }

  const handleKycComplete = (formData: Record<string, any>) => {
    console.log("KYC data submitted from AccountPage:", formData);
    setIsKycVerified(true); // Mock successful KYC
    // Show success toast
  };
  
  const sidebarLinks = [
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'security', label: 'Security', icon: Shield },
      { id: 'kyc', label: 'KYC Verification', icon: FileText },
      { id: 'referrals', label: 'Referral Program', icon: Gift },
      { id: 'support', label: 'Support', icon: HelpCircle },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <Card>
            <CardHeader><CardTitle>Profile Information</CardTitle><CardDescription>Manage your personal details.</CardDescription></CardHeader>
            <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                    <CardContent className="space-y-4">
                        <FormField control={profileForm.control} name="fullName" render={({ field }) => (
                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={profileForm.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={profileForm.control} name="phoneNumber" render={({ field }) => (
                            <FormItem><FormLabel>Phone Number (Optional)</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Save Changes</Button>
                    </CardFooter>
                </form>
            </Form>
          </Card>
        );
      case 'security':
        return (
          <Card>
            <CardHeader><CardTitle>Security Settings</CardTitle><CardDescription>Enhance your account security.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                    <div>
                        <h3 className="font-medium">Two-Factor Authentication (2FA)</h3>
                        <p className="text-sm text-muted-foreground">Protect your account with an extra layer of security.</p>
                    </div>
                    <Switch checked={is2faEnabled} onCheckedChange={setIs2faEnabled} aria-label="Toggle 2FA" />
                </div>
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline"><Lock className="mr-2 h-4 w-4" /> Change Password</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Change Your Password</DialogTitle></DialogHeader>
                        <Form {...passwordForm}>
                            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                                <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
                                    <FormItem><FormLabel>Current Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                                    <FormItem><FormLabel>New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={passwordForm.control} name="confirmPassword" render={({ field }) => (
                                    <FormItem><FormLabel>Confirm New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <DialogFooter>
                                    <Button type="submit">Set New Password</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
                {/* More security options: API Keys, Login History, etc. */}
            </CardContent>
          </Card>
        );
      case 'kyc':
        return isKycVerified ? (
          <Card>
            <CardHeader><CardTitle>KYC Verified</CardTitle></CardHeader>
            <CardContent><p className="text-green-600">Your identity has been successfully verified.</p></CardContent>
          </Card>
        ) : (
          <KYCStepper steps={kycSteps} onComplete={handleKycComplete} />
        );
      case 'referrals':
         return (
            <Card>
                <CardHeader><CardTitle>Referral Program</CardTitle><CardDescription>Invite friends and earn rewards!</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                    <p>Your referral code: <span className="font-semibold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">REF123XYZ</span></p>
                    <Input readOnly value="https://tradeapp.com/register?ref=REF123XYZ" />
                    <Button onClick={() => navigator.clipboard.writeText("https://tradeapp.com/register?ref=REF123XYZ")}>Copy Link</Button>
                    <p className="text-sm text-muted-foreground">Share this link with your friends. You both get bonuses when they sign up and trade.</p>
                </CardContent>
            </Card>
         );
      case 'support':
        return (
          <Card>
            <CardHeader><CardTitle>Support & Resources</CardTitle></CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq">
                  <AccordionTrigger>Frequently Asked Questions</AccordionTrigger>
                  <AccordionContent>Check our FAQ for answers to common questions about trading, fees, and security.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="contact">
                  <AccordionTrigger>Contact Support</AccordionTrigger>
                  <AccordionContent>Need help? Contact our support team via email at support@tradeapp.com or open a support ticket.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="legal">
                  <AccordionTrigger>Legal Documents</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a></li>
                        <li><a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a></li>
                        <li><a href="/risk" className="text-blue-600 hover:underline">Risk Disclosure</a></li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationMenu />
      <div className="flex flex-1 container mx-auto py-6">
        <Sidebar className="w-64 hidden md:block mr-6 flex-shrink-0 h-auto">
          <nav className="space-y-1 p-2">
            {sidebarLinks.map(link => (
                 <Button
                    key={link.id}
                    variant={activeSection === link.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveSection(link.id)}
                >
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.label}
                </Button>
            ))}
          </nav>
        </Sidebar>
        <main className="flex-1">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default AccountPage;