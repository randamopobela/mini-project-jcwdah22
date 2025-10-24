import QRCode from "qrcode";

export async function generateQRCode(data: any): Promise<string> {
    try {
        return await QRCode.toDataURL(JSON.stringify(data));
    } catch (error) {
        console.error("Gagal membuat QR code:", error);
        return "";
    }
}
