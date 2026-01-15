import GoogleAdsClone from "@/components/GoogleAdsClone";
import AdminLogin from "@/components/AdminLogin";
import { useAuthState } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { isAuthenticated, user, login, isLocked, lockTimeRemaining } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin');
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (username: string, password: string) => {
    return await login(username, password);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} isLocked={isLocked} lockTimeRemaining={lockTimeRemaining} />;
  }

  if (user?.role === 'user') {
    return <GoogleAdsClone />;
  }

  return null;
};

export default Index;
