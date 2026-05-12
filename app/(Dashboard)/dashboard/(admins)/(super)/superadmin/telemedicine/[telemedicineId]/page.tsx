import TelemedicineViewClient from '../view/TelemedicineViewClient';

export default async function Page({ params }: { params: Promise<{ telemedicineId: string }> }) {
  const { telemedicineId } = await params;
  return <TelemedicineViewClient telemedicineId={telemedicineId} />;
}