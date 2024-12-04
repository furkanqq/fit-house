"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/input";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      alert("Hatalı giriş!");
    }
  };

  return (
    <div className="flex h-[100vh] flex-col justify-center items-center md:px-6 py-12 lg:px-8">
      <div className="flex justify-center flex-col items-center sm:mx-auto sm:w-full sm:max-w-sm ">
        <Image
          src="https://www.fithousetrainingstudio.com/images/logo/6214858539465-672-fithouse-footer-logo.png"
          alt="fithouse"
          width={300}
          height={180}
        />
        <h2 className="mt-10 text-center text-xl/9 font-bold tracking-tight text-white">
          Admin ile giriş yap
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto w-[80vw] sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          action="#"
          method="POST"
          onSubmit={(e) => handleLogin(e)}
        >
          <div>
            <label className="block text-sm/6 font-medium text-white">
              Email adresi
            </label>
            <div className="mt-2">
              <Input
                type="email"
                name="email"
                id="email"
                required
                placeholder="Kullanıcı adınızı giriniz"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm/6 font-medium text-white">
                Şifre
              </label>
            </div>
            <div className="mt-2">
              <Input
                type="password"
                name="password"
                id="password"
                required
                placeholder="Şifrenizi giriniz"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm/6 font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Giriş
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
