import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const API_URL = "http://localhost:3000/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        if (user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (user.role === "warehouse") {
          navigate("/warehouse/dashboard", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
console.log("🔑 Password length:", password.length);
    console.log(
      "🔑 Password characters:",
      password
        .split("")
        .map((c, i) => `${i}: '${c}' (${c.charCodeAt(0)})`)
    );

    setLoading(true);

    try {
const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
if (response.ok && data.success) {
        const user = data.user;
        localStorage.setItem("currentUser", JSON.stringify(user));
        toast.success(`خوش آمدید ${user.name}!`);

        setTimeout(() => {
          if (user.role === "admin") {
            navigate("/admin/dashboard");
          } else if (user.role === "warehouse") {
            navigate("/warehouse/dashboard");
          } else {
            navigate("/dashboard");
          }
          window.location.reload();
        }, 500);
      } else {
        toast.error(data.error || "ایمیل یا رمز عبور اشتباه است");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      toast.error("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">ورود</CardTitle>
          <p className="text-center text-muted-foreground">
            به فروشگاه خوش آمدید
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل یا موبایل</Label>
              <Input
                id="email"
                type="text"
                placeholder="admin@shop.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <Input
                id="password"
                type="password"
                placeholder="رمز عبور خود را وارد کنید"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "در حال ورود..." : "ورود"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                حساب کاربری ندارید؟{" "}
              </span>
              <Link
                to="/register"
                className="text-primary hover:underline font-medium"
              >
                ثبت‌نام کنید
              </Link>
            </div>


          </form>
        </CardContent>
      </Card>
    </div>
  );
}
