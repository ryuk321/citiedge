"use client";

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

/**
 * ========================================
 * THANK YOU PAGE - OFQUAL ENROLLMENT
 * ========================================
 * Displayed after successful application submission
 */

export default function ThankYouPage() {
  const router = useRouter();
  const [applicationRef, setApplicationRef] = useState('');

  useEffect(() => {
    // Get application reference from URL params if available
    const ref = router.query.ref as string;
    if (ref) {
      setApplicationRef(ref);
    }
  }, [router.query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Success Icon */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-center">
            <div className="inline-block bg-white rounded-full p-6 mb-4">
              <svg 
                className="w-16 h-16 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Application Submitted Successfully!
            </h1>
            <p className="text-xl text-green-100">
              Thank you for applying to Citiedge International College
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-10">
            {applicationRef && (
              <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Your Application Reference Number:
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {applicationRef}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Please save this reference number for tracking your application
                </p>
              </div>
            )}

            <div className="space-y-6 text-gray-700">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  What Happens Next?
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-center leading-8 mr-3 flex-shrink-0">
                      1
                    </span>
                    <div>
                      <p className="font-semibold">Email Confirmation</p>
                      <p className="text-sm text-gray-600">
                        You will receive a confirmation email within the next 24 hours with your application reference and next steps.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-center leading-8 mr-3 flex-shrink-0">
                      2
                    </span>
                    <div>
                      <p className="font-semibold">Application Review</p>
                      <p className="text-sm text-gray-600">
                        Our admissions team will review your application and supporting documents within 3-5 business days.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-center leading-8 mr-3 flex-shrink-0">
                      3
                    </span>
                    <div>
                      <p className="font-semibold">Decision & Offer</p>
                      <p className="text-sm text-gray-600">
                        If approved, you will receive an official offer letter and enrollment instructions.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-center leading-8 mr-3 flex-shrink-0">
                      4
                    </span>
                    <div>
                      <p className="font-semibold">Enrollment & Registration</p>
                      <p className="text-sm text-gray-600">
                        Complete your enrollment by submitting required documents and paying tuition fees.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Important Information:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Check your email regularly (including spam/junk folder)</li>
                  <li>Prepare supporting documents (ID, qualifications, etc.)</li>
                  <li>Contact us if you don't receive confirmation within 24 hours</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:admissions@citiedge.edu" className="text-blue-600 hover:text-blue-700 underline">
                      admissions@citiedge.edu
                    </a>
                  </p>
                  <p>
                    <strong>Phone:</strong>{' '}
                    <a href="tel:+441234567890" className="text-blue-600 hover:text-blue-700">
                      +44 1234 567890
                    </a>
                  </p>
                  <p>
                    <strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM (GMT)
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/"
                className="flex-1 text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Go to Homepage
              </Link>
              <Link
                href="/ofqual-courses/overview"
                className="flex-1 text-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                View Courses
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Questions about your application? Visit our{' '}
            <Link href="/support" className="text-blue-600 hover:text-blue-700 underline">
              Support Center
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
