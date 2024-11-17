document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById("download-btn");

    if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "fetchImages" }, async response => {
                    if (response && response.images && Array.isArray(response.images)) {
                        const zip = new JSZip();

                        const promises = response.images.map(async (url, index) => {
                            const response = await fetch(url);
                            const blob = await response.blob();
                            const fileName = `image-${index + 1}.jpg`;
                            zip.file(fileName, blob);
                        });

                        await Promise.all(promises);

                        zip.generateAsync({ type: "blob" }).then(content => {
                            const link = document.createElement("a");
                            link.href = URL.createObjectURL(content);
                            link.download = "images.zip";
                            link.click();
                        });
                    } else {
                        console.error("No images found or failed to fetch images.");
                    }
                });
            });
        });
    } else {
        console.error("Download button not found.");
    }
});
