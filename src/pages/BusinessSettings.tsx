
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the form schema
const businessFormSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  taxId: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  currencyCode: z.string().min(1, "Currency code is required"),
  receiptPrefix: z.string().min(1, "Receipt prefix is required"),
  orderPrefix: z.string().min(1, "Order prefix is required"),
});

// Define tax form schema
const taxFormSchema = z.object({
  enableTax: z.boolean().default(true),
  taxPercentage: z.coerce.number().min(0, "Tax percentage cannot be negative").max(100, "Tax percentage cannot exceed 100"),
  taxName: z.string().min(1, "Tax name is required"),
  taxNumber: z.string().optional(),
  applyTaxOnShipping: z.boolean().default(false),
});

// Define notification settings schema
const notificationSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  orderNotifications: z.boolean().default(true),
  inventoryAlerts: z.boolean().default(true),
  customerSignups: z.boolean().default(false),
  dailySummary: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

// Sample data for the forms
const businessData = {
  businessName: "Coffee & Co.",
  email: "info@coffeeandco.example",
  phone: "+1 (555) 123-4567",
  address: "123 Brew Street",
  city: "Coffeeville",
  state: "CA",
  zipCode: "90210",
  country: "United States",
  taxId: "123-45-6789",
  website: "https://coffeeandco.example",
  currencyCode: "USD",
  receiptPrefix: "RCT",
  orderPrefix: "ORD",
};

const taxData = {
  enableTax: true,
  taxPercentage: 8.5,
  taxName: "Sales Tax",
  taxNumber: "ST-12345",
  applyTaxOnShipping: false,
};

const notificationData = {
  emailNotifications: true,
  smsNotifications: false,
  orderNotifications: true,
  inventoryAlerts: true,
  customerSignups: false,
  dailySummary: true,
  marketingEmails: false,
};

const BusinessSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  
  // Initialize the forms
  const businessForm = useForm<z.infer<typeof businessFormSchema>>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: businessData,
  });

  const taxForm = useForm<z.infer<typeof taxFormSchema>>({
    resolver: zodResolver(taxFormSchema),
    defaultValues: taxData,
  });

  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: notificationData,
  });

  // Form submission handlers
  const onBusinessSubmit = (data: z.infer<typeof businessFormSchema>) => {
    console.log("Business form data:", data);
    // In a real app, this would send data to an API
    alert("Business information saved successfully!");
  };

  const onTaxSubmit = (data: z.infer<typeof taxFormSchema>) => {
    console.log("Tax form data:", data);
    // In a real app, this would send data to an API
    alert("Tax settings saved successfully!");
  };

  const onNotificationSubmit = (data: z.infer<typeof notificationSchema>) => {
    console.log("Notification form data:", data);
    // In a real app, this would send data to an API
    alert("Notification settings saved successfully!");
  };

  return (
    <MainLayout title="Business Settings">
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Business Settings</CardTitle>
            <CardDescription>
              Configure your business information, tax settings, and more.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="general" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="tax">Tax Settings</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              {/* General Settings */}
              <TabsContent value="general">
                <Form {...businessForm}>
                  <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Business Information</h3>
                      <p className="text-sm text-muted-foreground">
                        Update your business details and contact information.
                      </p>
                    </div>
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={businessForm.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter business name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={businessForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter email address" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={businessForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={businessForm.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter website URL" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mt-8">Address</h3>
                      <p className="text-sm text-muted-foreground">
                        Update your business location information.
                      </p>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={businessForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="col-span-full">
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter street address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={businessForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={businessForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter state or province" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={businessForm.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip/Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter zip code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={businessForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter country" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mt-8">Business Identifiers</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure tax and business identifiers.
                      </p>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={businessForm.control}
                        name="taxId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tax ID / EIN</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter tax ID number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Your business tax identification number
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={businessForm.control}
                        name="currencyCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <FormControl>
                              <Input placeholder="Currency code (e.g., USD)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={businessForm.control}
                        name="receiptPrefix"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Receipt Number Prefix</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g., RCT" {...field} />
                            </FormControl>
                            <FormDescription>
                              Used for receipt numbers (e.g., RCT-001)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={businessForm.control}
                        name="orderPrefix"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Order Number Prefix</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g., ORD" {...field} />
                            </FormControl>
                            <FormDescription>
                              Used for order numbers (e.g., ORD-001)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              {/* Tax Settings */}
              <TabsContent value="tax">
                <Form {...taxForm}>
                  <form onSubmit={taxForm.handleSubmit(onTaxSubmit)} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Tax Configuration</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure tax rates and settings for your business.
                      </p>
                    </div>
                    <Separator />

                    <FormField
                      control={taxForm.control}
                      name="enableTax"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enable Tax Calculation</FormLabel>
                            <FormDescription>
                              Apply tax to orders and display tax on receipts
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={taxForm.control}
                        name="taxName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tax Name</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g., Sales Tax, VAT" {...field} />
                            </FormControl>
                            <FormDescription>
                              The name that will appear on receipts
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={taxForm.control}
                        name="taxPercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tax Percentage</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="E.g., 8.5" {...field} />
                            </FormControl>
                            <FormDescription>
                              The tax rate as a percentage (e.g., 8.5 for 8.5%)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={taxForm.control}
                        name="taxNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tax Registration Number</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g., VAT123456789" {...field} />
                            </FormControl>
                            <FormDescription>
                              Optional: Your tax registration number to display on receipts
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={taxForm.control}
                      name="applyTaxOnShipping"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Apply Tax on Shipping</FormLabel>
                            <FormDescription>
                              Include shipping costs in tax calculation
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="submit">Save Tax Settings</Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications">
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Notification Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure when and how you receive notifications.
                      </p>
                    </div>
                    <Separator />

                    <div className="space-y-4">
                      <FormField
                        control={notificationForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email Notifications</FormLabel>
                              <FormDescription>
                                Receive notifications via email
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name="smsNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">SMS Notifications</FormLabel>
                              <FormDescription>
                                Receive notifications via text message
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name="orderNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">New Order Alerts</FormLabel>
                              <FormDescription>
                                Get notified when a new order is placed
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name="inventoryAlerts"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Inventory Alerts</FormLabel>
                              <FormDescription>
                                Get notified when inventory is low
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name="customerSignups"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Customer Signups</FormLabel>
                              <FormDescription>
                                Get notified when a new customer registers
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name="dailySummary"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Daily Summary</FormLabel>
                              <FormDescription>
                                Receive a daily summary of activities
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name="marketingEmails"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Marketing Updates</FormLabel>
                              <FormDescription>
                                Receive news and updates about new features
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit">Save Notification Settings</Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BusinessSettings;
