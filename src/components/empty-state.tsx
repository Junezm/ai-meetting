import Image from "next/image";

interface Props {
    title: string;
    description: string;
}

export const EmptyState = ({
    title,
    description
}: Props) => {
    return (
        <div className="flex flex-col flex-1 items-center justify-center">
            <Image src="/logo.svg" alt="Empty" width={150} height={150} />
            <div className="flex flex-col gap-y-6 max-w-md mx-auto text-center">
                <h6 className="text-lg font-medium">{title}</h6>
                <p className="text-sm">{description}</p>
            </div>
        </div>
    )
}
