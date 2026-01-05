
export default function AuthTestPage() {
    const serverEnv = process.env.API_BASE_URL;
    const publicEnv = process.env.NEXT_PUBLIC_API_BASE_URL;

    return (
        <div className="p-10 space-y-4">
            <h1>
                Environment Test
            </h1>

            <div>
                <p>
                    Server Env: {" "}
                    {serverEnv ?? "X Not Detected"}
                </p>

                <p>
                    Public Env: {" "}
                    {publicEnv ?? "X Not Detected"}
                </p>
            </div>
        </div>
    )
}