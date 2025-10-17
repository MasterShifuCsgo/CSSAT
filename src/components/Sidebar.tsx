import { NavLink } from "react-router-dom";
import { BiBarChartAlt2, BiBookOpen, BiCog, BiStar } from "react-icons/bi";
import { FaBarcode } from "react-icons/fa";

const navItems = [
  { to: "/", label: "Tasks", icon: <BiBookOpen size={20} /> },
  { to: "/", label: "Leaderboard", icon: <BiBarChartAlt2 size={20} /> },
  { to: "/", label: "My Skills", icon: <BiStar size={20} /> },
  { to: "/", label: "Settings", icon: <BiCog size={20} /> },
];

const Sidebar = () => {
  return (
    <div>
      {/* Mobile Header */}
      <div className="sticky top-0 inset-x-0 z-20 bg-white border-y border-gray-200 px-4 sm:px-6 lg:px-8 lg:hidden dark:bg-neutral-800 dark:border-neutral-700">
        <div className="flex items-center py-2">
          <button
            type="button"
            className="size-8 flex justify-center items-center gap-x-2 border border-gray-200 text-gray-800 hover:text-gray-500 rounded-lg focus:outline-hidden focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-controls="hs-application-sidebar"
            aria-label="Toggle navigation"
            data-hs-overlay="#hs-application-sidebar"
          >
            <span className="sr-only">Toggle Navigation</span>
            <svg
              className="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M15 3v18" />
              <path d="m8 9 3 3-3 3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        id="hs-application-sidebar"
        className="hs-overlay [--auto-close:lg]
          hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform
          w-65 h-full hidden fixed inset-y-0 start-0 z-60
          bg-white border-e border-gray-200
          lg:block lg:translate-x-0 lg:end-auto lg:bottom-0
          dark:bg-neutral-800 dark:border-neutral-700"
        role="dialog"
        tabIndex={-1}
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col h-full max-h-full">
          {/* Logo */}
          <div className="px-6 pt-4 flex items-center">
            <NavLink
              to="/"
              className="text-3xl font-bold text-white flex flex-col justify-center items-center w-full mt-5"
            >
              <FaBarcode className="relative transform scale-x-[6] scale-y-[2] origin-center" />
              <span className="mt-1 transform scale-x-[1.3] scale-y-[1] text-center block">
                A - Secure
              </span>
            </NavLink>
          </div>

          {/* Navigation */}
          <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <nav className="hs-accordion-group p-3 w-full flex flex-col flex-wrap" data-hs-accordion-always-open>
              <ul className="flex flex-col space-y-1">
                {navItems.map(({ to, label, icon }) => (
                  <li key={label}>
                    <NavLink
                      to={to}
                      className="w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200"
                    >
                      {icon}
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Footer */}
          <footer className="mt-auto p-3 flex flex-col">
            <div className="flex flex-row items-center justify-between">
              <NavLink
                to="/"
                className="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 dark:text-neutral-200"
              >
                Profile
              </NavLink>

              {/* Language Dropdown */}
              <div className="hs-dropdown [--strategy:absolute] relative inline-flex">
                <button
                  id="hs-pro-aimtlg"
                  type="button"
                  className="flex justify-center items-center gap-x-3 size-9 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                >
                  <svg
                    className="shrink-0 size-4.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 8 6 6" />
                    <path d="m4 14 6-6 2-3" />
                    <path d="M2 5h12" />
                    <path d="M7 2h1" />
                    <path d="m22 22-5-10-5 10" />
                    <path d="M14 18h6" />
                  </svg>
                  <span className="sr-only">Language</span>
                </button>

                <div
                  className="hs-dropdown-menu hs-dropdown-open:opacity-100 w-40 transition-[opacity,margin] duration opacity-0 hidden z-11 bg-white border border-gray-200 rounded-xl shadow-lg before:absolute before:-top-4 before:start-0 before:w-full before:h-5 dark:bg-neutral-950 dark:border-neutral-700"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="hs-pro-aimtlg"
                >
                  <div className="p-1 space-y-0.5">
                    {["English (US)", "English (UK)", "Deutsch", "Dansk", "Italiano", "中文 (繁體)"].map(
                      (lang) => (
                        <button
                          key={lang}
                          type="button"
                          className="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                        >
                          {lang}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
