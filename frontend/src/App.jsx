import Homepage from "./componenets/Homepage/Homepage";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      
        <Homepage />
      
    </AuthProvider>
  );
}
