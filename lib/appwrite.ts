import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import { Account, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

export const config = {
	platform: "com.tlm.foodordering",
	endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
	projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
	databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  bucketId: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
	userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID!,
  categoriesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
  menuCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MENU_COLLECTION_ID!,
  customizationsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CUSTOMIZATIONS_COLLECTION_ID!,
  menuCustomizationsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MENU_CUSTOMIZATIONS_COLLECTION_ID!,
};


export const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
//const avatars = new Avatars(client);

// Function to check if there is an active session
export const checkActiveSession = async () => {
  try {
    const session = await account.getSession('current'); // Get the current session
    return session !== null; // Return true if there is an active session
  } catch (error: any) {
    // If there's an error (e.g., no active session), handle it appropriately
    if (error.code === 401) {
      return false; // No active session
    }
    throw error; // Re-throw other unexpected errors
  }
};


// Function to delete all sessions for the current user
export const deleteSessions = async () => {
  try {
    // Get the list of all sessions
    const sessions = await account.listSessions();

    // Delete each session
    await Promise.all(
      sessions.sessions.map(async (session) => {
        await account.deleteSession(session.$id);
      })
    );

    console.log('All sessions deleted successfully');
  } catch (error: any) {
    console.error('Error deleting sessions: ', error.message || 'Unknown error');
    throw error; // Re-throw the error for further handling
  }
};

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)

        if(!newAccount) throw Error;

        //const avatarUrl = avatars.getInitials(name);
				const nameparts = name.split(' ');
        const avatarUrl = `https://cloud.appwrite.io/v1/avatars/initials?name=${nameparts[0]}+${nameparts[1]}&width=80&height=80`;

        await signIn({ email, password });

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            { 
							accountId: newAccount.$id, 
							email, 
							name, 
							avatar: avatarUrl 
						}
        );

				return newUser;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

				console.log('currentAccount: ', currentAccount);

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (e) {
        console.log(e);
        throw new Error(e as string);
    }
}

export const getMenu = async ({ category, query }: GetMenuParams) => {
    try {
        const queries: string[] = [];

        if(category) queries.push(Query.equal('categories', category));
        if(query) queries.push(Query.search('name', query));
      
        const menus = await databases.listDocuments(
            config.databaseId,
            config.menuCollectionId,
            queries,
        )

        return menus.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCategories = async () => {
    try {
        const categories = await databases.listDocuments(
            config.databaseId,
            config.categoriesCollectionId,
        )

        return categories.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}