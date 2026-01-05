export function stableDasTransac(data: any) {
    const list = Array.isArray(data?.transactions) ? data.transactions : [];

    return list.map((tx: any, index: number) =>
    ({
        id: `${tx?.userid ?? "TX" } - ${index}`,

        transactionType: tx?.transactionType === "credit" || tx?.transactionType === "debit" ? tx.transactionType : "none",

        amount: typeof tx?.amount === "number" ? tx.amount : 0,

        status: tx?.status ?? "unkown",

        transactionDate: tx?.transactionDate ? new Date(tx.transactionDate) : null,
    }));
}