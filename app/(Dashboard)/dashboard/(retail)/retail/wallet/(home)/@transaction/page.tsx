// app/(Dashboard)/dashboard/(retail)/retail/wallet/(home)/@transaction/page.tsx

import { getTransaction } from "@/lib/transaction";
import TransactionClient from "./TransactionClient";


export default async function Page() {
  
  const data = await getTransaction();

  return <TransactionClient data={data} />;
}
