import { API_BASE_URL } from "config";

interface DownloadFilePayload {
  fileId: string;
  organizationId: string;
}
const useDownloadFile = (token: string | null) => {
  const downloadFile = (payload: DownloadFilePayload): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!token) throw new Error("No token provided");

        const apiEndpoint = `${API_BASE_URL}/admin/file/content/${payload.fileId}?organizationId=${payload.organizationId}`;
        console.log("Fetching", apiEndpoint);

        const response = await fetch(apiEndpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const disposition = response.headers.get("Content-Disposition");
        let filename = "downloaded_file";
        if (disposition && disposition.includes("filename=")) {
          filename = disposition.split("filename=")[1].replace(/["']/g, "");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        resolve(true);
      } catch (e: any) {
        console.error("Error fetching", e)
        reject(e);
      }
    });
  };
  return { downloadFile };

};

export default useDownloadFile;