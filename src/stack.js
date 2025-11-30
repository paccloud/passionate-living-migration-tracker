import { StackClientApp } from '@stackframe/react';

console.log('=== NEON AUTH INITIALIZATION ===');
console.log('Project ID from env:', import.meta.env.VITE_STACK_PROJECT_ID);
console.log('Client Key from env:', import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY);

if (!import.meta.env.VITE_STACK_PROJECT_ID || !import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY) {
  console.error('❌ Missing Neon Auth environment variables!');
  console.error('Go to: https://console.neon.tech -> Your Project -> Auth -> Configuration');
  console.error('Select "React (Vite)" and copy the environment variables to your .env file');
  throw new Error('Neon Auth configuration is incomplete. Check .env file for VITE_STACK_PROJECT_ID and VITE_STACK_PUBLISHABLE_CLIENT_KEY');
}

export const stack = new StackClientApp({
  projectId: import.meta.env.VITE_STACK_PROJECT_ID,
  publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY,
  tokenStore: 'cookie', // Recommended for Neon Auth
});

console.log('✅ Neon Auth client created');
console.log('Stack URLs:', stack.urls);
console.log('============================');
