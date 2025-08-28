import { API_BASE_URL } from "config";

interface DownloadFileProps {
  uploadId: string;
  organizationId: string;
}
const useDownloadAllFiles = (token: string | null) => {
  const downloadAllFiles = (props: DownloadFileProps): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!token) throw new Error("No token provided");

        const apiEndpoint = `${API_BASE_URL}/admin/uploads/download/${props.organizationId}/${props.uploadId}`;
        console.log("Fetching", apiEndpoint);

        const response = await fetch(apiEndpoint, {
          method: "POST",
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
  return { downloadAllFiles };

};

export default useDownloadAllFiles;