//start code here osmond time to lock in
import LoginHeader from "@/components/LoginHeader";
import LoginForm from "@/components/LoginForm";

export default function StaffLoginPage() {
    return (
        <div>
            <LoginHeader />
            {/* Main Content Section */}
            <main className="flex flex-1 flex-row">
                {/* Login form */}
                <div className="w-1/2 bg-cover bg-center relative"
                style={{
                    backgroundImage: "url('/ocbc-building.jpg')", // replace with your own
                }}
                >
                    <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-r from-transparent to-white"></div>
                </div>

                {/* Right side: Centered login form */}
                <div className="w-1/2 flex items-center justify-center bg-white">
                    <LoginForm />
                </div>
            </main>
        </div>
    );
}
