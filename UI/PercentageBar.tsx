import { div } from "motion/react-client";

export default function PercentageBar({
    percentage,
}: {
    percentage: any;
}) {
    return (
        <div className="h-2 bg-[#EEEEEE] rounded-2xl">
            <div className="dsbGrad h-full rounded-2xl"
            style={{width: `${percentage}%`}}></div>
        </div>
    )
}