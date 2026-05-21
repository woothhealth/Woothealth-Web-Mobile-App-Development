import React from 'react';
import { getProviderUser } from '@/lib/providerCurrentUser';
import WelcomeWrapper from '@/app/(Dashboard)/dashboard/(providers)/Components/WelcomeWrapper';

interface Props {
  title: string;
}

export default async function ProviderHeader({ title }: Props) {
  const user = await getProviderUser();

  if (!user || !user.id) {
    // leave redirect decision to caller
  }

  const firstName = user?.name || 'User';
  const displayLastName = firstName.length > 6 ? firstName[0] + '.' : firstName;
  const role = user?.role || 'No assigned role';
  const id = user?.id || 'No ID';
  const initials = (firstName?.[0] || 'U');

  return (
    <WelcomeWrapper
      firstName={firstName}
      displayLastName={displayLastName}
      initials={initials}
      role={role}
      id={id}
      email={user?.email || 'user@example.com'}
      title={title}
    />
  );
}
