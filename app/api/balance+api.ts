// TODO: Fetch balance from grid api and check error handling
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const smartAccountAddress = body.smartAccountAddress;
        const url = `http://api-load-balancer-77548667.us-east-1.elb.amazonaws.com/api/v1/smart-accounts/${smartAccountAddress}/balances`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-squads-network": "devnet",
                "Authorization": `Bearer ${process.env.GRID_API_KEY}`
            }
        });

        if (!response.ok) {
            return new Response(null, { status: response.status });
        }

        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        console.error('Error fetching balance:', error);
        return new Response(null, { status: 500 });
    }
} 