// src/components/chatbot/BranchQRCode.jsx
import QRCode from "react-qr-code";

export default function BranchQRCode({ value }) {
    return (
        <div className="p-2 bg-white rounded shadow inline-block">
        <QRCode value={value} size={160} />
        </div>
    );
}
