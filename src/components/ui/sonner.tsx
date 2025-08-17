'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      closeButton={props.closeButton !== undefined ? props.closeButton : true}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--success-bg': 'hsl(var(--primary))',
          '--success-text': 'hsl(var(--primary-foreground))',
          '--error-bg': 'hsl(var(--destructive))',
          '--error-text': 'hsl(var(--destructive-foreground))',
          '--warning-bg': 'hsl(var(--muted))',
          '--warning-text': 'hsl(var(--muted-foreground))',
          '--info-bg': 'hsl(var(--accent))',
          '--info-text': 'hsl(var(--accent-foreground))',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'group-[.toaster]:shadow-lg group-[.toaster]:border',
          title: 'group-[.toast]:font-medium',
          description: 'group-[.toast]:text-sm group-[.toast]:opacity-90',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          closeButton: 'group-[.toast]:bg-background group-[.toast]:text-foreground',
        },
        ...props.toastOptions,
      }}
      {...props}
    />
  );
};

export { Toaster };
