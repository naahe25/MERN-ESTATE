export const parseApiResponse = async (res) => {
    const text = await res.text();

    if (!text) {
        return res.ok
            ? null
            : {
                success: false,
                statusCode: res.status,
                message: res.statusText || "Request failed",
            };
    }

    try {
        return JSON.parse(text);
    } catch (error) {
        return {
            success: false,
            statusCode: res.status,
            message: "Server returned an invalid response. Make sure the API server is running.",
        };
    }
};
