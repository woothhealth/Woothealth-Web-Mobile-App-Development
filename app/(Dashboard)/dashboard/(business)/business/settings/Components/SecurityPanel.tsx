import React from 'react'
import SecurityForm from './SecurityForm';
import { SlScreenDesktop } from "react-icons/sl";
import { MdOutlinePhoneIphone } from 'react-icons/md';

interface SecurityPanelProps {
  onPasswordChange?: (newPassword: string, confirmPassword: string) => Promise<void>;
}

export default function SecurityPanel({ onPasswordChange }: SecurityPanelProps) {
  return (
    <div>
      <SecurityForm onPasswordChange={onPasswordChange} />
    </div>
  );
}