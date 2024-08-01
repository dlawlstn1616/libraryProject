import { Route, Routes } from "react-router-dom";
import LibraryHome from "./components/LibraryHome";
import LibraryLogin from "./components/LibraryLogin";
import Layout from "./components/Layout";
import LibrarySign from "./components/LibrarySign";
import { LibrarySearch } from "./components/LibrarySearch";
import { AuthProvider } from "./components/AuthContext";
import LibraryDetail from "./components/LibraryDetail";
import LibraryRegister from "./components/LibraryRegister";
import LibraryUpdate from "./components/LibraryUpdate";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LibraryHome />} />
          <Route path="/login" element={<LibraryLogin />} />
          <Route path="/sign" element={<LibrarySign />} />
          <Route path="/search" element={<LibrarySearch />} />
          <Route path="/detail/:bookIdx" element={<LibraryDetail />} />
          <Route path="/register" element={<LibraryRegister />} />
          <Route path="/update" element={<LibraryUpdate />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
