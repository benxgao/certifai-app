# Reusable Form Components

This directory contains reusable form components following the Certifai design system. These components provide a consistent look and feel across all authentication and form interfaces.

## Architecture

### Basic Building Blocks

- `FormField` - Reusable input field with label, validation, and styling
- `FormButton` - Reusable submit button with loading states and variants
- `FormCard` - Form container with glass-morphism design
- `AuthForm` - Basic form wrapper with consistent spacing
- `FormMessages` - Error, success, and info message components
- `AuthPageLayout` - Page layout wrapper for authentication pages

### Complete Form Components

- `SigninForm` - Complete signin form with email/password
- `SignupForm` - Complete signup form with all required fields
- `ForgotPasswordForm` - Email-only form for password reset

## Usage Examples

### Using Complete Form Components

```tsx
import { SigninForm } from '@/src/components/custom/forms';

const SigninPage = () => {
  const handleSignin = async (data: { email: string; password: string }) => {
    // Handle signin logic
    console.log('Signin data:', data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50/30">
      <SigninForm
        onSubmit={handleSignin}
        loading={false}
        error=""
        showForgotPassword={true}
        rememberMe={false}
        onRememberMeChange={(checked) => console.log('Remember me:', checked)}
      />
    </div>
  );
};
```

### Using Building Blocks

```tsx
import { FormField, FormButton, FormCard, AuthForm } from '@/src/components/custom/forms';

const CustomForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Handle form submission
    setLoading(false);
  };

  return (
    <FormCard title="Custom Form" description="Enter your details">
      <AuthForm onSubmit={handleSubmit}>
        <FormField
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <FormButton type="submit" loading={loading}>
          Submit
        </FormButton>
      </AuthForm>
    </FormCard>
  );
};
```

## Design System

All components follow the Certifai design system:

- **Colors**: Violet-to-blue gradients for primary actions
- **Glass-morphism**: Backdrop blur effects with translucent backgrounds
- **Typography**: Consistent font weights and sizes
- **Spacing**: Logical spacing scale using Tailwind
- **Borders**: Rounded corners with subtle borders
- **Focus States**: Violet focus rings with smooth transitions
- **Dark Mode**: Full dark mode support

## Migration Guide

To migrate existing forms to use these components:

1. **Replace form structure**: Use `FormCard` or `AuthForm` instead of custom form wrappers
2. **Replace input fields**: Use `FormField` instead of separate `Label` + `Input` combinations
3. **Replace buttons**: Use `FormButton` instead of custom `Button` implementations
4. **Replace messages**: Use `FormError`, `FormSuccess` from `FormMessages`
5. **Use complete forms**: For standard auth flows, consider using `SigninForm`, `SignupForm`, etc.

## Benefits

- **Consistency**: All forms look and behave the same way
- **Maintainability**: Styling changes need to be made in one place
- **Accessibility**: Built-in accessibility features
- **Developer Experience**: Less code to write, easier to test
- **Performance**: Optimized components with proper memoization
