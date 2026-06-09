import React from 'react';
import { getCurrentProvider } from '@/lib/currentUser';
import WelcomeWrapper from './WelcomeWrapper';

interface Props {
  title: string;
}

export default async function ProviderHeader({ title }: Props) {
  const user = await getCurrentProvider();

  // Defensive extraction of name and id (backend may return nested or array values)
  const rawName = user?.name || user?.facilityName || user?.providerName || 'User';
  const name = Array.isArray(rawName) ? String(rawName[0] || 'User') : String(rawName || 'User');
  const displayName = name.length > 10 ? `${name.substring(0, 10)}.` : name;
  const id = user?.id || user?.$id || (user as any)?.providerCode || 'No ID';
  const initials = (name?.[0] || 'U').toUpperCase();
  return (
    <WelcomeWrapper
      name={name}
      displayName={displayName}
      initials={initials}
      id={id}
      email={Array.isArray(user?.email) ? String(user?.email[0]) : (user?.email || 'user@example.com')}
      title={title}
    />
  );
}
