export default function Footer() {
  return (
    <footer className="border-t bg-[#5764f3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-[#ffffff]">About</h3>
            <p className="mt-4 text-sm text-[white]">
              Dishub is a platform for discovering and sharing Discord servers.
              Find communities that match your interests.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[white] text-[#f7f7f7]">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="/" className="text-sm text-white hover:text-[#5865F2]">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="text-sm text-white hover:text-[#5865F2]"
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#ffffff]">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-white hover:text-[#5865F2]">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white hover:text-[#5865F2]">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-white text-center">
            © {new Date().getFullYear()} Dishub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
