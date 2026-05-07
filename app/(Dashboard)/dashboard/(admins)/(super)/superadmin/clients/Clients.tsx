import { ClientsClient } from './ClientsClient';
import Title from "../UIs/Title";

export default function Clients() {
  return (
    <>
      <Title title="Client Management"/>
      <ClientsClient />
    </>
  );
}
