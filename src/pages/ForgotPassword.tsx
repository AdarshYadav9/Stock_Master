import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ArrowLeft } from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits').optional(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters').optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  // If OTP is provided, newPassword and confirmPassword are required
  if (data.otp) {
    return data.newPassword && data.confirmPassword && data.newPassword === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const { requestOTP, resetPassword } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const email = form.watch('email');

  const handleRequestOTP = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      await requestOTP(data.email);
      setStep('otp');
    } catch (error) {
      // Error is handled in the store with toast
      console.error('Request OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (data: ForgotPasswordFormValues) => {
    if (!data.otp || data.otp.length !== 6) {
      form.setError('otp', { message: 'Please enter a valid 6-digit OTP' });
      return;
    }
    setStep('password');
  };

  const handleResetPassword = async (data: ForgotPasswordFormValues) => {
    if (!data.otp || !data.newPassword) {
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(data.email, data.otp, data.newPassword);
      // Redirect to sign in after successful reset
      setTimeout(() => {
        navigate('/sign-in');
      }, 1000);
    } catch (error) {
      // Error is handled in the store with toast
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          <CardDescription>
            {step === 'email' && "Enter your email and we'll send you an OTP"}
            {step === 'otp' && 'Enter the 6-digit OTP sent to your email'}
            {step === 'password' && 'Enter your new password'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                step === 'email'
                  ? handleRequestOTP
                  : step === 'otp'
                  ? handleVerifyOTP
                  : handleResetPassword
              )}
              className="space-y-4"
            >
              {step === 'email' && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {step === 'otp' && (
                <>
                  <div className="text-sm text-muted-foreground mb-2">
                    OTP sent to: <strong>{email}</strong>
                  </div>
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter OTP</FormLabel>
                        <FormControl>
                          <InputOTP
                            maxLength={6}
                            {...field}
                            disabled={isLoading}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormDescription>
                          Enter the 6-digit code sent to your email
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {step === 'password' && (
                <>
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="At least 6 characters"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <div className="flex gap-2">
                {step !== 'email' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (step === 'password') {
                        setStep('otp');
                      } else {
                        setStep('email');
                      }
                    }}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                )}
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading
                    ? 'Processing...'
                    : step === 'email'
                    ? 'Send OTP'
                    : step === 'otp'
                    ? 'Verify OTP'
                    : 'Reset Password'}
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center">
            <Link
              to="/sign-in"
              className="text-sm text-primary hover:underline inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
