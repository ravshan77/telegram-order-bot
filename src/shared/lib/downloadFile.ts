export const downloadFile = async (apiCall: () => Promise<Blob>, filename: string): Promise<void> => {
    try {
        const blob = await apiCall();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error downloading file:", error);
        throw error;
    }
};
