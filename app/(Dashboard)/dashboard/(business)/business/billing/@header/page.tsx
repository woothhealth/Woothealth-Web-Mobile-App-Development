import React from "react";
import { getBusinessCurrentUser } from "@/lib/businessCurrentUser";
import { redirect } from "next/navigation";
import SharedHeader from "@/Components/SharedHeader";


export default async function Welcome() {
  const user = await getBusinessCurrentUser();
  
    if (!user || !user.id) {
      redirect('/login');
    }
  
    // Use firstName and lastName from user object
    const firstName = user.name || 'User';
    const lastName = user.lastName || '';
    
    // Truncate lastName: if > 6 chars, show first char + '.'
    const displayLastName = lastName.length > 6 ? lastName[0] + '.' : lastName;
    
    const role = user.role || 'No assigneed role';
    const id = user.id || 'No ID';
    
    // Generate initials from first and last name
    const initials = (firstName?.[0] || "U") + (lastName?.[0] || "");

  return (
    <SharedHeader
      title="BILLING"
      firstName={firstName}
      lastName={lastName}
      displayLastName={displayLastName}
      initials={initials}
      role={role}
      id={id}
      email={user.email || "user@example.com"}
      dashboardType="business"
    />
  );
}