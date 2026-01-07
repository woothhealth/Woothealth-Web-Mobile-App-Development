import { stableDashboard } from "./stabledashboard";
import { account, databases } from "./appwrite";

const DATABASE_ID = "main";
const USERS_COLLECTION_ID = "users";
const PLANS_COLLECTION_ID = "plans";

// Get current user document from Appwrite
export async function getDashboard() {
    try {
        // Get current user session
        const user = await account.get();
        if (!user || !user.email) throw new Error("No user session");

        // Query user document by email (assuming email is unique)
        const response = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [
                // Appwrite query: search by email
                // If you use userId instead, change to: Query.equal('userId', user.$id)
                // Query.equal('email', user.email)
            ]
        );
        // Find the document matching the user email
        const userDoc = response.documents.find((doc: any) => doc.email === user.email);
        if (!userDoc) throw new Error("User document not found");
        return stableDashboard(userDoc);
    } catch (error) {
        return stableDashboard({});
    }
}

// Get plan data for dashboard from Appwrite
export async function getDashboardPlan() {
    try {
        // Example: get all plans (customize as needed)
        const response = await databases.listDocuments(
            DATABASE_ID,
            PLANS_COLLECTION_ID
        );
        // Return the first plan or a default
        const planDoc = response.documents[0] || {};
        return stableDashboard(planDoc);
    } catch (error) {
        return stableDashboard({});
    }
}