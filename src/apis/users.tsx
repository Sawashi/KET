const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  username: string;
  id: string;
  status: string;
  role: string;
}

export async function getAllUserData(): Promise<User[]> {
  console.log("Api url: ", apiUrl);
  try {
    const response = await fetch(`${apiUrl}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting data:", error);
    throw error;
  }
}
