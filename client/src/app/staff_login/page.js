//start code here osmond time to lock in
import LoginHeader from "@/components/dashboard/LoginHeader";
import LoginForm from "@/components/dashboard/LoginForm";

export default function StaffLoginPage() {
    return (
        <div className="min-h-screen bg-gray-50">
        <LoginHeader />
        
        <div className="flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Welcome To OCBC Banking</h2>
            </div>
            
            <LoginForm />
            </div>
        </div>
        </div>
    );
}