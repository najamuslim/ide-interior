import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#2563eb",
            colorBackground: "#1F2937",
            colorInputBackground: "#374151",
            colorText: "white",
            colorTextSecondary: "#9CA3AF",
            colorInputText: "white",
          },
          elements: {
            card: "bg-[#1F2937] shadow-xl",
            headerTitle: "text-2xl text-white",
            headerSubtitle: "text-gray-400",
            socialButtonsBlockButton: 
              "bg-[#374151] border-gray-700 text-white hover:bg-[#4B5563] hover:border-gray-600",
            socialButtonsBlockButtonText: "text-white font-medium",
            dividerLine: "bg-gray-700",
            dividerText: "text-gray-400",
            formFieldLabel: "text-gray-300",
            formFieldInput: 
              "bg-[#374151] border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500",
            formButtonPrimary: 
              "bg-blue-600 hover:bg-blue-700 text-white font-medium",
            footerActionLink: "text-blue-500 hover:text-blue-400",
            identityPreviewText: "text-white",
            identityPreviewEditButtonIcon: "text-blue-500",
            formFieldAction: "text-blue-500 hover:text-blue-400",
            alert: "bg-[#374151] border-gray-700 text-white",
            alertText: "text-white",
            formResendCodeLink: "text-blue-500 hover:text-blue-400",
            main: "w-full",
            navbar: "hidden",
            header: "text-center",
            form: "w-full",
            footer: "w-full"
          }
        }}
      />
    </div>
  );
}