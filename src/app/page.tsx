"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  location: z.string().min(1, { message: "Please enter a location" }),
  theme: z.string().min(1, { message: "Please select a theme" }),
  text: z.string().min(1, { message: "Please enter some text content" }),
});

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      theme: "modern",
      text: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    // Create URL search params for state management
    const searchParams = new URLSearchParams();
    searchParams.set("location", values.location);
    searchParams.set("theme", values.theme);
    searchParams.set("text", values.text);
    
    // Navigate to preview page with params
    router.push(`/preview?${searchParams.toString()}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center py-10 md:py-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 animate-fade-in">
            QR<span className="text-yellow-300">cle</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Create beautiful, custom QR codes for your business, events, or personal use in seconds.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center mb-12">
          {/* Form Card */}
          <Card className="w-full md:w-1/2 bg-white/95 backdrop-blur shadow-xl border-0 transform transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold">Create Your QR Code</CardTitle>
              <CardDescription className="text-white/90">
                Fill out the form below to generate your custom QR code.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800">Location</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="E.g., Website URL or address" 
                            {...field} 
                            className="border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </FormControl>
                        <FormDescription className="text-gray-600">
                          Enter the location (URL, address, etc.) you want to encode.
                        </FormDescription>
                        <FormMessage className="text-pink-600" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800">Theme</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-300 focus:ring-purple-500 focus:border-purple-500">
                              <SelectValue placeholder="Select a theme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="modern">Modern</SelectItem>
                            <SelectItem value="pastel">Pastel</SelectItem>
                            <SelectItem value="cartoony">Cartoony</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-gray-600">
                          Choose a visual style for your QR code.
                        </FormDescription>
                        <FormMessage className="text-pink-600" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800">Text Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter text to display or encode in your QR code" 
                            className="min-h-[100px] border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-gray-600">
                          This text will be encoded in your QR code.
                        </FormDescription>
                        <FormMessage className="text-pink-600" />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 transition-all duration-300 transform hover:scale-[1.02]" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Generate QR Code"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Preview/Example Section */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="bg-gradient-to-br from-blue-400 via-teal-500 to-emerald-400 p-12 rounded-xl shadow-lg mb-6 transform rotate-3 hover:rotate-0 transition-all duration-500">
              <div className="bg-white p-1 rounded-lg">
                <Image
                  src="/qrcle.png"
                  alt="QRcle Example"
                  width={256}
                  height={256}
                  className="rounded-md"
                />
              </div>
            </div>
            <div className="text-white space-y-4 max-w-md">
              <h3 className="text-2xl font-bold">Why QRcle?</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Beautiful design themes</li>
                <li>Instant generation</li>
                <li>Easy to share and download</li>
                <li>Fully customizable</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-white/95 backdrop-blur border-0 transform transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">Privacy First</CardTitle>
              <CardDescription className="text-gray-600">
                Your data stays on your device. No storage, no tracking, just pure functionality.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/95 backdrop-blur border-0 transform transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">Instant Generation</CardTitle>
              <CardDescription className="text-gray-600">
                Create beautiful QR codes in seconds with our lightning-fast generation engine.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/95 backdrop-blur border-0 transform transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">Easy to Use</CardTitle>
              <CardDescription className="text-gray-600">
                Simple interface with powerful customization options. No learning curve required.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
