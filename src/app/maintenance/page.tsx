export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
      <div className="max-w-md text-center space-y-4 p-8">
        <div className="text-6xl font-bold text-gray-700">&#9888;</div>
        <h1 className="text-2xl font-bold">Under Maintenance</h1>
        <p className="text-gray-400">
          This site is temporarily unavailable while the owner updates their
          account.
        </p>
        <p className="text-gray-500 text-sm">
          If you&apos;re the owner,{" "}
          <a href="/sign-in" className="text-blue-400 underline">
            log in to reactivate
          </a>
          .
        </p>
        <div className="pt-4 text-xs text-gray-600">Powered by Devlop</div>
      </div>
    </div>
  );
}
