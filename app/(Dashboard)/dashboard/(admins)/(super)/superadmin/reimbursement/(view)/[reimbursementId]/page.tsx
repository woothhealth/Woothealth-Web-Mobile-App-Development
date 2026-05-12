import ReimbursementViewClient from '../ReimbursementViewClient';

interface PageProps {
  params: Promise<{
    reimbursementId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { reimbursementId } = await params;
  return <ReimbursementViewClient reimbursementId={reimbursementId} />;
}
