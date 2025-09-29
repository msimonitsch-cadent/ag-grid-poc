import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "AG Grid Table", exact: true },
    { path: "/tanstack-table", label: "TanStack Table" },
    { path: "/tree", label: "Tree Data Table" },
  ];

  return (
    <nav className="navigation">
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.path} className="nav-item">
            <Link
              to={item.path}
              className={`nav-link ${
                (item.exact && location.pathname === item.path) ||
                (!item.exact && location.pathname.startsWith(item.path))
                  ? "active"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
